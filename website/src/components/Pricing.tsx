import { CheckIcon, StarIcon, SparklesIcon, RocketLaunchIcon, TrophyIcon } from '@heroicons/react/24/outline';

const pricingPlans = [
  {
    name: 'Starter',
    price: 999,
    originalPrice: 1299,
    description: 'Perfect for small businesses and startups',
    features: [
      'Responsive Website Design',
      'Up to 5 Pages',
      'Basic SEO Setup',
      'Contact Form',
      'Mobile Optimization',
      '3 Months Support',
      'Google Analytics Setup',
      'Social Media Integration',
    ],
    popular: false,
    buttonText: 'Get Started',
    buttonStyle: 'bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:from-gray-700 hover:to-gray-900',
    gradient: 'from-gray-500 to-gray-700',
    bgGradient: 'from-gray-50 to-gray-100',
    icon: StarIcon,
    delay: '0'
  },
  {
    name: 'Professional',
    price: 2499,
    originalPrice: 2999,
    description: 'Ideal for growing businesses',
    features: [
      'Custom Website Design',
      'Up to 10 Pages',
      'Advanced SEO Optimization',
      'Content Management System',
      'E-commerce Integration',
      '6 Months Support',
      'Performance Optimization',
      'SSL Certificate',
      'Backup & Security',
      'Social Media Marketing Setup',
    ],
    popular: true,
    buttonText: 'Most Popular',
    buttonStyle: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700',
    gradient: 'from-blue-500 to-purple-600',
    bgGradient: 'from-blue-50 to-purple-50',
    icon: TrophyIcon,
    delay: '100'
  },
  {
    name: 'Enterprise',
    price: 4999,
    originalPrice: 5999,
    description: 'Complete solution for large organizations',
    features: [
      'Custom Web Application',
      'Unlimited Pages',
      'Advanced SEO & Analytics',
      'Custom CMS Development',
      'Full E-commerce Platform',
      '12 Months Support',
      'Performance Monitoring',
      'Security Audit',
      'Automated Backups',
      'Social Media Management',
      'Google Ads Setup',
      'Monthly Reports',
    ],
    popular: false,
    buttonText: 'Contact Sales',
    buttonStyle: 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700',
    gradient: 'from-green-500 to-emerald-600',
    bgGradient: 'from-green-50 to-emerald-50',
    icon: RocketLaunchIcon,
    delay: '200'
  },
];

const additionalServices = [
  {
    name: 'Mobile App Development',
    price: 'Starting at $3,999',
    description: 'iOS and Android applications',
    icon: '📱',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Branding & Logo Design',
    price: 'Starting at $499',
    description: 'Complete brand identity package',
    icon: '🎨',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    name: 'SEO Services',
    price: 'Starting at $299/month',
    description: 'Ongoing search engine optimization',
    icon: '🔍',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Social Media Marketing',
    price: 'Starting at $599/month',
    description: 'Complete social media management',
    icon: '📢',
    gradient: 'from-orange-500 to-red-500'
  },
];

export function Pricing() {
  return (
    <div id="pricing" className="py-24 sm:py-32 relative overflow-hidden">
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
            <TrophyIcon className="w-4 h-4" />
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></span>
            Transparent Pricing
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl animate-fade-in-up">
            Choose Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x">
              Perfect Plan
            </span>
          </h2>
          <p className="mt-6 text-xl leading-8 text-gray-600 animate-fade-in-up animation-delay-1000 max-w-2xl mx-auto">
            Transparent pricing with no hidden fees. All plans include our standard features with upgrade options available.
          </p>
          
          {/* Pricing highlights */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 animate-fade-in-up animation-delay-2000">
            <div className="glass rounded-2xl p-6 hover-lift transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg">
                  <CheckIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">No Hidden Fees</div>
              </div>
              <div className="text-sm text-gray-600">Transparent pricing with no surprises</div>
            </div>
            <div className="glass rounded-2xl p-6 hover-lift transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg">
                  <StarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">30-Day Money Back</div>
              </div>
              <div className="text-sm text-gray-600">Risk-free guarantee on all plans</div>
            </div>
            <div className="glass rounded-2xl p-6 hover-lift transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg">
                  <RocketLaunchIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">Fast Delivery</div>
              </div>
              <div className="text-sm text-gray-600">Quick turnaround on all projects</div>
            </div>
          </div>
        </div>
        
        {/* Enhanced pricing cards */}
        <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`group flex flex-col justify-between rounded-3xl p-8 ring-1 ring-gray-200 shadow-lg hover-lift hover-glow transition-all duration-500 relative overflow-hidden glass ${
                plan.popular ? 'scale-105 rotate-1' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background gradient on hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${plan.bgGradient}`}></div>
              
              {/* Floating particles on hover */}
              <div className="absolute inset-0 z-0">
                <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-blue-300 rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-float transition-all duration-500"></div>
                <div className="absolute bottom-8 left-8 w-1 h-1 bg-purple-300 rounded-full opacity-0 group-hover:opacity-60 group-hover:animate-float animation-delay-1000 transition-all duration-500"></div>
                <div className="absolute top-1/2 right-12 w-1 h-1 bg-pink-300 rounded-full opacity-0 group-hover:opacity-40 group-hover:animate-float animation-delay-2000 transition-all duration-500"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-x-4 text-xs">
                  <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform duration-500 ${plan.gradient}`}>
                    <plan.icon className="h-8 w-8 text-white group-hover:rotate-6 transition-transform duration-500" aria-hidden="true" />
                  </div>
                  {plan.popular && (
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 animate-fade-in-up">
                      Most Popular
                    </span>
                  )}
                </div>
                <h3 className="mt-6 text-xl font-semibold leading-8 tracking-tight text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-500">
                  {plan.name}
                </h3>
                <p className="mt-4 text-base leading-7 text-gray-600">
                  {plan.description}
                </p>
                
                {/* Pricing */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">${plan.price.toLocaleString()}</span>
                    <span className="text-lg text-gray-500 line-through">${plan.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r ${plan.gradient}`}>
                      Save ${(plan.originalPrice - plan.price).toLocaleString()}
                    </span>
                    <div className="px-2 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
                      Limited Time
                    </div>
                  </div>
                </div>
                
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={feature} className="flex items-center gap-x-3 text-sm text-gray-600 animate-fade-in-up" style={{ animationDelay: `${index * 0.1 + featureIndex * 0.05 + 0.8}s` }}>
                      <div className="h-2 w-2 rounded-full bg-blue-500 group-hover:scale-150 transition-transform duration-300" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <a
                href="#"
                className={`mt-8 block rounded-full px-6 py-3 text-center text-sm font-semibold leading-6 ${plan.buttonStyle} shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300`}
              >
                {plan.buttonText}
              </a>
            </div>
          ))}
        </div>
        
        {/* Additional Services Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Additional Services
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Enhance your project with our premium add-on services
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {additionalServices.map((service, index) => (
              <div 
                key={service.name}
                className="group glass rounded-2xl p-6 hover-lift transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <span className="text-2xl">{service.icon}</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h4>
                  <p className="text-2xl font-bold text-blue-600 mb-2">{service.price}</p>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Enhanced CTA section */}
        <div className="mt-20 text-center animate-fade-in-up animation-delay-2000">
          <div className="glass rounded-3xl p-8 lg:p-12 hover-lift transition-all duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Have specific requirements? Let&apos;s discuss a tailored solution that fits your exact needs and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <SparklesIcon className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                  Get Custom Quote
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a
                href="#contact"
                className="group relative px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 text-gray-900 font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Schedule Consultation
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