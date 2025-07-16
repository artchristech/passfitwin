import React from 'react';
import { Camera, Target, Zap, Timer, Loader2 } from 'lucide-react';

interface CameraWorkoutCardProps {
  onStartPushupTracking: (targetReps: number) => void;
  isLoading?: boolean;
}

export default function CameraWorkoutCard({ onStartPushupTracking, isLoading }: CameraWorkoutCardProps) {
  const pushupChallenges = [
    { reps: 10, difficulty: 'Beginner', color: 'from-green-500 to-emerald-600' },
    { reps: 20, difficulty: 'Intermediate', color: 'from-yellow-500 to-orange-600' },
    { reps: 30, difficulty: 'Advanced', color: 'from-red-500 to-pink-600' },
    { reps: 50, difficulty: 'Expert', color: 'from-purple-500 to-indigo-600' },
  ];

  return (
    <div className="bg-zinc-800/40 rounded-3xl p-4 border border-zinc-700/30 sm:p-6 animate-fade-in">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-gradient-to-r from-blue-500/80 to-purple-600/80 p-2 rounded-full text-white sm:p-3">
          <Camera className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-zinc-100 sm:text-xl md:text-2xl lg:text-3xl">AI Camera Tracking</h3>
          <p className="text-sm text-zinc-300 sm:text-base md:text-lg">Real-time pushup counting & form analysis</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-zinc-700/30 rounded-2xl p-3 border border-zinc-600/20 sm:p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-5 h-5 text-orange-400" />
            <span className="text-sm font-semibold text-zinc-100 sm:text-base md:text-lg">Features</span>
          </div>
          <ul className="space-y-2 text-xs text-zinc-300 sm:text-sm md:text-base">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
              <span>Automatic rep counting</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              <span>Real-time form feedback</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              <span>Pose landmark tracking</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
              <span>Performance analytics</span>
            </li>
          </ul>
        </div>

        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Target className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-semibold text-zinc-100 sm:text-base md:text-lg">Choose Your Challenge</span>
          </div>
          
          {/* Mobile: Horizontal scroll */}
          <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2 md:hidden">
            {pushupChallenges.map((challenge) => (
              <button
                key={challenge.reps}
                onClick={() => onStartPushupTracking(challenge.reps)}
                disabled={isLoading}
                className={`flex-shrink-0 bg-gradient-to-r ${challenge.color} text-white p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:scale-100 min-w-[80px]`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                ) : (
                  <>
                    <div className="text-xl font-bold mb-1">{challenge.reps}</div>
                    <div className="text-xs opacity-90 sm:text-sm">{challenge.difficulty}</div>
                  </>
                )}
              </button>
            ))}
          </div>
          
          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {pushupChallenges.map((challenge) => (
              <button
                key={challenge.reps}
                onClick={() => onStartPushupTracking(challenge.reps)}
                disabled={isLoading}
                className={`bg-gradient-to-r ${challenge.color} text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:scale-100 md:p-6`}
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 mx-auto animate-spin md:w-8 md:h-8" />
                ) : (
                  <>
                    <div className="text-2xl font-bold mb-1 md:text-3xl lg:text-4xl">{challenge.reps}</div>
                    <div className="text-xs opacity-90 md:text-sm lg:text-base">{challenge.difficulty}</div>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-2xl p-3 sm:p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Timer className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-semibold text-yellow-300 sm:text-sm md:text-base">Setup Tips</span>
          </div>
          <ul className="space-y-1 text-xs text-yellow-200 md:text-sm">
            <li>• Ensure good lighting and clear camera view</li>
            <li>• Position camera to see your full body</li>
            <li>• Allow camera permissions when prompted</li>
            <li>• Start in proper plank position</li>
          </ul>
        </div>
      </div>
    </div>
  );
}