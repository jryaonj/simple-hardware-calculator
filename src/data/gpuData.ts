import type { GPUSpec } from '../types';

export const gpuDatabase: GPUSpec[] = [
  // NVIDIA GPUs
  {
    name: 'GeForce GTX 1080 Ti',
    streamProcessors: 3584,
    baseFrequency: 1480,
    boostFrequency: 1582,
    memoryBandwidth: 484,
    vramGB: 11,
    architecture: 'Pascal',
    manufacturer: 'nvidia'
  },
  {
    name: 'GeForce RTX 3090',
    streamProcessors: 10496,
    baseFrequency: 1395,
    boostFrequency: 1695,
    memoryBandwidth: 936,
    vramGB: 24,
    architecture: 'Ampere',
    manufacturer: 'nvidia'
  },
  {
    name: 'GeForce RTX 4090',
    streamProcessors: 16384,
    baseFrequency: 2230,
    boostFrequency: 2520,
    memoryBandwidth: 1008,
    vramGB: 24,
    architecture: 'Ada Lovelace',
    manufacturer: 'nvidia'
  },
  // AMD GPUs
  {
    name: 'Radeon RX 480',
    streamProcessors: 2304,
    baseFrequency: 1120,
    boostFrequency: 1266,
    memoryBandwidth: 256,
    vramGB: 8,
    architecture: 'Polaris',
    manufacturer: 'amd'
  },
  {
    name: 'Radeon RX 6600',
    streamProcessors: 1792,
    baseFrequency: 1626,
    boostFrequency: 2491,
    memoryBandwidth: 224,
    vramGB: 8,
    architecture: 'RDNA 2',
    manufacturer: 'amd'
  },
  {
    name: 'Radeon RX 7900 XTX',
    streamProcessors: 6144,
    baseFrequency: 1900,
    boostFrequency: 2500,
    memoryBandwidth: 960,
    vramGB: 24,
    architecture: 'RDNA 3',
    manufacturer: 'amd'
  }
]; 