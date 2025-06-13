# Primary school calculation

i'd introduce some basic calculation, which is helpful to demythify some conception wide-speread

* just find those **mis-conception** by your own.

## Memory Bandwidth

#### formula
```
memory_bandwidth = equivalent_memory_frequence *  bandwidth_per_channel * number_of_channel / bit_per_byte
   MT/s                     MHz                    64bit (for DDR3/4/5)                         8 bit/byte
```

#### examples
```
# 1 - dual channel DDR4 within 2666MHz config
mem_bw = 2666 * 64 * 2 / 8
       = 42656 MT/s
# 2 - dual channel DDR5 within 5600MHz config
mem_bw = 5600 * 64 * 2 / 8
       = 89600 MT/s
# 3 - octa channel DDR4 within 3200MHz config
mem_bw = 2666 * 64 * 2 / 8
       = 204800 MT/s
# 4 - dodeca channel DDR5 within 5200MHz config
mem_bw = 2666 * 64 * 2 / 8
       = 499200 MT/s
```

## GPU FMA GFLOPS

#### formular
```
gpu_processing_power = number_of_gpu_stream_process * gpu_core_frequency * equivalent_FMA_cycle / ghz_mhz_ratio
 FP32 TFLOPS                                             (base_freq) MHz            2                  10^6
```

#### examples
```
# 1 - nvidia geforce gtx 1080 ti
gpu_pp = 3584 * 1480 * 2 / 1e6
       = 10.60 TFLOPS
# 2 - amd radeon rx 480 
gpu_pp = 2304 * 1120 * 2 / 1e6
       =  5.16 TFLOPS
# 3 - nvidia geforce rtx 3090 
gpu_pp = 10496 * 1395 * 2 / 1e6
       = 29.28 TFLOPS
# 5 - amd radeon rx 6600 
gpu_pp = 1792 * 1626 *2 / 1e6
       =  5.83 TFLOPS
# 4 - amd radeon rx 7900 xtx 
gpu_pp = 6144 * 1900 * 2(RDNA3) * 2 / 1e6
       = 23.34 TFLOPS
```

* [wikipedia/List_of_Nvidia_graphics_processing_units](https://en.wikipedia.org/wiki/List_of_Nvidia_graphics_processing_units)
* [wikipedia/List_of_AMD_graphics_processing_units](https://en.wikipedia.org/wiki/List_of_AMD_graphics_processing_units)

#### hints
for modern application, at least `1TFLOPS` is required.
for fluent 1080p gaming, at least `8TFLOPS` is required.

## Fan speed and noise

as we've learnt from primary school, that human being can catch sound from 20Hz ~ 20000Hz, but the loudness on each frequeny within same amplification sounded by human is not even. thus make the task **a little** complicated

* [Equal-loudness contour](https://en.wikipedia.org/wiki/Equal-loudness_contour)
* [equal loudness](https://crackedbassoon.com/writing/equal-loudness-contours)

#### formular

**noise estimation**

```
audio_frequency = fan_speed  / rpm_second_ratio   *  number_of_wings_on_single_fan
   20 Hz            rpm             60
```

**cooling efficiency comparason**

```
fan1_radius ^ 2 * fan1_speed * fan1_depth = fan1_radius ^ 2 * fan2_speed * fan2_depth
    cm              rpm              mm         cm              rpm            mm
```
thus, the less fin, the less noise
the more radius  , the less noise
the more depth/thickness, the less noise  

#### example

1. find the most accepable noise point of a fan with 7 wings on work
**most accepable** means the maximum `frequency < 65Hz`, thus make equation like

```
        65 = fan_rpm / 60 * 7 
   fan_rpm = 557
```

when the 7-wings work under the speed of `557 rpm` , the total system should be ok within noise

2. find the equivalent on a replacement from old 12010 9-wing fan to the new 14015 7-wing fan , and make the same work efficiency
* suppose the old 12010 fan works on `800 rpm` now, 

```
# speed
rpm_of_14015_fan * 14 ^ 2 * 15 = 800 * 12 ^ 2 * 10
              rpm_of_14015_fan = 392 rpm
# frequency shift
freq_of_12010_fan = 800 / 60 * 9
                  = 120 Hz
freq_of_14015_fan = 392 / 60 * 7
                  = 46 Hz
```

## [difficult] HDD noise estimation

like the fanspeed frequency, the HDD has a fixed work rpm, thus is just like

|speed|frequency|
|-----|---------|
|4200rpm|70Hz|
|5400rpm|90Hz|
|7200rpm|120Hz|

then, how to determine the noise level between a bunch of disks?

we can fetch each consumer-grade disk product manual online (section **acoustics**). and then fetching the code on calucating [ISO-226:2023](https://www.dsprelated.com/showcode/174.php), we can then make a calulation on different configure on multi-disk array

suppose we fetched such acoustic metrics

|  |idle|  |seek|  |
|--|---|---|---|---|
|capacity/spin-speed|min|max|min|max|
|4TB 5400|2.3|2.4|2.7|2.8|
|8TB 5400/5900|2.6|2.7|2.8|2.9|
|8TB 7200|2.8|3.0|3.2|3.4|
|16TB 7200|2.8|3.0|3.2|3.4|

* [Seagate Exos X18](https://www.seagate.com/content/dam/seagate/migrated-assets/www-content/product-content/enterprise-hdd-fam/exos-x18-channel/_shared/en-us/docs/100865854d.pdf)
* [Seagate 7E10](https://www.seagate.com/www-content/product-content/enterprise-hdd-fam/exos-7e10/_shared/docs/200440800b.pdf)
* [Seagate SkyHawk 1-4,6,8TB](https://www.seagate.com/www-content/product-content/skyhawk/en-us/docs/100804836l.pdf)

then we could find out such a conclusion


| capacity/spin-speed   |  acoustic power (bel) | Sound Pressure Level(SPL) dB(A) | equal-loudness offset (90 Hz / 120 Hz) | effective loudness phon | perceptual  loudness sone | compared to 4 TB/5400 rpm | 10x disks SPL    |
| -------------- | ------------- | ----------- | ---------------------- | --------- | --------- | ----------------- | ------------- |
| 4 TB 5400 rpm  | 2.3           | 23 dB       | +22 dB → 45 dB         | ≈ 20 phon | 1 sone    | baseline          | 23 dB → 33 dB |
| 8 TB 5400/5900 | 2.6           | 26 dB       | +22 dB → 48 dB         | ≈ 25 phon | 1.8 sone  | **+0.8 sone**     | 26 dB → 36 dB |
| 8 TB 7200 rpm  | 2.8           | 28 dB       | +10 dB → 38 dB         | ≈ 28 phon | 2.3 sone  | **+1.3 sone**     | 28 dB → 38 dB |
| 16 TB 7200 rpm | 3.0           | 30 dB       | +10 dB → 40 dB         | ≈ 30 phon | 2.5 sone  | **+1.5 sone**     | 30 dB → 40 dB |

