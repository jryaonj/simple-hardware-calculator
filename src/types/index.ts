// GPU Performance Calculator Types
export interface GPUSpec {
  name: string;
  streamProcessors: number;
  baseFrequency: number; // MHz
  boostFrequency?: number; // MHz
  memoryBandwidth: number; // GB/s
  vramGB: number;
  architecture: string;
  manufacturer: 'nvidia' | 'amd' | 'intel';
}

export interface GPUPerformanceResult {
  fp32TFLOPS: number;
  fp16TFLOPS: number;
  memoryBandwidthGBs: number;
  estimatedGamingScore: number;
}

// Memory Bandwidth Calculator Types
export interface MemorySpec {
  type: 'DDR3' | 'DDR4' | 'DDR5';
  frequency: number; // MHz
  channels: number;
  bandwidth: number; // MT/s
}

// Fan Speed Calculator Types
export interface FanSpec {
  diameter: number; // mm
  thickness: number; // mm
  wings: number;
  maxRPM: number;
  currentRPM: number;
}

export interface FanResult {
  frequency: number; // Hz
  noiseLevel: 'quiet' | 'acceptable' | 'noisy';
  recommendations: string[];
}

// HDD Noise Calculator Types
export interface HDDSpec {
  capacity: number; // TB
  spinSpeed: number; // RPM
  acousticIdle: number; // dB(A)
  acousticSeek: number; // dB(A)
  quantity: number;
}

export interface HDDResult {
  frequency: number; // Hz
  totalNoiseLevel: number; // dB(A)
  effectiveLoudness: number; // sone
  recommendations: string[];
}

// Common Calculator Type
export type CalculatorType = 'gpu' | 'memory' | 'fan' | 'hdd'; 