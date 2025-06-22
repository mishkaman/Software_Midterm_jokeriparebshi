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
