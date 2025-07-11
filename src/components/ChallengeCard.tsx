import React from 'react';
import { Trophy, Target, Clock, Users, Star, Flame } from 'lucide-react';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  difficulty: 'easy' | 'medium' | 'hard';
  reward: {
    points: number;
    badge?: string;
  };
  progress: {
    current: number;
    target: number;
  };
  timeLeft?: string;
  participants?: number;
  isCompleted: boolean;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onAccept: (challengeId: string) => void;
  onClaim: (challengeId: string) => void;
}

export default function ChallengeCard({ challenge, onAccept, onClaim }: ChallengeCardProps) {
  const progressPercentage = (challenge.progress.current / challenge.progress.target) * 100;
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'from-green-500 to-emerald-600';
      case 'medium': return 'from-yellow-500 to-orange-600';
      case 'hard': return 'from-red-500 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'daily': return <Target className="w-5 h-5" />;
      case 'weekly': return <Trophy className="w-5 h-5" />;
      case 'monthly': return <Star className="w-5 h-5" />;
      case 'special': return <Flame className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border-2 ${
      challenge.isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200'
    } hover:shadow-xl transition-all duration-300`}>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} p-2 rounded-full text-white`}>
            {getTypeIcon(challenge.type)}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">{challenge.title}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="capitalize">{challenge.type}</span>
              <span>•</span>
              <span className="capitalize">{challenge.difficulty}</span>
            </div>
          </div>
        </div>
        
        {challenge.isCompleted && (
          <div className="bg-green-500 text-white p-2 rounded-full">
            <Trophy className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4">{challenge.description}</p>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{challenge.progress.current}/{challenge.progress.target}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{challenge.reward.points} pts</span>
          </div>
          
          {challenge.participants && (
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-blue-500" />
              <span>{challenge.participants.toLocaleString()}</span>
            </div>
          )}
          
          {challenge.timeLeft && (
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>{challenge.timeLeft}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex space-x-2">
        {challenge.isCompleted ? (
          <button
            onClick={() => onClaim(challenge.id)}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Trophy className="w-4 h-4" />
            <span>Claim Reward</span>
          </button>
        ) : progressPercentage > 0 ? (
          <button
            onClick={() => onAccept(challenge.id)}
            className={`flex-1 bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-200`}
          >
            Continue Challenge
          </button>
        ) : (
          <button
            onClick={() => onAccept(challenge.id)}
            className={`flex-1 bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-200`}
          >
            Accept Challenge
          </button>
        )}
      </div>

      {/* Badge Preview */}
      {challenge.reward.badge && (
        <div className="mt-3 text-center">
          <span className="text-xs text-gray-500">Unlock: </span>
          <span className="text-xs font-semibold text-purple-600">{challenge.reward.badge}</span>
        </div>
      )}
    </div>
  );
}