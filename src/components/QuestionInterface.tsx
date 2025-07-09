'use client';

import { useState, useRef } from 'react';
import { Send, RotateCcw, MessageCircle, Sparkles, User, Bot, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type AIModel = 'gpt-4' | 'claude' | 'gemini';

export default function QuestionInterface() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModel>('gpt-4');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const models = [
    { id: 'gpt-4' as AIModel, name: 'GPT-4', description: 'OpenAI GPT-4o-mini' },
    { id: 'claude' as AIModel, name: 'Claude', description: 'Anthropic Claude 3.5 Haiku' },
    { id: 'gemini' as AIModel, name: 'Gemini', description: 'Google Gemini 2.0 Flash' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: question.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);
    setStreamingResponse('');

    // Abort any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          model: selectedModel
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              continue;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantContent += parsed.content;
                setStreamingResponse(assistantContent);
              }
            } catch {
              // Ignore JSON parsing errors - we don't need the caught variable
            }
          }
        }
      }

      // Add the complete assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingResponse('');

    } catch (error: unknown) {
      // Better error handling with proper typing
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Chat error:', error);
        const errorMsg: Message = {
          role: 'assistant',
          content: 'Sorry, I encountered an error while processing your question. Please try again.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMsg]);
      }
    } finally {
      setIsLoading(false);
      setStreamingResponse('');
    }
  };

  const handleClear = () => {
    setMessages([]);
    setQuestion('');
    setStreamingResponse('');
  };

  const quickQuestions = [
    "What experience does Robert have with AI?",
    "Tell me about Robert's work at CIBC",
    "What are Robert's key strengths?",
    "What challenges has Robert faced?",
    "What's Robert's biggest achievement?",
    "Why did Robert leave his previous roles?"
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className="mb-6 space-y-4 max-h-96 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-3 max-w-4xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-gray-400' 
                    : 'bg-green-600'
                }`}>
                  {message.role === 'user' ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-white" />
                  )}
                </div>
                <div className={`rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-gray-100 border border-gray-200'
                    : 'bg-green-50 border border-green-200'
                }`}>
                  <div className="text-gray-900 leading-relaxed prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-900 prose-strong:text-gray-900 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-pre:border prose-ul:text-gray-900 prose-ol:text-gray-900 prose-li:text-gray-900">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {/* Streaming Response */}
          {isLoading && streamingResponse && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-4xl">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <div className="text-gray-900 leading-relaxed prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-900 prose-strong:text-gray-900 prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-pre:border prose-ul:text-gray-900 prose-ol:text-gray-900 prose-li:text-gray-900">
                    <ReactMarkdown>{streamingResponse}</ReactMarkdown>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Sparkles size={12} className="text-green-600 animate-spin" />
                    <span className="text-xs text-gray-500">AI is typing...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Model Selection */}
      <div className="mb-4">
        <div className="relative inline-block">
          <button
            type="button"
            onClick={() => setShowModelDropdown(!showModelDropdown)}
            className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            <Bot size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {models.find(m => m.id === selectedModel)?.name}
            </span>
            <ChevronDown size={16} className={`text-gray-600 transition-transform duration-200 ${showModelDropdown ? 'rotate-180' : ''}`} />
          </button>
          
          {showModelDropdown && (
            <div className="absolute top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model.id);
                    setShowModelDropdown(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-all duration-200 first:rounded-t-lg last:rounded-b-lg ${
                    selectedModel === model.id ? 'bg-green-50 text-green-700' : 'text-gray-700'
                  }`}
                >
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-gray-500">{model.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <div className="flex items-center bg-white border border-gray-300 rounded-lg focus-within:border-green-500 transition-all duration-200">
            <div className="p-3">
              <MessageCircle size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me anything about Robert..."
              className="flex-1 px-0 py-3 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
              disabled={isLoading}
            />
            <div className="flex items-center space-x-2 p-3">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title="Clear conversation"
                >
                  <RotateCcw size={18} />
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Sparkles size={16} className="animate-spin" />
                    <span>Thinking...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Ask</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Quick Questions */}
      {messages.length === 0 && (
        <div className="text-center">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Try asking questions like:
            </h3>
            <p className="text-gray-600 text-sm italic">
              Click on any question below to get started
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {quickQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => setQuestion(q)}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 text-left group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-all duration-200">
                    <MessageCircle size={14} className="text-green-600" />
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900 transition-all duration-200">
                    {q}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}