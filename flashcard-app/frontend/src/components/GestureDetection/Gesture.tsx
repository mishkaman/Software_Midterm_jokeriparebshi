import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import Webcam from 'react-webcam';
import './Gesture.css';

export type Gesture = 'thumbsUp' | 'thumbsDown' | 'flatHand' | null;

interface GestureProps {
  onGestureDetected: (gesture: Gesture) => void;
  active: boolean;
}

const GestureDetector: React.FC<GestureProps> = ({ onGestureDetected, active }) => {
  const webcamRef = useRef<Webcam>(null);
  const modelRef = useRef<handpose.HandPose | null>(null);
  const animationIdRef = useRef<number | undefined>(undefined);

  const [modelReady, setModelReady] = useState(false);
  const [debugMsg, setDebugMsg] = useState('');

  useEffect(() => {
    async function loadHandposeModel() {
      try {
        await tf.ready();
        modelRef.current = await handpose.load();
        setModelReady(true);
        setDebugMsg('Model loaded successfully');
      } catch (err) {
        setDebugMsg(`Model load error: ${err}`);
        console.error('Handpose model load error:', err);
      }
    }
    loadHandposeModel();

    return () => {
      tf.dispose();
    };
  }, []);

  useEffect(() => {
    if (!active || !modelReady || !webcamRef.current) {
      cancelAnimationFrame(animationIdRef.current!);
      animationIdRef.current = undefined;
      resetDetection();
      return;
    }

    let lastTime = 0;
    const FRAME_INTERVAL = 100; // ms

    const detectHands = async () => {
      const now = Date.now();
      if (now - lastTime < FRAME_INTERVAL) {
        animationIdRef.current = requestAnimationFrame(detectHands);
        return;
      }
      lastTime = now;

      if (webcamRef.current?.video?.readyState !== 4) {
        animationIdRef.current = requestAnimationFrame(detectHands);
        return;
      }

      try {
        const model = modelRef.current;
        if (!model) return;

        const hands = await model.estimateHands(webcamRef.current.video);

        if (hands.length > 0) {
          const gesture = identifyGesture(hands[0]);
          processGesture(gesture);
          const thumbPos = getThumbPosition(hands[0].landmarks);
          setDebugMsg(`Hand detected. Thumb: ${thumbPos}. Gesture: ${gesture ?? 'none'}`);
        } else {
          resetDetection();
          setDebugMsg('No hands detected');
        }
      } catch (error) {
        setDebugMsg(`Detection error: ${error}`);
        console.error('Hand detection error:', error);
      }

      animationIdRef.current = requestAnimationFrame(detectHands);
    };

    detectHands();

    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
    };
  }, [active, modelReady]);

    const getThumbPosition = (landmarks: number[][]): string => {
    const wristY = landmarks[0][1];
    const thumbTipY = landmarks[4][1];
    const indexMcpX = landmarks[5][0];
    const thumbTipX = landmarks[4][0];

    if (thumbTipY < wristY && Math.abs(thumbTipX - indexMcpX) > 30) return 'UP';
    if (thumbTipY > wristY && Math.abs(thumbTipX - indexMcpX) > 30) return 'DOWN';
    return 'NEUTRAL';
  };

  const areMostFingersExtended = (landmarks: number[][]): boolean => {
    const tips = [8, 12, 16, 20];
    const mcps = [5, 9, 13, 17];
    let extendedCount = 0;

    tips.forEach((tip, i) => {
      if (landmarks[tip][1] < landmarks[mcps[i]][1]) extendedCount++;
    });

    return extendedCount >= 3;
  };

  const identifyGesture = (prediction: handpose.AnnotatedPrediction): Gesture => {
    const landmarks = prediction.landmarks;

    if (getThumbPosition(landmarks) === 'UP' && !areMostFingersExtended(landmarks)) {
      return 'thumbsUp';
    }
    if (getThumbPosition(landmarks) === 'DOWN' && !areMostFingersExtended(landmarks)) {
      return 'thumbsDown';
    }
    if (areMostFingersExtended(landmarks)) {
      return 'flatHand';
    }
    return null;
  };

  const [currentGesture, setCurrentGesture] = useState<Gesture>(null);
  const [holding, setHolding] = useState(false);
  const holdStartRef = useRef<number>(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const gestureTriggeredRef = useRef(false);

  const resetDetection = () => {
    setCurrentGesture(null);
    setHolding(false);
    setHoldProgress(0);
    holdStartRef.current = 0;
    gestureTriggeredRef.current = false;
  };

  const processGesture = (gesture: Gesture) => {
    if (!active) return;

    if (gesture !== currentGesture || gesture === null) {
      setCurrentGesture(gesture);
      setHolding(false);
      setHoldProgress(0);
      holdStartRef.current = 0;
      return;
    }

    if (gestureTriggeredRef.current) return;

    if (!holding) {
      setHolding(true);
      holdStartRef.current = Date.now();
    }

    const elapsed = Date.now() - holdStartRef.current;
    const progressRatio = Math.min(elapsed / 3000, 1);
    setHoldProgress(progressRatio);

    if (elapsed >= 3000) {
      gestureTriggeredRef.current = true;
      setDebugMsg(`Gesture "${gesture}" recognized - triggering callback`);
      onGestureDetected && setTimeout(() => onGestureDetected(gesture), 0);
    }
  };
  
    const gestureLabel = (gesture: Gesture) => {
    switch (gesture) {
      case 'thumbsUp':
        return '👍 Easy';
      case 'thumbsDown':
        return '👎 Wrong';
      case 'flatHand':
        return '✋ Hard';
      default:
        return 'Waiting for gesture...';
    }
  };

  return (
    <div className="gesture-detector-container">
      {!modelReady ? (
        <div className="loading-wrapper">
          <div className="spinner"></div>
          <p>Loading handpose model...</p>
        </div>
      ) : (
        <>
          <Webcam
            ref={webcamRef}
            className="gesture-webcam"
            videoConstraints={{ facingMode: 'user', width: 640, height: 480 }}
          />
          <div className="gesture-feedback">
            <div className={`gesture-label ${currentGesture ? 'active' : ''}`}>
              {currentGesture ? (
                <>
                  <div className="gesture-name">{gestureLabel(currentGesture)}</div>
                  {holding && (
                    <div className="hold-countdown">
                      <div className="countdown-number">{Math.ceil(3 - holdProgress * 3)}</div>
                      Hold gesture to confirm
                    </div>
                  )}
                </>
              ) : (
                <div className="waiting-message">Waiting for gesture...</div>
              )}
            </div>
            {holding && (
              <div className="hold-progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${holdProgress * 100}%` }}
                />
              </div>
            )}
            <div className="debug-text">{debugMsg}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default GestureDetector;
