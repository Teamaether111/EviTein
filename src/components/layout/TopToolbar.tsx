import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  GitBranch, 
  Play, 
  Lock
} from 'lucide-react';
import { VendorId, ForensicWorkspaceTab } from '../../types/forensics';
import { VENDOR_ADAPTERS } from '../../data/mockForensicData';

interface TopToolbarProps {
  activeTab: ForensicWorkspaceTab;
  onSelectTab: (tab: ForensicWorkspaceTab) => void;
  selectedVendor: VendorId;
  onSelectVendor: (vendor: VendorId) => void;
  onOpenTrace: () => void;
  onOpenAskEvidence: () => void;
  onOpenReport: () => void;
  onOpenCompare: () => void;
  onOpenDemoGuide: () => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  activeTab,
  onSelectTab,
  selectedVendor,
  onSelectVendor,
  onOpenTrace,
  onOpenAskEvidence,
  onOpenReport,
  onOpenCompare,
  onOpenDemoGuide
}) => {
  const currentAdapter = VENDOR_ADAPTERS[selectedVendor];

  // 7 Main Standardized Forensic Stages per requirement:
  // CASE | ACQUIRE | RECOVER | TIMELINE | ANALYZE | VERIFY | REPORT
  const navItems: { label: string; id: string; activeCheck: boolean; onClick: () => void }[] = [
    {
      label: 'CASE',
      id: 'CASE',
      activeCheck: activeTab === 'NOTES',
      onClick: () => onSelectTab('NOTES')
    },
    {
      label: 'ACQUIRE',
      id: 'ACQUIRE',
      activeCheck: activeTab === 'ACQUISITION',
      onClick: () => onSelectTab('ACQUISITION')
    },
    {
      label: 'RECOVER',
      id: 'RECOVER',
      activeCheck: activeTab === 'RECOVERY' || activeTab === 'STORAGE',
      onClick: () => onSelectTab('RECOVERY')
    },
    {
      label: 'TIMELINE',
      id: 'TIMELINE',
      activeCheck: activeTab === 'TIMELINE',
      onClick: () => onSelectTab('TIMELINE')
    },
    {
      label: 'ANALYZE',
      id: 'ANALYZE',
      activeCheck: activeTab === 'VIEWER' || activeTab === 'AI_ANALYSIS' || activeTab === 'COMPARE',
      onClick: () => onSelectTab('VIEWER')
    },
    {
      label: 'VERIFY',
      id: 'VERIFY',
      activeCheck: activeTab === 'INTEGRITY' || activeTab === 'CUSTODY',
      onClick: () => onSelectTab('INTEGRITY')
    },
    {
      label: 'REPORT',
      id: 'REPORT',
      activeCheck: false,
      onClick: onOpenReport
    }
  ];

  return (
    <header className="bg-[#10141c] border-b border-[#232b3b] text-[#c9d1d9] select-none text-xs flex flex-col shrink-0">
      {/* Top Application Bar */}
      <div className="h-10 px-4 flex items-center justify-between border-b border-[#18202d]">
        {/* Left: App Brand & Simplified Top Navigation */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#1c2433] border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8] font-bold text-xs shadow-inner">
              ET
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-white text-sm font-mono">EviTwin</span>
              <span className="text-[10px] text-[#38bdf8] font-mono uppercase bg-[#0c4a6e]/40 px-1.5 py-0.5 rounded border border-[#0284c7]/40">
                SIH26150
              </span>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-[#242c3d]" />

          {/* 7 Simplified Forensic Stage Navigation Items */}
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`px-3 py-1 rounded text-xs font-semibold font-mono tracking-wider transition-all cursor-pointer ${
                  item.activeCheck
                    ? 'bg-[#1b263b] text-[#38bdf8] border border-[#38bdf8]/40 shadow-sm'
                    : 'text-[#8b949e] hover:text-white hover:bg-[#161d2a]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right: Key Tools & Essential Status */}
        <div className="flex items-center gap-2.5">
          {/* Demo Guide */}
          <button
            onClick={onOpenDemoGuide}
            className="flex items-center gap-1.5 bg-[#0369a1]/25 hover:bg-[#0284c7]/35 border border-[#0ea5e9]/40 text-[#7dd3fc] px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer"
            title="Open Interactive Demo Workflow Guide"
          >
            <Play className="w-3 h-3 text-[#38bdf8]" />
            <span className="font-mono">Demo Flow</span>
          </button>

          {/* Ask the Evidence */}
          <button
            onClick={onOpenAskEvidence}
            className="flex items-center gap-1.5 bg-[#171f2c] hover:bg-[#202b3d] border border-[#2b3648] text-[#cbd5e1] px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer"
          >
            <Search className="w-3 h-3 text-[#38bdf8]" />
            <span>Ask the Evidence</span>
          </button>

          {/* Trace to Source */}
          <button
            onClick={onOpenTrace}
            className="flex items-center gap-1.5 bg-[#0369a1] hover:bg-[#0284c7] text-white px-3 py-1 rounded text-xs font-bold font-mono tracking-wide transition cursor-pointer shadow"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>TRACE TO SOURCE</span>
          </button>

          <div className="h-4 w-[1px] bg-[#242c3d]" />

          {/* Write Blocker */}
          <div className="flex items-center gap-1.5 bg-[#0d2217] border border-[#166534] px-2 py-0.5 rounded text-[11px] text-[#4ade80]" title="Hardware write protection active">
            <Lock className="w-3 h-3 text-[#22c55e]" />
            <span className="font-mono">WRITE-BLOCKED</span>
          </div>

          {/* Integrity */}
          <div className="flex items-center gap-1.5 bg-[#0a2013] border border-[#15803d] px-2 py-0.5 rounded text-[11px] text-[#86efac]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
            <span className="font-mono font-bold">VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Sub-bar: Active Context & Vendor Adapter */}
      <div className="h-7 px-4 bg-[#0c0f16] flex items-center justify-between text-[11px] text-[#8b949e]">
        <div className="flex items-center gap-3 font-mono">
          <span className="text-[#64748b]">CASE: <strong className="text-white">CASE-EVT-2026-001</strong></span>
          <span className="text-[#2b3547]">|</span>
          <span className="text-[#64748b]">EVIDENCE: <strong className="text-[#38bdf8]">EVID-NVR-001</strong></span>
          <span className="text-[#2b3547]">|</span>
          <span className="text-[#64748b]">TIME OFFSET: <strong className="text-[#f59e0b]">+00:03:17 (Normalized)</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#64748b] text-[10px] uppercase tracking-wider font-semibold">
            Vendor Adapter:
          </span>
          <select
            value={selectedVendor}
            onChange={(e) => onSelectVendor(e.target.value as VendorId)}
            className="bg-[#151c28] text-[#e2e8f0] border border-[#263347] rounded px-2 py-0.5 text-xs font-mono font-medium focus:outline-none focus:border-[#38bdf8] cursor-pointer"
          >
            <option value="HIKVISION">● HIKVISION (HikFS / HKFS)</option>
            <option value="DAHUA">○ DAHUA (DHFS 4.1)</option>
            <option value="CP_PLUS">○ CP PLUS (OrangeFS)</option>
            <option value="HONEYWELL">○ HONEYWELL (SecureFS)</option>
            <option value="TP_LINK">○ TP-LINK (VIGI)</option>
            <option value="UNIVIEW">○ UNIVIEW (UNV-StorageFS)</option>
            <option value="MATRIX">○ MATRIX (SATATYA)</option>
          </select>
          <span className="text-[10px] text-[#10b981] font-mono bg-[#064e3b]/30 border border-[#059669]/30 px-1.5 py-0.2 rounded">
            {currentAdapter.parserConfidence}% Conf
          </span>
        </div>
      </div>
    </header>
  );
};
