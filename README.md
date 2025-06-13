# Simple Hardware Calculator

A comprehensive hardware performance calculator app built with React, TypeScript, and TailwindCSS. This application provides simple, easy-to-understand calculations for various hardware components with clear formulas and results.

## Features

### 🎮 GPU Performance Calculator
- **FP32/FP16 TFLOPS calculation** based on stream processors and frequency
- **Gaming performance estimation** with performance level indicators
- **Memory bandwidth analysis**
- **Custom GPU specifications** support
- Formula: `stream_processors × base_frequency × 2 (FMA operations) ÷ 1,000,000`

### 💾 Memory Bandwidth Calculator
- **DDR3/DDR4/DDR5 support** with common frequency presets
- **Multi-channel configurations** (1, 2, 4, 8, 12 channels)
- **Real-time bandwidth calculation** in MT/s and GB/s
- Formula: `frequency × 64 bits × channels ÷ 8 bits per byte`

### 🌀 Fan Speed & Noise Calculator
- **Noise frequency calculation** from RPM and wing count
- **Optimal RPM recommendations** for acceptable noise levels
- **Fan size and thickness considerations**
- **Real-time noise level assessment** (Quiet/Acceptable/Noisy)
- Formula: `(RPM ÷ 60) × number_of_wings = frequency (Hz)`

### 💿 HDD Noise Estimation Calculator
- **Acoustic analysis** based on real HDD specifications
- **Multiple drive configurations** with combined noise calculation
- **Equal-loudness contour adjustments** for different frequencies
- **Preset configurations** from real Seagate drive specifications
- **Effective loudness calculation** in sone units

## Technology Stack

- **React 19** with TypeScript for type safety
- **Vite** for fast development and building
- **TailwindCSS** for utility-first styling
- **DaisyUI** for beautiful, accessible components
- **Lucide React** for consistent iconography

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Hardware Examples

### GPU Performance Examples
- **GTX 1080 Ti**: 10.60 TFLOPS FP32
- **RTX 3090**: 29.28 TFLOPS FP32  
- **RX 7900 XTX**: 23.34 TFLOPS FP32

### Memory Bandwidth Examples
- **Dual DDR4-2666**: 42,656 MT/s
- **Dual DDR5-5600**: 89,600 MT/s
- **Octa DDR4-3200**: 204,800 MT/s

### Fan Noise Guidelines
- **< 50 Hz**: Excellent for quiet operation
- **50-65 Hz**: Good balance of cooling and noise
- **> 65 Hz**: May be audibly noticeable

### HDD Acoustic Levels
- **4TB 5400RPM**: 1.0 sone (baseline)
- **8TB 7200RPM**: 2.3 sone (+1.3 sone)
- **Multiple drives**: Logarithmic noise addition

## Formulas Used

All calculations are based on well-established hardware formulas:

1. **GPU TFLOPS**: `(cores × frequency × 2) ÷ 1,000,000`
2. **Memory Bandwidth**: `(frequency × 64 × channels) ÷ 8`
3. **Fan Frequency**: `(RPM ÷ 60) × wings`
4. **HDD Frequency**: `RPM ÷ 60`

## Contributing

This project welcomes contributions! Feel free to:
- Add more GPU models to the database
- Improve calculation accuracy
- Add new calculator types
- Enhance the UI/UX

## License

MIT License - feel free to use this project for educational purposes or as a reference for your own hardware calculations.

---

*Made with ❤️ for hardware enthusiasts who want to understand their systems better.*