import { useState } from 'react';
import { MemoryStick, Zap, Activity, Info, ChevronDown } from 'lucide-react';

interface MemorySpec {
  type: string;
  speed: number;
  busWidth: number;
  channels: number;
}

const memoryTypes: MemorySpec[] = [
  { type: 'DDR3-1600', speed: 1600, busWidth: 64, channels: 2 },
  { type: 'DDR3-1866', speed: 1866, busWidth: 64, channels: 2 },
  { type: 'DDR3-2133', speed: 2133, busWidth: 64, channels: 2 },
  { type: 'DDR4-2400', speed: 2400, busWidth: 64, channels: 2 },
  { type: 'DDR4-2666', speed: 2666, busWidth: 64, channels: 2 },
  { type: 'DDR4-3200', speed: 3200, busWidth: 64, channels: 2 },
  { type: 'DDR4-3600', speed: 3600, busWidth: 64, channels: 2 },
  { type: 'DDR5-4800', speed: 4800, busWidth: 64, channels: 2 },
  { type: 'DDR5-5600', speed: 5600, busWidth: 64, channels: 2 },
  { type: 'DDR5-6400', speed: 6400, busWidth: 64, channels: 2 },
];

function MemoryCalculator() {
  const [selectedMemory, setSelectedMemory] = useState<MemorySpec>(memoryTypes[5]);
  const [customMode, setCustomMode] = useState(false);
  const [customSpeed, setCustomSpeed] = useState(3200);
  const [customBusWidth, setCustomBusWidth] = useState(64);
  const [customChannels, setCustomChannels] = useState(2);
  const [isCalculating, setIsCalculating] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const calculateBandwidth = () => {
    const spec = customMode ? 
      { speed: customSpeed, busWidth: customBusWidth, channels: customChannels } : 
      selectedMemory;
    
    // Bandwidth = Memory Speed × Bus Width × Channels ÷ 8 (for GB/s)
    return (spec.speed * spec.busWidth * spec.channels) / 8 / 1000;
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
    }, 300);
  };

  const bandwidth = calculateBandwidth();
  
  const getPerformanceLevel = () => {
    if (bandwidth < 20) return { level: 'Basic', color: 'text-yellow-600', description: 'Entry-level performance' };
    if (bandwidth < 40) return { level: 'Good', color: 'text-blue-600', description: 'Mainstream performance' };
    if (bandwidth < 60) return { level: 'High', color: 'text-green-600', description: 'High-end performance' };
    return { level: 'Extreme', color: 'text-purple-600', description: 'Enthusiast-level performance' };
  };

  const performanceLevel = getPerformanceLevel();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Configuration Card */}
      <div className="card-clean animate-fade-in">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <MemoryStick className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Memory Configuration</h2>
              <p className="text-sm text-gray-500">Calculate DDR3/4/5 memory bandwidth</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Custom Memory Toggle */}
            <div className="form-group">
              <label className="toggle-clean">
                <input
                  type="checkbox"
                  checked={customMode}
                  onChange={(e) => setCustomMode(e.target.checked)}
                />
                <span className="toggle-slider"></span>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Use Custom Memory Specifications
                </span>
              </label>
            </div>

            {/* Memory Type Selection */}
            {!customMode && (
              <div className="form-group">
                <label className="form-label">Select Memory Type</label>
                <div className="dropdown-clean">
                  <button
                    className="dropdown-trigger"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedMemory.type.startsWith('DDR5') ? 'bg-purple-500' :
                        selectedMemory.type.startsWith('DDR4') ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      <span>{selectedMemory.type}</span>
                      <span className="text-xs text-gray-500">
                        {selectedMemory.speed} MHz • {selectedMemory.channels}ch
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="dropdown-menu">
                      {memoryTypes.map((memory) => (
                        <div
                          key={memory.type}
                          className="dropdown-item"
                          onClick={() => {
                            setSelectedMemory(memory);
                            setDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              memory.type.startsWith('DDR5') ? 'bg-purple-500' :
                              memory.type.startsWith('DDR4') ? 'bg-blue-500' : 'bg-green-500'
                            }`}></div>
                            <div>
                              <div className="text-sm font-medium">{memory.type}</div>
                              <div className="text-xs text-gray-500">
                                {memory.speed} MHz • {memory.channels} channels
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
            {customMode && (
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Memory Speed (MHz)</label>
                  <input
                    type="number"
                    className="input-clean"
                    value={customSpeed}
                    onChange={(e) => setCustomSpeed(Number(e.target.value))}
                    placeholder="e.g., 3200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Bus Width (bits)</label>
                    <input
                      type="number"
                      className="input-clean"
                      value={customBusWidth}
                      onChange={(e) => setCustomBusWidth(Number(e.target.value))}
                      placeholder="e.g., 64"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Channels</label>
                    <input
                      type="number"
                      className="input-clean"
                      value={customChannels}
                      onChange={(e) => setCustomChannels(Number(e.target.value))}
                      placeholder="e.g., 2"
                    />
                  </div>
                </div>
              </div>
            )}

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
                  Calculate Bandwidth
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
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Bandwidth Results</h2>
              <p className="text-sm text-gray-500">Memory throughput analysis</p>
            </div>
          </div>

          {/* Main Result */}
          <div className="result-card-clean mb-6">
            <div className="result-main">{bandwidth.toFixed(1)}</div>
            <div className="result-label">GB/s Bandwidth</div>
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
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((bandwidth / 80) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{performanceLevel.description}</p>
          </div>

          {/* Usage Scenarios */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-gray-600" />
              <span className="font-medium text-gray-900">Optimal Use Cases</span>
            </div>
            
            <div className="space-y-2">
              {bandwidth >= 60 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-sm font-medium text-green-800">Content Creation</div>
                  <div className="text-xs text-green-600">4K video editing, 3D rendering</div>
                </div>
              )}
              {bandwidth >= 40 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm font-medium text-blue-800">Gaming</div>
                  <div className="text-xs text-blue-600">High-end gaming, streaming</div>
                </div>
              )}
              {bandwidth >= 20 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-sm font-medium text-yellow-800">Productivity</div>
                  <div className="text-xs text-yellow-600">Office work, multitasking</div>
                </div>
              )}
              {bandwidth < 20 && (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-sm font-medium text-gray-800">Basic Tasks</div>
                  <div className="text-xs text-gray-600">Web browsing, light work</div>
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
                  <span className="text-gray-600">Formula:</span>
                  <span className="font-mono text-xs">speed × bus_width × channels ÷ 8000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory Speed:</span>
                  <span>{customMode ? customSpeed : selectedMemory.speed} MHz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bus Width:</span>
                  <span>{customMode ? customBusWidth : selectedMemory.busWidth} bits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Channels:</span>
                  <span>{customMode ? customChannels : selectedMemory.channels}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Theoretical Max:</span>
                  <span>{bandwidth.toFixed(1)} GB/s</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MemoryCalculator; 