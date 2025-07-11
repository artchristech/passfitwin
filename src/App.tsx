import React, { useState, useRef, useEffect } from 'react';
import { Trophy, Award, Target, AlertCircle } from 'lucide-react';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import QuickActions from './components/QuickActions';
import TypingIndicator from './components/TypingIndicator';
import ProgressStats from './components/ProgressStats';
import WorkoutSession from './components/WorkoutSession';
import ChallengesTab from './components/ChallengesTab';
import AchievementsTab from './components/AchievementsTab';
import PushupTracker from './components/PushupTracker';
import CameraWorkoutCard from './components/CameraWorkoutCard';
import Toast from './components/Toast';
import useFitnessChat from './hooks/useFitnessChat';

function App() {
  const { 
    messages, 
    isTyping, 
    activeWorkout,
    showPushupTracker,
    pushupTarget,
    sendMessage, 
    handleQuickAction,
    handleStartPushupTracking,
    handlePushupComplete,
    handleWorkoutComplete,
    setActiveWorkout,
    setShowPushupTracker,
    gamification
  } = useFitnessChat();
  
  const [activeTab, setActiveTab] = useState<'chat' | 'challenges' | 'achievements'>('chat');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const mockStats = {
    weeklyWorkouts: 5,
    caloriesBurned: 1250,
    averageWorkoutTime: 28,
    completionRate: 85,
  };

  useEffect(() => {
    if (chatContainerRef.current && activeTab === 'chat') {
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isTyping, activeTab]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleQuickActionWithLoading = async (action: string) => {
    setIsLoading(action);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
      handleQuickAction(action);
      showToast('Workout loaded successfully!', 'success');
    } catch (error) {
      showToast('Failed to load workout. Please try again.', 'error');
    } finally {
      setIsLoading(null);
    }
  };

  const handlePushupTrackingWithLoading = async (targetReps: number) => {
    setIsLoading('camera-pushups');
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate camera initialization
      handleStartPushupTracking(targetReps);
      showToast('Camera initialized successfully!', 'success');
    } catch (error) {
      showToast('Camera access failed. Please check permissions.', 'error');
    } finally {
      setIsLoading(null);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'FitCoach AI - My Personal Fitness Journey',
        text: `I'm Level ${gamification.gameState.level} with ${gamification.gameState.totalPoints} points and a ${gamification.gameState.streak}-day streak with FitCoach AI! 💪`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `I'm Level ${gamification.gameState.level} with ${gamification.gameState.totalPoints} points and a ${gamification.gameState.streak}-day streak with FitCoach AI! 💪 Check it out: ${window.location.href}`;
      navigator.clipboard.writeText(shareText);
      showToast('Share text copied to clipboard!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col pt-safe-top pb-safe-bottom">
      <Header 
        streak={gamification.gameState.streak} 
        totalWorkouts={gamification.gameState.achievements.filter(a => a.unlockedAt).length} 
        onShare={handleShare}
      />
      
      {/* Tab Navigation */}
      <div className="bg-zinc-800/50 border-b border-zinc-700/50 sticky top-0 z-10">
        <div className="w-full max-w-md mx-auto flex px-4 sm:max-w-4xl">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 px-3 text-center font-medium transition-all duration-300 rounded-t-2xl text-sm sm:py-4 sm:px-6 sm:text-base ${
              activeTab === 'chat'
                ? 'text-orange-400 bg-zinc-800 border-b-2 border-orange-400'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`flex-1 py-3 px-3 text-center font-medium transition-all duration-300 flex items-center justify-center space-x-1 rounded-t-2xl text-sm sm:py-4 sm:px-6 sm:text-base sm:space-x-2 ${
              activeTab === 'challenges'
                ? 'text-orange-400 bg-zinc-800 border-b-2 border-orange-400'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
            }`}
          >
            <Target className="w-4 h-4" />
            <span className="hidden xs:inline">Challenges</span>
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 py-3 px-3 text-center font-medium transition-all duration-300 flex items-center justify-center space-x-1 rounded-t-2xl text-sm sm:py-4 sm:px-6 sm:text-base sm:space-x-2 ${
              activeTab === 'achievements'
                ? 'text-orange-400 bg-zinc-800 border-b-2 border-orange-400'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
            }`}
          >
            <Award className="w-4 h-4" />
            <span className="hidden xs:inline">Achievements</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto bg-zinc-800/30 rounded-3xl m-2 overflow-hidden sm:max-w-4xl sm:m-4">
        {activeTab === 'chat' && (
          <>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 sm:p-6 sm:space-y-6 scroll-smooth">
              {messages.length > 3 && (
                <ProgressStats stats={mockStats} />
              )}
              
              {messages.length > 5 && (
                <CameraWorkoutCard 
                  onStartPushupTracking={handlePushupTrackingWithLoading}
                  isLoading={isLoading === 'camera-pushups'}
                />
              )}
              
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isTyping && <TypingIndicator />}
              <div ref={chatEndRef} />
            </div>
            
            <QuickActions 
              onQuickAction={handleQuickActionWithLoading} 
              onStartPushupTracking={handlePushupTrackingWithLoading}
              isLoading={isLoading}
            />
            <ChatInput onSendMessage={sendMessage} isTyping={isTyping} />
          </>
        )}
        
        {activeTab === 'challenges' && (
          <div className="flex-1 overflow-y-auto">
            <ChallengesTab
              challenges={gamification.gameState.activeChallenges}
              onAcceptChallenge={gamification.acceptChallenge}
              onClaimReward={gamification.claimReward}
            />
          </div>
        )}
        
        {activeTab === 'achievements' && (
          <div className="flex-1 overflow-y-auto">
            <AchievementsTab
              achievements={gamification.gameState.achievements}
              newAchievements={gamification.newAchievements}
              level={gamification.gameState.level}
              xp={gamification.gameState.xp}
              xpToNextLevel={gamification.gameState.xpToNextLevel}
            />
          </div>
        )}
      </div>
      
      {/* Workout Session Modal */}
      {activeWorkout && (
        <WorkoutSession
          workout={activeWorkout}
          onComplete={handleWorkoutComplete}
          onClose={() => setActiveWorkout(null)}
        />
      )}
      
      {/* Pushup Tracker Modal */}
      {showPushupTracker && (
        <PushupTracker
          targetReps={pushupTarget}
          onComplete={handlePushupComplete}
          onClose={() => setShowPushupTracker(false)}
        />
      )}
      
      {/* Toast Notifications */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

export default App;