import React from 'react';
import { Trophy, Target, Clock, Flame } from 'lucide-react';
import ChallengeCard, { Challenge } from './ChallengeCard';

interface ChallengesTabProps {
  challenges: Challenge[];
  onAcceptChallenge: (challengeId: string) => void;
  onClaimReward: (challengeId: string) => void;
}

export default function ChallengesTab({ challenges, onAcceptChallenge, onClaimReward }: ChallengesTabProps) {
  const dailyChallenges = challenges.filter(c => c.type === 'daily');
  const weeklyChallenges = challenges.filter(c => c.type === 'weekly');
  const specialChallenges = challenges.filter(c => c.type === 'special');

  return (
    <div className="p-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-zinc-100 mb-2 sm:text-2xl">Fitness Challenges</h2>
        <p className="text-zinc-300 text-sm sm:text-base">Push your limits and earn rewards!</p>
      </div>

      {/* Daily Challenges */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Target className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-zinc-100">Daily Challenges</h3>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {dailyChallenges.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onAccept={onAcceptChallenge}
              onClaim={onClaimReward}
            />
          ))}
        </div>
      </div>

      {/* Weekly Challenges */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Trophy className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-zinc-100">Weekly Challenges</h3>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {weeklyChallenges.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onAccept={onAcceptChallenge}
              onClaim={onClaimReward}
            />
          ))}
        </div>
      </div>

      {/* Special Challenges */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <Flame className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-zinc-100">Special Events</h3>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {specialChallenges.map(challenge => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onAccept={onAcceptChallenge}
              onClaim={onClaimReward}
            />
          ))}
        </div>
      </div>
    </div>
  );
}