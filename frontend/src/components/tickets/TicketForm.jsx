import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTicket } from '../../features/tickets/ticketSlice';
import { closeTicketForm, closeChat } from '../../features/chat/chatSlice';

const TicketForm = ({ prefillIssue }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.tickets);

  const [form, setForm] = useState({
    title: prefillIssue ? prefillIssue.slice(0, 80) : '',
    description: prefillIssue || '',
    priority: 'Medium',
    category: 'Other',
    submittedBy: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createTicket({ ...form, chatContext: prefillIssue }));
    if (result.meta.requestStatus === 'fulfilled') {
      setSubmitted(true);
      setTimeout(() => {
        dispatch(closeTicketForm());
        dispatch(closeChat());
      }, 2500);
    }
  };

  if (submitted) {
    return (
      <div className="ticket-success">
        <div className="ticket-success-icon">✅</div>
        <h3>Ticket Created!</h3>
        <p>Our IT team will get back to you shortly.</p>
      </div>
    );
  }

  return (
    <div className="ticket-form-container">
      <div className="ticket-form-header">
        <h3>🎫 Create Support Ticket</h3>
        <button
          id="close-ticket-form-btn"
          className="chat-icon-btn"
          onClick={() => dispatch(closeTicketForm())}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="ticket-form">
        <div className="form-group">
          <label htmlFor="ticket-title">Title</label>
          <input
            id="ticket-title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="Brief summary of the issue"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="ticket-description">Description</label>
          <textarea
            id="ticket-description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Detailed description of the problem..."
            rows={4}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ticket-priority">Priority</label>
            <select id="ticket-priority" name="priority" value={form.priority} onChange={handleChange}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="ticket-category">Category</label>
            <select id="ticket-category" name="category" value={form.category} onChange={handleChange}>
              <option>Hardware</option>
              <option>Software</option>
              <option>Network</option>
              <option>Account</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="ticket-submittedBy">Your Name</label>
          <input
            id="ticket-submittedBy"
            name="submittedBy"
            type="text"
            value={form.submittedBy}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>

        <button
          id="submit-ticket-btn"
          type="submit"
          className="submit-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : '🚀 Submit Ticket'}
        </button>
      </form>
    </div>
  );
};

export default TicketForm;
