import { CheckIcon } from '@heroicons/react/24/outline';

const stats = [
  { name: 'Projects Completed', value: '50+' },
  { name: 'Happy Clients', value: '30+' },
  { name: 'Years Experience', value: '5+' },
  { name: 'Team Members', value: '10+' },
];

const values = [
  'Quality-driven development approach',
  'Client-focused solutions',
  'Modern technology stack',
  'Agile development methodology',
  '24/7 support and maintenance',
  'Transparent communication',
];

export function About() {
  return (
    <div id="about" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              About Kiatech Software
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              We are a team of passionate developers and designers dedicated to creating exceptional software solutions.
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="mx-auto flex max-w-xs flex-col gap-y-4">
                <dt className="text-base leading-7 text-gray-600">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Why Choose Us?
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                We deliver exceptional results through our commitment to quality, innovation, and client satisfaction.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
                  <p className="text-gray-600">
                    To empower businesses with cutting-edge mobile and web solutions that drive growth, 
                    enhance user experience, and deliver measurable results. We believe in the power of 
                    technology to transform ideas into reality.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Vision</h3>
                  <p className="text-gray-600">
                    To be the leading software development company known for innovation, reliability, 
                    and exceptional client service. We aim to set new standards in mobile app development 
                    and digital transformation.
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Values</h3>
                <ul className="space-y-3">
                  {values.map((value) => (
                    <li key={value} className="flex items-start gap-x-3">
                      <CheckIcon className="h-6 w-6 flex-shrink-0 text-blue-600 mt-0.5" />
                      <span className="text-gray-600">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
