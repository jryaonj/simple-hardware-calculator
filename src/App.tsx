import { useState } from 'react';
import { Calculator, Cpu, MemoryStick, Fan, HardDrive, Heart } from 'lucide-react';
import GPUCalculator from './components/GPUCalculator';
import MemoryCalculator from './components/MemoryCalculator';
import FanCalculator from './components/FanCalculator';
import HDDCalculator from './components/HDDCalculator';
import type { CalculatorType } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<CalculatorType>('gpu');

  const tabs = [
    { id: 'gpu' as CalculatorType, name: 'GPU Performance', icon: Cpu },
    { id: 'memory' as CalculatorType, name: 'Memory Bandwidth', icon: MemoryStick },
    { id: 'fan' as CalculatorType, name: 'Fan Noise', icon: Fan },
    { id: 'hdd' as CalculatorType, name: 'HDD Noise', icon: HardDrive },
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
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="navbar bg-base-200 shadow-lg">
        <div className="max-w-7xl mx-auto flex-1">
          <div className="flex items-center gap-2">
            <Calculator className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold">Primary School Calc</h1>
            <div className="badge badge-secondary">Hardware Calculator</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="tabs tabs-boxed mb-6">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`tab tab-lg gap-2 ${activeTab === tab.id ? 'tab-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Calculator Content */}
        <div className="mb-8">
          {renderCalculator()}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-base-200 mt-16 pt-6 pb-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <span>© 2025 Primary School Calc</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-error animate-pulse" />
                <span>for hardware enthusiasts</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-base-content/70">
              <span>Powered by</span>
              <div className="flex items-center gap-3">
                <a 
                  href="https://react.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="link link-hover font-medium transition-colors hover:text-primary"
                >
                  React
                </a>
                <span>·</span>
                <a
                  href="https://daisyui.com"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="link link-hover font-medium transition-colors hover:text-primary"
                >
                  DaisyUI
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
