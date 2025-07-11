import React from 'react';
import { Clock, Zap, Target, Calendar, Timer, Camera, Loader2 } from 'lucide-react';

interface QuickActionsProps {
  onQuickAction: (action: string) => void;
  onStartPushupTracking: (targetReps: number) => void;
  isLoading?: string | null;
}

export default function QuickActions({ onQuickAction, onStartPushupTracking, isLoading }: QuickActionsProps) {
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
    <div className="p-4 bg-zinc-800/30 border-t border-zinc-700/30 sm:p-6">
      <p className="text-sm text-zinc-300 mb-3 font-medium sm:mb-4">Quick Actions</p>
      
      {/* Mobile: Horizontal scroll */}
      <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2 sm:hidden">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action.id)}
            disabled={isLoading === action.id}
            className={`flex-shrink-0 bg-gradient-to-r ${action.color} text-white p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:scale-100 min-w-[120px]`}
          >
            {isLoading === action.id ? (
              <Loader2 className="w-4 h-4 mx-auto mb-1 animate-spin" />
            ) : (
              <action.icon className="w-4 h-4 mx-auto mb-1" />
            )}
            <span className="text-xs font-medium block">{action.label}</span>
          </button>
        ))}
      </div>
      
      {/* Desktop: Grid */}
      <div className="hidden sm:grid sm:grid-cols-2 sm:gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleActionClick(action.id)}
            disabled={isLoading === action.id}
            className={`bg-gradient-to-r ${action.color} text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:scale-100`}
          >
            {isLoading === action.id ? (
              <Loader2 className="w-5 h-5 mx-auto mb-1 animate-spin" />
            ) : (
              <action.icon className="w-5 h-5 mx-auto mb-1" />
            )}
            <span className="text-xs font-medium block">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}