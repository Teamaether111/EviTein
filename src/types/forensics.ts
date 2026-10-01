export type VendorId = 'HIKVISION' | 'DAHUA' | 'CP_PLUS' | 'HONEYWELL' | 'TP_LINK' | 'UNIVIEW' | 'MATRIX';

export interface VendorAdapterInfo {
  id: VendorId;
  name: string;
  filesystem: string;
  containerFormat: string;
  codecSupport: string[];
  signatureHeader: string;
  defaultPort: number;
  parserConfidence: number;
  notes: string;
}

export interface CameraChannel {
  id: string; // e.g., 'CH-01'
  name: string; // e.g., 'Main Entrance'
  location: string;
  status: 'Active' | 'Intermittent' | 'Offline';
  resolution: string;
  fps: number;
  codec: string;
  ipAddress: string;
  activeRecordingsCount: number;
}

export interface FrameMetadata {
  frameNumber: number;
  pts: string; // presentation timestamp
  dts: string;
  frameType: 'I-Frame (Key)' | 'P-Frame' | 'B-Frame';
  bitrateKbps: number;
  quantizationParam: number;
  byteOffset: string;
  sliceHash: string;
}

export interface VideoRecording {
  id: string; // e.g., 'REC-CH04-019'
  cameraId: string;
  cameraName: string;
  startTime: string; // e.g., '2026-09-28 21:00:00'
  endTime: string; // e.g., '2026-09-28 21:30:00'
  normalizedStartTime: string;
  normalizedEndTime: string;
  durationSeconds: number;
  durationFormatted: string;
  fileSizeMb: number;
  format: 'DAV' | 'MP4' | 'DHFS' | 'HIK-RAW' | 'Fragment Stream';
  codec: 'H.264 High' | 'H.265 Main' | 'MPEG-4' | 'H.264 Baseline' | string;
  resolution: string;
  fps: number;
  status: 'Active' | 'Recovered' | 'Fragmented' | 'Corrupted';
  md5: string;
  sha256: string;
  storageRegion: string;
  startOffsetHex: string;
  endOffsetHex: string;
  recoveryConfidence?: number;
  recoveredFromFragmentId?: string;
  isBookmarked?: boolean;
  notesCount?: number;
  framesCount: number;
  thumbnailColor: string; // for canvas rendering simulation
}

export interface StorageSector {
  id: string;
  blockNumber: number;
  offsetHex: string;
  sizeKb: number;
  status: 'ACTIVE' | 'DELETED' | 'RECOVERABLE' | 'FRAGMENTED' | 'OVERWRITTEN' | 'UNKNOWN';
  cameraId?: string;
  recordingId?: string;
  fragmentId?: string;
  clusterAllocated: boolean;
  hexSample: string;
  asciiSample: string;
  entropy: number;
  notes?: string;
}

export interface RecoveryFragment {
  id: string; // e.g. 'FRAG-00382'
  storageOffsetHex: string;
  estimatedTimestamp: string;
  normalizedTimestamp: string;
  cameraId: string;
  cameraName: string;
  sizeMb: number;
  codec: string;
  resolution: string;
  status: 'Recoverable' | 'Deleted' | 'Fragmented' | 'Overwritten' | 'Reconstructed';
  recoveryConfidence: number;
  sourceRegion: string;
  nalUnitCount: number;
  hasSPS_PPS: boolean;
  associatedRecordingId?: string;
  notes: string;
}

export interface AIFinding {
  id: string;
  type: 'Vehicle Detection' | 'Person Detected' | 'License Plate' | 'Loitering Alert' | 'Perimeter Breach' | 'Motion Anomaly';
  cameraId: string;
  cameraName: string;
  timestamp: string;
  normalizedTimestamp: string;
  frameNumber: number;
  confidence: number;
  recordingId: string;
  evidenceId: string;
  model: string;
  boundingBox: { x: number; y: number; width: number; height: number };
  details: string;
  verifiedByAnalyst: boolean;
  addedToReport: boolean;
  sourceFragmentId?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  normalizedTimestamp: string;
  cameraId: string;
  cameraName: string;
  title: string;
  description: string;
  category: 'VEHICLE' | 'PERSON' | 'SYSTEM' | 'RECOVERED' | 'ALARM' | 'ANOMALY';
  recordingId: string;
  frameNumber?: number;
  confidence?: number;
  isCorrelated: boolean;
  sequenceOrder: number;
}

export interface CustodyRecord {
  id: string;
  timestamp: string;
  action: string;
  person: string;
  role: string;
  organization: string;
  evidenceId: string;
  hash: string;
  location: string;
  status: 'Verified' | 'Pending' | 'Flagged';
  notes: string;
}

export interface EvidenceBookmark {
  id: string;
  cameraId: string;
  timestamp: string;
  normalizedTimestamp: string;
  recordingId: string;
  frameNumber: number;
  title: string;
  description: string;
  createdTime: string;
  analyst: string;
  status: 'Verified' | 'Flagged';
}

export interface CaseNote {
  id: string;
  analyst: string;
  createdTime: string;
  evidenceRef: string;
  recordingId?: string;
  timestamp: string;
  observation: string;
  importance: 'Standard' | 'Critical' | 'Exhibitory';
}

export interface CaseInfo {
  id: string;
  title: string;
  investigator: string;
  organization: string;
  incidentDate: string;
  location: string;
  description: string;
  status: 'Active Investigation' | 'Forensic Analysis' | 'Report Prepared' | 'Archived';
  createdDate: string;
  courtCaseRef?: string;
}

export interface DeviceInfo {
  manufacturer: string;
  vendorId: VendorId;
  deviceType: 'NVR' | 'DVR' | 'Hybrid DVR' | 'IP Camera';
  model: string;
  firmware: string;
  serialNumber: string;
  totalChannels: number;
  activeCameras: number;
  storageCapacityTb: number;
  filesystem: string;
  supportedCodecs: string;
  deviceTimezone: string;
  clockOffsetSeconds: number; // e.g. +197 seconds (+00:03:17)
  clockOffsetFormatted: string; // '+00:03:17'
  seizedDate: string;
  seizedLocation: string;
  writeBlockerModel: string;
  writeBlockerStatus: 'Hardware Write-Block Active' | 'Software Read-Only';
  acquisitionHashMD5: string;
  acquisitionHashSHA256: string;
}

export type ForensicWorkspaceTab = 
  | 'VIEWER'
  | 'ACQUISITION'
  | 'STORAGE'
  | 'RECOVERY'
  | 'TIMELINE'
  | 'AI_ANALYSIS'
  | 'INTEGRITY'
  | 'COMPARE'
  | 'CUSTODY'
  | 'NOTES'
  | 'REPORT';
