'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowDownTrayIcon, PlayIcon } from '@heroicons/react/24/outline';

export function Hero() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [particlePositions, setParticlePositions] = useState<Array<{
    left: number;
    top: number;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    // Generate particle positions only on client side
    const positions = Array.from({ length: 20 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
    }));
    setParticlePositions(positions);
  }, []);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      alert('Download links would be provided here for App Store and Google Play');
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {particlePositions.map((particle, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-300 rounded-full animate-float"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            ></div>
          ))}
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-8 sm:py-12 lg:py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl animate-fade-in-up">
              Transform Your Business with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x">
                Custom Software
              </span>
            </h1>
            <p className="mt-8 text-xl leading-8 text-gray-600 max-w-4xl mx-auto">
              We build powerful, scalable web applications, mobile apps, and digital solutions that drive growth, 
              efficiency, and success for businesses of all sizes. From concept to deployment, we&apos;ve got you covered.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 animate-fade-in-up animation-delay-1000">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isDownloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span className="animate-pulse">✨</span>
                      GET FREE CONSULTATION
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
              </button>
              <Link
                href="#portfolio"
                className="group flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold text-lg rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-200 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <PlayIcon className="h-5 w-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10">WATCH OUR WORK</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <ArrowDownTrayIcon className="h-8 w-8 text-gray-400" />
        </div>
      </div>
    </div>
  );
}