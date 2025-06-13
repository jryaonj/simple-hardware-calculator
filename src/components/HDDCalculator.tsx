import { useState } from 'react';
import { HardDrive, Volume2, Zap, Info, ChevronDown, BarChart3 } from 'lucide-react';

interface HDDSpec {
  capacity: number;
  spinSpeed: number;
  acousticIdle: number;
  acousticSeek: number;
  quantity: number;
}

const presetConfigs = [
  { name: '4TB 5400RPM', capacity: 4, spinSpeed: 5400, acousticIdle: 2.3, acousticSeek: 2.7 },
  { name: '8TB 5400RPM', capacity: 8, spinSpeed: 5400, acousticIdle: 2.6, acousticSeek: 2.8 },
  { name: '8TB 7200RPM', capacity: 8, spinSpeed: 7200, acousticIdle: 2.8, acousticSeek: 3.2 },
  { name: '16TB 7200RPM', capacity: 16, spinSpeed: 7200, acousticIdle: 2.8, acousticSeek: 3.2 },
  { name: '4TB 5400RPM (WD Red)', capacity: 4, spinSpeed: 5400, acousticIdle: 2.1, acousticSeek: 2.5 },
  { name: '10TB 7200RPM (Seagate)', capacity: 10, spinSpeed: 7200, acousticIdle: 3.0, acousticSeek: 3.4 },
];

