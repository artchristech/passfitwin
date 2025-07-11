import React from 'react';
import { Camera, Target, Zap, Timer } from 'lucide-react';

interface CameraWorkoutCardProps {
  onStartPushupTracking: (targetReps: number) => void;
}

export default function CameraWorkoutCard({ onStartPushupTracking }: CameraWorkoutCardProps) {
  const pushupChallenges = [
    { reps: 10, difficulty: 'Beginner', color: 'from-green-500 to-emerald-600' },
    { reps: 20, difficulty: 'Intermediate', color: 'from-yellow-500 to-orange-600' },
    { reps: 30, difficulty: 'Advanced', color: 'from-red-500 to-pink-600' },
    { reps: 50, difficulty: 'Expert', color: 'from-purple-500 to-indigo-600' },
  ];

  return (
    <div className="bg-zinc-800/40 rounded-3xl p-6 border border-zinc-700/30">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-gradient-to-r from-blue-500/80 to-purple-600/80 p-3 rounded-full text-white">
          <Camera className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-zinc-100">AI Camera Tracking</h3>
          <p className="text-zinc-300">Real-time pushup counting & form analysis</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-zinc-700/30 rounded-2xl p-4 border border-zinc-600/20">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-5 h-5 text-orange-400" />
            <span className="font-semibold text-zinc-100">Features</span>
          </div>
          <ul className="space-y-2 text-sm text-zinc-300">
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
            <span className="font-semibold text-zinc-100">Choose Your Challenge</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {pushupChallenges.map((challenge) => (
              <button
                key={challenge.reps}
                onClick={() => onStartPushupTracking(challenge.reps)}
                className={`bg-gradient-to-r ${challenge.color} text-white p-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg`}
              >
                <div className="text-2xl font-bold mb-1">{challenge.reps}</div>
                <div className="text-xs opacity-90">{challenge.difficulty}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-400/20 rounded-2xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Timer className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-300">Setup Tips</span>
          </div>
          <ul className="space-y-1 text-xs text-yellow-200">
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