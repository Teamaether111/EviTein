import React from 'react';
import { ShieldCheck, Activity } from 'lucide-react';
import { VendorId } from '../../types/forensics';
import { VENDOR_ADAPTERS } from '../../data/mockForensicData';

interface StatusBarProps {
  selectedVendor: VendorId;
  activeRecordingId?: string;
  recoveryFragmentsCount?: number;
  totalRecordingsCount?: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  selectedVendor,
  activeRecordingId = 'REC-CH04-019'
}) => {
  const adapter = VENDOR_ADAPTERS[selectedVendor];
  const vendorName = adapter.id;

  return (
    <footer className="h-6 bg-[#0a0d13] border-t border-[#1c2330] text-[10px] font-mono text-[#8b949e] px-4 flex items-center justify-between select-none shrink-0 z-20">
      {/* Clean essential system status strip */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[#38bdf8]">
          <Activity className="w-3 h-3 text-[#38bdf8]" />
          <span>CASE: CASE-EVT-2026-001</span>
        </div>

        <span className="text-[#263042]">|</span>

        <div className="text-[#cbd5e1]">
          EVIDENCE: <span className="text-white font-semibold">EVID-NVR-001</span>
        </div>

        <span className="text-[#263042]">|</span>

        <div className="flex items-center gap-1 text-[#22c55e]">
          <ShieldCheck className="w-3 h-3 text-[#22c55e]" />
          <span>INTEGRITY: ✓ VERIFIED</span>
        </div>

        <span className="text-[#263042]">|</span>

        <div className="text-[#cbd5e1]">
          PARSER: <span className="text-[#38bdf8] font-semibold">{vendorName}</span>
        </div>

        <span className="text-[#263042]">|</span>

        <div className="text-[#4ade80] font-semibold">
          STATUS: ANALYSIS READY
        </div>
      </div>

      {/* Target item being examined */}
      <div className="flex items-center gap-2 text-[#8b949e]">
        <span>EXAMINING:</span>
        <span className="text-[#38bdf8] font-bold">{activeRecordingId}</span>
      </div>
    </footer>
  );
};
