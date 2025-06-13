import { useState, useEffect } from 'react';
import { Cpu, Zap, Monitor, Info, ChevronDown } from 'lucide-react';

interface GPUModel {
  name: string;
  cores: number;
  baseFreq: number;
  architecture: string;
  company: 'nvidia' | 'amd';
}

interface PerformanceLevel {
  level: string;
  min: number;
  max: number;
  color: string;
  description: string;
}

const gpuModels: GPUModel[] = [
  { name: 'GeForce GTX 1080 Ti', cores: 3584, baseFreq: 1481, architecture: 'Pascal', company: 'nvidia' },
  { name: 'GeForce RTX 3060', cores: 3584, baseFreq: 1320, architecture: 'Ampere', company: 'nvidia' },
  { name: 'GeForce RTX 3070', cores: 5888, baseFreq: 1500, architecture: 'Ampere', company: 'nvidia' },
  { name: 'GeForce RTX 3080', cores: 8704, baseFreq: 1440, architecture: 'Ampere', company: 'nvidia' },
  { name: 'GeForce RTX 3090', cores: 10496, baseFreq: 1395, architecture: 'Ampere', company: 'nvidia' },
  { name: 'GeForce RTX 4060', cores: 3072, baseFreq: 1830, architecture: 'Ada Lovelace', company: 'nvidia' },
  { name: 'GeForce RTX 4070', cores: 5888, baseFreq: 1920, architecture: 'Ada Lovelace', company: 'nvidia' },
  { name: 'GeForce RTX 4080', cores: 9728, baseFreq: 2205, architecture: 'Ada Lovelace', company: 'nvidia' },
  { name: 'GeForce RTX 4090', cores: 16384, baseFreq: 2230, architecture: 'Ada Lovelace', company: 'nvidia' },
  { name: 'Radeon RX 6600', cores: 1792, baseFreq: 1968, architecture: 'RDNA 2', company: 'amd' },
  { name: 'Radeon RX 6700 XT', cores: 2560, baseFreq: 2424, architecture: 'RDNA 2', company: 'amd' },
  { name: 'Radeon RX 6800', cores: 3840, baseFreq: 1815, architecture: 'RDNA 2', company: 'amd' },
  { name: 'Radeon RX 6900 XT', cores: 5120, baseFreq: 2015, architecture: 'RDNA 2', company: 'amd' },
  { name: 'Radeon RX 7700 XT', cores: 3456, baseFreq: 2171, architecture: 'RDNA 3', company: 'amd' },
  { name: 'Radeon RX 7800 XT', cores: 3840, baseFreq: 2124, architecture: 'RDNA 3', company: 'amd' },
  { name: 'Radeon RX 7900 XTX', cores: 6144, baseFreq: 2230, architecture: 'RDNA 3', company: 'amd' },
];

const performanceLevels: PerformanceLevel[] = [
  { level: 'Low', min: 0, max: 8, color: 'text-red-600', description: 'Entry-level gaming performance' },
  { level: 'Medium', min: 8, max: 15, color: 'text-yellow-600', description: 'Good for 1080p gaming' },
  { level: 'High', min: 15, max: 25, color: 'text-blue-600', description: 'Excellent for 1440p gaming' },
  { level: 'Extreme', min: 25, max: 100, color: 'text-green-600', description: 'Top-tier 4K gaming' },
];

