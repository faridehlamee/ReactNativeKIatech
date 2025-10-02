import { 
  CodeBracketIcon, 
  DevicePhoneMobileIcon, 
  GlobeAltIcon,
  CloudIcon,
  CogIcon,
  ChartBarIcon,
  SparklesIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const services = [
  {
    name: 'Custom Web Applications',
    description: 'Tailored web solutions built with modern technologies. From simple websites to complex web applications that scale with your business.',
    icon: GlobeAltIcon,
    features: ['Custom Development', 'Responsive Design', 'Performance Optimization', 'SEO Integration'],
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50',
    delay: '0'
  },
  {
    name: 'E-commerce Solutions',
    description: 'Complete online store development with payment integration, inventory management, and comprehensive admin dashboards.',
    icon: CodeBracketIcon,
    features: ['Payment Integration', 'Inventory Management', 'Order Processing', 'Admin Dashboard'],
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-50 to-pink-50',
    delay: '100'
  },
  {
    name: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications for iOS and Android with advanced push notification support.',
    icon: DevicePhoneMobileIcon,
    features: ['iOS Development', 'Android Development', 'Cross-Platform', 'Push Notifications'],
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50',
    delay: '200'
  },
  {
    name: 'Branding & Logo Design',
    description: 'Complete brand identity packages including logo design, brand guidelines, and comprehensive marketing materials.',
    icon: ChartBarIcon,
    features: ['Logo Design', 'Brand Guidelines', 'Marketing Materials', 'Social Media Assets'],
    gradient: 'from-orange-500 to-red-500',
    bgGradient: 'from-orange-50 to-red-50',
    delay: '300'
  },
  {
    name: 'Reporting & Analytics',
    description: 'Comprehensive reporting systems and analytics dashboards to track your business performance and make data-driven decisions.',
    icon: CloudIcon,
    features: ['Custom Reports', 'Analytics Dashboards', 'Data Visualization', 'Performance Tracking'],
    gradient: 'from-indigo-500 to-purple-500',
    bgGradient: 'from-indigo-50 to-purple-50',
    delay: '400'
  },
  {
    name: 'SEO & Digital Marketing',
    description: 'Search engine optimization and digital marketing services to boost your online presence and drive growth.',
    icon: CogIcon,
    features: ['SEO Optimization', 'Google Ads', 'Social Media Marketing', 'Content Marketing'],
    gradient: 'from-teal-500 to-blue-500',
    bgGradient: 'from-teal-50 to-blue-50',
    delay: '500'
  },
];

export function Services() {
  return (
    <div id="services" className="py-24 sm:py-32 relative overflow-hidden">
      {/* Enhanced background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30"></div>
      
      {/* Floating background elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        {/* Enhanced header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600 font-semibold text-sm rounded-full animate-pulse-glow shadow-lg">
            <SparklesIcon className="w-4 h-4" />
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
            Our Premium Services
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl animate-fade-in-up">
            Complete{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x">
              Software Solutions
            </span>
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-600 animate-fade-in-up animation-delay-1000 max-w-2xl mx-auto">
            From mobile app development to enterprise web solutions, we provide end-to-end software services that drive your business forward.
          </p>
          
          {/* Stats section */}
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 animate-fade-in-up animation-delay-2000">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">100+</div>
              <div className="text-sm text-gray-600">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">50+</div>
              <div className="text-sm text-gray-600">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600">5+</div>
              <div className="text-sm text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
        
        {/* Enhanced services grid */}
        <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {services.map((service) => (
            <div 
              key={service.name} 
              className="group flex flex-col justify-between rounded-3xl bg-white/80 backdrop-blur-sm p-8 ring-1 ring-gray-200/50 shadow-lg hover:shadow-2xl hover-lift transition-all duration-500 relative overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${parseInt(service.delay)}ms` }}
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Floating particles */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-blue-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float transition-all duration-500"></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-300 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-float animation-delay-1000 transition-all duration-500"></div>
              
              <div className="relative z-10">
                {/* Enhanced icon */}
                <div className="flex items-center gap-x-4 mb-6">
                  <div className={`p-4 bg-gradient-to-br ${service.gradient} rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <service.icon className="h-10 w-10 text-white" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${service.gradient} rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 delay-300`}></div>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold leading-8 tracking-tight text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  {service.name}
                </h3>
                <p className="mt-4 text-base leading-7 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  {service.description}
                </p>
                
                {/* Enhanced features list */}
                <ul className="mt-6 space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li 
                      key={feature} 
                      className="flex items-center gap-x-3 text-sm text-gray-600 group-hover:text-gray-700 transition-all duration-300"
                      style={{ animationDelay: `${featureIndex * 100}ms` }}
                    >
                      <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${service.gradient} group-hover:scale-125 transition-transform duration-300`} />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Enhanced CTA */}
              <div className="mt-8 relative">
                <a
                  href="#contact"
                  className="group/btn inline-flex items-center gap-2 text-sm font-semibold leading-6 text-blue-600 hover:text-purple-600 transition-all duration-300"
                >
                  <span>Get Started</span>
                  <RocketLaunchIcon className="h-4 w-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform duration-300" />
                </a>
                
                {/* Hover effect line */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Enhanced CTA section */}
        <div className="mt-20 text-center animate-fade-in-up animation-delay-2000">
          <div className="glass rounded-3xl p-8 lg:p-12 hover-lift transition-all duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Business?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss your project and create something amazing together. Our team is ready to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <SparklesIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  Start Your Project
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a
                href="#portfolio"
                className="group relative px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-900 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  View Our Work
                  <RocketLaunchIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}