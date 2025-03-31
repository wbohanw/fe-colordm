import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

export default function Landing() {
  const navigate = useNavigate();
  const [hoverIndex, setHoverIndex] = useState(-1);
  const colorRingRef = useRef<HTMLDivElement>(null);

  // Animated color ring effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (colorRingRef.current) {
        const elements = colorRingRef.current.children;
        const randomIdx = Math.floor(Math.random() * elements.length);
        elements[randomIdx].classList.add('scale-125', 'opacity-90');
        
        setTimeout(() => {
          elements[randomIdx].classList.remove('scale-125', 'opacity-90');
        }, 700);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    navigate('/home');
  };

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  // Cyber-style feature cards
  const featureCards = [
    {
      icon: '🎨',
      bgClass: 'from-cyan-50 to-cyan-100',
      borderClass: 'border-cyan-200',
      colorClass: 'text-cyan-600',
      glowClass: 'shadow-[0_0_15px_rgba(6,182,212,0.2)]',
      title: 'Main Color',
      description: 'Find the perfect color palette for your next-generation digital projects',
      path: '/main-color'
    },
    {
      icon: '📱',
      bgClass: 'from-fuchsia-50 to-fuchsia-100',
      borderClass: 'border-fuchsia-200',
      colorClass: 'text-fuchsia-600',
      glowClass: 'shadow-[0_0_15px_rgba(192,38,211,0.2)]',
      title: 'Gallery',
      description: 'Explore cutting-edge color inspirations from our global network',
      path: '/home'
    },
    {
      icon: '🎮',
      bgClass: 'from-emerald-50 to-emerald-100',
      borderClass: 'border-emerald-200',
      colorClass: 'text-emerald-600',
      glowClass: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]',
      title: 'Playground',
      description: 'Visual laboratory to experiment with colors and digital aesthetics',
      path: '/playground'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto text-gray-800">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between py-12 md:py-16">
        <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
          <div className="inline-block px-4 py-2 border border-cyan-200 rounded-full text-sm font-semibold text-cyan-600 mb-6 bg-white/70 backdrop-blur-sm shadow-sm">
            COLOR ENGINE v1.0
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-gray-800 to-fuchsia-600 cyber-text">
            Create<br />
            Digital<br />
            Aesthetics
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
            Unlock next-generation color palettes, boost your design system, and connect to a network of digital art possibilities.
          </p>
          <button 
            onClick={handleGetStarted} 
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-full inline-flex items-center hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] group"
          >
            <span>Enter System</span>
            <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
        
        <div className="md:w-1/2 relative">
          <div className="relative z-10 bg-white/70 cyber-border p-8 rounded-2xl shadow-lg overflow-hidden">
            {/* Abstract geometric background */}
            <div className="absolute inset-0 circuit-pulse">
              <div className="absolute top-0 left-0 w-1/3 h-[1px] bg-cyan-500"></div>
              <div className="absolute top-0 right-0 w-[1px] h-1/3 bg-cyan-500"></div>
              <div className="absolute bottom-0 right-0 w-1/3 h-[1px] bg-cyan-500"></div>
              <div className="absolute bottom-0 left-0 w-[1px] h-1/3 bg-cyan-500"></div>
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-cyan-500 opacity-10"></div>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-fuchsia-600">Color System</div>
                <div className="text-sm md:text-base text-gray-500 mt-1">Interactive color intelligence</div>
              </div>
              
              {/* Color wheel animation */}
              <div ref={colorRingRef} className="relative h-48 md:h-64 flex items-center justify-center mx-auto">
                {[...Array(16)].map((_, i) => {
                  const angle = (i * (360 / 16)) * (Math.PI / 180);
                  const radius = 100;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  // Generate different colors around the wheel
                  const hue = i * (360 / 16);
                  const color = `hsl(${hue}, 85%, 60%)`;
                  
                  return (
                    <div 
                      key={i}
                      className="absolute w-6 h-6 rounded-full transform transition-all duration-500 shadow-md opacity-80 cursor-pointer"
                      style={{ 
                        transform: `translate(${x}px, ${y}px)`,
                        backgroundColor: color,
                        boxShadow: `0 0 8px ${color}70`
                      }}
                      onMouseEnter={() => setHoverIndex(i)}
                      onMouseLeave={() => setHoverIndex(-1)}
                    />
                  );
                })}
                <div className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-white to-gray-50 border border-gray-200 flex items-center justify-center text-2xl shadow-inner">
                  {hoverIndex >= 0 ? (
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Hue</div>
                      <div className="text-lg font-mono text-gray-800">{hoverIndex * (360 / 16)}°</div>
                    </div>
                  ) : '🎨'}
                </div>
              </div>
            </div>
            
            {/* Moving gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-fuchsia-500/0 opacity-60 pointer-events-none gradient-flow"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 relative">
        <h2 className="text-3xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-fuchsia-600">
          System Modules
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {featureCards.map((card, index) => (
            <div 
              key={index}
              className={`
                bg-gradient-to-br ${card.bgClass} rounded-2xl p-6 md:p-8 cursor-pointer 
                transform transition-all duration-300 hover:scale-[1.03] relative overflow-hidden cyber-border
                hover:${card.glowClass} ${card.borderClass}
              `}
              onClick={() => handleCardClick(card.path)}
            >
              {/* Circuit pattern background */}
              <div className="absolute inset-0 circuit-pulse">
                <div className="absolute top-0 left-0 w-1/3 h-[1px] bg-cyan-500"></div>
                <div className="absolute top-0 right-0 w-[1px] h-1/3 bg-cyan-500"></div>
                <div className="absolute bottom-0 right-0 w-1/3 h-[1px] bg-cyan-500"></div>
                <div className="absolute bottom-0 left-0 w-[1px] h-1/3 bg-cyan-500"></div>
              </div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-white shadow-md flex items-center justify-center mb-6 text-3xl border border-gray-100">
                  {card.icon}
                </div>
                <h3 className={`text-xl font-bold mb-3 ${card.colorClass}`}>{card.title}</h3>
                <p className="text-gray-600 mb-6">{card.description}</p>
                <div className={`inline-flex items-center font-medium ${card.colorClass}`}>
                  <span>Access</span>
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 