import React from 'react';
import TextToSpeech from '../accessibility/TextToSpeech';

const AiChatWindow = ({ messages = [] }) => {
  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
      {messages.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <p className="font-semibold text-base text-slate-400">OpenAI Engine Ready</p>
          <p className="text-xs mt-1">Ask any question or request document analysis to begin.</p>
        </div>
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'glass-card border border-white/10 text-slate-100 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
            {msg.role === 'assistant' && (
              <div className="mt-1.5">
                <TextToSpeech text={msg.content} />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AiChatWindow;
