import { useState, useEffect } from 'react';
import { Fan, Volume2, Info, AlertTriangle } from 'lucide-react';
import { calculateFanNoise, getOptimalFanRPM } from '../utils/calculations';
import type { FanSpec, FanResult } from '../types';

export default function FanCalculator() {
  const [fanSpec, setFanSpec] = useState<FanSpec>({
    diameter: 120,
    thickness: 25,
    wings: 7,
    maxRPM: 1500,
    currentRPM: 800
  });
  const [results, setResults] = useState<FanResult | null>(null);
  const [optimalRPM, setOptimalRPM] = useState<number>(0);

  useEffect(() => {
    const result = calculateFanNoise(fanSpec);
    const optimal = getOptimalFanRPM(fanSpec.wings);
    setResults(result);
    setOptimalRPM(optimal);
  }, [fanSpec]);

  const getNoiseColor = (level: string) => {
    switch (level) {
      case 'quiet': return 'text-success';
      case 'acceptable': return 'text-warning';
      case 'noisy': return 'text-error';
      default: return 'text-base-content';
    }
  };

  const getNoiseIcon = (level: string) => {
    switch (level) {
      case 'quiet': return <Volume2 className="w-4 h-4 text-success" />;
      case 'acceptable': return <Volume2 className="w-4 h-4 text-warning" />;
      case 'noisy': return <AlertTriangle className="w-4 h-4 text-error" />;
      default: return <Volume2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-2">
            <Fan className="w-6 h-6" />
            Fan Speed & Noise Calculator
          </h2>
          <p className="text-base-content/70">
            Calculate fan noise frequency and get recommendations. 
            Formula: (RPM ÷ 60) × number_of_wings = frequency (Hz)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-4">Fan Specifications</h3>
            
            <div className="space-y-4">
              {/* Fan Size */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Diameter (mm)</span>
                  </label>
                  <select 
                    className="select select-bordered"
                    value={fanSpec.diameter}
                    onChange={(e) => setFanSpec(prev => ({ 
                      ...prev, 
                      diameter: parseInt(e.target.value) 
                    }))}
                  >
                    <option value={80}>80mm</option>
                    <option value={92}>92mm</option>
                    <option value={120}>120mm</option>
                    <option value={140}>140mm</option>
                    <option value={200}>200mm</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Thickness (mm)</span>
                  </label>
                  <select 
                    className="select select-bordered"
                    value={fanSpec.thickness}
                    onChange={(e) => setFanSpec(prev => ({ 
                      ...prev, 
                      thickness: parseInt(e.target.value) 
                    }))}
                  >
                    <option value={10}>10mm</option>
                    <option value={15}>15mm</option>
                    <option value={25}>25mm</option>
                    <option value={38}>38mm</option>
                  </select>
                </div>
              </div>

              {/* Fan Properties */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Number of Wings</span>
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="13" 
                  value={fanSpec.wings}
                  className="range range-primary"
                  onChange={(e) => setFanSpec(prev => ({ 
                    ...prev, 
                    wings: parseInt(e.target.value) 
                  }))}
                />
                <div className="text-center text-sm mt-1">{fanSpec.wings} wings</div>
              </div>

              {/* RPM Settings */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Current RPM</span>
                </label>
                <input 
                  type="range" 
                  min="200" 
                  max={fanSpec.maxRPM} 
                  value={fanSpec.currentRPM}
                  className="range range-secondary"
                  onChange={(e) => setFanSpec(prev => ({ 
                    ...prev, 
                    currentRPM: parseInt(e.target.value) 
                  }))}
                />
                <div className="text-center text-sm mt-1">{fanSpec.currentRPM} RPM</div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Maximum RPM</span>
                </label>
                <input 
                  type="number" 
                  className="input input-bordered" 
                  value={fanSpec.maxRPM}
                  onChange={(e) => setFanSpec(prev => ({ 
                    ...prev, 
                    maxRPM: parseInt(e.target.value) || 1500,
                    currentRPM: Math.min(prev.currentRPM, parseInt(e.target.value) || 1500)
                  }))}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-4">Noise Analysis</h3>
            
            {results && (
              <div className="space-y-4">
                {/* Frequency Result */}
                <div className="card bg-gradient-to-r from-primary/10 to-primary/5">
                  <div className="card-body">
                    <div className="flex items-center gap-2 mb-2">
                      {getNoiseIcon(results.noiseLevel)}
                      <h4 className="font-semibold">Audio Frequency</h4>
                    </div>
                    <div className="text-3xl font-bold text-primary mb-1">
                      {results.frequency} Hz
                    </div>
                    <div className={`badge badge-lg ${getNoiseColor(results.noiseLevel)}`}>
                      {results.noiseLevel.toUpperCase()}
                    </div>
                  </div>
                </div>

                {/* Optimal RPM */}
                <div className="card bg-gradient-to-r from-success/10 to-success/5">
                  <div className="card-body">
                    <h4 className="font-semibold mb-2">Optimal RPM</h4>
                    <div className="text-2xl font-bold text-success">
                      {optimalRPM} RPM
                    </div>
                    <div className="text-sm text-base-content/70">
                      For acceptable noise (&lt; 65Hz)
                    </div>
                  </div>
                </div>

                {/* Current vs Optimal */}
                <div className="stats stats-vertical shadow">
                  <div className="stat">
                    <div className="stat-title">Current Setting</div>
                    <div className="stat-value text-lg">{fanSpec.currentRPM} RPM</div>
                    <div className="stat-desc">{results.frequency} Hz</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Recommended</div>
                    <div className="stat-value text-lg">{optimalRPM} RPM</div>
                    <div className="stat-desc">&lt; 65 Hz</div>
                  </div>
                </div>

                {/* Recommendations */}
                {results.recommendations.length > 0 && (
                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h4 className="font-semibold mb-2">Recommendations</h4>
                      <ul className="space-y-1 text-sm">
                        {results.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Info className="w-4 h-4 mt-0.5 text-info flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Reference Guide */}
                <div className="alert alert-info">
                  <Info className="w-4 h-4" />
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Noise Guidelines:</div>
                    <div>• &lt; 50 Hz: Excellent for quiet operation</div>
                    <div>• 50-65 Hz: Good balance of cooling and noise</div>
                    <div>• &gt; 65 Hz: May be audibly noticeable</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 