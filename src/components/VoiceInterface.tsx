'use client';

import { useState, useRef, useEffect } from 'react';
import { Phone, PhoneOff, Loader, User, Bot, Volume2 } from 'lucide-react';
import { RealtimeAgent, RealtimeSession } from '@openai/agents/realtime';

interface VoiceMessage {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function VoiceInterface() {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState('');
  
  const agentRef = useRef<RealtimeAgent | null>(null);
  const sessionRef = useRef<RealtimeSession | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const getCandidateContext = async () => {
    try {
      setLoadingStep('🔐 Securing connection...');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setLoadingStep('📋 Loading Robert\'s experience...');
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setLoadingStep('🎓 Gathering education details...');
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setLoadingStep('🏆 Collecting achievements...');
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setLoadingStep('💡 Analyzing key stories...');
      await new Promise(resolve => setTimeout(resolve, 400));
      
      setLoadingStep('🧠 Preparing AI context...');
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: 'Please provide a comprehensive overview of Robert Mill for voice interview context.',
          messages: []
        }),
      });
      
      if (response.ok) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let context = '';
        
        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    context += parsed.content;
                  }
                } catch (e) {
                  // Ignore parsing errors
                }
              }
            }
          }
        }
        
        return `You are an AI assistant helping interviewers learn about Robert Mill through natural voice conversation. 
        Be conversational, friendly, and informative. 
        
        IMPORTANT: When the conversation starts, immediately introduce yourself by saying: "Hello! I'm Robert's interview assistant and I'm happy to answer any questions about his background, experience, and qualifications. What would you like to know?"
        
        Here's the context about Robert: ${context}`;
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

      // Get candidate context for instructions
      setLoadingProgress(25);
      const instructions = await getCandidateContext();

      // Create RealtimeAgent
      setLoadingProgress(75);
      setLoadingStep('🤖 Setting up AI assistant...');
      agentRef.current = new RealtimeAgent({
        name: 'Interview Assistant',
        instructions: instructions,
        voice: 'alloy',
      });

      // Create RealtimeSession with the agent
      setLoadingProgress(85);
      setLoadingStep('🎤 Establishing voice connection...');
      sessionRef.current = new RealtimeSession(agentRef.current);

      // Remove any existing listeners first to prevent duplicates
      sessionRef.current.removeAllListeners?.();

      // Set up event listeners on the session
      sessionRef.current.on('conversation.item.input_audio_transcription.completed', (event) => {
        console.log('User said:', event.transcript);
        const userMessage: VoiceMessage = {
          type: 'user',
          content: event.transcript,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
      });

      sessionRef.current.on('response.audio_transcript.delta', (event) => {
        setCurrentTranscript(prev => prev + event.delta);
      });

      sessionRef.current.on('response.audio_transcript.done', (event) => {
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

      sessionRef.current.on('input_audio_buffer.speech_started', () => {
        console.log('Speech started');
        setIsRecording(true);
      });

      sessionRef.current.on('input_audio_buffer.speech_stopped', () => {
        console.log('Speech stopped');
        setIsRecording(false);
      });

      // Connect the session
      setLoadingProgress(90);
      await sessionRef.current.connect({ 
        apiKey: client_secret,
      });

      setLoadingProgress(100);
      setConnectionStatus('connected');
      setIsConnected(true);

      // AI speaks first - greeting message
      setTimeout(() => {
        // Add the greeting message to the conversation
        const greetingMessage: VoiceMessage = {
          type: 'assistant',
          content: "Hello! I'm Robert's interview assistant and I'm happy to answer any questions about his background, experience, and qualifications. What would you like to know?",
          timestamp: new Date()
        };
        setMessages([greetingMessage]);

        // Trigger the AI to speak the greeting by sending a system message
        if (sessionRef.current) {
          try {
            // Send a message to trigger the AI's greeting
            sessionRef.current.send({
              type: 'conversation.item.create',
              item: {
                type: 'message',
                role: 'assistant',
                content: [{
                  type: 'input_text',
                  text: "Hello! I'm Robert's interview assistant and I'm happy to answer any questions about his background, experience, and qualifications. What would you like to know?"
                }]
              }
            });
            
            // Request a response to make the AI speak
            sessionRef.current.send({
              type: 'response.create'
            });
          } catch (error) {
            console.error('Error sending greeting:', error);
          }
        }
      }, 1000);

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
        } else if (typeof sessionRef.current.end === 'function') {
          await sessionRef.current.end();
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
    setAudioLevel(0);
    setCurrentTranscript('');
    setLoadingProgress(0);
  };

  const clearConversation = () => {
    setMessages([]);
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200">
      <div className="space-y-6">
        {/* Connection Status */}
        <div className="text-center">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
            connectionStatus === 'connected' ? 'bg-green-100 text-green-700' :
            connectionStatus === 'connecting' ? 'bg-yellow-100 text-yellow-700' :
            connectionStatus === 'error' ? 'bg-red-100 text-red-700' :
            'bg-gray-100 text-gray-600'
          }`}>
            {connectionStatus === 'connecting' && <Loader size={12} className="animate-spin" />}
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'connecting' ? 'bg-yellow-500' :
              connectionStatus === 'error' ? 'bg-red-500' :
              'bg-gray-400'
            }`} />
            <span className="capitalize">{connectionStatus}</span>
          </div>
        </div>

        {/* Connection Loading Progress */}
        {connectionStatus === 'connecting' && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Loader size={16} className="text-blue-600 animate-spin" />
                <span className="text-blue-700 font-medium">Connecting to AI Assistant...</span>
                <span className="text-blue-600 text-sm">({loadingProgress}%)</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${Math.max(loadingProgress, 5)}%` }}
                ></div>
              </div>
              <p className="text-blue-600 text-xs mt-2">
                {loadingProgress < 30 ? 'Getting secure token...' :
                 loadingProgress < 60 ? 'Loading candidate context...' :
                 loadingProgress < 90 ? 'Setting up AI agent...' :
                 'Establishing voice connection...'}
              </p>
              {process.env.NODE_ENV === 'development' && (
                <p className="text-xs text-gray-500 mt-1">
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
        <div className="flex justify-center items-center space-x-4">
          {!isConnected ? (
            <button
              onClick={connectToRealtime}
              disabled={connectionStatus === 'connecting'}
              className="w-16 h-16 bg-green-600 hover:bg-green-700 disabled:opacity-50 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
            >
              {connectionStatus === 'connecting' ? (
                <Loader size={24} className="text-white animate-spin" />
              ) : (
                <Phone size={24} className="text-white" />
              )}
            </button>
          ) : (
            <>
              <button
                onClick={clearConversation}
                className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-all duration-200"
                title="Clear conversation"
              >
                <Volume2 size={20} />
              </button>

              <div className="relative">
                <button
                  onClick={disconnect}
                  className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
                >
                  <PhoneOff size={24} className="text-white" />
                </button>
                
                {/* Recording Indicator */}
                {isRecording && (
                  <div className="absolute -inset-2 rounded-full border-4 border-green-400 animate-pulse" />
                )}
              </div>

              <button
                className="w-12 h-12 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center transition-all duration-200"
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
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
              isRecording ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
              }`} />
              <span>{isRecording ? 'Listening...' : 'Ready to listen'}</span>
            </div>
          </div>
        )}

        {/* Live Transcript */}
        {currentTranscript && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">AI is responding:</h4>
            <p className="text-gray-700 text-sm">{currentTranscript}</p>
          </div>
        )}

        {/* Conversation History */}
        {messages.length > 0 && (
          <div className="space-y-4 max-h-64 overflow-y-auto">
            <h4 className="text-sm font-medium text-gray-900">Conversation History:</h4>
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-3xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' ? 'bg-gray-400' : 'bg-green-600'
                  }`}>
                    {message.type === 'user' ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <Bot size={16} className="text-white" />
                    )}
                  </div>
                  <div className={`rounded-2xl p-3 ${
                    message.type === 'user'
                      ? 'bg-gray-100 border border-gray-200'
                      : 'bg-green-50 border border-green-200'
                  }`}>
                    <p className="text-gray-900 text-sm">{message.content}</p>
                    <div className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sample Voice Prompts */}
        {connectionStatus !== 'connecting' && (
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Try asking questions like:
              </h3>
              <p className="text-gray-600 mb-4">
                {!isConnected 
                  ? "Click the phone icon to start, then speak naturally"
                  : "Speak naturally - the AI is listening and ready to respond"
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {[
                "Tell me about Robert's experience with AI and machine learning",
                "What was Robert's biggest achievement at CIBC?",
                "Describe Robert's leadership style and experience",
                "What challenges has Robert faced in his career?",
                "How does Robert approach strategy consulting?",
                "What makes Robert a good fit for an AI consultant role?"
              ].map((prompt, index) => (
                <div
                  key={index}
                  className="p-4 bg-white border border-gray-200 rounded-lg text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-gray-700 text-sm">
                      "{prompt}"
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-500 space-y-2">
              {!isConnected ? (
                <>
                  <p>Click the phone icon to start a voice conversation with the AI.</p>
                  <p>The AI will listen and respond naturally about Robert&apos;s background.</p>
                </>
              ) : (
                <>
                  <p>Voice conversation is active - just speak naturally!</p>
                  <p>The AI will detect when you start speaking and respond about Robert&apos;s background.</p>
                </>
              )}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-blue-700 text-xs">
                  <strong>Note:</strong> This uses OpenAI&apos;s Realtime API with continuous session handling for natural voice conversations. 
                  The AI will automatically detect when you start and stop speaking, handle interruptions, and maintain conversation context.
                  Make sure your microphone is enabled and you&apos;re in a quiet environment for best results.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}