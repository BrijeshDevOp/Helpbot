const HomePage = () => {
  return (
    <main className="home-page">
      {/* Grid overlay */}
      <div className="grid-overlay" />

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Internal IT Support Portal
        </div>

        <h1 className="hero-company">Enterprise IT Helpdesk</h1>

        <p className="hero-tagline">
          Fast, direct troubleshooting for Windows and Mac system configuration, plus automated ticketing when you need hands-on support.
        </p>

        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-value">24/7</span>
            <span className="stat-label">Availability</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">Instant</span>
            <span className="stat-label">Troubleshooting</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">Direct</span>
            <span className="stat-label">Ticket Escalation</span>
          </div>
        </div>

        <div className="hero-features">
          <div className="feature-item">
            <span className="feature-icon">🪟</span>
            <span>Windows Support</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🍎</span>
            <span>macOS Support</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🌐</span>
            <span>Network Issues</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎫</span>
            <span>Ticket System</span>
          </div>
        </div>

        <p className="hero-cta-hint">
          👇 Click the <strong>Help</strong> button in the bottom-right corner to get started
        </p>
      </div>
    </main>
  );
};

export default HomePage;