function HDDCalculator() {
  const [hddSpec, setHddSpec] = useState<HDDSpec>({
    capacity: 4,
    spinSpeed: 5400,
    acousticIdle: 2.3,
    acousticSeek: 2.7,
    quantity: 1
  });
  const [usePreset, setUsePreset] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState(presetConfigs[0]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const calculateHDDNoise = () => {
    // Spin frequency = RPM ÷ 60
    const frequency = hddSpec.spinSpeed / 60;
    
    // Estimate loudness in sones (simplified calculation)
    // This is a simplified model - real calculations would be more complex
    const idleSones = Math.pow(10, (hddSpec.acousticIdle - 40) / 33);
    const seekSones = Math.pow(10, (hddSpec.acousticSeek - 40) / 33);
    
    // Total noise considering multiple drives
    const totalIdleSones = idleSones * hddSpec.quantity;
    const totalSeekSones = seekSones * hddSpec.quantity;
    
    return {
      frequency: Math.round(frequency * 10) / 10,
      idleSones: Math.round(totalIdleSones * 100) / 100,
      seekSones: Math.round(totalSeekSones * 100) / 100,
      idleDB: Math.round((hddSpec.acousticIdle + 10 * Math.log10(hddSpec.quantity)) * 10) / 10,
      seekDB: Math.round((hddSpec.acousticSeek + 10 * Math.log10(hddSpec.quantity)) * 10) / 10
    };
  };

  const getLoudnessLevel = (sone: number) => {
    if (sone < 1.5) return { level: 'Very Quiet', color: 'text-green-600', description: 'Barely noticeable' };
    if (sone < 2.5) return { level: 'Quiet', color: 'text-blue-600', description: 'Acceptable for quiet environments' };
    if (sone < 3.5) return { level: 'Moderate', color: 'text-yellow-600', description: 'Noticeable but acceptable' };
    if (sone < 5) return { level: 'Loud', color: 'text-orange-600', description: 'Clearly audible' };
    return { level: 'Very Loud', color: 'text-red-600', description: 'Potentially disruptive' };
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 300);
  };

  const handlePresetChange = (preset: typeof presetConfigs[0]) => {
    setSelectedPreset(preset);
    setHddSpec(prev => ({
      ...prev,
      ...preset
    }));
  };

  const results = calculateHDDNoise();
  const loudnessLevel = getLoudnessLevel(results.seekSones);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Configuration Card */}
      <div className="card-clean animate-fade-in">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">HDD Configuration</h2>
              <p className="text-sm text-gray-500">Configure drive specifications and quantity</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Preset Toggle */}
            <div className="form-group">
              <label className="toggle-clean">
                <input
                  type="checkbox"
                  checked={usePreset}
                  onChange={(e) => setUsePreset(e.target.checked)}
                />
                <span className="toggle-slider"></span>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Use Preset Configuration
                </span>
              </label>
            </div>

            {/* Preset Selection */}
            {usePreset && (
              <div className="form-group">
                <label className="form-label">Select HDD Model</label>
                <div className="dropdown-clean">
                  <button
                    className="dropdown-trigger"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedPreset.spinSpeed >= 7200 ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                      <span>{selectedPreset.name}</span>
                      <span className="text-xs text-gray-500">
                        {selectedPreset.spinSpeed} RPM • {selectedPreset.acousticIdle} dB
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="dropdown-menu">
                      {presetConfigs.map((preset) => (
                        <div
                          key={preset.name}
                          className="dropdown-item"
                          onClick={() => {
                            handlePresetChange(preset);
                            setDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              preset.spinSpeed >= 7200 ? 'bg-red-500' : 'bg-blue-500'
                            }`}></div>
                            <div>
                              <div className="text-sm font-medium">{preset.name}</div>
                              <div className="text-xs text-gray-500">
                                {preset.spinSpeed} RPM • {preset.acousticIdle} dB idle
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Custom Configuration */}
            {!usePreset && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Capacity (TB)</label>
                    <input
                      type="number"
                      className="input-clean"
                      value={hddSpec.capacity}
                      onChange={(e) => setHddSpec(prev => ({ 
                        ...prev, 
                        capacity: parseInt(e.target.value) || 1 
                      }))}
                      placeholder="e.g., 4"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Spin Speed (RPM)</label>
                    <input
                      type="number"
                      className="input-clean"
                      value={hddSpec.spinSpeed}
                      onChange={(e) => setHddSpec(prev => ({ 
                        ...prev, 
                        spinSpeed: parseInt(e.target.value) || 5400 
                      }))}
                      placeholder="e.g., 5400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Idle Noise (dB)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-clean"
                      value={hddSpec.acousticIdle}
                      onChange={(e) => setHddSpec(prev => ({ 
                        ...prev, 
                        acousticIdle: parseFloat(e.target.value) || 2.0 
                      }))}
                      placeholder="e.g., 2.3"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Seek Noise (dB)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-clean"
                      value={hddSpec.acousticSeek}
                      onChange={(e) => setHddSpec(prev => ({ 
                        ...prev, 
                        acousticSeek: parseFloat(e.target.value) || 2.5 
                      }))}
                      placeholder="e.g., 2.7"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Number of Drives */}
            <div className="form-group">
              <label className="form-label">
                Number of Drives
                <span className="text-xs text-gray-500 ml-2">
                  {hddSpec.quantity} drive{hddSpec.quantity > 1 ? 's' : ''}
                </span>
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={hddSpec.quantity}
                  onChange={(e) => setHddSpec(prev => ({ 
                    ...prev, 
                    quantity: parseInt(e.target.value) 
                  }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>10</span>
                  <span>20</span>
                </div>
              </div>
            </div>

            <button
              className="btn-clean w-full"
              onClick={handleCalculate}
              disabled={isCalculating}
            >
              {isCalculating ? (
                <>
                  <div className="loading-spinner"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Analyze HDD Noise
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Card */}
      <div className="card-clean animate-slide-in">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Noise Analysis</h2>
              <p className="text-sm text-gray-500">Drive noise levels and acoustic impact</p>
            </div>
          </div>

          {/* Main Results */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="result-card-clean">
              <div className="result-main text-2xl">{results.frequency}</div>
              <div className="result-label text-sm">Hz Spin Rate</div>
            </div>
            <div className="result-card-clean">
              <div className="result-main text-2xl">{results.seekSones}</div>
              <div className="result-label text-sm">Sones (Seek)</div>
            </div>
          </div>

          {/* Loudness Level */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Loudness Level</span>
              <span className={`text-sm font-medium ${loudnessLevel.color}`}>
                {loudnessLevel.level}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-slate-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((results.seekSones / 6) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{loudnessLevel.description}</p>
          </div>

          {/* Noise Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">Noise Breakdown</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm font-medium text-blue-800">Idle Operation</div>
                <div className="text-lg font-semibold text-blue-900">{results.idleDB} dB</div>
                <div className="text-xs text-blue-600">{results.idleSones} sones</div>
              </div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="text-sm font-medium text-orange-800">Seek Operation</div>
                <div className="text-lg font-semibold text-orange-900">{results.seekDB} dB</div>
                <div className="text-xs text-orange-600">{results.seekSones} sones</div>
              </div>
            </div>

            {/* Usage Scenarios */}
            <div className="space-y-2">
              {results.seekSones < 2.5 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm font-medium text-green-800">Suitable for</div>
                  <div className="text-xs text-green-600">Quiet environments, home office</div>
                </div>
              )}
              {results.seekSones >= 2.5 && results.seekSones < 4 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-sm font-medium text-yellow-800">Consider for</div>
                  <div className="text-xs text-yellow-600">Server rooms, basement setups</div>
                </div>
              )}
              {results.seekSones >= 4 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-sm font-medium text-red-800">Recommended for</div>
                  <div className="text-xs text-red-600">Data centers, separate rooms only</div>
                </div>
              )}
            </div>
          </div>

          {/* Technical Details */}
          <button
            className="btn-outline-clean w-full mt-6"
            onClick={() => setShowDetails(!showDetails)}
          >
            <Info className="w-4 h-4" />
            {showDetails ? 'Hide' : 'Show'} Technical Details
            <ChevronDown className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
          </button>

          {showDetails && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fade-in">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Spin Frequency:</span>
                  <span>{hddSpec.spinSpeed} ÷ 60 = {results.frequency} Hz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Drive Model:</span>
                  <span>{usePreset ? selectedPreset.name : 'Custom'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span>{hddSpec.capacity} TB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span>{hddSpec.quantity} drive{hddSpec.quantity > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Combined Noise:</span>
                  <span>+{(10 * Math.log10(hddSpec.quantity)).toFixed(1)} dB</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HDDCalculator; 