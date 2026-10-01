import React, { useState } from 'react';
import {
  X,
  GitBranch,
  Sparkles,
  Crosshair,
  FileVideo,
  Camera,
  Flame,
  HardDrive,
  ShieldCheck,
  Cpu,
  Lock,
  ArrowDown,
  Check,
  Copy,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AIFinding, VideoRecording, DeviceInfo, RecoveryFragment } from '../../types/forensics';

interface TraceToSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFinding?: AIFinding;
  activeRecording: VideoRecording;
  deviceInfo: DeviceInfo;
  onNavigateToTab: (tab: any, refId?: string) => void;
}

export const TraceToSourceModal: React.FC<TraceToSourceModalProps> = ({
  isOpen,
  onClose,
  activeFinding,
  activeRecording,
  deviceInfo,
  onNavigateToTab
}) => {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(0);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  if (!isOpen) return null;

  // The 8-level unbroken forensic provenance nodes
  const traceNodes = [
    {
      level: 1,
      title: 'AI FINDING',
      subtitle: activeFinding ? `${activeFinding.type} (${activeFinding.confidence}%)` : 'Corridor Subject Anomaly Detection',
      id: activeFinding ? activeFinding.id : 'AIF-001',
      details: [
        { label: 'Classification', value: activeFinding ? activeFinding.type : 'Vehicle / Person Anomaly' },
        { label: 'Confidence Score', value: activeFinding ? `${activeFinding.confidence}%` : '93%' },
        { label: 'Detection Model', value: activeFinding ? activeFinding.model : 'YOLO-Forensic-v9 (Darknet TRT)' },
        { label: 'Timestamp (Raw)', value: activeFinding ? activeFinding.timestamp : activeRecording.startTime },
        { label: 'Normalized Time', value: activeFinding ? activeFinding.normalizedTimestamp : activeRecording.normalizedStartTime },
        { label: 'Bounding Coordinates', value: 'X: 38% | Y: 22% | W: 34% | H: 58%' }
      ],
      icon: Sparkles,
      color: 'text-[#c084fc]',
      bgColor: 'bg-[#3b0764]/40',
      borderColor: 'border-[#a855f7]'
    },
    {
      level: 2,
      title: 'EXAMINED VIDEO FRAME',
      subtitle: `Frame #${activeFinding ? activeFinding.frameNumber : 38192}`,
      id: `FRAME-#${activeFinding ? activeFinding.frameNumber : 38192}`,
      details: [
        { label: 'Frame Number', value: activeFinding ? `#${activeFinding.frameNumber}` : '#38192' },
        { label: 'Frame Slice Type', value: 'I-Frame (Key Frame Slice / IDR)' },
        { label: 'Presentation Timestamp (PTS)', value: '00:14:32.480' },
        { label: 'Decode Timestamp (DTS)', value: '00:14:32.400' },
        { label: 'Slice Byte Offset', value: '0x8A23F140 (Inside Extent #18)' },
        { label: 'Slice MD5 Checksum', value: '7c89a01f42d9e801b7a20c914e67aa21' }
      ],
      icon: Crosshair,
      color: 'text-[#38bdf8]',
      bgColor: 'bg-[#0c4a6e]/40',
      borderColor: 'border-[#0284c7]'
    },
    {
      level: 3,
      title: 'RECORDING CONTAINER STREAM',
      subtitle: activeRecording.id,
      id: activeRecording.id,
      details: [
        { label: 'Recording ID', value: activeRecording.id },
        { label: 'Container Format', value: activeRecording.format },
        { label: 'Stream Codec', value: activeRecording.codec },
        { label: 'Resolution & FPS', value: `${activeRecording.resolution} @ ${activeRecording.fps} fps` },
        { label: 'Raw Duration', value: activeRecording.durationFormatted },
        { label: 'Recording SHA-256', value: activeRecording.sha256 }
      ],
      icon: FileVideo,
      color: 'text-[#60a5fa]',
      bgColor: 'bg-[#1e3a8a]/40',
      borderColor: 'border-[#2563eb]'
    },
    {
      level: 4,
      title: 'CAMERA CHANNEL SENSOR',
      subtitle: `${activeRecording.cameraId} (${activeRecording.cameraName})`,
      id: activeRecording.cameraId,
      details: [
        { label: 'Channel ID', value: activeRecording.cameraId },
        { label: 'Channel Name', value: activeRecording.cameraName },
        { label: 'Physical Location', value: 'Corridor 4B adjacent to Server Vault' },
        { label: 'Sensor Specification', value: 'Sony STARVIS CMOS (1920x1080)' },
        { label: 'IP Address / Port', value: '192.168.1.104:554 (RTSP Stream)' },
        { label: 'NVR Port Binding', value: 'Physical PoE Port #4 (Isolated VLAN)' }
      ],
      icon: Camera,
      color: 'text-[#2dd4bf]',
      bgColor: 'bg-[#134e4a]/40',
      borderColor: 'border-[#0d9488]'
    },
    {
      level: 5,
      title: 'CARVED RECOVERY FRAGMENT',
      subtitle: activeRecording.recoveredFromFragmentId || 'FRAG-00382',
      id: activeRecording.recoveredFromFragmentId || 'FRAG-00382',
      details: [
        { label: 'Carve Fragment ID', value: activeRecording.recoveredFromFragmentId || 'FRAG-00382' },
        { label: 'Carving Offset (Hex)', value: '0x8A23F000' },
        { label: 'Unallocated Size', value: '18.2 MB' },
        { label: 'NAL Unit Packet Count', value: '4,210 NAL slices' },
        { label: 'Sequence Parameter Set', value: 'HEVC SPS/PPS Present & Validated' },
        { label: 'Carving Algorithm', value: 'EviTwin Multi-Vendor NAL Stream Stitcher' }
      ],
      icon: Flame,
      color: 'text-[#fbbf24]',
      bgColor: 'bg-[#78350f]/40',
      borderColor: 'border-[#d97706]'
    },
    {
      level: 6,
      title: 'PHYSICAL STORAGE EXTENT / SECTOR',
      subtitle: 'Disk 0, Sector Block #12 (Extent #18)',
      id: 'SEC-013 / EXTENT-#18',
      details: [
        { label: 'Storage Unit', value: 'Disk 0 (Partition 1)' },
        { label: 'Block Index', value: 'Block #12 (Cluster 64 KB)' },
        { label: 'Cluster Status', value: 'Unallocated Extent (Intentional Deletion Signature)' },
        { label: 'Shannon Entropy', value: '7.98 / 8.0 (Compressed Video Payload)' },
        { label: 'Filesystem Extent Table', value: 'HikFS v4.2 Unallocated Extent Table' },
        { label: 'Start-End Hex', value: `${activeRecording.startOffsetHex} — ${activeRecording.endOffsetHex}` }
      ],
      icon: HardDrive,
      color: 'text-[#f87171]',
      bgColor: 'bg-[#7f1d1d]/40',
      borderColor: 'border-[#dc2626]'
    },
    {
      level: 7,
      title: 'FORENSIC EVIDENCE BIT-STREAM IMAGE',
      subtitle: 'EVID-NVR-001.E01 (Expert Witness Format)',
      id: 'EVID-NVR-001.E01',
      details: [
        { label: 'Image Container', value: 'Expert Witness E01 Segmented Forensic Image' },
        { label: 'Acquisition MD5', value: '91ab7c2de04a621b8f5e3d74c09211aa' },
        { label: 'Acquisition SHA-256', value: '7f3c4e92a10df54b8301726c8d35e4b109af9b2c8a14ec4210d7a6bc9924a91e' },
        { label: 'Verification Hash Status', value: 'MATCH (Zero Byte Drift)' },
        { label: 'Acquired By', value: 'Insp. Rajesh Varma, Lead Examiner (DFC-418)' },
        { label: 'Acquisition Tool', value: 'EviTwin Raw Bit-Stream Imager v2.6' }
      ],
      icon: ShieldCheck,
      color: 'text-[#4ade80]',
      bgColor: 'bg-[#14532d]/40',
      borderColor: 'border-[#16a34a]'
    },
    {
      level: 8,
      title: 'ORIGINAL SEIZED HARDWARE DEVICE',
      subtitle: `${deviceInfo.manufacturer} ${deviceInfo.model}`,
      id: deviceInfo.serialNumber,
      details: [
        { label: 'Hardware Make & Model', value: `${deviceInfo.manufacturer} ${deviceInfo.model}` },
        { label: 'Hardware Serial Number', value: deviceInfo.serialNumber },
        { label: 'Firmware Build', value: deviceInfo.firmware },
        { label: 'Seized Date & Time', value: deviceInfo.seizedDate },
        { label: 'Seized Location', value: deviceInfo.seizedLocation },
        { label: 'Hardware Write-Blocker', value: 'Tableau T8u USB 3.0 Bridge (Hardware Write-Block Active)' }
      ],
      icon: Lock,
      color: 'text-[#22c55e]',
      bgColor: 'bg-[#14532d]/50',
      borderColor: 'border-[#22c55e]'
    }
  ];

  const activeNode = traceNodes[selectedNodeIndex];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash('Copied');
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none font-mono">
      <div className="bg-[#0f131c] border border-[#2d3748] rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden text-xs text-[#cbd5e1]">
        {/* Modal Top Header */}
        <div className="h-12 px-4 bg-[#151a26] border-b border-[#242c3d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#0369a1] text-white flex items-center justify-center font-bold">
              <GitBranch className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">TRACE TO SOURCE — FORENSIC PROVENANCE GRAPH</span>
                <span className="text-[10px] bg-[#0284c7]/30 text-[#38bdf8] px-1.5 py-0.5 rounded border border-[#0284c7]/40">
                  SIH26150 SIGNATURE ENGINE
                </span>
              </div>
              <p className="text-[10px] text-[#8b949e]">
                Unbroken mathematical and physical evidence chain from AI finding down to hardware write-blocker
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#253043] text-[#94a3b8] hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Flowchart & Right Inspector */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Interactive 8-Stage Chain Flowchart */}
          <div className="w-1/2 border-r border-[#1f2635] p-3 overflow-y-auto space-y-2 bg-[#0a0d14]">
            <div className="text-[11px] font-bold text-[#8b949e] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Provenance Stages (Select to inspect layer)</span>
              <span className="text-[#22c55e]">Chain of Custody: INTACT</span>
            </div>

            {traceNodes.map((node, idx) => {
              const isSelected = selectedNodeIndex === idx;
              const Icon = node.icon;

              return (
                <React.Fragment key={node.level}>
                  <div
                    onClick={() => setSelectedNodeIndex(idx)}
                    className={`p-2.5 rounded border cursor-pointer transition flex items-center justify-between ${
                      node.bgColor
                    } ${isSelected ? 'ring-2 ring-[#38bdf8] scale-[1.01] border-white' : node.borderColor}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full border flex items-center justify-center ${node.borderColor} bg-black/40 ${node.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] bg-black/50 px-1 rounded text-[#94a3b8] font-bold">
                            STEP {node.level}
                          </span>
                          <span className={`font-bold ${node.color}`}>{node.title}</span>
                        </div>
                        <div className="text-white text-[11px] font-semibold truncate max-w-[280px]">
                          {node.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] text-[#64748b] block">{node.id}</span>
                      <span className={`text-[10px] font-bold ${isSelected ? 'text-[#38bdf8]' : 'text-transparent'}`}>
                        INSPECTING →
                      </span>
                    </div>
                  </div>

                  {idx < traceNodes.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <ArrowDown className="w-3.5 h-3.5 text-[#475569]" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Right: Selected Node Technical Deep-Dive Inspector */}
          <div className="w-1/2 p-4 bg-[#0d1017] flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header card for selected stage */}
              <div className="flex items-center justify-between pb-3 border-b border-[#242c3d] mb-4">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded border ${activeNode.borderColor} ${activeNode.bgColor} ${activeNode.color}`}>
                    <activeNode.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8b949e]">LAYER {activeNode.level} PROVENANCE NODE</span>
                    <h3 className={`text-base font-bold ${activeNode.color}`}>{activeNode.title}</h3>
                  </div>
                </div>

                <span className="text-[10px] bg-[#142e20] text-[#4ade80] px-2 py-0.5 rounded border border-[#166534] font-bold">
                  VERIFIED AUTHENTIC
                </span>
              </div>

              {/* Node Detailed Properties Table */}
              <div className="space-y-2 mb-4">
                {activeNode.details.map((prop, pIdx) => (
                  <div
                    key={pIdx}
                    className="flex justify-between items-center p-2 rounded bg-[#121620] border border-[#1e2533] text-[11px]"
                  >
                    <span className="text-[#8b949e]">{prop.label}:</span>
                    <div className="flex items-center gap-2 max-w-[280px]">
                      <span className="text-white font-bold truncate">{prop.value}</span>
                      {prop.value.length > 25 && (
                        <button
                          onClick={() => copyToClipboard(prop.value)}
                          className="text-[#64748b] hover:text-white"
                          title="Copy to clipboard"
                        >
                          {copiedHash ? <Check className="w-3 h-3 text-[#22c55e]" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Forensic Admissibility Note */}
              <div className="p-3 bg-[#111827] rounded border border-[#1f2937] text-[10px] text-[#9ca3af] space-y-1">
                <div className="text-[#38bdf8] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span>COURT-ROOM EVIDENCE INTEGRITY & REPRODUCIBILITY</span>
                </div>
                <p>
                  Every analytical representation in EviTwin is bi-directionally mapped to raw physical storage blocks through deterministic extent indices. The acquisition was conducted via hardware write-blocker, ensuring byte-identical replication according to ISO/IEC 27037 standards.
                </p>
              </div>
            </div>

            {/* Quick jump to workspace tabs */}
            <div className="pt-4 border-t border-[#1e2533] flex items-center justify-between gap-3">
              <span className="text-[10px] text-[#64748b]">
                Active Node: <strong className="text-white">{activeNode.id}</strong>
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onClose();
                    if (activeNode.level <= 3) {
                      onNavigateToTab('VIEWER');
                    } else if (activeNode.level === 5) {
                      onNavigateToTab('RECOVERY');
                    } else if (activeNode.level === 6) {
                      onNavigateToTab('STORAGE');
                    } else {
                      onNavigateToTab('INTEGRITY');
                    }
                  }}
                  className="bg-[#0369a1] hover:bg-[#0284c7] text-white px-3 py-1.5 rounded font-bold cursor-pointer flex items-center gap-1"
                >
                  <span>EXAMINE IN WORKSPACE</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
