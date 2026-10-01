import React, { useState } from 'react';
import {
  HardDrive,
  Cpu,
  Lock,
  Play,
  RotateCw,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  Layers,
  Terminal,
  ArrowRight
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
  const [progress, setProgress] = useState<number>(68.3);
  const [processedTb, setProcessedTb] = useState<number>(2.73);
  const [readSpeed, setReadSpeed] = useState<number>(184);
  const [statusMessage, setStatusMessage] = useState<string>('Reading storage blocks... SHA-256 & MD5 on-the-fly digest active');
  const [acquisitionComplete, setAcquisitionComplete] = useState<boolean>(true);

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
    }, 350);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e14] h-full overflow-hidden select-none font-mono text-xs">
      {/* Top Header */}
      <div className="h-10 px-4 bg-[#141822] border-b border-[#242c3d] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <HardDrive className="w-4 h-4 text-[#38bdf8]" />
            <span>STANDARDIZED FORENSIC ACQUISITION ENGINE</span>
          </div>
          <span className="text-[#475569]">|</span>
          <span className="text-[#38bdf8]">BIT-STREAM REPLICATOR (E01 / DD)</span>
          <span className="text-[#22c55e]">[WRITE-BLOCKER ACTIVE]</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#1e293b] text-[#94a3b8] px-2 py-0.5 rounded border border-[#334155]">
            ISO/IEC 27037 PROTOCOL
          </span>
          <span className="text-[10px] bg-[#451a03] text-[#fde047] px-2 py-0.5 rounded border border-[#b45309] font-bold">
            SIMULATED ACQUISITION
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Source Device & Hardware Bridge Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Source Device Card */}
          <div className="bg-[#121620] border border-[#242c3d] rounded p-3 space-y-1.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e2533] text-white font-bold">
              <span>SOURCE DEVICE</span>
              <span className="text-[#38bdf8] text-[10px]">{adapter.name.split('/')[0]}</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Manufacturer:</span>
                <span className="text-white font-bold">{deviceInfo.manufacturer}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Model & Channels:</span>
                <span className="text-white">{deviceInfo.model.split(' ')[0]} ({deviceInfo.totalChannels} Ch)</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Storage Capacity:</span>
                <span className="text-white font-bold">{deviceInfo.storageCapacityTb} TB (Disk 0)</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#64748b]">Serial Number:</span>
                <span className="text-[#38bdf8] truncate max-w-[140px]">{deviceInfo.serialNumber}</span>
              </div>
            </div>
          </div>

          {/* Acquisition Method Selector */}
          <div className="bg-[#121620] border border-[#242c3d] rounded p-3 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e2533] text-white font-bold">
              <span>ACQUISITION METHOD</span>
              <span className="text-[#22c55e] text-[10px]">STANDARDIZED</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <label
                onClick={() => setAcquisitionType('PHYSICAL')}
                className={`p-2 rounded border cursor-pointer flex items-center justify-between ${
                  acquisitionType === 'PHYSICAL'
                    ? 'bg-[#1e293b] border-[#38bdf8] text-white font-bold'
                    : 'bg-[#0f131c] border-[#1e2533] text-[#8b949e]'
                }`}
              >
                <span>Physical Bit-Stream (E01 Expert Witness)</span>
                <span className="text-[10px] text-[#22c55e]">RECOMMENDED</span>
              </label>

              <label
                onClick={() => setAcquisitionType('LOGICAL')}
                className={`p-2 rounded border cursor-pointer flex items-center justify-between ${
                  acquisitionType === 'LOGICAL'
                    ? 'bg-[#1e293b] border-[#38bdf8] text-white font-bold'
                    : 'bg-[#0f131c] border-[#1e2533] text-[#8b949e]'
                }`}
              >
                <span>Logical File & Stream Capture</span>
                <span className="text-[10px] text-[#64748b]">QUICK</span>
              </label>

              <label
                onClick={() => setAcquisitionType('IMAGE')}
                className={`p-2 rounded border cursor-pointer flex items-center justify-between ${
                  acquisitionType === 'IMAGE'
                    ? 'bg-[#1e293b] border-[#38bdf8] text-white font-bold'
                    : 'bg-[#0f131c] border-[#1e2533] text-[#8b949e]'
                }`}
              >
                <span>Raw DD Bit-Stream (.RAW / .IMG)</span>
                <span className="text-[10px] text-[#64748b]">FLAT</span>
              </label>
            </div>
          </div>

          {/* Write Blocker Bridge Status */}
          <div className="bg-[#121620] border border-[#242c3d] rounded p-3 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e2533] text-white font-bold">
              <span>WRITE-BLOCKER STATUS</span>
              <span className="text-[#22c55e] text-[10px] bg-[#142e20] px-1 rounded border border-[#166534]">
                ACTIVE
              </span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Bridge Hardware:</span>
                <span className="text-white font-bold">{deviceInfo.writeBlockerModel}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Bus Connection:</span>
                <span className="text-white">USB 3.0 UASP SuperSpeed</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Hardware Intercept:</span>
                <span className="text-[#22c55e] font-bold">SCSI WRITE COMMANDS BLOCKED (0x2A)</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#64748b]">Bad Sectors Detected:</span>
                <span className="text-[#22c55e] font-bold">0 (Clean Media)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Acquisition Progress & Engine Status */}
        <div className="bg-[#121620] border border-[#242c3d] rounded p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e2533]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">ACQUISITION STATUS & PROGRESS</span>
              <span className="text-[10px] text-[#38bdf8] bg-[#0c4a6e]/40 px-1.5 py-0.5 rounded border border-[#0284c7]/40">
                LBA 0 TO 976,758,551
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#64748b]">SPEED: <strong className="text-white">{readSpeed} MB/s</strong></span>
              <span className="text-[#64748b]">PROCESSED: <strong className="text-[#38bdf8]">{processedTb.toFixed(2)} TB</strong> / 4.00 TB</span>
              <span className="text-lg font-bold text-white">{progress.toFixed(1)}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-4 bg-[#0a0d14] rounded-full overflow-hidden p-0.5 border border-[#1e2533]">
            <div
              className="h-full bg-gradient-to-r from-[#0284c7] to-[#38bdf8] rounded-full transition-all duration-300 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#8b949e]">
            <span>Current Operation: <strong className="text-[#cbd5e1]">{statusMessage}</strong></span>
            <span>Integrity: SHA-256 & MD5 on-the-fly calculation active</span>
          </div>

          {/* Acquisition Complete Certificate Banner */}
          {acquisitionComplete && (
            <div className="mt-4 p-4 bg-[#052e16] border border-[#16a34a] rounded space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#4ade80] font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#22c55e]" />
                  <span>ACQUISITION COMPLETE & VERIFIED</span>
                </div>
                <span className="text-[10px] bg-[#166534] text-white px-2 py-0.5 rounded font-bold">
                  BIT-STREAM CERTIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px]">
                <div className="bg-[#0b2416] p-2 rounded border border-[#15803d]">
                  <span className="text-[#86efac] text-[9px] block">ACQUISITION SHA-256 HASH:</span>
                  <span className="text-white font-mono break-all font-bold">
                    {deviceInfo.acquisitionHashSHA256}
                  </span>
                </div>
                <div className="bg-[#0b2416] p-2 rounded border border-[#15803d]">
                  <span className="text-[#86efac] text-[9px] block">ACQUISITION MD5 HASH:</span>
                  <span className="text-white font-mono break-all font-bold">
                    {deviceInfo.acquisitionHashMD5}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#166534] text-[11px]">
                <div className="text-[#bbf7d0]">
                  Target Forensic Image: <strong className="text-white font-mono">EVID-NVR-001.E01</strong> | Size: <strong className="text-white">4,000,787,030,016 Bytes</strong>
                </div>
                <button
                  onClick={onNavigateToViewer}
                  className="bg-[#16a34a] hover:bg-[#15803d] text-white px-3 py-1 rounded font-bold cursor-pointer flex items-center gap-1 shadow"
                >
                  <span>EXAMINE EVIDENCE IN WORKSPACE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Action to re-run simulation */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleRunSimulation}
              disabled={isAcquiring}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold cursor-pointer ${
                isAcquiring
                  ? 'bg-[#1e293b] text-[#64748b] cursor-not-allowed'
                  : 'bg-[#0369a1] hover:bg-[#0284c7] text-white'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isAcquiring ? 'animate-spin' : ''}`} />
              <span>SIMULATE ACQUISITION RUN</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
