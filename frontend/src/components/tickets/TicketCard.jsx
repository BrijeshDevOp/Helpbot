import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTicket, deleteTicket } from '../../features/tickets/ticketSlice';

const STATUS_COLORS = {
  'Open': 'status-open',
  'In Progress': 'status-progress',
  'Resolved': 'status-resolved',
  'Closed': 'status-closed',
};

const PRIORITY_COLORS = {
  'Low': 'priority-low',
  'Medium': 'priority-medium',
  'High': 'priority-high',
  'Critical': 'priority-critical',
};

const TicketCard = ({ ticket }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.tickets);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    category: ticket.category,
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    dispatch(updateTicket({ id: ticket._id, updates: form }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this ticket?')) dispatch(deleteTicket(ticket._id));
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className={`ticket-card ${isEditing ? 'editing' : ''}`}>
      <div className="ticket-card-header">
        <div className="ticket-meta">
          <span className={`badge ${STATUS_COLORS[ticket.status]}`}>{ticket.status}</span>
          <span className={`badge ${PRIORITY_COLORS[ticket.priority]}`}>{ticket.priority}</span>
          <span className="badge badge-category">{ticket.category}</span>
        </div>
        <div className="ticket-actions">
          <button
            id={`edit-ticket-${ticket._id}`}
            className="action-btn edit-btn"
            onClick={() => setIsEditing(!isEditing)}
            title="Edit ticket"
          >
            {isEditing ? '✕ Cancel' : '✏️ Edit'}
          </button>
          <button
            id={`delete-ticket-${ticket._id}`}
            className="action-btn delete-btn"
            onClick={handleDelete}
            disabled={isLoading}
            title="Delete ticket"
          >
            🗑️
          </button>
        </div>
      </div>

      <h3 className="ticket-title">{ticket.title}</h3>

      {isEditing ? (
        <div className="ticket-edit-form">
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
          </div>
          <button className="submit-btn save-btn" onClick={handleSave} disabled={isLoading}>
            💾 Save Changes
          </button>
        </div>
      ) : (
        <p className="ticket-description">{ticket.description}</p>
      )}

      <div className="ticket-footer">
        <span>👤 {ticket.submittedBy || 'Anonymous'}</span>
        <span>📅 {formatDate(ticket.createdAt)}</span>
      </div>
    </div>
  );
};

export default TicketCard;
