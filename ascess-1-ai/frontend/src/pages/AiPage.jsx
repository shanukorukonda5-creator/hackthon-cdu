import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import TextToSpeech from '../components/accessibility/TextToSpeech';
import SpeechToText from '../components/accessibility/SpeechToText';
import { useNotifications } from '../context/NotificationContext';
import aiService from '../services/ai.service';
import {
  FiCpu,
  FiSend,
  FiPlus,
  FiTrash2,
  FiPaperclip,
  FiCopy,
  FiFileText,
  FiX,
  FiZap,
  FiRefreshCw,
  FiMessageSquare,
} from 'react-icons/fi';

const suggestedPrompts = [
  'Audit current document for WCAG AA compliance',
  'Simplify this text for a 5th grade reading level',
  'Generate accessible alt text for complex UI diagrams',
  'Translate document content into Telugu & Spanish',
];

const AiPage = () => {
  const { addToast } = useNotifications();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I am your OpenAI Accessibility Copilot. Ask any question or provide a document for accessibility guidance, WCAG auditing, or text simplification.',
    },
  ]);
  const [prompt, setPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeDocContext, setActiveDocContext] = useState(null);
  const [history, setHistory] = useState([
    'WCAG 2.1 AA Contrast Rules',
    'Alt text generation for images',
    'ARIA landmark review',
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedDoc = sessionStorage.getItem('activeDocumentContext');
    if (savedDoc) {
      try {
        const parsed = JSON.parse(savedDoc);
        setActiveDocContext(parsed);
      } catch (err) {
        // ignore
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = async (textToSend) => {
    const query = textToSend || prompt;
    if (!query.trim() || isThinking) return;

    const userMsg = { role: 'user', content: query };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setPrompt('');
    setIsThinking(true);

    try {
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const docContextStr = activeDocContext
        ? `DOCUMENT TITLE: ${activeDocContext.title}\nCONTENT: ${activeDocContext.extracted_text}`
        : '';

      const response = await aiService.chat(apiMessages, docContextStr);
      const assistantContent = response.data?.content || 'Response received from OpenAI.';

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: assistantContent },
      ]);

      if (!history.includes(query.slice(0, 30))) {
        setHistory((prev) => [query.slice(0, 30) + '...', ...prev]);
      }
    } catch (err) {
      addToast(err.message || 'Failed to connect to AI engine.', 'error');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ An error occurred while contacting the OpenAI engine. Please check your backend connection or try again.',
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleClearContext = () => {
    sessionStorage.removeItem('activeDocumentContext');
    setActiveDocContext(null);
    addToast('Cleared document context from AI session', 'info');
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Chat session cleared. How can I assist you with digital accessibility today?',
      },
    ]);
    addToast('Chat session cleared', 'info');
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    addToast('Message copied to clipboard', 'info');
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6 overflow-hidden">
      {/* Left History Sidebar */}
      <GlassCard className="hidden lg:flex flex-col w-64 p-4 border border-white/10 space-y-4">
        <GlassButton variant="primary" size="sm" onClick={handleClearChat} className="w-full justify-start">
          <FiPlus className="mr-2 text-base" /> New AI Session
        </GlassButton>

        <div className="flex-1 overflow-y-auto space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 py-1">
            Recent Sessions
          </p>
          {history.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item)}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors text-left truncate"
            >
              <FiMessageSquare className="text-indigo-400 flex-shrink-0" />
              <span className="truncate">{item}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleClearChat}
          className="flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors"
        >
          <FiTrash2 /> <span>Clear Current Session</span>
        </button>
      </GlassCard>

      {/* Main AI Chat Interface */}
      <GlassCard className="flex-1 flex flex-col justify-between p-6 overflow-hidden border border-white/10">
        {/* Header */}
        <div className="pb-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg shadow-lg">
              <FiCpu />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">OpenAI Accessibility Copilot</h3>
              <p className="text-[10px] text-indigo-400 font-mono">Live OpenAI Engine Connected</p>
            </div>
          </div>

          {/* Active Document Context Banner Pill */}
          {activeDocContext ? (
            <div className="flex items-center space-x-2 bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 rounded-xl text-xs text-indigo-300">
              <FiFileText className="text-indigo-400" />
              <span className="font-semibold truncate max-w-[150px]">{activeDocContext.title}</span>
              <button onClick={handleClearContext} className="text-slate-400 hover:text-white">
                <FiX />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleSend('Suggest document accessibility checks')}
              className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors text-xs flex items-center space-x-1"
            >
              <FiRefreshCw />
              <span className="hidden sm:inline">Regenerate</span>
            </button>
          )}
        </div>

        {/* Message Canvas */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'glass-panel border border-white/10 text-slate-100 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>

              <div className="flex items-center space-x-2 mt-1.5">
                {msg.role === 'assistant' && <TextToSpeech text={msg.content} />}
                <button
                  onClick={() => handleCopy(msg.content)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
                  title="Copy Message"
                >
                  <FiCopy className="text-xs" />
                </button>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center space-x-3 p-3 rounded-xl glass-panel border border-white/10 w-fit animate-pulse">
              <FiCpu className="text-indigo-400 text-base animate-spin" />
              <span className="text-xs text-slate-300 font-medium">OpenAI is processing your request...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pills */}
        <div className="py-2 flex items-center space-x-2 overflow-x-auto">
          <FiZap className="text-amber-400 text-xs flex-shrink-0" />
          {suggestedPrompts.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              className="px-3 py-1 rounded-full bg-slate-900/60 hover:bg-indigo-600/30 border border-white/10 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-3 border-t border-white/10 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={() => addToast('Manage documents on /upload to attach context', 'info')}
            className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/10 transition-colors"
            title="Attach Document Context"
          >
            <FiPaperclip className="text-base" />
          </button>

          <SpeechToText onTranscriptChange={(text) => setPrompt(text)} />

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask OpenAI or request accessibility assistance..."
            className="glass-input flex-1 rounded-2xl py-3 px-4 text-sm bg-slate-900/80 border border-white/15"
          />

          <GlassButton type="submit" variant="primary" disabled={!prompt.trim() || isThinking} className="rounded-2xl px-5">
            <FiSend className="text-base" />
          </GlassButton>
        </form>
      </GlassCard>
    </div>
  );
};

export default AiPage;
