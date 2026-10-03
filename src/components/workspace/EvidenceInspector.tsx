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
  ChevronDown,
  ChevronUp
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

  // Progressive disclosure: Only primary section open by default, others expandable on demand
  const [sectionsOpen, setSectionsOpen] = useState({
    time: false,
    integrity: false,
    recovery: false,
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
    <aside className="w-72 bg-[#0e121a] border-l border-[#1f2635] flex flex-col shrink-0 text-xs text-[#cbd5e1] select-none h-full overflow-hidden font-mono">
      {/* Inspector Header */}
      <div className="h-9 px-3 bg-[#131822] border-b border-[#1f2635] flex items-center justify-between text-[11px] font-semibold text-[#8b949e]">
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>EVIDENCE DETAILS</span>
        </div>
        <span className="text-[10px] text-[#22c55e] bg-[#0c2818] px-1 rounded border border-[#166534]">
          VERIFIED
        </span>
      </div>

      {/* Inspector Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 text-[11px]">
        {/* Requirement 14 & 11: Prominent TRACE TO SOURCE Button */}
        <button
          onClick={onOpenTrace}
          className="w-full bg-[#0369a1] hover:bg-[#0284c7] text-white py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition text-xs"
        >
          <GitBranch className="w-4 h-4 text-white" />
          <span className="tracking-wide">TRACE TO SOURCE</span>
        </button>

        {/* PRIMARY EVIDENCE SUMMARY (Always visible, clean, uncrowded) */}
        <div className="bg-[#121620] border border-[#242c3d] rounded-lg p-3 space-y-1.5">
          <div className="flex justify-between items-center pb-1 border-b border-[#1c2331]">
            <span className="text-[#64748b] text-[10px]">RECORDING:</span>
            <span className="text-white font-bold">{recording.id}</span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-b border-[#1c2331]">
            <span className="text-[#64748b] text-[10px]">CAMERA:</span>
            <span className="text-[#38bdf8] font-semibold">{recording.cameraId}</span>
          </div>
          <div className="flex justify-between items-center py-0.5 border-b border-[#1c2331]">
            <span className="text-[#64748b] text-[10px]">DURATION:</span>
            <span className="text-white">{recording.durationFormatted}</span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-[#64748b] text-[10px]">STATUS:</span>
            <span className={recording.status === 'Recovered' ? 'text-[#f59e0b] font-bold' : 'text-[#22c55e] font-bold'}>
              {recording.status === 'Recovered' ? 'Carved / Recovered' : 'Active Stream'}
            </span>
          </div>
        </div>

        {/* EXPANDABLE SECTION 1: AI Findings on this Recording */}
        {activeFinding && (
          <div className="border border-[#3b0764] bg-[#140822] rounded-lg overflow-hidden">
            <div
              onClick={() => toggleSection('ai')}
              className="px-3 py-2 bg-[#200a35] flex items-center justify-between cursor-pointer text-[#e9d5ff] font-semibold text-[11px]"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#c084fc]" />
                <span>AI Finding on Clip</span>
              </div>
              {sectionsOpen.ai ? <ChevronUp className="w-3 h-3 text-[#c084fc]" /> : <ChevronDown className="w-3 h-3 text-[#c084fc]" />}
            </div>

            {sectionsOpen.ai && (
              <div className="p-3 space-y-1.5 text-[10px] animate-in fade-in duration-150">
                <div className="flex justify-between items-center pb-0.5 border-b border-[#2d114a]">
                  <span className="text-[#a855f7]">Object:</span>
                  <span className="text-[#fde047] font-bold">{activeFinding.type}</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-[#2d114a]">
                  <span className="text-[#a855f7]">Confidence:</span>
                  <span className="text-[#4ade80] font-bold">{activeFinding.confidence}%</span>
                </div>
                <div className="flex justify-between items-center py-0.5 border-b border-[#2d114a]">
                  <span className="text-[#a855f7]">Frame:</span>
                  <span className="text-white">#{activeFinding.frameNumber}</span>
                </div>
                <div className="text-[#d8b4fe] text-[9px] pt-1">
                  {activeFinding.details}
                </div>
              </div>
            )}
          </div>
        )}

        {/* EXPANDABLE SECTION 2: Time Information & Normalization */}
        <div className="border border-[#222a3a] bg-[#11151f] rounded-lg overflow-hidden">
          <div
            onClick={() => toggleSection('time')}
            className="px-3 py-2 bg-[#151a26] flex items-center justify-between cursor-pointer text-[#cbd5e1] font-semibold text-[11px]"
          >
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Timestamp & Normalization</span>
            </div>
            {sectionsOpen.time ? <ChevronUp className="w-3 h-3 text-[#8b949e]" /> : <ChevronDown className="w-3 h-3 text-[#8b949e]" />}
          </div>

          {sectionsOpen.time && (
            <div className="p-3 space-y-1.5 text-[10px] animate-in fade-in duration-150">
              <div className="py-0.5 border-b border-[#1b212e]">
                <span className="text-[#64748b] text-[9px] block">RAW DEVICE TIME:</span>
                <span className="text-[#fca5a5] font-bold">{recording.startTime}</span>
              </div>
              <div className="py-0.5 border-b border-[#1b212e]">
                <span className="text-[#64748b] text-[9px] block">NORMALIZED TIME:</span>
                <span className="text-[#38bdf8] font-bold">{recording.normalizedStartTime}</span>
              </div>
              <div className="flex justify-between items-center pt-0.5">
                <span className="text-[#64748b]">Clock Drift:</span>
                <span className="text-[#f59e0b] font-bold">+00:03:17</span>
              </div>
            </div>
          )}
        </div>

        {/* EXPANDABLE SECTION 3: Cryptographic Integrity */}
        <div className="border border-[#222a3a] bg-[#11151f] rounded-lg overflow-hidden">
          <div
            onClick={() => toggleSection('integrity')}
            className="px-3 py-2 bg-[#151a26] flex items-center justify-between cursor-pointer text-[#cbd5e1] font-semibold text-[11px]"
          >
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
              <span>Cryptographic Hashes</span>
            </div>
            {sectionsOpen.integrity ? <ChevronUp className="w-3 h-3 text-[#8b949e]" /> : <ChevronDown className="w-3 h-3 text-[#8b949e]" />}
          </div>

          {sectionsOpen.integrity && (
            <div className="p-3 space-y-2 text-[10px] animate-in fade-in duration-150">
              <div>
                <div className="flex justify-between items-center text-[#64748b] text-[9px] mb-0.5">
                  <span>SHA-256:</span>
                  <button
                    onClick={() => copyToClipboard(recording.sha256, 'SHA-256')}
                    className="hover:text-white"
                  >
                    {copiedHash === 'SHA-256' ? 'Copied ✓' : 'Copy'}
                  </button>
                </div>
                <div className="bg-[#0b0e14] p-1.5 rounded border border-[#1e2533] break-all text-[#cbd5e1] text-[9px]">
                  {recording.sha256}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[#64748b] text-[9px] mb-0.5">
                  <span>MD5:</span>
                  <button
                    onClick={() => copyToClipboard(recording.md5, 'MD5')}
                    className="hover:text-white"
                  >
                    {copiedHash === 'MD5' ? 'Copied ✓' : 'Copy'}
                  </button>
                </div>
                <div className="bg-[#0b0e14] p-1.5 rounded border border-[#1e2533] break-all text-[#cbd5e1] text-[9px]">
                  {recording.md5}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* EXPANDABLE SECTION 4: Storage & Carving Provenance */}
        <div className="border border-[#222a3a] bg-[#11151f] rounded-lg overflow-hidden">
          <div
            onClick={() => toggleSection('recovery')}
            className="px-3 py-2 bg-[#151a26] flex items-center justify-between cursor-pointer text-[#cbd5e1] font-semibold text-[11px]"
          >
            <div className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Storage & Carving</span>
            </div>
            {sectionsOpen.recovery ? <ChevronUp className="w-3 h-3 text-[#8b949e]" /> : <ChevronDown className="w-3 h-3 text-[#8b949e]" />}
          </div>

          {sectionsOpen.recovery && (
            <div className="p-3 space-y-1.5 text-[10px] animate-in fade-in duration-150">
              <div className="flex justify-between items-center py-0.5 border-b border-[#1b212e]">
                <span className="text-[#64748b]">Byte Range:</span>
                <span className="text-[#38bdf8] font-mono">{recording.startOffsetHex}</span>
              </div>
              <div className="flex justify-between items-center py-0.5 border-b border-[#1b212e]">
                <span className="text-[#64748b]">Carved Fragment:</span>
                <span className="text-[#f59e0b] font-bold">
                  {recording.recoveredFromFragmentId || 'Direct Extent'}
                </span>
              </div>
              <div className="pt-1.5 flex gap-1.5">
                <button
                  onClick={onNavigateToStorage}
                  className="flex-1 bg-[#182130] hover:bg-[#202c40] border border-[#2b394e] text-[#cbd5e1] py-1 rounded text-center text-[10px] cursor-pointer"
                >
                  Block Map →
                </button>
                <button
                  onClick={onNavigateToRecovery}
                  className="flex-1 bg-[#182130] hover:bg-[#202c40] border border-[#2b394e] text-[#cbd5e1] py-1 rounded text-center text-[10px] cursor-pointer"
                >
                  Carve Table →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
