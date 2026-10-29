import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeChat,
  clearChat,
  addUserMessage,
  sendMessage,
  openTicketForm,
} from '../../features/chat/chatSlice';
import TicketForm from '../tickets/TicketForm';

const TypingIndicator = () => (
  <div className="chat-bubble assistant typing-bubble">
    <span className="typing-dot" />
    <span className="typing-dot" />
    <span className="typing-dot" />
  </div>
);

const ChatModal = () => {
  const dispatch = useDispatch();
  const { messages, isLoading, error, showTicketForm, prefillIssue } = useSelector(
    (state) => state.chat
  );
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    dispatch(addUserMessage(text));

    const conversationMessages = [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: text },
    ];
    dispatch(sendMessage(conversationMessages));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCreateTicket = () => {
    const lastUserMsg = messages.filter((m) => m.role === 'user').slice(-1)[0]?.content || '';
    dispatch(openTicketForm(lastUserMsg));
  };

  return (
    <div className="chat-modal-overlay" onClick={(e) => e.target === e.currentTarget && dispatch(closeChat())}>
      <div className="chat-modal" role="dialog" aria-modal="true" aria-label="IT Help Chat">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="chat-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z" />
                <path d="M12 8v4l3 3" />
              </svg>
            </div>
            <div>
              <p className="chat-header-title">IT Support Assistant</p>
              <p className="chat-header-sub">
                <span className="status-dot" />
                Online • AI Powered
              </p>
            </div>
          </div>
          <div className="chat-header-actions">
            <button id="chat-clear-btn" className="chat-icon-btn" onClick={() => dispatch(clearChat())} title="Clear chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6M14 11v6" />
                <path d="M9 6V4h6v2" />
              </svg>
            </button>
            <button id="chat-close-btn" className="chat-icon-btn" onClick={() => dispatch(closeChat())} title="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-welcome">
              <div className="chat-welcome-icon">🛠️</div>
              <h3>Hello! How can I help?</h3>
              <p>Ask me about Windows or Mac system configuration & basic troubleshooting.</p>
              <div className="chat-suggestions">
                {['Windows display settings', 'Mac sound not working', 'Windows update error', 'Need help with something else'].map((s) => (
                  <button
                    key={s}
                    className="suggestion-chip"
                    onClick={() => {
                      setInput(s);
                      setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-message-row ${msg.role}`}>
              <div className={`chat-bubble ${msg.role} ${msg.type === 'error' ? 'error' : ''}`}>
                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</p>
                {msg.type === 'escalate' && (
                  <button
                    id="create-ticket-btn"
                    className="create-ticket-btn"
                    onClick={handleCreateTicket}
                  >
                    🎫 Create Support Ticket
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <textarea
            ref={inputRef}
            id="chat-input"
            className="chat-input"
            placeholder="Describe your IT issue..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
          />
          <button
            id="chat-send-btn"
            className="chat-send-btn"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        {/* Ticket Form Overlay */}
        {showTicketForm && (
          <div className="ticket-form-overlay">
            <TicketForm prefillIssue={prefillIssue} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatModal;
