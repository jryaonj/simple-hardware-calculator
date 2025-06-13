import { useState, useEffect } from 'react';
import { Info, Zap, MemoryStick, Gamepad2, ChevronDown } from 'lucide-react';
import { gpuDatabase } from '../data/gpuData';
import { calculateGPUPerformance } from '../utils/calculations';
import type { GPUSpec, GPUPerformanceResult } from '../types';

export default function GPUCalculator() {
  const [selectedGPU, setSelectedGPU] = useState<GPUSpec>(gpuDatabase[0]);
  const [customMode, setCustomMode] = useState(false);
  const [customGPU, setCustomGPU] = useState<GPUSpec>({
    name: 'Custom GPU',
    streamProcessors: 3584,
    baseFrequency: 1500,
    memoryBandwidth: 500,
    vramGB: 12,
    architecture: 'Custom',
    manufacturer: 'nvidia'
  });
  const [results, setResults] = useState<GPUPerformanceResult | null>(null);

  const currentGPU = customMode ? customGPU : selectedGPU;

  useEffect(() => {
    const result = calculateGPUPerformance(currentGPU);
    setResults(result);
  }, [currentGPU]);

  const getPerformanceLevel = (tflops: number) => {
    if (tflops < 1) return { level: 'Very Low', color: 'text-error', bg: 'bg-error/10' };
    if (tflops < 8) return { level: 'Basic', color: 'text-warning', bg: 'bg-warning/10' };
    if (tflops < 15) return { level: 'Good', color: 'text-info', bg: 'bg-info/10' };
    if (tflops < 25) return { level: 'High', color: 'text-success', bg: 'bg-success/10' };
    return { level: 'Extreme', color: 'text-primary', bg: 'bg-primary/10' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-2">
            <Zap className="w-6 h-6" />
            GPU FP32/16 Performance Calculator
          </h2>
          <p className="text-base-content/70">
            Calculate GPU TFLOPS performance based on specifications. 
            Formula: stream_processors × base_frequency × 2 (FMA operations) ÷ 1,000,000
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-4">GPU Configuration</h3>
            
            {/* Mode Toggle */}
            <div className="form-control mb-4">
              <label className="label cursor-pointer">
                <span className="label-text">Use Custom GPU Specifications</span>
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary" 
                  checked={customMode}
                  onChange={(e) => setCustomMode(e.target.checked)}
                />
              </label>
            </div>

            {!customMode ? (
              /* Predefined GPU Selection */
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Select GPU</span>
                </label>
                <div className="dropdown dropdown-bottom w-full">
                  <div tabIndex={0} role="button" className="btn btn-outline w-full justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        selectedGPU.manufacturer === 'nvidia' ? 'bg-green-500' : 
                        selectedGPU.manufacturer === 'amd' ? 'bg-red-500' : 'bg-blue-500'
                      }`}></div>
                      {selectedGPU.name}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-full max-h-60 overflow-y-auto">
                    {gpuDatabase.map((gpu) => (
                      <li key={gpu.name}>
                        <a onClick={() => setSelectedGPU(gpu)} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            gpu.manufacturer === 'nvidia' ? 'bg-green-500' : 
                            gpu.manufacturer === 'amd' ? 'bg-red-500' : 'bg-blue-500'
                          }`}></div>
                          <div>
                            <div className="font-medium">{gpu.name}</div>
                            <div className="text-xs opacity-70">{gpu.architecture}</div>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              /* Custom GPU Inputs */
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">GPU Name</span>
                  </label>
                  <input 
                    type="text" 
                    className="input input-bordered" 
                    value={customGPU.name}
                    onChange={(e) => setCustomGPU({...customGPU, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Stream Processors</span>
                    </label>
                    <input 
                      type="number" 
                      className="input input-bordered" 
                      value={customGPU.streamProcessors}
                      onChange={(e) => setCustomGPU({...customGPU, streamProcessors: parseInt(e.target.value) || 0})}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Base Frequency (MHz)</span>
                    </label>
                    <input 
                      type="number" 
                      className="input input-bordered" 
                      value={customGPU.baseFrequency}
                      onChange={(e) => setCustomGPU({...customGPU, baseFrequency: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Memory Bandwidth (GB/s)</span>
                    </label>
                    <input 
                      type="number" 
                      className="input input-bordered" 
                      value={customGPU.memoryBandwidth}
                      onChange={(e) => setCustomGPU({...customGPU, memoryBandwidth: parseInt(e.target.value) || 0})}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">VRAM (GB)</span>
                    </label>
                    <input 
                      type="number" 
                      className="input input-bordered" 
                      value={customGPU.vramGB}
                      onChange={(e) => setCustomGPU({...customGPU, vramGB: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* GPU Specs Display */}
            <div className="card bg-base-200 mt-4">
              <div className="card-body">
                <h4 className="font-semibold mb-2">Current GPU Specifications</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Stream Processors: <span className="font-medium">{currentGPU.streamProcessors.toLocaleString()}</span></div>
                  <div>Base Clock: <span className="font-medium">{currentGPU.baseFrequency} MHz</span></div>
                  <div>Memory BW: <span className="font-medium">{currentGPU.memoryBandwidth} GB/s</span></div>
                  <div>VRAM: <span className="font-medium">{currentGPU.vramGB} GB</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title mb-4">Performance Results</h3>
            
            {results && (
              <div className="space-y-4">
                {/* FP32 Performance */}
                <div className="card bg-gradient-to-r from-primary/10 to-primary/5">
                  <div className="card-body">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold">FP32 Performance</h4>
                    </div>
                    <div className="text-3xl font-bold text-primary mb-1">
                      {results.fp32TFLOPS} TFLOPS
                    </div>
                    <div className={`badge ${getPerformanceLevel(results.fp32TFLOPS).bg} ${getPerformanceLevel(results.fp32TFLOPS).color}`}>
                      {getPerformanceLevel(results.fp32TFLOPS).level}
                    </div>
                  </div>
                </div>

                {/* FP16 Performance */}
                <div className="card bg-gradient-to-r from-secondary/10 to-secondary/5">
                  <div className="card-body">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-secondary" />
                      <h4 className="font-semibold">FP16 Performance</h4>
                    </div>
                    <div className="text-3xl font-bold text-secondary mb-1">
                      {results.fp16TFLOPS} TFLOPS
                    </div>
                    <div className="text-sm text-base-content/70">
                      ~2x FP32 performance (theoretical)
                    </div>
                  </div>
                </div>

                {/* Memory Bandwidth */}
                <div className="card bg-gradient-to-r from-accent/10 to-accent/5">
                  <div className="card-body">
                    <div className="flex items-center gap-2 mb-2">
                      <MemoryStick className="w-5 h-5 text-accent" />
                      <h4 className="font-semibold">Memory Bandwidth</h4>
                    </div>
                    <div className="text-2xl font-bold text-accent">
                      {results.memoryBandwidthGBs} GB/s
                    </div>
                  </div>
                </div>

                {/* Gaming Performance Estimate */}
                <div className="card bg-gradient-to-r from-info/10 to-info/5">
                  <div className="card-body">
                    <div className="flex items-center gap-2 mb-2">
                      <Gamepad2 className="w-5 h-5 text-info" />
                      <h4 className="font-semibold">Gaming Score</h4>
                    </div>
                    <div className="text-2xl font-bold text-info mb-1">
                      {results.estimatedGamingScore}
                    </div>
                    <div className="text-xs text-base-content/70">
                      Estimated relative gaming performance
                    </div>
                  </div>
                </div>

                {/* Performance Guidelines */}
                <div className="alert alert-info">
                  <Info className="w-4 h-4" />
                  <div className="text-sm">
                    <div className="font-semibold mb-1">Performance Guidelines:</div>
                    <div>• At least 1 TFLOPS for modern applications</div>
                    <div>• At least 8 TFLOPS for fluent 1080p gaming</div>
                    <div>• 15+ TFLOPS for high-end 1440p/4K gaming</div>
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