import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, clearMessages } from '../features/tickets/ticketSlice';
import TicketCard from '../components/tickets/TicketCard';

const FILTERS = ['All', 'Open', 'In Progress', 'Resolved', 'Closed'];

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { tickets, isLoading, error, successMessage } = useSelector((state) => state.tickets);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  useEffect(() => {
    if (successMessage || error) {
      const t = setTimeout(() => dispatch(clearMessages()), 3000);
      return () => clearTimeout(t);
    }
  }, [successMessage, error, dispatch]);

  const filtered = tickets.filter((ticket) => {
    const matchFilter = filter === 'All' || ticket.status === filter;
    const matchSearch =
      ticket.title.toLowerCase().includes(search.toLowerCase()) ||
      ticket.description.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'Open').length,
    inProgress: tickets.filter((t) => t.status === 'In Progress').length,
    resolved: tickets.filter((t) => t.status === 'Resolved').length,
  };

  return (
    <main className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Ticket Dashboard</h1>
          <p className="dashboard-subtitle">Manage and track all IT support requests</p>
        </div>
        <button
          id="refresh-tickets-btn"
          className="refresh-btn"
          onClick={() => dispatch(fetchTickets())}
          disabled={isLoading}
        >
          {isLoading ? '⏳' : '🔄'} Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="dash-stat-card">
          <span className="dash-stat-value">{stats.total}</span>
          <span className="dash-stat-label">Total Tickets</span>
        </div>
        <div className="dash-stat-card open">
          <span className="dash-stat-value">{stats.open}</span>
          <span className="dash-stat-label">Open</span>
        </div>
        <div className="dash-stat-card progress">
          <span className="dash-stat-value">{stats.inProgress}</span>
          <span className="dash-stat-label">In Progress</span>
        </div>
        <div className="dash-stat-card resolved">
          <span className="dash-stat-value">{stats.resolved}</span>
          <span className="dash-stat-label">Resolved</span>
        </div>
      </div>

      {/* Toast */}
      {successMessage && <div className="toast toast-success">✅ {successMessage}</div>}
      {error && <div className="toast toast-error">❌ {error}</div>}

      {/* Filters & Search */}
      <div className="dashboard-toolbar">
        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f}
              id={`filter-${f.replace(' ', '-').toLowerCase()}`}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          id="ticket-search"
          type="text"
          className="search-input"
          placeholder="🔍 Search tickets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tickets */}
      {isLoading && tickets.length === 0 ? (
        <div className="loading-spinner">
          <div className="spinner" />
          <p>Loading tickets...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No tickets found</h3>
          <p>
            {search || filter !== 'All'
              ? 'Try adjusting your filters.'
              : 'No support tickets have been submitted yet. Click "Help" to create one!'}
          </p>
        </div>
      ) : (
        <div className="tickets-grid">
          {filtered.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      )}
    </main>
  );
};

export default DashboardPage;
