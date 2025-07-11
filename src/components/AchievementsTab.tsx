import React from 'react';
import { Award, Star, Trophy } from 'lucide-react';
import AchievementBadge, { Achievement } from './AchievementBadge';

interface AchievementsTabProps {
  achievements: Achievement[];
  newAchievements: string[];
  level: number;
  xp: number;
  xpToNextLevel: number;
  onQuickAction?: (action: string) => void;
  onStartPushupTracking?: (targetReps: number) => void;
  isLoading?: string | null;
}

export default function AchievementsTab({ 
  achievements, 
  newAchievements, 
  level, 
  xp, 
  xpToNextLevel,
  onQuickAction = () => {},
  onStartPushupTracking = () => {},
  isLoading = null
}: AchievementsTabProps) {
  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const lockedAchievements = achievements.filter(a => !a.unlockedAt);

  const xpProgress = (xp / xpToNextLevel) * 100;

  return (
    <>
      <div className="p-4 space-y-4 sm:space-y-6">
      {/* Level Progress */}
      <div className="bg-gradient-to-r from-orange-500 to-purple-600 text-white p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">Level {level}</h2>
            <p className="opacity-90 text-sm sm:text-base">Fitness Champion</p>
          </div>
          <div className="bg-white/20 p-2 rounded-full sm:p-3">
            <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{xp} XP</span>
            <span>{xpToNextLevel} XP to next level</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 sm:h-3">
            <div 
              className="bg-white h-2 sm:h-3 rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-zinc-700/50 rounded-xl border border-zinc-600/30 sm:p-4">
          <div className="text-xl font-bold text-zinc-100 sm:text-2xl">{unlockedAchievements.length}</div>
          <div className="text-xs text-zinc-300 sm:text-sm">Unlocked</div>
        </div>
        <div className="text-center p-3 bg-zinc-700/50 rounded-xl border border-zinc-600/30 sm:p-4">
          <div className="text-xl font-bold text-zinc-100 sm:text-2xl">{achievements.length}</div>
          <div className="text-xs text-zinc-300 sm:text-sm">Total</div>
        </div>
        <div className="text-center p-3 bg-zinc-700/50 rounded-xl border border-zinc-600/30 sm:p-4">
          <div className="text-2xl font-bold text-gray-800">
            {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
          </div>
          <div className="text-xl font-bold text-zinc-100 sm:text-2xl">
            {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
          </div>
          <div className="text-xs text-zinc-300 sm:text-sm">Complete</div>
        </div>
      </div>

      </div>

      {/* Quick Actions - Integrated */}
      <div className="p-4 space-y-4 sm:space-y-6 border-t border-zinc-700/30 mt-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100 mb-4">Quick Actions</h3>
        
        {/* Mobile: Horizontal scroll */}
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2 sm:hidden">
          <button
            onClick={() => onQuickAction('quick-workout')}
            disabled={isLoading === 'quick-workout'}
            className="flex-shrink-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:scale-100 min-w-[120px]"
          >
            {isLoading === 'quick-workout' ? (
              <div className="w-4 h-4 mx-auto mb-1 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-4 h-4 mx-auto mb-1">⏱️</div>
            )}
            <span className="text-xs font-medium block">5-Min Workout</span>
          </button>
          
          <button
            onClick={() => onQuickAction('daily-challenge')}
            disabled={isLoading === 'daily-challenge'}
            className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-red-600 text-white p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:scale-100 min-w-[120px]"
          >
            {isLoading === 'daily-challenge' ? (
              <div className="w-4 h-4 mx-auto mb-1 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-4 h-4 mx-auto mb-1">🎯</div>
            )}
            <span className="text-xs font-medium block">Daily Challenge</span>
          </button>
          
          <button
            onClick={() => onQuickAction('strength-training')}
            disabled={isLoading === 'strength-training'}
            className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:scale-100 min-w-[120px]"
          >
            {isLoading === 'strength-training' ? (
              <div className="w-4 h-4 mx-auto mb-1 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-4 h-4 mx-auto mb-1">⚡</div>
            )}
            <span className="text-xs font-medium block">Strength Training</span>
          </button>
          
          <button
            onClick={() => onStartPushupTracking(20)}
            disabled={isLoading === 'camera-pushups'}
            className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-3 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:scale-100 min-w-[120px]"
          >
            {isLoading === 'camera-pushups' ? (
              <div className="w-4 h-4 mx-auto mb-1 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-4 h-4 mx-auto mb-1">📷</div>
            )}
            <span className="text-xs font-medium block">AI Pushup Tracker</span>
          </button>
        </div>
        
        {/* Desktop: Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 sm:gap-3">
          <button
            onClick={() => onQuickAction('quick-workout')}
            disabled={isLoading === 'quick-workout'}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:scale-100"
          >
            {isLoading === 'quick-workout' ? (
              <div className="w-5 h-5 mx-auto mb-1 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-5 h-5 mx-auto mb-1">⏱️</div>
            )}
            <span className="text-xs font-medium block">5-Min Workout</span>
          </button>
          
          <button
            onClick={() => onQuickAction('daily-challenge')}
            disabled={isLoading === 'daily-challenge'}
            className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:scale-100"
          >
            {isLoading === 'daily-challenge' ? (
              <div className="w-5 h-5 mx-auto mb-1 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-5 h-5 mx-auto mb-1">🎯</div>
            )}
            <span className="text-xs font-medium block">Daily Challenge</span>
          </button>
          
          <button
            onClick={() => onQuickAction('strength-training')}
            disabled={isLoading === 'strength-training'}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:scale-100"
          >
            {isLoading === 'strength-training' ? (
              <div className="w-5 h-5 mx-auto mb-1 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-5 h-5 mx-auto mb-1">⚡</div>
            )}
            <span className="text-xs font-medium block">Strength Training</span>
          </button>
          
          <button
            onClick={() => onStartPushupTracking(20)}
            disabled={isLoading === 'camera-pushups'}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:scale-100"
          >
            {isLoading === 'camera-pushups' ? (
              <div className="w-5 h-5 mx-auto mb-1 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-5 h-5 mx-auto mb-1">📷</div>
            )}
            <span className="text-xs font-medium block">AI Pushup Tracker</span>
          </button>
          </div>
        </div>
      </div>
    </>
  );
}