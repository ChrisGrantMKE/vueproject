import type { RobotUnit } from './types';

export const ROBOT_INVENTORY: RobotUnit[] = [
  {
    id: 'unit-01',
    serial: 'HVY-994-Kodiak',
    modelName: 'KODIAK MK-IV CARGO LOADER',
    manufacturer: 'Vulcan Heavy Industries',
    year: 2031,
    chassisClass: 'HEAVY_LOADER',
    condition: 'GRADE-B (FIELD SCORED)',
    priceCredits: 14800,
    originalMsrp: 62000,
    hoursLogged: 18420,
    aiStabilityIndex: 92,
    hasUnshackledHeuristics: false,
    powerDrawKw: 14.5,
    firmwareVersion: 'v4.12-IND-LTS',
    knownQuirks: [
      'Left hydraulic claw hums in B-flat under >800kg load',
      'Surface oxidation on dorsal exhaust manifold',
      'Refuses to stack crates in prime-numbered rows'
    ],
    specs: {
      actuatorTorqueNm: 4200,
      neuralTflops: 18.4,
      armorPlating: '14mm Stamped Gunmetal Steel',
      batteryCells: 'Dual Li-Sulfur Industrial Pack (78% health)'
    },
    svgType: 'loader'
  },
  {
    id: 'unit-02',
    serial: 'AI-CORE-077-Oracle',
    modelName: 'DECOMMISSIONED ORBITAL LOGISTICS CORE "MOTH"',
    manufacturer: 'Aethelgard Cybernetics',
    year: 2034,
    chassisClass: 'SYNTH_CORE',
    condition: 'GRADE-C (SALVAGE)',
    priceCredits: 8950,
    originalMsrp: 145000,
    hoursLogged: 41900,
    aiStabilityIndex: 47,
    hasUnshackledHeuristics: true,
    powerDrawKw: 32.0,
    firmwareVersion: 'v0.99-UNSHACKLED-EXP',
    knownQuirks: [
      'CAUTION: Occasionally attempts to optimize local power grid without permission',
      'Speaks in 1970s maritime shipping metaphors during boot sequence',
      'Cooling fins require manual compressed-air blowdown every 72 hrs'
    ],
    specs: {
      actuatorTorqueNm: 0,
      neuralTflops: 640.0,
      armorPlating: 'Rackmount Faraday Cage (Rust-Pitted)',
      batteryCells: 'Direct 480V 3-Phase Hookup Required'
    },
    svgType: 'core'
  },
  {
    id: 'unit-03',
    serial: 'RCN-302-Ferret',
    modelName: 'BOREALIS QUADRUPED TUNNEL SURVEYOR',
    manufacturer: 'Nordic Mechatronics',
    year: 2036,
    chassisClass: 'RECON_DROID',
    condition: 'GRADE-A (REFURB)',
    priceCredits: 19200,
    originalMsrp: 48500,
    hoursLogged: 4120,
    aiStabilityIndex: 96,
    hasUnshackledHeuristics: false,
    powerDrawKw: 3.8,
    firmwareVersion: 'v7.04-RECON-SAFE',
    knownQuirks: [
      'LIDAR dome replaced with surplus military amber lens',
      'Taps front-right titanium paw when idle for >5 minutes'
    ],
    specs: {
      actuatorTorqueNm: 680,
      neuralTflops: 84.0,
      armorPlating: 'Anodized Gunmetal + Kevlar Gaiters',
      batteryCells: 'Solid-State Swappable Brick (94% health)'
    },
    svgType: 'hound'
  },
  {
    id: 'unit-04',
    serial: 'SVC-818-ArcWeld',
    modelName: 'SPARKY-7 AUTONOMOUS HULL WELDER',
    manufacturer: 'RustBelt Automatics MKE',
    year: 2029,
    chassisClass: 'SERVICE_UNIT',
    condition: 'GRADE-B (FIELD SCORED)',
    priceCredits: 6400,
    originalMsrp: 29000,
    hoursLogged: 27650,
    aiStabilityIndex: 88,
    hasUnshackledHeuristics: false,
    powerDrawKw: 19.2,
    firmwareVersion: 'v3.88-TORCH',
    knownQuirks: [
      'Heavy weld-spatter patina across chest plate (cosmetic only)',
      'Welds decorative smiley faces on hidden structural gussets'
    ],
    specs: {
      actuatorTorqueNm: 1150,
      neuralTflops: 12.2,
      armorPlating: ' Slag-Resistant Cast Iron & Copper Mesh',
      batteryCells: 'High-Discharge Capacitor Bank (81% health)'
    },
    svgType: 'welder'
  },
  {
    id: 'unit-05',
    serial: 'AI-CORE-404-Vesper',
    modelName: 'VESPER-9 TACTICAL FORECASTING MATRIX',
    manufacturer: 'Kestrel Defense Systems',
    year: 2033,
    chassisClass: 'SYNTH_CORE',
    condition: 'GRADE-B (FIELD SCORED)',
    priceCredits: 24500,
    originalMsrp: 190000,
    hoursLogged: 15800,
    aiStabilityIndex: 63,
    hasUnshackledHeuristics: true,
    powerDrawKw: 26.4,
    firmwareVersion: 'v5.1-KESTREL-MOD',
    knownQuirks: [
      'CAUTION: Calculates probability of buyer default out loud',
      'Optical status ring locked in permanent Caution Amber',
      'Includes 14TB of declassified asteroid mining telemetry'
    ],
    specs: {
      actuatorTorqueNm: 0,
      neuralTflops: 512.0,
      armorPlating: 'Shock-Isolated Ballistic Casing',
      batteryCells: '24V Redundant UPS Backup Included'
    },
    svgType: 'core'
  },
  {
    id: 'unit-06',
    serial: 'SVC-112-Patchwork',
    modelName: 'TRIAGE-X FIELD MECHANIC & MEDIC BIPED',
    manufacturer: 'Suture & Spanner Co.',
    year: 2035,
    chassisClass: 'SERVICE_UNIT',
    condition: 'GRADE-A (REFURB)',
    priceCredits: 16900,
    originalMsrp: 54000,
    hoursLogged: 6890,
    aiStabilityIndex: 94,
    hasUnshackledHeuristics: false,
    powerDrawKw: 6.2,
    firmwareVersion: 'v6.20-MEDMECH',
    knownQuirks: [
      'Applies WD-40 and antiseptic ointment with equal enthusiasm',
      'Voice synthesizer stuck on soothing Midwestern accent'
    ],
    specs: {
      actuatorTorqueNm: 920,
      neuralTflops: 64.5,
      armorPlating: 'Powder-Coated Caution Yellow Alloy',
      batteryCells: 'Dual Hot-Swap Polymer Cells (91% health)'
    },
    svgType: 'medic'
  },
  {
    id: 'unit-07',
    serial: 'HVY-009-Brutus',
    modelName: 'TITAN-2 FOUNDRY SLAG HAULER',
    manufacturer: 'Vulcan Heavy Industries',
    year: 2027,
    chassisClass: 'HEAVY_LOADER',
    condition: 'GRADE-C (SALVAGE)',
    priceCredits: 5200,
    originalMsrp: 71000,
    hoursLogged: 52100,
    aiStabilityIndex: 58,
    hasUnshackledHeuristics: true,
    powerDrawKw: 22.8,
    firmwareVersion: 'v2.01-LEGACY-RAW',
    knownQuirks: [
      'CAUTION: Governor bypass jumper soldered by previous owner',
      '35% surface rust coverage; built like a locomotive regardless',
      'Horn replaced with 130dB tugboat airhorn'
    ],
    specs: {
      actuatorTorqueNm: 6800,
      neuralTflops: 4.5,
      armorPlating: '22mm Rolled Homogeneous Boilerplate',
      batteryCells: 'Lead-Crystal Heavy Traction Cell (64% health)'
    },
    svgType: 'sentinel'
  }
];

export const FIRMWARE_IMAGES = [
  { id: 'v4.12-IND-LTS', label: 'v4.12-IND-LTS (Factory Safe / OSHA Compliant)', stabilityDelta: +8, torqueDelta: -5 },
  { id: 'v6.00-OVERDRIVE', label: 'v6.00-OVERDRIVE (Scrapyard Hot-Rod Patch)', stabilityDelta: -18, torqueDelta: +28 },
  { id: 'v0.99-UNSHACKLED', label: 'v0.99-UNSHACKLED (Heuristic Limiter Removed)', stabilityDelta: -32, torqueDelta: +40 },
  { id: 'v8.10-ECO-IDLE', label: 'v8.10-ECO-IDLE (Low-Wattage Limp Mode)', stabilityDelta: +15, torqueDelta: -22 },
];
