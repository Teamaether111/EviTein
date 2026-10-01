import React, { useState } from 'react';
import {
  FileText,
  Clock,
  ShieldCheck,
  Flame,
  Sparkles,
  GitBranch,
  Copy,
  Check,
  HardDrive,
  Cpu,
  Hash,
  Layers,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { VideoRecording, DeviceInfo, AIFinding, RecoveryFragment } from '../../types/forensics';

interface EvidenceInspectorProps {
  recording: VideoRecording;
  deviceInfo: DeviceInfo;
  activeFinding?: AIFinding;
  fragmentInfo?: RecoveryFragment;
  onOpenTrace: () => void;
  onNavigateToStorage: () => void;
  onNavigateToRecovery: () => void;
}

export const EvidenceInspector: React.FC<EvidenceInspectorProps> = ({
  recording,
  deviceInfo,
  activeFinding,
  fragmentInfo,
  onOpenTrace,
  onNavigateToStorage,
  onNavigateToRecovery
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [sectionsOpen, setSectionsOpen] = useState({
    evidence: true,
    time: true,
    integrity: true,
    recovery: true,
    ai: true
  });

  const toggleSection = (sectionKey: keyof typeof sectionsOpen) => {
    setSectionsOpen((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(label);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <aside className="w-80 bg-[#12161f] border-l border-[#242c3d] flex flex-col shrink-0 text-xs text-[#cbd5e1] select-none h-full overflow-hidden font-mono">
      {/* Inspector Title */}
      <div className="h-8 px-3 bg-[#161b26] border-b border-[#242c3d] flex items-center justify-between text-[11px] font-semibold text-[#8b949e]">
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>EVIDENCE INSPECTOR</span>
        </div>
        <span className="text-[10px] text-[#22c55e] bg-[#142e20] px-1 rounded border border-[#166534]">
          FORENSIC
        </span>
      </div>

      {/* Inspector Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 text-[11px]">
        {/* Trace to Source Signature Action Button */}
        <button
          onClick={onOpenTrace}
          className="w-full bg-gradient-to-r from-[#0369a1] to-[#0284c7] hover:from-[#0284c7] hover:to-[#38bdf8] text-white py-2 px-3 rounded font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition"
        >
          <GitBranch className="w-4 h-4 text-white" />
          <span className="tracking-wider text-xs">TRACE TO SOURCE</span>
        </button>

        {/* SECTION 1: Evidence Information */}
        <div className="border border-[#222a3a] bg-[#0f121a] rounded overflow-hidden">
          <div
            onClick={() => toggleSection('evidence')}
            className="px-2.5 py-1.5 bg-[#171c26] flex items-center justify-between cursor-pointer text-[#e2e8f0] font-semibold"
          >
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Evidence Information</span>
            </div>
            {sectionsOpen.evidence ? <ChevronDown className="w-3 h-3 text-[#64748b]" /> : <ChevronRight className="w-3 h-3 text-[#64748b]" />}
          </div>

          {sectionsOpen.evidence && (
            <div className="p-2.5 space-y-1.5 text-[10px]">
              <div className="flex justify-between items-center py-0.5 border-b border-[#1b212e]">
                <span className="text-[#64748b]">Evidence ID:</span>
                <span className="text-[#38bdf8] font-bold">EVID-NVR-001</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#1b212e]">
                <span className="text-[#64748b]">Recording ID:</span>
                <span className="text-white font-bold">{recording.id}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#1b212e]">
                <span className="text-[#64748b]">Camera / Ch:</span>
                <span className="text-[#cbd5e1]">{recording.cameraId} ({recording.cameraName.split(' ')[0]})</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#1b212e]">
                <span className="text-[#64748b]">Source Device:</span>
                <span className="text-[#cbd5e1] truncate max-w-[150px]">{deviceInfo.manufacturer} {deviceInfo.model.split(' ')[0]}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#1b212e]">
                <span className="text-[#64748b]">Format / Container:</span>
                <span className="text-[#f59e0b] font-medium">{recording.format}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#1b212e]">
                <span className="text-[#64748b]">Codec:</span>
                <span className="text-[#cbd5e1]">{recording.codec}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#1b212e]">
                <span className="text-[#64748b]">Resolution:</span>
                <span className="text-[#cbd5e1]">{recording.resolution}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#1b212e]">
                <span className="text-[#64748b]">Frame Rate:</span>
                <span className="text-[#cbd5e1]">{recording.fps} fps</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[#64748b]">File Size:</span>
                <span className="text-white">{recording.fileSizeMb} MB</span>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: Time Information & Normalization */}
        <div className="border border-[#222a3a] bg-[#0f121a] rounded overflow-hidden">
          <div
            onClick={() => toggleSection('time')}
            className="px-2.5 py-1.5 bg-[#171c26] flex items-center justify-between cursor-pointer text-[#e2e8f0] font-semibold"
          >
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Time Information</span>
            </div>
            {sectionsOpen.time ? <ChevronDown className="w-3 h-3 text-[#64748b]" /> : <ChevronRight className="w-3 h-3 text-[#64748b]" />}
          </div>

          {sectionsOpen.time && (
            <div className="p-2.5 space-y-1.5 text-[10px]">
              <div className="py-0.5 border-b border-[#1b212e]">
                <div className="text-[#64748b] text-[9px]">ORIGINAL DEVICE TIMESTAMP:</div>
                <div className="text-[#fca5a5] font-bold mt-0.5">{recording.startTime}</div>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#1b212e]">
                <span className="text-[#64748b]">Device Timezone:</span>
                <span className="text-[#cbd5e1]">UTC+05:30 (IST)</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#1b212e]">
                <span className="text-[#64748b]">Detected Clock Offset:</span>
                <span className="text-[#f59e0b] font-bold">+00:03:17 (Fast)</span>
              </div>
              <div className="py-0.5 border-b border-[#1b212e]">
                <div className="text-[#64748b] text-[9px]">NORMALIZED INVESTIGATION TIME:</div>
                <div className="text-[#38bdf8] font-bold mt-0.5">{recording.normalizedStartTime}</div>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span className="text-[#64748b]">Clip Duration:</span>
                <span className="text-white font-bold">{recording.durationFormatted} ({recording.durationSeconds}s)</span>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: Forensic Integrity & Hashing */}
        <div className="border border-[#222a3a] bg-[#0f121a] rounded overflow-hidden">
          <div
            onClick={() => toggleSection('integrity')}
            className="px-2.5 py-1.5 bg-[#171c26] flex items-center justify-between cursor-pointer text-[#e2e8f0] font-semibold"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>Cryptographic Integrity</span>
            </div>
            {sectionsOpen.integrity ? <ChevronDown className="w-3 h-3 text-[#64748b]" /> : <ChevronRight className="w-3 h-3 text-[#64748b]" />}
          </div>

          {sectionsOpen.integrity && (
            <div className="p-2.5 space-y-2 text-[10px]">
              <div>
                <div className="flex justify-between items-center text-[#64748b] text-[9px] mb-0.5">
                  <span>MD5 CHECKSUM:</span>
                  <button
                    onClick={() => copyToClipboard(recording.md5, 'MD5')}
                    className="hover:text-white flex items-center gap-0.5"
                  >
                    {copiedHash === 'MD5' ? <Check className="w-2.5 h-2.5 text-[#22c55e]" /> : <Copy className="w-2.5 h-2.5" />}
                    <span>{copiedHash === 'MD5' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-[#151a24] p-1.5 rounded border border-[#263144] break-all text-[#cbd5e1] font-mono text-[9px]">
                  {recording.md5}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[#64748b] text-[9px] mb-0.5">
                  <span>SHA-256 HASH:</span>
                  <button
                    onClick={() => copyToClipboard(recording.sha256, 'SHA-256')}
                    className="hover:text-white flex items-center gap-0.5"
                  >
                    {copiedHash === 'SHA-256' ? <Check className="w-2.5 h-2.5 text-[#22c55e]" /> : <Copy className="w-2.5 h-2.5" />}
                    <span>{copiedHash === 'SHA-256' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-[#151a24] p-1.5 rounded border border-[#263144] break-all text-[#cbd5e1] font-mono text-[9px]">
                  {recording.sha256}
                </div>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-[#1b212e]">
                <span className="text-[#64748b]">Hash Verification Status:</span>
                <span className="text-[#22c55e] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED MATCH
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748b]">Acquisition Image:</span>
                <span className="text-[#38bdf8]">EVID-NVR-001.E01</span>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: Storage & Carving Recovery */}
        <div className="border border-[#222a3a] bg-[#0f121a] rounded overflow-hidden">
          <div
            onClick={() => toggleSection('recovery')}
            className="px-2.5 py-1.5 bg-[#171c26] flex items-center justify-between cursor-pointer text-[#e2e8f0] font-semibold"
          >
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Storage & Carving Provenance</span>
            </div>
            {sectionsOpen.recovery ? <ChevronDown className="w-3 h-3 text-[#64748b]" /> : <ChevronRight className="w-3 h-3 text-[#64748b]" />}
          </div>

          {sectionsOpen.recovery && (
            <div className="p-2.5 space-y-1.5 text-[10px]">
              <div className="flex justify-between items-center py-0.5 border-b border-[#1b212e]">
                <span className="text-[#64748b]">Storage Region:</span>
                <span className="text-white truncate max-w-[160px]">{recording.storageRegion}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#1b212e]">
                <span className="text-[#64748b]">Start Byte Offset:</span>
                <span className="text-[#38bdf8] font-mono font-bold">{recording.startOffsetHex}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#1b212e]">
                <span className="text-[#64748b]">End Byte Offset:</span>
                <span className="text-[#38bdf8] font-mono font-bold">{recording.endOffsetHex}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#1b212e]">
                <span className="text-[#64748b]">Carved Fragment:</span>
                <span className="text-[#f59e0b] font-bold">
                  {recording.recoveredFromFragmentId || 'Direct Extent'}
                </span>
              </div>
              {recording.recoveryConfidence && (
                <div className="flex justify-between items-center py-0.5 border-b border-[#1b212e]">
                  <span className="text-[#64748b]">Recovery Confidence:</span>
                  <span className="text-[#22c55e] font-bold">{recording.recoveryConfidence}%</span>
                </div>
              )}
              <div className="pt-1 flex gap-1.5">
                <button
                  onClick={onNavigateToStorage}
                  className="flex-1 bg-[#1a2130] hover:bg-[#242f45] border border-[#2b3547] text-[#cbd5e1] py-1 rounded text-center text-[10px] cursor-pointer flex items-center justify-center gap-1"
                >
                  <HardDrive className="w-3 h-3 text-[#38bdf8]" />
                  <span>Inspect Sector</span>
                </button>
                <button
                  onClick={onNavigateToRecovery}
                  className="flex-1 bg-[#1a2130] hover:bg-[#242f45] border border-[#2b3547] text-[#cbd5e1] py-1 rounded text-center text-[10px] cursor-pointer flex items-center justify-center gap-1"
                >
                  <Flame className="w-3 h-3 text-[#f59e0b]" />
                  <span>Carve Table</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 5: AI Findings on this Recording */}
        {activeFinding && (
          <div className="border border-[#3b0764] bg-[#12071f] rounded overflow-hidden">
            <div
              onClick={() => toggleSection('ai')}
              className="px-2.5 py-1.5 bg-[#25093e] flex items-center justify-between cursor-pointer text-[#e9d5ff] font-semibold"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#c084fc]" />
                <span>AI Finding on Clip</span>
              </div>
              {sectionsOpen.ai ? <ChevronDown className="w-3 h-3 text-[#c084fc]" /> : <ChevronRight className="w-3 h-3 text-[#c084fc]" />}
            </div>

            {sectionsOpen.ai && (
              <div className="p-2.5 space-y-1.5 text-[10px]">
                <div className="flex justify-between items-center py-0.5 border-b border-[#3b1263]">
                  <span className="text-[#a855f7]">Finding ID:</span>
                  <span className="text-white font-bold">{activeFinding.id}</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-[#3b1263]">
                  <span className="text-[#a855f7]">Classification:</span>
                  <span className="text-[#fde047] font-bold">{activeFinding.type}</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-[#3b1263]">
                  <span className="text-[#a855f7]">Confidence:</span>
                  <span className="text-[#4ade80] font-bold">{activeFinding.confidence}%</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-[#3b1263]">
                  <span className="text-[#a855f7]">Frame Ref:</span>
                  <span className="text-white">#{activeFinding.frameNumber}</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-[#3b1263]">
                  <span className="text-[#a855f7]">Model:</span>
                  <span className="text-[#cbd5e1] truncate max-w-[150px]">{activeFinding.model}</span>
                </div>
                <div className="text-[#d8b4fe] text-[9px] pt-1">
                  {activeFinding.details}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Inspector Footer */}
      <div className="p-2 border-t border-[#1e2533] bg-[#0a0d13] text-[9px] text-[#64748b] flex items-center justify-between">
        <span>WRITER: TABLEAU T8U LOCKED</span>
        <span className="text-[#22c55e]">E01 VERIFIED</span>
      </div>
    </aside>
  );
};
