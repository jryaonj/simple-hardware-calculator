import { useState, useEffect } from 'react';
import { Calculator, Cpu, MemoryStick, Fan, HardDrive, Heart, Github } from 'lucide-react';
import GPUCalculator from './components/GPUCalculator';
import MemoryCalculator from './components/MemoryCalculator';
import FanCalculator from './components/FanCalculator';
import HDDCalculator from './components/HDDCalculator';
import type { CalculatorType } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<CalculatorType>('gpu');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const tabs = [
    { 
      id: 'gpu' as CalculatorType, 
      name: 'GPU Performance', 
      icon: Cpu,
      description: 'Calculate FP32/FP16 TFLOPS'
    },
    { 
      id: 'memory' as CalculatorType, 
      name: 'Memory Bandwidth', 
      icon: MemoryStick,
      description: 'DDR3/4/5 bandwidth calc'
    },
    { 
      id: 'fan' as CalculatorType, 
      name: 'Fan Noise', 
      icon: Fan,
      description: 'Optimal RPM & noise levels'
    },
    { 
      id: 'hdd' as CalculatorType, 
      name: 'HDD Noise', 
      icon: HardDrive,
      description: 'Drive noise estimation'
    },
  ];

  const renderCalculator = () => {
    switch (activeTab) {
      case 'gpu':
        return <GPUCalculator />;
      case 'memory':
        return <MemoryCalculator />;
      case 'fan':
        return <FanCalculator />;
      case 'hdd':
        return <HDDCalculator />;
      default:
        return <GPUCalculator />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Clean header */}
      <header className={`header-clean sticky top-0 z-50 ${isLoaded ? 'animate-fade-in' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Simple Hardware Calculator
                </h1>
                <p className="text-sm text-gray-500">Easy hardware performance calculations</p>
              </div>
            </div>
            
            {/* GitHub Fork Button */}
            <a
              href="https://github.com/yourusername/simple-hardware-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all duration-200 hover:scale-105 text-sm font-medium"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">Fork me</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8 flex-1">
        {/* Clean tabs */}
        <nav className={`tabs-clean mb-8 ${isLoaded ? 'animate-slide-in' : ''}`}>
          <div className="flex">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  className={`tab-clean ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    <div className="text-left">
                      <div className="font-medium text-sm">{tab.name}</div>
                      <div className="text-xs opacity-70 hidden sm:block">{tab.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Calculator content */}
        <div className="animate-fade-in">
          {renderCalculator()}
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>© 2025 Simple Hardware Calculator</span>
            </div>

            {/* Made with love */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>by</span>
              <a 
                href="https://github.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                jryaonj
              </a>
            </div>

            {/* Tech stack */}
            <div className="flex items-center justify-end gap-4 text-sm text-gray-600">
              <span>Powered by</span>
              <div className="flex items-center gap-3">
                <a 
                  href="https://react.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  React
                </a>
                <span className="text-gray-400">•</span>
                <a
                  href="https://tailwindcss.com"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Tailwind
                </a>
              </div>
            </div>
          </div>

          {/* Performance indicator */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
              <span>Simple calculations for hardware enthusiasts</span>
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
