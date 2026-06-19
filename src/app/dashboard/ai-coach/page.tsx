'use client';

import { useChat } from '@ai-sdk/react';
import { Send, Bot, User, Loader2, Paperclip, X, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

export default function AICoachPage() {
  const chatCtx = useChat();
  const { messages, status } = chatCtx;
  const sendMessage = (chatCtx as any).sendMessage;
  const [input, setInput] = useState('');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };
  const [files, setFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isLoading = status === 'streaming' || status === 'submitted';
  const autoSentRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !autoSentRef.current) {
      const prompt = new URLSearchParams(window.location.search).get('prompt');
      if (prompt && messages.length === 0) {
        autoSentRef.current = true;
        if (sendMessage) {
          sendMessage({ role: 'user', content: prompt });
        }
      }
    }
  }, [messages.length, sendMessage]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && (!files || files.length === 0)) return;
    
    // Use sendMessage instead of append
    if (sendMessage) {
      sendMessage({ role: 'user', content: input }, { experimental_attachments: files });
    }
    
    setInput('');
    setFiles(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-bold font-display text-text-primary">AI Coach</h1>
        <p className="text-text-muted text-sm mt-1">Your personal Gemini-powered sustainability advisor.</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin scrollbar-thumb-surface-border scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="glass-card p-12 text-center space-y-4" style={{ background: 'linear-gradient(135deg, rgba(20,180,124,0.06) 0%, rgba(14,165,233,0.03) 100%)' }}>
            <div className="text-5xl">🤖</div>
            <h2 className="font-semibold text-text-primary">Hello! I'm your AI Coach</h2>
            <p className="text-text-muted text-sm max-w-md mx-auto">
              Ask me about reducing your carbon footprint, sustainable swaps, or any climate-related questions!
            </p>
          </div>
        )}

        {messages.map((m: any) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-4 p-4 rounded-xl",
              m.role === 'user' ? "bg-surface-tertiary ml-12" : "bg-brand-950/20 mr-12 border border-brand-900/30"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              m.role === 'user' ? "bg-surface-secondary" : "bg-brand-500 text-white"
            )}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className="flex-1 whitespace-pre-wrap text-sm text-text-primary leading-relaxed">
              {m.content || (m.parts && m.parts.map((p: any) => p.text).join('')) || m.text}
            </div>
          </motion.div>
        ))}

        {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
          <div className="flex gap-4 p-4 rounded-xl bg-brand-950/20 mr-12 border border-brand-900/30">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-brand-500 text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex items-center">
              <Loader2 className="w-4 h-4 animate-spin text-brand-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={onSubmit} className="relative mt-auto flex-shrink-0">
        {files && files.length > 0 && (
          <div className="absolute bottom-full left-0 mb-2 p-2 bg-surface-tertiary rounded-xl border border-surface-border flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-400" />
            <span className="text-xs text-text-primary max-w-[200px] truncate">{files[0].name}</span>
            <button
              type="button"
              onClick={() => {
                setFiles(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="text-text-muted hover:text-red-400 p-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => setFiles(e.target.files)}
          accept=".pdf,.csv,.xlsx,.xls"
        />
        <div className="relative flex items-center w-full">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute left-3 p-2 text-text-muted hover:text-brand-400 transition-colors"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <input
            value={input || ''}
            onChange={handleInputChange}
            placeholder="Ask about sustainable living or attach a report..."
            className="w-full rounded-2xl border border-surface-border bg-surface-secondary text-text-primary
                       pl-12 py-4 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || (!input?.trim() && (!files || files.length === 0))}
            className="absolute right-3 p-2 rounded-xl bg-brand-600 text-white hover:bg-brand-500
                       disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
