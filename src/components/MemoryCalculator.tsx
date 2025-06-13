import { useState, useEffect } from 'react';
import { MemoryStick, Info } from 'lucide-react';
import { calculateMemoryBandwidth } from '../utils/calculations';
import type { MemorySpec } from '../types';

export default function MemoryCalculator() {
  const [memorySpec, setMemorySpec] = useState<MemorySpec>({
    type: 'DDR4',
    frequency: 2666,
    channels: 2,
    bandwidth: 0
  });

  useEffect(() => {
    const bandwidth = calculateMemoryBandwidth(memorySpec);
    setMemorySpec(prev => ({ ...prev, bandwidth }));
  }, [memorySpec.type, memorySpec.frequency, memorySpec.channels]);

  const memoryTypes = ['DDR3', 'DDR4', 'DDR5'] as const;
  const commonFrequencies = {
    DDR3: [800, 1066, 1333, 1600, 1866, 2133],
    DDR4: [1600, 1866, 2133, 2400, 2666, 2933, 3200, 3600],
    DDR5: [3200, 3600, 4000, 4400, 4800, 5200, 5600, 6000, 6400]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-2">
            <MemoryStick className="w-6 h-6" />
            Memory Bandwidth Calculator
          </h2>
          <p className="text-base-content/70">
            Calculate memory bandwidth in MT/s. 
            Formula: frequency × 64 bits × channels ÷ 8 bits per byte
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-4">Memory Configuration</h3>
            
            <div className="space-y-4">
              {/* Memory Type */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Memory Type</span>
                </label>
                <div className="join">
                  {memoryTypes.map((type) => (
                    <input
                      key={type}
                      className="join-item btn"
                      type="radio"
                      name="memoryType"
                      aria-label={type}
                      checked={memorySpec.type === type}
                      onChange={() => setMemorySpec(prev => ({ 
                        ...prev, 
                        type,
                        frequency: commonFrequencies[type][0]
                      }))}
                    />
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Frequency (MHz)</span>
                </label>
                <select 
                  className="select select-bordered"
                  value={memorySpec.frequency}
                  onChange={(e) => setMemorySpec(prev => ({ 
                    ...prev, 
                    frequency: parseInt(e.target.value) 
                  }))}
                >
                  {commonFrequencies[memorySpec.type].map((freq) => (
                    <option key={freq} value={freq}>{freq} MHz</option>
                  ))}
                </select>
              </div>

              {/* Channel Count */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Number of Channels</span>
                </label>
                <div className="join">
                  {[1, 2, 4, 8, 12].map((channels) => (
                    <input
                      key={channels}
                      className="join-item btn"
                      type="radio"
                      name="channels"
                      aria-label={`${channels} Channel${channels > 1 ? 's' : ''}`}
                      checked={memorySpec.channels === channels}
                      onChange={() => setMemorySpec(prev => ({ ...prev, channels }))}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-4">Bandwidth Results</h3>
            
            <div className="space-y-4">
              {/* Main Result */}
              <div className="card bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="card-body">
                  <h4 className="font-semibold mb-2">Memory Bandwidth</h4>
                  <div className="text-4xl font-bold text-primary mb-2">
                    {memorySpec.bandwidth.toLocaleString()} MT/s
                  </div>
                  <div className="text-sm text-base-content/70">
                    {(memorySpec.bandwidth / 1000).toFixed(1)} GB/s
                  </div>
                </div>
              </div>

              {/* Configuration Details */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <h4 className="font-semibold mb-2">Configuration</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Type: <span className="font-medium">{memorySpec.type}</span></div>
                    <div>Frequency: <span className="font-medium">{memorySpec.frequency} MHz</span></div>
                    <div>Channels: <span className="font-medium">{memorySpec.channels}</span></div>
                    <div>Per Channel: <span className="font-medium">64 bits</span></div>
                  </div>
                </div>
              </div>

              {/* Examples from ps_calc.md */}
              <div className="alert alert-info">
                <Info className="w-4 h-4" />
                <div className="text-sm">
                  <div className="font-semibold mb-1">Reference Examples:</div>
                  <div>• Dual DDR4-2666: 42,656 MT/s</div>
                  <div>• Dual DDR5-5600: 89,600 MT/s</div>
                  <div>• Octa DDR4-3200: 204,800 MT/s</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 