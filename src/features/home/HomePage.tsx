import { NavLink } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const features = [
    {
      title: 'Project Management',
      description: 'Organize and track all your projects with our intuitive Kanban board.',
      icon: '📋',
      link: '/projects',
      linkText: 'View Projects'
    },
    {
      title: 'Drag & Drop',
      description: 'Easily move tasks between columns with our smooth drag-and-drop interface.',
      icon: '🎯',
      link: '/projects',
      linkText: 'Try It Out'
    },
    {
      title: 'Real-time Updates',
      description: 'See changes instantly as you and your team collaborate on projects.',
      icon: '⚡',
      link: '/projects',
      linkText: 'Get Started'
    }
  ];

  const stats = [
    { label: 'Active Projects', value: '12' },
    { label: 'Tasks Completed', value: '48' },
    { label: 'Team Members', value: '8' }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to KeepTrack</h1>
          <p className="hero-subtitle">
            Your simple and powerful project management companion
          </p>
          <div className="hero-actions">
            <NavLink to="/projects" className="button primary hero-cta">
              View Projects
            </NavLink>
            <NavLink to="/" className="button hero-cta-secondary">
              Learn More
            </NavLink>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="page-header">
          <h2>Everything you need</h2>
          <p className="text-muted">Powerful features to help you stay organized and productive</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <NavLink key={index} to={feature.link} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <span className="feature-link">{feature.linkText} →</span>
            </NavLink>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;