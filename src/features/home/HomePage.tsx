import { NavLink } from 'react-router-dom';

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
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Hero Section */}
      <section className="text-center py-16 px-8 mb-12 bg-gradient-to-br from-primary-light to-bg-secondary rounded-lg border border-border">
        <div>
          <h1 className="text-5xl font-extrabold text-text-primary mb-4 tracking-tight bg-gradient-to-br from-primary to-purple-500 bg-clip-text text-transparent sm:text-4xl">
            Welcome to KeepTrack
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-lg mx-auto">
            Your simple and powerful project management companion
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <NavLink to="/projects" className="px-8 py-3.5 text-base font-semibold rounded-lg no-underline transition-all duration-base bg-primary text-white border border-primary shadow-md hover:bg-primary-hover hover:border-primary-hover hover:shadow-lg hover:-translate-y-0.5 sm:w-full">
              View Projects
            </NavLink>
            <NavLink to="/" className="px-8 py-3.5 text-base font-semibold rounded-lg no-underline transition-all duration-base bg-bg-primary text-text-primary border border-border hover:bg-bg-tertiary hover:border-border-hover sm:w-full">
              Learn More
            </NavLink>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-bg-primary border border-border rounded-lg p-6 text-center transition-all duration-base shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-border-hover">
              <div className="text-5xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-text-secondary font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary">Everything you need</h2>
          <p className="text-text-secondary">Powerful features to help you stay organized and productive</p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 sm:grid-cols-1">
          {features.map((feature, index) => (
            <NavLink
              key={index}
              to={feature.link}
              className="bg-bg-primary border border-border rounded-lg p-8 no-underline transition-all duration-base shadow-sm flex flex-col relative overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:border-border-hover before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-gradient-to-r before:from-primary before:to-purple-500 before:origin-left before:transition-transform before:duration-base before:scale-x-0 hover:before:scale-x-100"
            >
              <div className="text-5xl mb-4 leading-none">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-text-primary mb-3">{feature.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-6 flex-1">{feature.description}</p>
              <span className="text-sm font-semibold text-primary inline-flex items-center transition-all duration-base hover:gap-2">{feature.linkText} →</span>
            </NavLink>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;