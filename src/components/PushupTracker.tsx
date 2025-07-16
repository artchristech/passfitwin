import React, { useEffect, useState } from 'react';
import { Camera, CameraOff, RotateCcw, CheckCircle, AlertTriangle, Target } from 'lucide-react';
import usePoseDetection from '../hooks/usePoseDetection';

interface PushupTrackerProps {
  targetReps: number;
  onComplete: (reps: number, duration: number) => void;
  onClose: () => void;
}

export default function PushupTracker({ targetReps, onComplete, onClose }: PushupTrackerProps) {
  const {
    videoRef,
    canvasRef,
    isActive,
    pushupMetrics,
    startTracking,
    stopTracking,
    resetCount
  } = usePoseDetection();

  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Update duration timer
  useEffect(() => {
    if (!startTime || isCompleted) return;

    const interval = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isCompleted]);

  // Check for completion
  useEffect(() => {
    if (pushupMetrics.count >= targetReps && !isCompleted) {
      setIsCompleted(true);
      const finalDuration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
      setTimeout(() => {
        onComplete(pushupMetrics.count, finalDuration);
      }, 2000); // Show celebration for 2 seconds
    }
  }, [pushupMetrics.count, targetReps, isCompleted, startTime, onComplete]);

  const handleStartTracking = async () => {
    await startTracking();
    setStartTime(Date.now());
  };

  const handleStopTracking = () => {
    stopTracking();
    setStartTime(null);
    setDuration(0);
  };

  const handleReset = () => {
    resetCount();
    setStartTime(Date.now());
    setDuration(0);
    setIsCompleted(false);
  };

  const progress = Math.min((pushupMetrics.count / targetReps) * 100, 100);

  const getPhaseColor = () => {
    switch (pushupMetrics.phase) {
      case 'down': return 'text-red-500';
      case 'up': return 'text-green-500';
      case 'transition': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getConfidenceColor = () => {
    if (pushupMetrics.confidence >= 80) return 'text-green-500';
    if (pushupMetrics.confidence >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-purple-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl">AI Pushup Tracker</h2>
              <p className="opacity-90 text-sm sm:text-base md:text-lg">Real-time form analysis & counting</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <CameraOff className="w-6 h-6" />
            </button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm md:text-base">
              <span>{pushupMetrics.count} / {targetReps} pushups</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Camera Feed */}
            <div className="space-y-4">
              <div className="relative bg-black rounded-2xl overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover opacity-0"
                  autoPlay
                  muted
                  playsInline
                />
                <canvas
                  ref={canvasRef}
                  width={640}
                  height={480}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay indicators */}
                {isActive && (
                  <div className="absolute top-4 left-4 space-y-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    <div className={`px-3 py-1 rounded-full text-xs font-medium sm:text-sm md:text-base ${
                      pushupMetrics.isInPosition 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {pushupMetrics.isInPosition ? 'In Position' : 'Position Yourself'}
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium sm:text-sm md:text-base bg-black/70 text-white`}>
                      Phase: <span className={getPhaseColor()}>{pushupMetrics.phase}</span>
                    </div>
                  </div>
                )}

                {/* Completion celebration */}
                {isCompleted && (
                  <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center">
                    <div className="text-center text-white">
                      <CheckCircle className="w-16 h-16 mx-auto mb-4 animate-bounce" />
                      <h3 className="text-xl font-bold sm:text-2xl md:text-3xl">Workout Complete!</h3>
                      <p className="text-base sm:text-lg md:text-xl">{pushupMetrics.count} pushups in {formatTime(duration)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="flex justify-center space-x-4">
                {!isActive ? (
                  <button
                    onClick={handleStartTracking}
                    className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Start Tracking</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleStopTracking}
                      className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
                    >
                      <CameraOff className="w-5 h-5" />
                      <span>Stop</span>
                    </button>
                    
                    <button
                      onClick={handleReset}
                      className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span>Reset</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stats and Feedback */}
            <div className="space-y-6">
              {/* Rep Counter */}
              <div className="bg-gradient-to-br from-orange-50 to-purple-50 rounded-2xl p-6 text-center">
                <div className="text-6xl font-bold text-gray-800 mb-2">
                <div className="text-4xl font-bold text-gray-800 mb-2 sm:text-5xl md:text-6xl lg:text-7xl">
                  {pushupMetrics.count}
                </div>
                <p className="text-sm text-gray-600 sm:text-base md:text-lg">Pushups Completed</p>
                <div className="mt-4">
                  <div className="text-xs text-gray-600 mb-2 sm:text-sm md:text-base">Target: {targetReps}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Form Analysis */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Target className="w-5 h-5 text-orange-500" />
                  <h3 className="text-sm font-semibold text-gray-800 sm:text-base md:text-lg">Form Analysis</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 md:text-base">Confidence</span>
                    <span className={`text-sm font-semibold md:text-base ${getConfidenceColor()}`}>
                      {pushupMetrics.confidence}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 md:text-base">Current Phase</span>
                    <span className={`text-sm font-semibold capitalize md:text-base ${getPhaseColor()}`}>
                      {pushupMetrics.phase}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 md:text-base">Position</span>
                    <span className={`text-sm font-semibold md:text-base ${
                      pushupMetrics.isInPosition ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {pushupMetrics.isInPosition ? 'Correct' : 'Adjust'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Feedback */}
              {pushupMetrics.formFeedback.length > 0 && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-sm font-semibold text-yellow-800 sm:text-base md:text-lg">Form Tips</h3>
                  </div>
                  <ul className="space-y-2">
                    {pushupMetrics.formFeedback.map((tip, index) => (
                      <li key={index} className="text-yellow-700 text-xs flex items-start space-x-2 sm:text-sm md:text-base">
                        <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-blue-800 mb-3 sm:text-base md:text-lg">Instructions</h3>
                <ul className="space-y-2 text-blue-700 text-xs sm:text-sm md:text-base">
                  <li>• Position yourself in front of the camera</li>
                  <li>• Make sure your full body is visible</li>
                  <li>• Start in plank position with hands shoulder-width apart</li>
                  <li>• Lower your body until elbows reach 90 degrees</li>
                  <li>• Push back up to complete one rep</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}