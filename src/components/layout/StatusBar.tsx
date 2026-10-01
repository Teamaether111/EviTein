import React, { useState, useEffect } from 'react';
import { ShieldCheck, HardDrive, Cpu, Terminal, Clock, Radio, Activity } from 'lucide-react';
import { VendorId } from '../../types/forensics';
import { VENDOR_ADAPTERS } from '../../data/mockForensicData';

interface StatusBarProps {
  selectedVendor: VendorId;
  activeRecordingId?: string;
  recoveryFragmentsCount: number;
  totalRecordingsCount: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  selectedVendor,
  activeRecordingId = 'REC-CH04-019',
  recoveryFragmentsCount,
  totalRecordingsCount
}) => {
  const [currentTimeUtc, setCurrentTimeUtc] = useState<string>('');
  const [currentTimeIst, setCurrentTimeIst] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeUtc(now.toUTCString().replace('GMT', 'UTC'));
      setCurrentTimeIst(now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const adapter = VENDOR_ADAPTERS[selectedVendor];

  return (
    <footer className="h-6 bg-[#0a0d13] border-t border-[#1e2533] text-[10px] font-mono text-[#8b949e] px-3 flex items-center justify-between select-none shrink-0 z-20">
      {/* Left side: System and forensic flags */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[#38bdf8]">
          <Activity className="w-3 h-3 text-[#38bdf8] animate-pulse" />
          <span>CASE: CASE-EVT-2026-001</span>
        </div>

        <span className="text-[#334155]">|</span>

        <div className="flex items-center gap-1.5 text-[#cbd5e1]">
          <HardDrive className="w-3 h-3 text-[#94a3b8]" />
          <span>STORAGE: Disk 0 (4,000,787,030,016 B / 4.0 TB)</span>
        </div>

        <span className="text-[#334155]">|</span>

        <div className="flex items-center gap-1.5 text-[#22c55e]">
          <ShieldCheck className="w-3 h-3 text-[#22c55e]" />
          <span>INTEGRITY: SHA-256 MATCHED</span>
        </div>

        <span className="text-[#334155]">|</span>

        <div className="flex items-center gap-1.5 text-[#e2e8f0]">
          <Cpu className="w-3 h-3 text-[#60a5fa]" />
          <span>PARSER: {adapter.name.split('/')[0].trim()}</span>
        </div>

        <span className="text-[#334155]">|</span>

        <div className="text-[#f59e0b]">
          OFFSET: +00:03:17 (ANALYTICAL NORMALIZED)
        </div>
      </div>

      {/* Right side: Active Target & Station Clock */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-[#94a3b8]">
          <span>EXAMINING:</span>
          <span className="text-[#38bdf8] font-bold">{activeRecordingId}</span>
        </div>

        <span className="text-[#334155]">|</span>

        <div className="text-[#94a3b8]">
          RECORDS: <span className="text-white font-semibold">{totalRecordingsCount}</span> | CARVED FRAGS: <span className="text-[#f59e0b] font-semibold">{recoveryFragmentsCount}</span>
        </div>

        <span className="text-[#334155]">|</span>

        <div className="flex items-center gap-1.5 text-[#cbd5e1]">
          <Clock className="w-3 h-3 text-[#64748b]" />
          <span>{currentTimeIst}</span>
        </div>
      </div>
    </footer>
  );
};
