import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import Webcam from 'react-webcam';
import './GestureDetector.css';

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


}
