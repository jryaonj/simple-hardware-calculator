import { useState, useEffect } from 'react';
import { HardDrive, Volume2, Info } from 'lucide-react';
import { calculateHDDNoise } from '../utils/calculations';
import type { HDDSpec, HDDResult } from '../types';

export default function HDDCalculator() {
  const [hddSpec, setHddSpec] = useState<HDDSpec>({
    capacity: 4,
    spinSpeed: 5400,
    acousticIdle: 2.3,
    acousticSeek: 2.7,
    quantity: 1
  });
  const [results, setResults] = useState<HDDResult | null>(null);

  useEffect(() => {
    const result = calculateHDDNoise(hddSpec);
    setResults(result);
  }, [hddSpec]);

  const presetConfigs = [
    { name: '4TB 5400RPM', capacity: 4, spinSpeed: 5400, acousticIdle: 2.3, acousticSeek: 2.7 },
    { name: '8TB 5400RPM', capacity: 8, spinSpeed: 5400, acousticIdle: 2.6, acousticSeek: 2.8 },
    { name: '8TB 7200RPM', capacity: 8, spinSpeed: 7200, acousticIdle: 2.8, acousticSeek: 3.2 },
    { name: '16TB 7200RPM', capacity: 16, spinSpeed: 7200, acousticIdle: 2.8, acousticSeek: 3.2 }
  ];

  const getLoudnessLevel = (sone: number) => {
    if (sone < 1.5) return { level: 'Very Quiet', color: 'text-success', bg: 'bg-success/10' };
    if (sone < 2.5) return { level: 'Quiet', color: 'text-success', bg: 'bg-success/10' };
    if (sone < 3.5) return { level: 'Acceptable', color: 'text-warning', bg: 'bg-warning/10' };
    if (sone < 5) return { level: 'Noticeable', color: 'text-error', bg: 'bg-error/10' };
    return { level: 'Very Noisy', color: 'text-error', bg: 'bg-error/20' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-2">
            <HardDrive className="w-6 h-6" />
            HDD Noise Estimation Calculator
          </h2>
          <p className="text-base-content/70">
            Estimate HDD noise levels and effective loudness. 
            Based on acoustic specifications and equal-loudness contours.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-4">HDD Configuration</h3>
            
            <div className="space-y-4">
              {/* Preset Configurations */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Quick Presets</span>
                </label>
                <div className="join join-vertical w-full">
                  {presetConfigs.map((preset) => (
                    <button
                      key={preset.name}
                      className="btn join-item justify-start"
                      onClick={() => setHddSpec(prev => ({ 
                        ...prev, 
                        ...preset 
                      }))}
                    >
                      <div className="text-left">
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-xs opacity-70">
                          {preset.spinSpeed} RPM • {preset.acousticIdle} dB(A) idle
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="divider">OR Configure Manually</div>

              {/* Manual Configuration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Capacity (TB)</span>
                  </label>
                  <input 
                    type="number" 
                    className="input input-bordered" 
                    value={hddSpec.capacity}
                    onChange={(e) => setHddSpec(prev => ({ 
                      ...prev, 
                      capacity: parseInt(e.target.value) || 1 
                    }))}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Spin Speed (RPM)</span>
                  </label>
                  <select 
                    className="select select-bordered"
                    value={hddSpec.spinSpeed}
                    onChange={(e) => setHddSpec(prev => ({ 
                      ...prev, 
                      spinSpeed: parseInt(e.target.value) 
                    }))}
                  >
                    <option value={4200}>4200 RPM</option>
                    <option value={5400}>5400 RPM</option>
                    <option value={5900}>5900 RPM</option>
                    <option value={7200}>7200 RPM</option>
                    <option value={10000}>10000 RPM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Idle Noise (dB)</span>
                  </label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="input input-bordered" 
                    value={hddSpec.acousticIdle}
                    onChange={(e) => setHddSpec(prev => ({ 
                      ...prev, 
                      acousticIdle: parseFloat(e.target.value) || 2.0 
                    }))}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Seek Noise (dB)</span>
                  </label>
                  <input 
                    type="number" 
                    step="0.1"
                    className="input input-bordered" 
                    value={hddSpec.acousticSeek}
                    onChange={(e) => setHddSpec(prev => ({ 
                      ...prev, 
                      acousticSeek: parseFloat(e.target.value) || 2.5 
                    }))}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Number of Drives</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  value={hddSpec.quantity}
                  className="range range-primary"
                  onChange={(e) => setHddSpec(prev => ({ 
                    ...prev, 
                    quantity: parseInt(e.target.value) 
                  }))}
                />
                <div className="text-center text-sm mt-1">{hddSpec.quantity} drive{hddSpec.quantity > 1 ? 's' : ''}</div>
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
                      <Volume2 className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold">Spin Frequency</h4>
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      {results.frequency} Hz
                    </div>
                    <div className="text-sm text-base-content/70">
                      From {hddSpec.spinSpeed} RPM rotation
                    </div>
                  </div>
                </div>

                {/* Noise Level */}
                <div className="card bg-gradient-to-r from-secondary/10 to-secondary/5">
                  <div className="card-body">
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className="w-5 h-5 text-secondary" />
                      <h4 className="font-semibold">Total Noise Level</h4>
                    </div>
                    <div className="text-3xl font-bold text-secondary mb-1">
                      {results.totalNoiseLevel} dB(A)
                    </div>
                    <div className="text-sm text-base-content/70">
                      {hddSpec.quantity} drive{hddSpec.quantity > 1 ? 's' : ''} combined
                    </div>
                  </div>
                </div>

                {/* Effective Loudness */}
                <div className="card bg-gradient-to-r from-accent/10 to-accent/5">
                  <div className="card-body">
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className="w-5 h-5 text-accent" />
                      <h4 className="font-semibold">Effective Loudness</h4>
                    </div>
                    <div className="text-3xl font-bold text-accent mb-1">
                      {results.effectiveLoudness} sone
                    </div>
                    <div className={`badge badge-lg ${getLoudnessLevel(results.effectiveLoudness).bg} ${getLoudnessLevel(results.effectiveLoudness).color}`}>
                      {getLoudnessLevel(results.effectiveLoudness).level}
                    </div>
                  </div>
                </div>

                {/* Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="table table-xs">
                    <thead>
                      <tr>
                        <th>Configuration</th>
                        <th>Freq (Hz)</th>
                        <th>Loudness (sone)</th>
                        <th>Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-primary/10">
                        <td className="font-medium">Current</td>
                        <td>{results.frequency}</td>
                        <td>{results.effectiveLoudness}</td>
                        <td className={getLoudnessLevel(results.effectiveLoudness).color}>
                          {getLoudnessLevel(results.effectiveLoudness).level}
                        </td>
                      </tr>
                      <tr>
                        <td>4TB 5400</td>
                        <td>90</td>
                        <td>1.0</td>
                        <td className="text-success">Baseline</td>
                      </tr>
                      <tr>
                        <td>8TB 5400</td>
                        <td>90</td>
                        <td>1.8</td>
                        <td className="text-success">+0.8 sone</td>
                      </tr>
                      <tr>
                        <td>8TB 7200</td>
                        <td>120</td>
                        <td>2.3</td>
                        <td className="text-warning">+1.3 sone</td>
                      </tr>
                    </tbody>
                  </table>
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
                    <div className="font-semibold mb-1">Acoustic Guidelines:</div>
                    <div>• 5400 RPM: 90 Hz, quieter but slower</div>
                    <div>• 7200 RPM: 120 Hz, faster but louder</div>
                    <div>• Multiple drives add ~3dB per doubling</div>
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