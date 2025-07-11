import { useRef, useCallback, useEffect, useState } from 'react';
import { Pose, Results } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

interface PoseResults {
  landmarks: any[];
  worldLandmarks: any[];
}

interface PushupMetrics {
  count: number;
  isInPosition: boolean;
  phase: 'up' | 'down' | 'transition';
  formFeedback: string[];
  confidence: number;
}

export default function usePoseDetection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  
  const [isActive, setIsActive] = useState(false);
  const [pushupMetrics, setPushupMetrics] = useState<PushupMetrics>({
    count: 0,
    isInPosition: false,
    phase: 'up',
    formFeedback: [],
    confidence: 0
  });
  
  const [lastElbowAngle, setLastElbowAngle] = useState<number>(180);
  const [isInDownPosition, setIsInDownPosition] = useState(false);
  const [hasCompletedDown, setHasCompletedDown] = useState(false);

  // Calculate angle between three points
  const calculateAngle = useCallback((a: any, b: any, c: any): number => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    return angle;
  }, []);

  // Calculate distance between two points
  const calculateDistance = useCallback((a: any, b: any): number => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }, []);

  // Analyze pushup form and count reps
  const analyzePushup = useCallback((landmarks: any[]) => {
    if (!landmarks || landmarks.length < 33) return;

    // Key landmarks for pushup analysis
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const nose = landmarks[0];

    // Calculate elbow angles (average of both arms)
    const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
    const avgElbowAngle = (leftElbowAngle + rightElbowAngle) / 2;

    // Calculate body alignment
    const shoulderMidpoint = {
      x: (leftShoulder.x + rightShoulder.x) / 2,
      y: (leftShoulder.y + rightShoulder.y) / 2
    };
    const hipMidpoint = {
      x: (leftHip.x + rightHip.x) / 2,
      y: (leftHip.y + rightHip.y) / 2
    };
    const kneeMidpoint = {
      x: (leftKnee.x + rightKnee.x) / 2,
      y: (leftKnee.y + rightKnee.y) / 2
    };

    // Check body alignment (straight line from shoulders to knees)
    const bodyAngle = Math.abs(calculateAngle(shoulderMidpoint, hipMidpoint, kneeMidpoint));
    const isBodyStraight = bodyAngle > 160 && bodyAngle < 200;

    // Check if hands are positioned correctly (roughly shoulder-width apart)
    const handDistance = calculateDistance(leftWrist, rightWrist);
    const shoulderDistance = calculateDistance(leftShoulder, rightShoulder);
    const handPositionRatio = handDistance / shoulderDistance;
    const isHandPositionGood = handPositionRatio > 0.8 && handPositionRatio < 1.5;

    // Check if person is in plank position (hands below shoulders)
    const isInPlankPosition = 
      leftWrist.y > leftShoulder.y && 
      rightWrist.y > rightShoulder.y &&
      nose.y > shoulderMidpoint.y;

    // Determine pushup phase
    let phase: 'up' | 'down' | 'transition' = 'up';
    let formFeedback: string[] = [];
    
    // Form feedback
    if (!isBodyStraight) {
      formFeedback.push("Keep your body straight");
    }
    if (!isHandPositionGood) {
      formFeedback.push("Adjust hand position to shoulder-width");
    }
    if (!isInPlankPosition) {
      formFeedback.push("Get into plank position");
    }

    // Pushup counting logic
    const isCurrentlyDown = avgElbowAngle < 90;
    const isCurrentlyUp = avgElbowAngle > 140;

    if (isCurrentlyDown && !isInDownPosition) {
      setIsInDownPosition(true);
      setHasCompletedDown(true);
      phase = 'down';
    } else if (isCurrentlyUp && isInDownPosition && hasCompletedDown) {
      // Complete pushup detected
      setPushupMetrics(prev => ({
        ...prev,
        count: prev.count + 1
      }));
      setIsInDownPosition(false);
      setHasCompletedDown(false);
      phase = 'up';
    } else if (avgElbowAngle >= 90 && avgElbowAngle <= 140) {
      phase = 'transition';
    }

    // Calculate confidence based on form
    let confidence = 0;
    if (isBodyStraight) confidence += 30;
    if (isHandPositionGood) confidence += 30;
    if (isInPlankPosition) confidence += 40;

    setPushupMetrics(prev => ({
      ...prev,
      isInPosition: isInPlankPosition && isBodyStraight,
      phase,
      formFeedback,
      confidence
    }));

    setLastElbowAngle(avgElbowAngle);
  }, [calculateAngle, calculateDistance, isInDownPosition, hasCompletedDown]);

  // Handle pose detection results
  const onResults = useCallback((results: Results) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the video frame
    if (results.image) {
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    }

    // Draw pose landmarks
    if (results.poseLandmarks) {
      // Draw connections
      const connections = [
        [11, 13], [13, 15], // Left arm
        [12, 14], [14, 16], // Right arm
        [11, 12], // Shoulders
        [11, 23], [12, 24], // Torso
        [23, 24], // Hips
        [23, 25], [24, 26], // Legs
      ];

      ctx.strokeStyle = '#00FF00';
      ctx.lineWidth = 2;
      
      connections.forEach(([start, end]) => {
        const startPoint = results.poseLandmarks[start];
        const endPoint = results.poseLandmarks[end];
        
        if (startPoint && endPoint) {
          ctx.beginPath();
          ctx.moveTo(startPoint.x * canvas.width, startPoint.y * canvas.height);
          ctx.lineTo(endPoint.x * canvas.width, endPoint.y * canvas.height);
          ctx.stroke();
        }
      });

      // Draw key landmarks
      const keyLandmarks = [11, 12, 13, 14, 15, 16, 23, 24];
      ctx.fillStyle = '#FF0000';
      
      keyLandmarks.forEach(index => {
        const landmark = results.poseLandmarks[index];
        if (landmark) {
          ctx.beginPath();
          ctx.arc(
            landmark.x * canvas.width,
            landmark.y * canvas.height,
            5,
            0,
            2 * Math.PI
          );
          ctx.fill();
        }
      });

      // Analyze pushup
      analyzePushup(results.poseLandmarks);
    }
  }, [analyzePushup]);

  // Initialize pose detection
  const initializePose = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      const pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      pose.onResults(onResults);
      poseRef.current = pose;

      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (poseRef.current && videoRef.current) {
            await poseRef.current.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480
      });

      cameraRef.current = camera;
    } catch (error) {
      console.error('Error initializing pose detection:', error);
    }
  }, [onResults]);

  // Start camera and pose detection
  const startTracking = useCallback(async () => {
    try {
      await initializePose();
      if (cameraRef.current) {
        await cameraRef.current.start();
        setIsActive(true);
      }
    } catch (error) {
      console.error('Error starting camera:', error);
    }
  }, [initializePose]);

  // Stop camera and pose detection
  const stopTracking = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    setIsActive(false);
  }, []);

  // Reset pushup count
  const resetCount = useCallback(() => {
    setPushupMetrics({
      count: 0,
      isInPosition: false,
      phase: 'up',
      formFeedback: [],
      confidence: 0
    });
    setIsInDownPosition(false);
    setHasCompletedDown(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    videoRef,
    canvasRef,
    isActive,
    pushupMetrics,
    startTracking,
    stopTracking,
    resetCount
  };
}