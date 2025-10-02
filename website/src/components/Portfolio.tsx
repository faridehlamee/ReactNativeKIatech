import { CodeBracketIcon, DevicePhoneMobileIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const projects = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard.',
    image: '/api/placeholder/400/300',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    category: 'Web Development',
    icon: GlobeAltIcon,
  },
  {
    id: 2,
    title: 'Mobile Banking App',
    description: 'Secure mobile banking application with biometric authentication and real-time transactions.',
    image: '/api/placeholder/400/300',
    technologies: ['React Native', 'Node.js', 'PostgreSQL', 'Firebase'],
    category: 'Mobile Development',
    icon: DevicePhoneMobileIcon,
  },
  {
    id: 3,
    title: 'SaaS Dashboard',
    description: 'Comprehensive analytics dashboard with real-time data visualization and reporting features.',
    image: '/api/placeholder/400/300',
    technologies: ['React', 'TypeScript', 'D3.js', 'AWS'],
    category: 'Web Development',
    icon: CodeBracketIcon,
  },
  {
    id: 4,
    title: 'Food Delivery App',
    description: 'Cross-platform food delivery app with GPS tracking, real-time updates, and payment integration.',
    image: '/api/placeholder/400/300',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Google Maps'],
    category: 'Mobile Development',
    icon: DevicePhoneMobileIcon,
  },
  {
    id: 5,
    title: 'CRM System',
    description: 'Customer relationship management system with lead tracking, automation, and reporting.',
    image: '/api/placeholder/400/300',
    technologies: ['Vue.js', 'Laravel', 'MySQL', 'Redis'],
    category: 'Web Development',
    icon: CodeBracketIcon,
  },
  {
    id: 6,
    title: 'Fitness Tracking App',
    description: 'Personal fitness tracking app with workout plans, progress monitoring, and social features.',
    image: '/api/placeholder/400/300',
    technologies: ['Flutter', 'Firebase', 'Google Fit API', 'Cloud Functions'],
    category: 'Mobile Development',
    icon: DevicePhoneMobileIcon,
  },
];

export function Portfolio() {
  return (
    <div id="portfolio" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        <div className="mx-auto max-w-2xl lg:text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 font-semibold text-sm rounded-full animate-pulse-glow">
            <span className="w-2 h-2 bg-purple-600 rounded-full animate-ping"></span>
            Our Portfolio
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl animate-fade-in-up">
            Our Recent{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Projects
            </span>
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 animate-fade-in-up animation-delay-1000">
            Explore our portfolio of successful projects across various industries and technologies.
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="group flex flex-col justify-between bg-white rounded-2xl shadow-sm hover-lift hover-glow transition-all duration-300 relative overflow-hidden">
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="p-6 relative z-10">
                <div className="flex items-center gap-x-4 text-xs mb-4">
                  <project.icon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  <span className="text-blue-600 font-semibold">{project.category}</span>
                </div>
                
                <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900 mb-3">
                  {project.title}
                </h3>
                
                <p className="text-base leading-7 text-gray-600 mb-4">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="px-6 pb-6">
                <button className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500 transition-colors">
                  View Project <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors">
            View All Projects
          </button>
        </div>
      </div>
    </div>
  );
}
