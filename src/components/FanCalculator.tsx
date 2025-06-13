import { useState } from 'react';
import { Fan, Volume2, Zap, Info, ChevronDown, BarChart3 } from 'lucide-react';

interface FanSpec {
  diameter: number;
  thickness: number;
  wings: number;
  maxRPM: number;
  currentRPM: number;
}

const fanSizes = [
  { diameter: 80, thickness: 25, name: '80mm Standard' },
  { diameter: 92, thickness: 25, name: '92mm Standard' },
  { diameter: 120, thickness: 25, name: '120mm Standard' },
  { diameter: 140, thickness: 25, name: '140mm Standard' },
  { diameter: 200, thickness: 30, name: '200mm Large' },
];

function FanCalculator() {
  const [fanSpec, setFanSpec] = useState<FanSpec>({
    diameter: 120,
    thickness: 25,
    wings: 7,
    maxRPM: 1500,
    currentRPM: 800
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const calculateFanNoise = () => {
    // Frequency = (RPM ÷ 60) × number_of_wings
    const frequency = (fanSpec.currentRPM / 60) * fanSpec.wings;
    return Math.round(frequency * 10) / 10;
  };

  const getOptimalRPM = () => {
    // Optimal frequency for acceptable noise is typically < 65Hz
    const targetFreq = 65;
    return Math.round((targetFreq * 60) / fanSpec.wings);
  };

  const getNoiseLevel = () => {
    const frequency = calculateFanNoise();
    if (frequency < 40) return { level: 'Quiet', color: 'text-green-600', description: 'Barely audible' };
    if (frequency < 65) return { level: 'Acceptable', color: 'text-blue-600', description: 'Comfortable for most users' };
    if (frequency < 100) return { level: 'Noticeable', color: 'text-yellow-600', description: 'Clearly audible' };
    return { level: 'Noisy', color: 'text-red-600', description: 'Potentially disturbing' };
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 300);
  };

  const frequency = calculateFanNoise();
  const optimalRPM = getOptimalRPM();
  const noiseLevel = getNoiseLevel();

  const selectedFanSize = fanSizes.find(f => f.diameter === fanSpec.diameter) || fanSizes[2];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Configuration Card */}
      <div className="card-clean animate-fade-in">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Fan className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Fan Configuration</h2>
              <p className="text-sm text-gray-500">Configure fan specs and RPM settings</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Fan Size Selection */}
            <div className="form-group">
              <label className="form-label">Fan Size</label>
              <div className="dropdown-clean">
                <button
                  className="dropdown-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>{selectedFanSize.name}</span>
                    <span className="text-xs text-gray-500">
                      {fanSpec.diameter}×{fanSpec.thickness}mm
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    {fanSizes.map((size) => (
                      <div
                        key={size.diameter}
                        className="dropdown-item"
                        onClick={() => {
                          setFanSpec(prev => ({
                            ...prev,
                            diameter: size.diameter,
                            thickness: size.thickness
                          }));
                          setDropdownOpen(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <div>
                            <div className="text-sm font-medium">{size.name}</div>
                            <div className="text-xs text-gray-500">
                              {size.diameter}×{size.thickness}mm
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Fan Wings */}
            <div className="form-group">
              <label className="form-label">
                Number of Wings
                <span className="text-xs text-gray-500 ml-2">
                  {fanSpec.wings} wings
                </span>
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="5"
                  max="13"
                  value={fanSpec.wings}
                  onChange={(e) => setFanSpec(prev => ({ 
                    ...prev, 
                    wings: parseInt(e.target.value) 
                  }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5</span>
                  <span>9</span>
                  <span>13</span>
                </div>
              </div>
            </div>

            {/* Maximum RPM */}
            <div className="form-group">
              <label className="form-label">Maximum RPM</label>
              <input
                type="number"
                className="input-clean"
                value={fanSpec.maxRPM}
                onChange={(e) => setFanSpec(prev => ({
                  ...prev,
                  maxRPM: parseInt(e.target.value) || 1500,
                  currentRPM: Math.min(prev.currentRPM, parseInt(e.target.value) || 1500)
                }))}
                placeholder="e.g., 1500"
              />
            </div>

            {/* Current RPM */}
            <div className="form-group">
              <label className="form-label">
                Current RPM
                <span className="text-xs text-gray-500 ml-2">
                  {fanSpec.currentRPM} RPM
                </span>
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="200"
                  max={fanSpec.maxRPM}
                  value={fanSpec.currentRPM}
                  onChange={(e) => setFanSpec(prev => ({ 
                    ...prev, 
                    currentRPM: parseInt(e.target.value) 
                  }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>200</span>
                  <span>{Math.round(fanSpec.maxRPM / 2)}</span>
                  <span>{fanSpec.maxRPM}</span>
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
                  Analyze Fan Noise
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
              <p className="text-sm text-gray-500">Fan noise frequency and recommendations</p>
            </div>
          </div>

          {/* Main Result */}
          <div className="result-card-clean mb-6">
            <div className="result-main">{frequency}</div>
            <div className="result-label">Hz Frequency</div>
            <div className={`result-badge ${noiseLevel.level === 'Quiet' ? 'success' : 
              noiseLevel.level === 'Acceptable' ? 'info' : 'warning'}`}>
              {noiseLevel.level} Level
            </div>
          </div>

          {/* Noise Level */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Noise Level</span>
              <span className={`text-sm font-medium ${noiseLevel.color}`}>
                {noiseLevel.level}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((frequency / 120) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{noiseLevel.description}</p>
          </div>

          {/* Optimal RPM Recommendation */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">Optimization</span>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">Optimal RPM</span>
                <span className="text-lg font-semibold text-blue-900">{optimalRPM}</span>
              </div>
              <p className="text-xs text-blue-600">
                For acceptable noise level (&lt; 65Hz)
              </p>
            </div>

            {fanSpec.currentRPM > optimalRPM && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="text-sm font-medium text-yellow-800">Recommendation</div>
                <div className="text-xs text-yellow-600">
                  Consider reducing RPM by {fanSpec.currentRPM - optimalRPM} for quieter operation
                </div>
              </div>
            )}
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
                  <span className="text-gray-600">Formula:</span>
                  <span className="font-mono text-xs">(RPM ÷ 60) × wings</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fan Size:</span>
                  <span>{fanSpec.diameter}×{fanSpec.thickness}mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wings:</span>
                  <span>{fanSpec.wings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current RPM:</span>
                  <span>{fanSpec.currentRPM}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency:</span>
                  <span>{frequency} Hz</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FanCalculator; 