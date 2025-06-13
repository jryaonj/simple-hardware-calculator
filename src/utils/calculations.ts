import type { GPUSpec, GPUPerformanceResult, MemorySpec, FanSpec, FanResult, HDDSpec, HDDResult } from '../types';

// GPU FMA GFLOPS calculation
export function calculateGPUPerformance(gpu: GPUSpec): GPUPerformanceResult {
  // Formula: gpu_processing_power = number_of_gpu_stream_process * gpu_core_frequency * equivalent_FMA_cycle / ghz_mhz_ratio
  
  // FP32 TFLOPS using base frequency
  const fp32TFLOPS = (gpu.streamProcessors * gpu.baseFrequency * 2) / 1e6;
  
  // FP16 TFLOPS (roughly 2x performance for modern GPUs)
  const fp16TFLOPS = fp32TFLOPS * 2;
  
  // Estimated gaming score (simplified heuristic)
  const estimatedGamingScore = fp32TFLOPS * 10; // Rough scoring
  
  return {
    fp32TFLOPS: Math.round(fp32TFLOPS * 100) / 100,
    fp16TFLOPS: Math.round(fp16TFLOPS * 100) / 100,
    memoryBandwidthGBs: gpu.memoryBandwidth,
    estimatedGamingScore: Math.round(estimatedGamingScore)
  };
}

// Memory Bandwidth calculation
export function calculateMemoryBandwidth(spec: MemorySpec): number {
  // Formula: memory_bandwidth = equivalent_memory_frequence * bandwidth_per_channel * number_of_channel / bit_per_byte
  const bandwidthPerChannel = 64; // bits for DDR3/4/5
  const bitPerByte = 8;
  
  return (spec.frequency * bandwidthPerChannel * spec.channels) / bitPerByte;
}

// Fan speed and noise calculation
export function calculateFanNoise(fan: FanSpec): FanResult {
  // Formula: audio_frequency = fan_speed / rpm_second_ratio * number_of_wings_on_single_fan
  const frequency = (fan.currentRPM / 60) * fan.wings;
  
  let noiseLevel: 'quiet' | 'acceptable' | 'noisy';
  const recommendations: string[] = [];
  
  if (frequency < 50) {
    noiseLevel = 'quiet';
    recommendations.push('Excellent for quiet operation');
  } else if (frequency < 65) {
    noiseLevel = 'acceptable';
    recommendations.push('Good balance of cooling and noise');
  } else {
    noiseLevel = 'noisy';
    recommendations.push('Consider reducing fan speed');
    recommendations.push('Or upgrade to larger/thicker fan');
  }
  
  // Additional recommendations based on fan specs
  if (fan.diameter < 120) {
    recommendations.push('Larger diameter fans run quieter at same airflow');
  }
  
  if (fan.thickness < 25) {
    recommendations.push('Thicker fans provide better airflow at lower RPM');
  }
  
  return {
    frequency: Math.round(frequency * 10) / 10,
    noiseLevel,
    recommendations
  };
}

// HDD noise estimation
export function calculateHDDNoise(hdd: HDDSpec): HDDResult {
  // Calculate frequency from spin speed
  const frequency = hdd.spinSpeed / 60;
  
  // Use idle noise level as baseline
  const singleDiscNoise = hdd.acousticIdle;
  
  // For multiple disks, noise adds up (not linearly due to logarithmic nature of dB)
  // Rough approximation: every doubling adds ~3dB
  const totalNoiseLevel = singleDiscNoise + (10 * Math.log10(hdd.quantity));
  
  // Convert to effective loudness (simplified)
  // Equal-loudness contour adjustment for different frequencies
  let frequencyOffset = 0;
  if (frequency < 100) { // ~5400 RPM and below
    frequencyOffset = 22; // More noticeable at low frequencies
  } else { // 7200 RPM and above
    frequencyOffset = 10; // Less noticeable at higher frequencies
  }
  
  const adjustedLoudness = totalNoiseLevel + frequencyOffset;
  const effectiveLoudness = Math.pow(2, (adjustedLoudness - 40) / 10); // Rough sone conversion
  
  const recommendations: string[] = [];
  
  if (effectiveLoudness > 3) {
    recommendations.push('Consider lower RPM drives (5400 RPM vs 7200 RPM)');
    recommendations.push('Add sound dampening to case');
  }
  
  if (hdd.quantity > 4) {
    recommendations.push('Consider spreading drives across multiple systems');
    recommendations.push('Use vibration dampening mounts');
  }
  
  if (frequency > 100) {
    recommendations.push('7200 RPM drives are audibly louder than 5400 RPM');
  }
  
  return {
    frequency: Math.round(frequency * 10) / 10,
    totalNoiseLevel: Math.round(totalNoiseLevel * 10) / 10,
    effectiveLoudness: Math.round(effectiveLoudness * 10) / 10,
    recommendations
  };
}

// Utility function to get optimal fan RPM for acceptable noise
export function getOptimalFanRPM(wings: number, maxAcceptableFreq: number = 65): number {
  // Formula: fan_rpm = max_frequency * 60 / wings
  return Math.floor((maxAcceptableFreq * 60) / wings);
}

// Utility function to compare fan replacement efficiency
export function compareFanEfficiency(oldFan: FanSpec, newFan: FanSpec, targetRPM: number): {
  newFanRPM: number;
  oldFrequency: number;
  newFrequency: number;
  efficiencyImprovement: string;
} {
  // Formula: fan1_radius^2 * fan1_speed * fan1_depth = fan2_radius^2 * fan2_speed * fan2_depth
  const oldRadius = oldFan.diameter / 2;
  const newRadius = newFan.diameter / 2;
  
  const newFanRPM = Math.round(
    (targetRPM * Math.pow(oldRadius, 2) * oldFan.thickness) / 
    (Math.pow(newRadius, 2) * newFan.thickness)
  );
  
  const oldFrequency = (targetRPM / 60) * oldFan.wings;
  const newFrequency = (newFanRPM / 60) * newFan.wings;
  
  const improvement = ((oldFrequency - newFrequency) / oldFrequency * 100);
  
  return {
    newFanRPM,
    oldFrequency: Math.round(oldFrequency * 10) / 10,
    newFrequency: Math.round(newFrequency * 10) / 10,
    efficiencyImprovement: improvement > 0 ? 
      `${Math.round(improvement)}% quieter` : 
      `${Math.round(Math.abs(improvement))}% louder`
  };
} 