import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  ChevronDown,
  Minimize2,
  Maximize2,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useDealer } from '../context/DealerContext';
import { api } from '../lib/api';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const DealershipChatbot: React.FC = () => {
  const { settings } = useDealer();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const initialGreeting: ChatMessage = {
    id: 'welcome',
    role: 'model',
    text: `Hello and welcome to **${settings?.businessName || 'Paul Smith Autos'}**! 🚗\n\nI am your AI Vehicle Advisor & Concierge. How can I assist your car search today?\n\n• In-stock showroom cars and pricing\n• Itemized Quick Quotes & CIF import breakdowns\n• Direct vehicle sourcing from China, the US, or Germany\n• Scheduling an in-person physical inspection with CEO Paul Smith`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [messages, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Build conversation history excluding welcome message
      const historyToSend = newMessages
        .filter((m) => m.id !== 'welcome')
        .slice(0, -1)
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const replyText = await api.sendChatMessage(userMsg.text, historyToSend);

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);

      if (!isOpen || isMinimized) {
        setHasUnread(true);
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `Thank you for contacting Paul Smith Autos. For immediate vehicle specifications, quick quotes, or direct inspection scheduling, please reach CEO Paul Smith directly on WhatsApp at **${settings?.whatsappNumber || '08037781788'}**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = () => {
    if (confirm('Start a fresh conversation with the vehicle concierge?')) {
      setMessages([initialGreeting]);
    }
  };

  const suggestionPrompts = [
    'Cars in stock under ₦50M?',
    'How does direct import from China work?',
    'What customs documents are verified?',
    'How do I book an inspection with Paul Smith?',
  ];

  // Helper to format basic markdown-style text (bold and bullets)
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold replacer
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedLine = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-1 my-0.5">
            <span className="text-blue-400 font-bold shrink-0">•</span>
            <span>{renderedLine}</span>
          </div>
        );
      }

      return (
        <p key={idx} className={line.trim() === '' ? 'h-2' : 'my-0.5 leading-relaxed'}>
          {renderedLine}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Trigger Button (Positioned at bottom-6 left-6, leaving WhatsApp at bottom-6 right-6) */}
      {!isOpen && (
        <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2 group">
          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
              setHasUnread(false);
            }}
            className="flex items-center gap-2.5 px-4 py-3 bg-[#0e1422] hover:bg-[#141d30] text-white border border-slate-700/80 rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label="Open AI Dealership Concierge"
          >
            <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white shadow-sm">
              <Bot className="w-4 h-4" />
              {hasUnread && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-400 rounded-full ring-2 ring-[#0e1422] animate-pulse" />
              )}
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold text-white block leading-tight">AI Vehicle Advisor</span>
              <span className="text-[10px] text-blue-400 block leading-tight font-medium">Ask specs & quotes</span>
            </div>
          </button>
        </div>
      )}

      {/* Floating Chat Drawer Container */}
      {isOpen && (
        <aside
          aria-label="AI Dealership Concierge Chat"
          className={`fixed z-50 transition-all duration-200 shadow-2xl flex flex-col ${
            isMinimized
              ? 'bottom-6 left-6 w-72 h-14 bg-[#0e1422] border border-slate-700 rounded-2xl overflow-hidden'
              : 'bottom-4 sm:bottom-6 left-4 sm:left-6 w-[calc(100vw-2rem)] sm:w-[400px] h-[550px] max-h-[85vh] bg-[#0e1422] border border-slate-800 rounded-2xl overflow-hidden'
          }`}
        >
          {/* Header */}
          <div className="bg-[#090d16] px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white tracking-tight">Dealership AI Concierge</h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[10px] text-slate-400">
                  {settings?.businessName || 'Paul Smith Autos'} · Gemini 3.5 Flash
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Clear Chat History"
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close Concierge"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                {messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-6 h-6 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm text-xs ${
                          isUser
                            ? 'bg-blue-600 text-white rounded-tr-xs'
                            : 'bg-[#121929] text-slate-200 border border-slate-800 rounded-tl-xs'
                        }`}
                      >
                        <div className="break-words">
                          {isUser ? msg.text : renderFormattedText(msg.text)}
                        </div>
                        <div
                          className={`text-[9px] mt-1 font-mono text-right ${
                            isUser ? 'text-blue-200' : 'text-slate-500'
                          }`}
                        >
                          {msg.timestamp}
                        </div>
                      </div>

                      {isUser && (
                        <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                          <User className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="w-6 h-6 rounded-md bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-[#121929] border border-slate-800 rounded-2xl rounded-tl-xs px-3.5 py-2.5 text-xs text-slate-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] text-slate-400 ml-1">Analyzing inventory & specs...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggestion Chips */}
              {messages.length <= 3 && (
                <div className="px-3 py-1.5 bg-[#090d16]/80 border-t border-slate-800/80 overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none">
                  {suggestionPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSend(prompt)}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-full text-[11px] whitespace-nowrap transition-colors cursor-pointer shrink-0"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 bg-[#090d16] border-t border-slate-800 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about car specs, pricing, or importing..."
                    disabled={loading}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="w-9 h-9 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-md shadow-blue-600/20"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 px-1">
                  <span>Transparent vehicle guidance</span>
                  <span>Direct inquiries: {settings?.whatsappNumber || '08037781788'}</span>
                </div>
              </div>
            </>
          )}
        </aside>
      )}
    </>
  );
};