function GPUCalculator() {
  const [useCustom, setUseCustom] = useState(false);
  const [selectedGPU, setSelectedGPU] = useState<GPUModel | null>(gpuModels[0]);
  const [cores, setCores] = useState(3584);
  const [baseFreq, setBaseFreq] = useState(1481);
  const [customFreq, setCustomFreq] = useState(1481);
  const [isCalculating, setIsCalculating] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (selectedGPU && !useCustom) {
      setCores(selectedGPU.cores);
      setBaseFreq(selectedGPU.baseFreq);
      setCustomFreq(selectedGPU.baseFreq);
    }
  }, [selectedGPU, useCustom]);

  const calculateTFLOPS = () => {
    const frequency = useCustom ? customFreq : baseFreq;
    return (cores * frequency * 2) / 1_000_000;
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 300);
  };

  const tflops = calculateTFLOPS();
  const performanceLevel = performanceLevels.find(level => 
    tflops >= level.min && tflops < level.max
  ) || performanceLevels[performanceLevels.length - 1];

  const getGamingEstimates = () => {
    const fp1080 = Math.round((tflops / 8) * 60);
    const fp1440 = Math.round((tflops / 12) * 60);
    const fp4k = Math.round((tflops / 20) * 60);
    
    return {
      '1080p': Math.min(fp1080, 165),
      '1440p': Math.min(fp1440, 120),
      '4K': Math.min(fp4k, 90)
    };
  };

  const gamingEstimates = getGamingEstimates();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Configuration Card */}
      <div className="card-clean animate-fade-in">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">GPU Configuration</h2>
              <p className="text-sm text-gray-500">Select GPU model or set custom specifications</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Custom GPU Toggle */}
            <div className="form-group">
              <label className="toggle-clean">
                <input
                  type="checkbox"
                  checked={useCustom}
                  onChange={(e) => setUseCustom(e.target.checked)}
                />
                <span className="toggle-slider"></span>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Use Custom GPU Specifications
                </span>
              </label>
            </div>

            {/* GPU Model Selection */}
            {!useCustom && (
              <div className="form-group">
                <label className="form-label">Select GPU Model</label>
                <div className="dropdown-clean">
                  <button
                    className="dropdown-trigger"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedGPU?.company === 'nvidia' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span>{selectedGPU?.name}</span>
                      <span className="text-xs text-gray-500">
                        {selectedGPU?.architecture} • {selectedGPU?.cores.toLocaleString()} cores
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="dropdown-menu">
                      {gpuModels.map((gpu) => (
                        <div
                          key={gpu.name}
                          className="dropdown-item"
                          onClick={() => {
                            setSelectedGPU(gpu);
                            setDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              gpu.company === 'nvidia' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            <div>
                              <div className="text-sm font-medium">{gpu.name}</div>
                              <div className="text-xs text-gray-500">
                                {gpu.architecture} • {gpu.cores.toLocaleString()} cores
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

            {/* Custom Specifications */}
            {useCustom && (
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Stream Processors</label>
                  <input
                    type="number"
                    className="input-clean"
                    value={cores}
                    onChange={(e) => setCores(Number(e.target.value))}
                    placeholder="e.g., 3584"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Base Frequency (MHz)</label>
                  <input
                    type="number"
                    className="input-clean"
                    value={baseFreq}
                    onChange={(e) => setBaseFreq(Number(e.target.value))}
                    placeholder="e.g., 1481"
                  />
                </div>
              </div>
            )}

            {/* Custom Frequency */}
            <div className="form-group">
              <label className="form-label">
                Custom Frequency (MHz)
                <span className="text-xs text-gray-500 ml-2">
                  Override for overclocking scenarios
                </span>
              </label>
              <input
                type="number"
                className="input-clean"
                value={customFreq}
                onChange={(e) => setCustomFreq(Number(e.target.value))}
                placeholder="e.g., 1600"
              />
            </div>

            <button
              className="btn-clean w-full"
              onClick={handleCalculate}
              disabled={isCalculating}
            >
              {isCalculating ? (
                <>
                  <div className="loading-spinner"></div>
                  Calculating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Calculate Performance
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
              <Monitor className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Performance Results</h2>
              <p className="text-sm text-gray-500">Computational power analysis</p>
            </div>
          </div>

          {/* Main Result */}
          <div className="result-card-clean mb-6">
            <div className="result-main">{tflops.toFixed(2)}</div>
            <div className="result-label">FP32 TFLOPS</div>
            <div className={`result-badge ${performanceLevel.level === 'Extreme' ? 'success' : 
              performanceLevel.level === 'High' ? 'info' : 'warning'}`}>
              {performanceLevel.level} Performance
            </div>
          </div>

          {/* Performance Level */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Performance Level</span>
              <span className={`text-sm font-medium ${performanceLevel.color}`}>
                {performanceLevel.level}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((tflops / 30) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{performanceLevel.description}</p>
          </div>

          {/* Gaming Performance Estimates */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">Gaming Performance Estimate</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(gamingEstimates).map(([resolution, fps]) => (
                <div key={resolution} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{fps}</div>
                  <div className="text-xs text-gray-500">FPS</div>
                  <div className="text-xs font-medium text-gray-700">{resolution}</div>
                </div>
              ))}
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
                  <span className="text-gray-600">Formula:</span>
                  <span className="font-mono text-xs">cores × frequency × 2 (FMA)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stream Processors:</span>
                  <span>{cores.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency:</span>
                  <span>{customFreq} MHz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">FP16 TFLOPS:</span>
                  <span>{(tflops * 2).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GPUCalculator; 