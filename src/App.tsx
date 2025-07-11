import React, { useState, useRef, useEffect } from 'react';
import { Trophy, Award, Target, AlertCircle, Zap, Info } from 'lucide-react';
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
        title: 'PASSFiT - My Personal Fitness Journey',
        text: `I'm Level ${gamification.gameState.level} with ${gamification.gameState.totalPoints} points and a ${gamification.gameState.streak}-day streak with PASSFiT! 💪`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `I'm Level ${gamification.gameState.level} with ${gamification.gameState.totalPoints} points and a ${gamification.gameState.streak}-day streak with PASSFiT! 💪 Check it out: ${window.location.href}`;
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
      
      <div className="flex-1 flex flex-col w-full max-w-md mx-auto bg-zinc-800/30 rounded-3xl m-2 overflow-hidden sm:max-w-4xl sm:m-4 pb-32">
        {activeTab === 'chat' && (
          <>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-4 sm:p-6 sm:space-y-6 scroll-smooth pb-20">
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
            
            <ChatInput onSendMessage={sendMessage} isTyping={isTyping} />
          </>
        )}
        
        {activeTab === 'challenges' && (
          <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
            <ChallengesTab
              challenges={gamification.gameState.activeChallenges}
              onAcceptChallenge={gamification.acceptChallenge}
              onClaimReward={gamification.claimReward}
            />
          </div>
        )}
        
        {activeTab === 'achievements' && (
          <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
            <AchievementsTab
              achievements={gamification.gameState.achievements}
              newAchievements={gamification.newAchievements}
              level={gamification.gameState.level}
              xp={gamification.gameState.xp}
              xpToNextLevel={gamification.gameState.xpToNextLevel}
            />
            
            <QuickActions 
              onQuickAction={handleQuickActionWithLoading} 
              onStartPushupTracking={handlePushupTrackingWithLoading}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
      
      {/* Tab Navigation - Now at Bottom */}
      <div className="bg-zinc-800 border-t border-zinc-700 fixed bottom-0 left-0 right-0 z-20 pb-safe-bottom h-16">
        <div className="w-full max-w-md mx-auto flex h-full sm:max-w-4xl">
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex-1 h-full relative text-center font-medium transition-all duration-300 flex items-center justify-center text-sm sm:text-base ${
              activeTab === 'achievements'
                ? 'text-orange-400'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
            }`}
          >
            {activeTab === 'achievements' && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange-400"></div>
            )}
            <Award className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`flex-1 h-full relative text-center font-medium transition-all duration-300 flex items-center justify-center text-sm sm:text-base ${
              activeTab === 'challenges'
                ? 'text-orange-400'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
            }`}
          >
            {activeTab === 'challenges' && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange-400"></div>
            )}
            <Target className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 h-full relative text-center font-medium transition-all duration-300 flex items-center justify-center text-sm sm:text-base ${
              activeTab === 'chat'
                ? 'text-orange-400'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
            }`}
          >
            {activeTab === 'chat' && (
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange-400"></div>
            )}
            <Info className="w-4 h-4" />
          </button>
        </div>
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