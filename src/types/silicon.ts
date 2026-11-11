export type PlatformSegment = 
  | 'mobile_soc'
  | 'handheld_apu'
  | 'laptop_client'
  | 'desktop_cpu'
  | 'discrete_gpu'
  | 'datacenter_ai';

export type VerificationStage = 
  | 'early_rumor'
  | 'patent_or_driver'
  | 'es_sample_hit'
  | 'announced'
  | 'retail_verified';

export interface FoundryNode {
  id: string;
  slug: string;
  foundryName: string;
  nodeName: string;
  transistorArch: string;
  densityMtrMm2: number;
  powerDelta: string;
  status: 'rd' | 'risk_production' | 'production';
  hvmYear: number;
}

export interface Microarchitecture {
  id: string;
  slug: string;
  name: string;
  designer: string;
  isa: string;
  foundryNodeId?: string;
  ipcGainClaim: string;
  keyInnovations: string[];
}

export interface ChipTopology {
  clusterType: string;
  coreCount: number;
  microarchName: string;
  baseClockGhz: number;
  boostClockGhz: number;
  l2CacheMb: number;
  l3CacheMb: number;
  slcCacheMb?: number;
}

export interface MemorySpec {
  memoryType: string;
  busWidthBits: number;
  bandwidthGbS: number;
  maxCapacityGb?: number;
}

export interface BenchmarkScore {
  category: string;
  name: string;
  singleScore: number;
  multiScore?: number;
  powerWattage?: number;
  sampleType: 'early_leak' | 'engineering_sample' | 'retail_tested';
  testDevice: string;
}

export interface LeakDeltaRecord {
  id: string;
  sourceName: string;
  sourceChannel: 'Weibo' | 'X / Twitter' | 'Chiphell' | 'EEC Manifest';
  predictedMetric: string;
  predictedValue: string;
  actualConfirmedValue?: string;
  deltaPercentage?: number;
  confidenceScore: number;
  recordedAt: string;
  accuracyVerdict: 'accurate' | 'in_margin' | 'debunked' | 'pending';
}

export interface Chip {
  id: string;
  slug: string;
  marketingName: string;
  codename: string;
  vendor: string;
  segment: PlatformSegment;
  foundryNodeId: string;
  primaryMicroarchId?: string;
  packagingTech: string;
  dieSizeMm2?: number;
  transistorCountBillion?: number;
  tdpMinW: number;
  tdpMaxW: number;
  verificationStage: VerificationStage;
  specConfidenceScore: number; // 0 to 100
  expectedLaunchQuarter: string;
  releaseDate?: string;
  topologies: ChipTopology[];
  memory: MemorySpec;
  benchmarks: BenchmarkScore[];
  leakDeltas?: LeakDeltaRecord[];
}
