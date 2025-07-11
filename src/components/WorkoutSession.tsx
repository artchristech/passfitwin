import React, { useState, useEffect } from 'react';
import { X, CheckCircle, SkipForward, Pause, Play } from 'lucide-react';
import WorkoutTimer from './WorkoutTimer';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  duration?: string;
}

interface WorkoutSessionProps {
  workout: {
    title: string;
    exercises: Exercise[];
  };
  onComplete: (sessionData: {
    totalTime: number;
    exercisesCompleted: number;
    caloriesBurned: number;
  }) => void;
  onClose: () => void;
}

export default function WorkoutSession({ workout, onComplete, onClose }: WorkoutSessionProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [totalSessionTime, setTotalSessionTime] = useState(0);
  const [sessionStartTime] = useState(Date.now());

  const currentExercise = workout.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalSessionTime(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const handleExerciseComplete = (completedSets: number, exerciseTime: number) => {
    const newCompleted = [...completedExercises, currentExerciseIndex];
    setCompletedExercises(newCompleted);

    if (isLastExercise) {
      // Session complete
      const sessionData = {
        totalTime: totalSessionTime,
        exercisesCompleted: newCompleted.length,
        caloriesBurned: Math.floor(totalSessionTime * 0.15), // Rough calculation
      };
      onComplete(sessionData);
    } else {
      // Move to next exercise
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const handleSkipExercise = () => {
    if (isLastExercise) {
      const sessionData = {
        totalTime: totalSessionTime,
        exercisesCompleted: completedExercises.length,
        caloriesBurned: Math.floor(totalSessionTime * 0.15),
      };
      onComplete(sessionData);
    } else {
      setCurrentExerciseIndex(prev => prev + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentExerciseIndex + 1) / workout.exercises.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-purple-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{workout.title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Session Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Exercise {currentExerciseIndex + 1} of {workout.exercises.length}</span>
              <span>{formatTime(totalSessionTime)}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Exercise List */}
        <div className="p-4 border-b">
          <div className="space-y-2">
            {workout.exercises.map((exercise, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-2 rounded-lg ${
                  index === currentExerciseIndex
                    ? 'bg-orange-100 border-2 border-orange-300'
                    : completedExercises.includes(index)
                    ? 'bg-green-100'
                    : 'bg-gray-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  completedExercises.includes(index)
                    ? 'bg-green-500 text-white'
                    : index === currentExerciseIndex
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-300'
                }`}>
                  {completedExercises.includes(index) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-bold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{exercise.name}</p>
                  <p className="text-sm text-gray-600">
                    {exercise.sets} sets × {exercise.reps} reps
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Exercise Timer */}
        <div className="p-6">
          <WorkoutTimer
            exercise={currentExercise}
            onComplete={handleExerciseComplete}
            onSkip={handleSkipExercise}
          />
        </div>
      </div>
    </div>
  );
}