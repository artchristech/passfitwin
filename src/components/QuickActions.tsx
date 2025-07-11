import React from 'react';
import { Clock, Zap, Target, Calendar, Timer, Camera } from 'lucide-react';

interface QuickActionsProps {
  onQuickAction: (action: string) => void;
  onStartPushupTracking: (targetReps: number) => void;
}

export default function QuickActions({ onQuickAction, onStartPushupTracking }: QuickActionsProps) {
  const actions = [
    { id: 'quick-workout', label: '5-Min Workout', icon: Timer, color: 'from-green-500 to-emerald-600' },
    { id: 'daily-challenge', label: 'Daily Challenge', icon: Target, color: 'from-orange-500 to-red-600' },
    { id: 'strength-training', label: 'Strength Training', icon: Zap, color: 'from-purple-500 to-pink-600' },
    { id: 'camera-pushups', label: 'AI Pushup Tracker', icon: Camera, color: 'from-blue-500 to-cyan-600' },
  ];

  const handleActionClick = (actionId: string) => {
    if (actionId === 'camera-pushups') {
      onStartPushupTracking(20); // Default to 20 pushups
    } else {
      onQuickAction(actionId);
    }
  };

  return (
    <div className="p-6 bg-zinc-800/30 border-t border-zinc-700/30">
      <p className="text-sm text-zinc-300 mb-4 font-medium">Quick Actions</p>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action.id)}
            className={`bg-gradient-to-r ${action.color} text-white p-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg`}
          >
            <action.icon className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}