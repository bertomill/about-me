'use client';

import { useState, useRef, useEffect } from 'react';
import { Phone, PhoneOff, Loader, User, Bot, Volume2, ChevronDown } from 'lucide-react';
import { RealtimeAgent, RealtimeSession } from '@openai/agents/realtime';

interface VoiceMessage {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuestionCategory {
  id: string;
  name: string;
  icon: string;
  questions: string[];
}

const QUESTION_CATEGORIES: QuestionCategory[] = [
  {
    id: 'all',
    name: 'All Questions',
    icon: '💡',
    questions: []
  },
  {
    id: 'experience',
    name: 'Experience & Background',
    icon: '💼',
    questions: [
      "Tell me about Robert's experience with AI and machine learning",
      "What was Robert's biggest achievement at CIBC?",
      "How did Robert scale Scelta from 5 to 20 customers?",
      "What was Robert's role at Sick Kids Hospital?",
      "Describe Robert's consulting experience across different industries",
      "How has Robert's background in football influenced his work style?"
    ]
  },
  {
    id: 'values',
    name: 'Values & Leadership',
    icon: '⭐',
    questions: [
      "What are Robert's core values and how does he demonstrate them?",
      "Describe Robert's leadership style and experience",
      "How does Robert approach collaboration and teamwork?",
      "What does 'Customer-Centric' mean to Robert?",
      "Tell me about Robert's 'Resourceful' value with examples",
      "How does Robert balance 'Challenge' and 'Persevere' in his work?"
    ]
  },
  {
    id: 'behavioral',
    name: 'Behavioral Scenarios',
    icon: '🎯',
    questions: [
      "Tell me about a time Robert handled a crisis or system failure",
      "Describe a situation where Robert had to build consensus among stakeholders",
      "How did Robert make the difficult decision to leave Scelta for CIBC?",
      "Give me an example of Robert leading without formal authority",
      "What's a time Robert failed and what did he learn from it?",
      "How does Robert approach problem-solving in complex situations?"
    ]
  },
  {
    id: 'technical',
    name: 'Technical Skills',
    icon: '🚀',
    questions: [
      "What makes Robert a good fit for an AI consultant role?",
      "How does Robert approach strategy consulting?",
      "What technical skills has Robert developed recently?",
      "How does Robert use AI tools in his daily work?",
      "What's Robert's experience with Google Cloud Platform and AppSheet?",
      "How does Robert stay current with emerging technologies?"
    ]
  },
  {
    id: 'decisions',
    name: 'Career Decisions',
    icon: '🤔',
    questions: [
      "Why did Robert transition from Scelta to CIBC?",
      "How does Robert approach major career decisions?",
      "What attracted Robert to innovation strategy consulting?",
      "How did Robert decide to pursue his master's degree?",
      "What challenges has Robert faced in his career transitions?",
      "Where does Robert see his career heading next?"
    ]
  },
  {
    id: 'achievements',
    name: 'Key Achievements',
    icon: '🏆',
    questions: [
      "How did Robert move CIBC from #41 to top 20 in AI maturity?",
      "What was the impact of Robert's 21 AI initiatives at CIBC?",
      "Tell me about Robert's success scaling Scelta's customer base",
      "How did Robert win the Ivey Design Innovation Studio competition?",
      "What recognition has Robert received for his work?",
      "What are Robert's most significant professional accomplishments?"
    ]
  }
];

export default function VoiceInterface() {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  // Audio level monitoring temporarily disabled - will be used for future enhancements
  // const [audioLevel, setAudioLevel] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [loadingProgress, setLoadingProgress] = useState(0);
  // Loading step messaging for better user experience during connection
  const [loadingStep, setLoadingStep] = useState('');
  
  // New state for question categories and management
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  const agentRef = useRef<RealtimeAgent | null>(null);
  const sessionRef = useRef<RealtimeSession | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Get questions for the selected category
  const getQuestionsForCategory = () => {
    if (selectedCategory === 'all') {
      // Return all questions from all categories (excluding 'all' category itself)
      return QUESTION_CATEGORIES
        .filter(cat => cat.id !== 'all')
        .flatMap(cat => cat.questions);
    }
    const category = QUESTION_CATEGORIES.find(cat => cat.id === selectedCategory);
    return category?.questions || [];
  };

  // Handle clicking on a question to automatically ask it
  const handleQuestionClick = async (question: string) => {
    if (!isConnected) {
      // If not connected, show a helpful message
      alert('Please click the phone icon to connect to TopGrade AI first, then click questions to ask them automatically!');
      return;
    }

    // Add the question as a user message
    const userMessage: VoiceMessage = {
      type: 'user',
      content: question,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      // Send the question to the voice API
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: question })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Add the AI response
        const assistantMessage: VoiceMessage = {
          type: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);

        // Play the audio response if available
        if (data.audio) {
          const audioBlob = new Blob(
            [Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))],
            { type: 'audio/mp3' }
          );
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play().catch(console.error);
        }
      }
    } catch (error) {
      console.error('Error asking question:', error);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on component unmount
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showCategoryDropdown) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategoryDropdown]);

  const getCandidateContext = async () => {
    try {
      setLoadingStep('📋 Loading Robert\'s profile...');
      
      // Use the new faster cached endpoint instead of the slow chat endpoint
      // This dramatically speeds up loading time since the context is cached
      const response = await fetch('/api/voice', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Got candidate context:', data.cached ? 'from cache' : 'fresh from database');
        
        return `You are an AI assistant helping interviewers learn about Robert Mill through natural voice conversation. 
        Be conversational, friendly, and informative. 
        
        IMPORTANT: When the conversation starts, immediately introduce yourself by saying: "Hello! I'm Robert's interview assistant and I'm happy to answer any questions about his background, experience, and qualifications. What would you like to know?"
        
        ${data.context}`;
      }
    } catch (error) {
      console.error('Error getting candidate context:', error);
    }
    
    return `You are an AI assistant helping interviewers learn about Robert Mill through voice conversation. 
    Robert is currently an Innovation Strategy Consultant at CIBC with extensive experience in AI, 
    strategy consulting, and technology implementation. Speak naturally and conversationally about his background.
    
    IMPORTANT: When the conversation starts, immediately introduce yourself by saying: "Hello! I'm Robert's interview assistant and I'm happy to answer any questions about his background, experience, and qualifications. What would you like to know?"`;
  };

  const connectToRealtime = async () => {
    try {
      // Prevent multiple connections
      if (isConnected || connectionStatus === 'connecting') {
        console.log('Already connected or connecting, ignoring request');
        return;
      }

      // Set loading state immediately and force re-render
      console.log('Setting connection status to connecting');
      setConnectionStatus('connecting');
      setLoadingProgress(5);
      setLoadingStep('🚀 Initializing voice assistant...');
      console.log('State set: connecting with 5% progress');
      
      // Force state update to ensure UI renders immediately
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Clean up any existing session first but don't reset connection state
      await cleanupSession();

      // Get ephemeral token
      setLoadingProgress(15);
      setLoadingStep('🔑 Getting secure access token...');
      const tokenResponse = await fetch('/api/realtime-token', {
        method: 'POST',
      });
      
      if (!tokenResponse.ok) {
        throw new Error('Failed to get realtime token');
      }
      
      const { client_secret } = await tokenResponse.json();
      
      if (!client_secret) {
        throw new Error('No client secret received');
      }

      // Get candidate context for instructions with smoother progress updates
      setLoadingProgress(25);
      const instructions = await getCandidateContext();
      
      // Update progress more smoothly after getting context
      setLoadingProgress(45);
      setLoadingStep('🧠 Processing context...');
      await new Promise(resolve => setTimeout(resolve, 200));

      // Create RealtimeAgent
      setLoadingProgress(65);
      setLoadingStep('🤖 Setting up AI assistant...');
      await new Promise(resolve => setTimeout(resolve, 300));
      agentRef.current = new RealtimeAgent({
        name: 'Interview Assistant',
        instructions: instructions,
        voice: 'alloy',
      });

      // Create RealtimeSession with the agent
      setLoadingProgress(80);
      setLoadingStep('🎤 Establishing voice connection...');
      sessionRef.current = new RealtimeSession(agentRef.current);
      
      setLoadingProgress(90);
      setLoadingStep('🔊 Preparing audio interface...');
      await new Promise(resolve => setTimeout(resolve, 200));

      // Remove any existing listeners first to prevent duplicates
      sessionRef.current.removeAllListeners?.();

      // Set up event listeners on the session with proper type assertions
      // TypeScript doesn't have complete type definitions for RealtimeSession events
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sessionRef.current as any).on('conversation.item.input_audio_transcription.completed', (event: any) => {
        console.log('User said:', event.transcript);
        const userMessage: VoiceMessage = {
          type: 'user',
          content: event.transcript,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sessionRef.current as any).on('response.audio_transcript.delta', (event: any) => {
        setCurrentTranscript(prev => prev + event.delta);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sessionRef.current as any).on('response.audio_transcript.done', (event: any) => {
        console.log('AI responded:', event.transcript);
        if (event.transcript) {
          const assistantMessage: VoiceMessage = {
            type: 'assistant',
            content: event.transcript,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, assistantMessage]);
          setCurrentTranscript('');
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sessionRef.current as any).on('input_audio_buffer.speech_started', () => {
        console.log('Speech started');
        setIsRecording(true);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sessionRef.current as any).on('input_audio_buffer.speech_stopped', () => {
        console.log('Speech stopped');
        setIsRecording(false);
      });

      // Connect the session
      await sessionRef.current.connect({ 
        apiKey: client_secret,
      });

      setLoadingProgress(100);
      setLoadingStep('✅ Connected! Ready to chat...');
      // Brief delay to show completion message
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setConnectionStatus('connected');
      setIsConnected(true);

      // Add a welcome message to the conversation history
      // Note: The AI will automatically greet when the user first speaks
      const greetingMessage: VoiceMessage = {
        type: 'assistant',
        content: "Hello! I'm Robert's interview assistant and I'm happy to answer any questions about his background, experience, and qualifications. What would you like to know?",
        timestamp: new Date()
      };
      setMessages([greetingMessage]);

      console.log('Voice assistant connected successfully! Ready for conversation.');

    } catch (error) {
      console.error('Error connecting to realtime API:', error);
      setConnectionStatus('error');
      alert('Failed to connect to voice assistant. Please check your microphone permissions and try again.');
    }
  };

  const cleanupSession = async () => {
    console.log('Cleaning up session objects...');
    
    // Clean up session
    if (sessionRef.current) {
      try {
        // Remove all event listeners first to prevent duplicate events
        sessionRef.current.removeAllListeners?.();
        
        // Try to gracefully close the session
        if (typeof sessionRef.current.close === 'function') {
          await sessionRef.current.close();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } else if (typeof (sessionRef.current as any).end === 'function') {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (sessionRef.current as any).end();
        } else {
          console.log('No close method found, cleaning up manually');
        }
      } catch (error) {
        console.error('Error cleaning up session:', error);
      }
      sessionRef.current = null;
    }

    // Clean up agent reference
    if (agentRef.current) {
      agentRef.current = null;
    }
    
    // Clean up media streams
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Clean up audio context
    if (audioContextRef.current) {
      try {
        await audioContextRef.current.close();
      } catch (error) {
        console.error('Error closing audio context:', error);
      }
      audioContextRef.current = null;
    }
  };

  const disconnect = async () => {
    console.log('Disconnecting voice session...');
    
    // Clean up session objects
    await cleanupSession();
    
    // Reset all state
    console.log('Resetting all state to disconnected');
    setIsConnected(false);
    setIsRecording(false);
    setConnectionStatus('disconnected');
    // setAudioLevel(0); // This line was removed from the original file, so it's removed here.
    setCurrentTranscript('');
    setLoadingProgress(0);
  };

  const clearConversation = () => {
    setMessages([]);
  };

  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 backdrop-blur-sm">
      <div className="space-y-8">
        {/* Connection Status */}
        <div className="text-center">
          <div className={`inline-flex items-center space-x-3 px-4 py-2 rounded-full text-sm font-medium shadow-sm border ${
            connectionStatus === 'connected' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            connectionStatus === 'connecting' ? 'bg-blue-50 text-blue-700 border-blue-200' :
            connectionStatus === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
            'bg-gray-50 text-gray-600 border-gray-200'
          }`}>
            {connectionStatus === 'connecting' && <Loader size={14} className="animate-spin" />}
            <div className={`w-2.5 h-2.5 rounded-full ${
              connectionStatus === 'connected' ? 'bg-emerald-500 shadow-emerald-300 shadow-sm' :
              connectionStatus === 'connecting' ? 'bg-blue-500 shadow-blue-300 shadow-sm' :
              connectionStatus === 'error' ? 'bg-red-500 shadow-red-300 shadow-sm' :
              'bg-gray-400'
            }`} />
            <span className="capitalize font-semibold">{connectionStatus}</span>
          </div>
        </div>

        {/* Connection Loading Progress */}
        {connectionStatus === 'connecting' && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Loader size={18} className="text-blue-600 animate-spin" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-blue-800 font-semibold text-base">Connecting to AI Assistant</span>
                    <span className="text-blue-600 text-sm font-medium">({loadingProgress}%)</span>
                  </div>
                </div>
              </div>
              <div className="w-full bg-white/80 rounded-full h-2 mb-3 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500 ease-out shadow-sm" 
                  style={{ width: `${Math.max(loadingProgress, 8)}%` }}
                ></div>
              </div>
              <p className="text-blue-700 text-sm font-medium">
                {loadingStep || (loadingProgress < 30 ? 'Getting secure token...' :
                 loadingProgress < 60 ? 'Loading candidate context...' :
                 loadingProgress < 90 ? 'Setting up AI agent...' :
                 'Establishing voice connection...')}
              </p>
              {process.env.NODE_ENV === 'development' && (
                <p className="text-xs text-gray-500 mt-2 px-3 py-1 bg-white/60 rounded-md">
                  Debug: Status={connectionStatus}, Progress={loadingProgress}%
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-2 bg-gray-100 text-xs">
            Status: {connectionStatus}, Progress: {loadingProgress}%, Connected: {isConnected ? 'Yes' : 'No'}
          </div>
        )}

        {/* Voice Controls */}
        <div className="flex justify-center items-center space-x-6">
          {!isConnected ? (
            <button
              onClick={connectToRealtime}
              disabled={connectionStatus === 'connecting'}
              className="group relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-all duration-300 shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/40 hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
              {connectionStatus === 'connecting' ? (
                <Loader size={28} className="text-white animate-spin relative z-10" />
              ) : (
                <Phone size={28} className="text-white relative z-10 group-hover:scale-110 transition-transform duration-200" />
              )}
            </button>
          ) : (
            <>
              <button
                onClick={clearConversation}
                className="w-14 h-14 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 hover:text-gray-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
                title="Clear conversation"
              >
                <Volume2 size={20} />
              </button>

              <div className="relative">
                <button
                  onClick={disconnect}
                  className="group relative w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl shadow-red-500/25 hover:shadow-2xl hover:shadow-red-500/40 hover:scale-105 active:scale-95"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                  <PhoneOff size={28} className="text-white relative z-10 group-hover:scale-110 transition-transform duration-200" />
                </button>
                
                {/* Recording Indicator */}
                {isRecording && (
                  <div className="absolute -inset-3 rounded-full border-4 border-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
                )}
              </div>

              <button
                className="w-14 h-14 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 hover:text-gray-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-md hover:shadow-lg"
                title="Speaker volume"
              >
                <Volume2 size={20} />
              </button>
            </>
          )}
        </div>

        {/* Recording Status */}
        {isConnected && (
          <div className="text-center">
            <div className={`inline-flex items-center space-x-3 px-5 py-3 rounded-full text-sm font-semibold shadow-sm border ${
              isRecording ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                isRecording ? 'bg-emerald-500 animate-pulse shadow-emerald-300 shadow-md' : 'bg-gray-400'
              }`} />
              <span>{isRecording ? 'Listening...' : 'Ready to listen'}</span>
            </div>
          </div>
        )}

        {/* Live Transcript */}
        {currentTranscript && (
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/50 rounded-2xl p-5 shadow-sm">
            <h4 className="text-base font-semibold text-emerald-800 mb-3 flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span>AI is responding:</span>
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">{currentTranscript}</p>
          </div>
        )}

        {/* Conversation History */}
        {messages.length > 0 && (
          <div className="space-y-5 max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Conversation History</h4>
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-slate-400 to-slate-500' 
                      : 'bg-gradient-to-br from-emerald-500 to-green-600'
                  }`}>
                    {message.type === 'user' ? (
                      <User size={18} className="text-white" />
                    ) : (
                      <Bot size={18} className="text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl p-4 shadow-sm border ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
                      : 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200'
                  }`}>
                    <p className="text-gray-900 text-sm leading-relaxed">{message.content}</p>
                    <div className="text-xs text-gray-500 mt-2 font-medium">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enhanced Sample Questions with Categories */}
        {connectionStatus !== 'connecting' && (
          <div className="text-center">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center space-x-2">
                <span>Sample Questions</span>
                <span className="text-emerald-600">💡</span>
              </h3>
              <p className="text-gray-600 text-lg mb-6">
                {!isConnected 
                  ? "Click the TopGrade AI phone icon to start, then click any question to ask it automatically"
                  : "TopGrade AI is listening - click questions to ask instantly or speak naturally"
                }
              </p>

              {/* Category Selector */}
              <div className="relative inline-block mb-6">
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <span className="text-lg">
                    {QUESTION_CATEGORIES.find(cat => cat.id === selectedCategory)?.icon}
                  </span>
                  <span className="font-medium">
                    {QUESTION_CATEGORIES.find(cat => cat.id === selectedCategory)?.name}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-10 min-w-64">
                    {QUESTION_CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 flex items-center space-x-3 ${
                          selectedCategory === category.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-700'
                        } ${category.id === QUESTION_CATEGORIES[0].id ? 'rounded-t-xl' : ''} ${
                          category.id === QUESTION_CATEGORIES[QUESTION_CATEGORIES.length - 1].id ? 'rounded-b-xl' : ''
                        }`}
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                        {selectedCategory === category.id && (
                          <span className="ml-auto text-emerald-600">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {getQuestionsForCategory().map((question, index) => (
                <div
                  key={index}
                  onClick={() => handleQuestionClick(question)}
                  className="group p-5 bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-emerald-300 rounded-2xl text-left transition-all duration-200 hover:shadow-lg hover:shadow-emerald-100 cursor-pointer hover:scale-105"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 group-hover:from-emerald-200 group-hover:to-green-200 rounded-xl flex items-center justify-center transition-colors duration-200 shadow-sm">
                      {isConnected ? (
                        <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-gray-700 text-sm leading-relaxed font-medium group-hover:text-gray-900 transition-colors duration-200">
                        &ldquo;{question}&rdquo;
                      </span>
                      <div className="mt-2 text-xs text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {isConnected ? 'Click to ask instantly' : 'Connect first, then click to ask'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-600 space-y-3">
              {!isConnected ? (
                <>
                  <p className="text-base">Click the phone icon to start a voice conversation with the AI.</p>
                  <p className="text-base">Or browse {getQuestionsForCategory().length} questions above - click any question to ask it automatically once connected!</p>
                </>
              ) : (
                <>
                  <p className="text-base">Voice conversation is active - click questions above to ask instantly or speak naturally!</p>
                  <p className="text-base">The AI has comprehensive knowledge about Robert&apos;s experience, values, and achievements.</p>
                </>
              )}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200/50 rounded-2xl p-5 mt-6 shadow-sm">
                <p className="text-slate-700 text-sm leading-relaxed">
                  <strong className="font-semibold text-emerald-700">🚀 TopGrade AI Technology:</strong> Advanced Realtime API with intelligent conversation handling. 
                  Our system automatically detects speech patterns, handles natural interruptions, and maintains contextual awareness throughout your interview session.
                  <span className="text-slate-600 block mt-2 text-xs">
                    ✓ Click questions for instant responses  •  ✓ 6 organized categories  •  ✓ Real-time voice interaction
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}