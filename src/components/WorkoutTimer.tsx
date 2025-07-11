import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Timer, Zap } from 'lucide-react';

interface WorkoutTimerProps {
  exercise: {
    name: string;
    sets: number;
    reps: number;
    duration?: string;
  };
  onComplete: (completedSets: number, totalTime: number) => void;
  onSkip: () => void;
}

export default function WorkoutTimer({ exercise, onComplete, onSkip }: WorkoutTimerProps) {
  const [currentSet, setCurrentSet] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(parseInt(exercise.duration || '30'));
  const [totalTime, setTotalTime] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [completedSets, setCompletedSets] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
        setTotalTime(total => total + 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      if (isResting) {
        // Rest period over, start next set
        setIsResting(false);
        setTimeLeft(parseInt(exercise.duration || '30'));
        setCurrentSet(prev => prev + 1);
      } else {
        // Exercise set complete
        const newCompletedSets = completedSets + 1;
        setCompletedSets(newCompletedSets);
        
        if (newCompletedSets >= exercise.sets) {
          // All sets complete
          onComplete(newCompletedSets, totalTime);
        } else {
          // Start rest period
          setIsResting(true);
          setTimeLeft(15); // 15 second rest
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isResting, completedSets, exercise.sets, totalTime, onComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(parseInt(exercise.duration || '30'));
    setCurrentSet(1);
    setCompletedSets(0);
    setTotalTime(0);
    setIsResting(false);
  };

  const skipExercise = () => {
    onSkip();
  };

  const progress = ((exercise.sets - (exercise.sets - completedSets)) / exercise.sets) * 100;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-purple-50 rounded-2xl p-6 border-2 border-orange-200">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Zap className="w-6 h-6 text-orange-500" />
          <h3 className="text-xl font-bold text-gray-800">{exercise.name}</h3>
        </div>
        <p className="text-gray-600">
          Set {currentSet} of {exercise.sets} • {exercise.reps} reps
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-orange-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className={`text-6xl font-bold mb-2 ${isResting ? 'text-blue-500' : 'text-orange-500'}`}>
          {timeLeft}
        </div>
        <p className="text-lg font-medium text-gray-700">
          {isResting ? '🧘‍♀️ Rest Time' : '💪 Exercise Time'}
        </p>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={toggleTimer}
          className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
            isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span>{isActive ? 'Pause' : 'Start'}</span>
        </button>
        
        <button
          onClick={resetTimer}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-semibold transition-all duration-200"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Skip Button */}
      <div className="text-center">
        <button
          onClick={skipExercise}
          className="text-gray-500 hover:text-gray-700 text-sm underline"
        >
          Skip this exercise
        </button>
      </div>

      {/* Completed Sets Indicator */}
      {completedSets > 0 && (
        <div className="mt-4 flex justify-center space-x-2">
          {Array.from({ length: exercise.sets }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < completedSets ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}