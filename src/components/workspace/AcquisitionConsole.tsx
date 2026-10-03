import React, { useState } from 'react';
import {
  HardDrive,
  Cpu,
  Lock,
  RotateCw,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Terminal,
  FileCheck,
  Info
} from 'lucide-react';
import { DeviceInfo, VendorId } from '../../types/forensics';
import { VENDOR_ADAPTERS } from '../../data/mockForensicData';

interface AcquisitionConsoleProps {
  deviceInfo: DeviceInfo;
  selectedVendor: VendorId;
  onNavigateToViewer: () => void;
}

export const AcquisitionConsole: React.FC<AcquisitionConsoleProps> = ({
  deviceInfo,
  selectedVendor,
  onNavigateToViewer
}) => {
  const [acquisitionType, setAcquisitionType] = useState<'PHYSICAL' | 'LOGICAL' | 'IMAGE'>('PHYSICAL');
  const [isAcquiring, setIsAcquiring] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(100);
  const [processedTb, setProcessedTb] = useState<number>(4.0);
  const [readSpeed, setReadSpeed] = useState<number>(184);
  const [statusMessage, setStatusMessage] = useState<string>('Bit-stream raw verification complete. Hashes matched.');
  const [acquisitionComplete, setAcquisitionComplete] = useState<boolean>(true);
  
  // Progressive disclosure toggle: Show technical details on demand
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  const adapter = VENDOR_ADAPTERS[selectedVendor];

  const handleRunSimulation = () => {
    setIsAcquiring(true);
    setAcquisitionComplete(false);
    setProgress(0);
    setProcessedTb(0);

    let curr = 0;
    const interval = setInterval(() => {
      curr += 10;
      if (curr >= 100) {
        clearInterval(interval);
        setProgress(100);
        setProcessedTb(4.00);
        setIsAcquiring(false);
        setAcquisitionComplete(true);
        setStatusMessage('Acquisition complete. Bit-stream hash verified against source physical media.');
      } else {
        setProgress(curr);
        setProcessedTb(Number(((curr / 100) * 4.0).toFixed(2)));
        setReadSpeed(180 + Math.floor(Math.random() * 25));
        setStatusMessage(`Reading cylinder ${(curr * 9.7).toFixed(0)}M sectors... Verifying CRC32 chunk checksums`);
      }
    }, 300);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e14] h-full overflow-hidden select-none font-mono text-xs">
      {/* Top Header */}
      <div className="h-10 px-4 bg-[#141822] border-b border-[#242c3d] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <HardDrive className="w-4 h-4 text-[#38bdf8]" />
            <span>FORENSIC ACQUISITION</span>
          </div>
          <span className="text-[#475569]">|</span>
          <span className="text-[#38bdf8] font-semibold">{deviceInfo.manufacturer} NVR (Disk 0)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#0c2818] text-[#4ade80] px-2 py-0.5 rounded border border-[#166534] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#22c55e]" />
            ACQUISITION COMPLETE
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 overflow-y-auto max-w-4xl mx-auto w-full space-y-4">
        {/* PRIMARY VIEW (Requirement 5): Clean, prominent summary */}
        <div className="bg-[#121620] border border-[#242c3d] rounded-lg p-5 shadow-lg">
          <div className="flex items-center justify-between pb-4 border-b border-[#1c2331]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0a2717] border border-[#166534] flex items-center justify-center text-[#22c55e]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                  <span>ACQUISITION COMPLETE</span>
                  <span className="text-[#22c55e]">✓</span>
                </h2>
                <p className="text-[#8b949e] text-[11px]">
                  Physical bit-stream image verified with zero byte drift
                </p>
              </div>
            </div>

            <span className="bg-[#0c2818] text-[#4ade80] px-3 py-1 rounded text-xs font-bold border border-[#166534]">
              STATUS: VERIFIED
            </span>
          </div>

          {/* Key primary fields */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-[#1c2331]">
            <div className="bg-[#0b0e14] p-3 rounded border border-[#1a2130]">
              <span className="text-[10px] text-[#64748b] block mb-1">DEVICE</span>
              <span className="text-white font-bold text-sm block truncate">
                {deviceInfo.manufacturer} NVR
              </span>
              <span className="text-[10px] text-[#38bdf8]">{deviceInfo.totalChannels} Channels</span>
            </div>

            <div className="bg-[#0b0e14] p-3 rounded border border-[#1a2130]">
              <span className="text-[10px] text-[#64748b] block mb-1">STORAGE</span>
              <span className="text-white font-bold text-sm block">4 TB</span>
              <span className="text-[10px] text-[#8b949e]">SATA Disk 0</span>
            </div>

            <div className="bg-[#0b0e14] p-3 rounded border border-[#1a2130]">
              <span className="text-[10px] text-[#64748b] block mb-1">ACQUISITION</span>
              <span className="text-white font-bold text-sm block truncate">Bit-stream Image</span>
              <span className="text-[10px] text-[#f59e0b]">EVID-NVR-001.E01</span>
            </div>

            <div className="bg-[#0b0e14] p-3 rounded border border-[#1a2130]">
              <span className="text-[10px] text-[#64748b] block mb-1">INTEGRITY</span>
              <span className="text-[#22c55e] font-bold text-sm flex items-center gap-1">
                <span>SHA-256</span>
                <span>✓</span>
              </span>
              <span className="text-[10px] text-[#8b949e]">MD5 Matched</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 flex items-center justify-between gap-3">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1a2333] hover:bg-[#232f45] border border-[#2d3a50] text-[#cbd5e1] font-semibold text-xs cursor-pointer transition"
            >
              <span>{showTechnicalDetails ? 'HIDE TECHNICAL DETAILS' : 'VIEW TECHNICAL DETAILS'}</span>
              {showTechnicalDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunSimulation}
                disabled={isAcquiring}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#161f2e] hover:bg-[#1f2c42] border border-[#28364d] text-[#94a3b8] hover:text-white font-semibold text-xs cursor-pointer transition"
              >
                <RotateCw className={`w-3 h-3 ${isAcquiring ? 'animate-spin' : ''}`} />
                <span>Re-verify Acquisition</span>
              </button>

              <button
                onClick={onNavigateToViewer}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs cursor-pointer shadow transition"
              >
                <span>Examine Evidence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* PROGRESSIVE DISCLOSURE: Technical Details (Shown when requested) */}
        {showTechnicalDetails && (
          <div className="bg-[#0f131c] border border-[#242c3d] rounded-lg p-5 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-[#1c2331]">
              <span className="font-bold text-white text-xs flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#38bdf8]" />
                TECHNICAL FORENSIC ACQUISITION DETAILS
              </span>
              <span className="text-[10px] text-[#64748b]">ISO/IEC 27037 Manifest</span>
            </div>

            {/* Cryptographic Digests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
              <div className="bg-[#121620] p-3 rounded border border-[#1e2637] space-y-1">
                <span className="text-[#8b949e] text-[10px] block">ACQUISITION SHA-256:</span>
                <span className="text-[#38bdf8] font-mono break-all font-bold">
                  {deviceInfo.acquisitionHashSHA256}
                </span>
                <div className="text-[10px] text-[#22c55e] pt-1">Status: Hash verified against physical disk</div>
              </div>

              <div className="bg-[#121620] p-3 rounded border border-[#1e2637] space-y-1">
                <span className="text-[#8b949e] text-[10px] block">ACQUISITION MD5:</span>
                <span className="text-[#38bdf8] font-mono break-all font-bold">
                  {deviceInfo.acquisitionHashMD5}
                </span>
                <div className="text-[10px] text-[#22c55e] pt-1">Status: Zero bit divergence</div>
              </div>
            </div>

            {/* Hardware write-blocker & SCSI parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div className="bg-[#121620] p-3 rounded border border-[#1e2637] space-y-1.5">
                <div className="flex items-center justify-between text-[#8b949e]">
                  <span>Write-Blocker Bridge:</span>
                  <span className="text-white font-bold">{deviceInfo.writeBlockerModel}</span>
                </div>
                <div className="flex items-center justify-between text-[#8b949e]">
                  <span>SCSI Command Filter:</span>
                  <span className="text-[#22c55e] font-bold">Write Block Active (0x2A)</span>
                </div>
                <div className="flex items-center justify-between text-[#8b949e]">
                  <span>Bus Protocol:</span>
                  <span className="text-white">USB 3.0 UASP SuperSpeed</span>
                </div>
              </div>

              <div className="bg-[#121620] p-3 rounded border border-[#1e2637] space-y-1.5">
                <div className="flex items-center justify-between text-[#8b949e]">
                  <span>LBA Sector Range:</span>
                  <span className="text-white font-mono">0 to 976,758,551</span>
                </div>
                <div className="flex items-center justify-between text-[#8b949e]">
                  <span>Physical Sector Size:</span>
                  <span className="text-white font-mono">4096 Bytes</span>
                </div>
                <div className="flex items-center justify-between text-[#8b949e]">
                  <span>Forensic Image Size:</span>
                  <span className="text-white font-mono">4,000,787,030,016 B</span>
                </div>
              </div>
            </div>

            {/* Acquisition Methods Selector (Preserved) */}
            <div className="pt-2 border-t border-[#1c2331]">
              <span className="text-[10px] text-[#64748b] block mb-2 font-semibold uppercase">
                Acquisition Image Format:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'PHYSICAL', label: 'Physical Bit-Stream (E01)', note: 'Recommended / Verified' },
                  { id: 'LOGICAL', label: 'Logical File & Stream', note: 'Fast volume scan' },
                  { id: 'IMAGE', label: 'Raw DD (.RAW / .IMG)', note: 'Bit-by-bit flat' }
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setAcquisitionType(m.id as any)}
                    className={`p-2 rounded border cursor-pointer text-left transition ${
                      acquisitionType === m.id
                        ? 'bg-[#1b263b] border-[#38bdf8] text-white font-bold'
                        : 'bg-[#121620] border-[#1e2637] text-[#8b949e]'
                    }`}
                  >
                    <div className="text-[11px]">{m.label}</div>
                    <div className="text-[9px] text-[#64748b]">{m.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
