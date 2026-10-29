import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleChat } from '../../features/chat/chatSlice';

const HelpButton = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.chat);

  return (
    <button
      id="help-float-btn"
      className={`help-float-btn ${isOpen ? 'active' : ''}`}
      onClick={() => dispatch(toggleChat())}
      aria-label="Toggle Help Chat"
      title="Need help? Click me!"
    >
      {isOpen ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      ) : (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )}
      <span className="help-btn-label">Help</span>
    </button>
  );
};

export default HelpButton;
