import React, { useState, useEffect } from 'react';
import { Trophy, Star, Flame, Target, Award, Zap } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
  progress?: {
    current: number;
    target: number;
  };
}

interface AchievementBadgeProps {
  achievement: Achievement;
  isNew?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function AchievementBadge({ achievement, isNew = false, size = 'medium' }: AchievementBadgeProps) {
  const [showAnimation, setShowAnimation] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setShowAnimation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const getIcon = (iconName: string) => {
    const iconProps = {
      className: `${size === 'small' ? 'w-4 h-4' : size === 'large' ? 'w-8 h-8' : 'w-6 h-6'} text-white`
    };
    
    switch (iconName) {
      case 'trophy': return <Trophy {...iconProps} />;
      case 'star': return <Star {...iconProps} />;
      case 'flame': return <Flame {...iconProps} />;
      case 'target': return <Target {...iconProps} />;
      case 'award': return <Award {...iconProps} />;
      case 'zap': return <Zap {...iconProps} />;
      default: return <Trophy {...iconProps} />;
    }
  };

  const getRarityColors = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-600';
      case 'rare': return 'from-blue-500 to-blue-600';
      case 'epic': return 'from-purple-500 to-purple-600';
      case 'legendary': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small': return 'w-12 h-12 p-2';
      case 'large': return 'w-20 h-20 p-4';
      default: return 'w-16 h-16 p-3';
    }
  };

  const isUnlocked = !!achievement.unlockedAt;
  const progressPercentage = achievement.progress 
    ? (achievement.progress.current / achievement.progress.target) * 100 
    : 100;

  return (
    <div className={`relative ${showAnimation ? 'animate-bounce' : ''}`}>
      {/* Badge */}
      <div className={`
        ${getSizeClasses()}
        rounded-full
        ${isUnlocked 
          ? `bg-gradient-to-br ${getRarityColors(achievement.rarity)} shadow-lg` 
          : 'bg-gray-300'
        }
        flex items-center justify-center
        transition-all duration-300
        ${isUnlocked ? 'hover:scale-110' : ''}
        ${showAnimation ? 'ring-4 ring-yellow-400 ring-opacity-75' : ''}
      `}>
        {isUnlocked ? (
          getIcon(achievement.icon)
        ) : (
          <div className="w-6 h-6 bg-gray-500 rounded opacity-50" />
        )}
      </div>

      {/* Progress Ring for Locked Achievements */}
      {!isUnlocked && achievement.progress && (
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={`${progressPercentage * 2.83} 283`}
            className="text-orange-500 transition-all duration-500"
          />
        </svg>
      )}

      {/* New Badge Indicator */}
      {showAnimation && (
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
          !
        </div>
      )}

      {/* Rarity Glow Effect */}
      {isUnlocked && achievement.rarity === 'legendary' && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 opacity-20 animate-pulse -z-10 scale-125" />
      )}
    </div>
  );
}