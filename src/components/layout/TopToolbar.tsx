import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Search, 
  GitBranch, 
  FileText, 
  SplitSquareVertical, 
  Play, 
  AlertTriangle,
  Lock,
  Layers,
  ChevronDown,
  Info
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

  const menuItems: { label: string; tab?: ForensicWorkspaceTab; action?: () => void }[] = [
    { label: 'Case', tab: 'NOTES' },
    { label: 'Evidence', tab: 'VIEWER' },
    { label: 'Acquire', tab: 'ACQUISITION' },
    { label: 'Storage', tab: 'STORAGE' },
    { label: 'Recover', tab: 'RECOVERY' },
    { label: 'Timeline', tab: 'TIMELINE' },
    { label: 'AI Analysis', tab: 'AI_ANALYSIS' },
    { label: 'Verify', tab: 'INTEGRITY' },
    { label: 'Custody', tab: 'CUSTODY' },
    { label: 'Compare', action: onOpenCompare },
    { label: 'Report', action: onOpenReport }
  ];

  return (
    <header className="bg-[#12161f] border-b border-[#242c3d] text-[#c9d1d9] select-none text-xs flex flex-col shrink-0">
      {/* Top Application Bar */}
      <div className="h-10 px-3 flex items-center justify-between border-b border-[#1b2230]">
        {/* Left: App Brand & Forensic Standard Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#1e293b] border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8] font-bold text-xs shadow-inner">
              ET
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wider text-white text-sm font-mono">EviTwin</span>
                <span className="text-[10px] text-[#38bdf8] font-mono uppercase bg-[#0c4a6e]/40 px-1.5 py-0.5 rounded border border-[#0284c7]/40">
                  SIH26150 Workstation
                </span>
              </div>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-[#2d3748] mx-1" />

          {/* Quick Menu Links */}
          <nav className="flex items-center space-x-1">
            {menuItems.map((item, idx) => {
              const isActive = item.tab && activeTab === item.tab;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else if (item.tab) {
                      onSelectTab(item.tab);
                    }
                  }}
                  className={`px-2.5 py-1 rounded transition-colors text-xs font-medium cursor-pointer ${
                    isActive
                      ? 'bg-[#1e293b] text-[#38bdf8] border border-[#38bdf8]/30 font-semibold'
                      : 'text-[#94a3b8] hover:text-white hover:bg-[#1a202c]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Forensic Status Badges & Quick Tools */}
        <div className="flex items-center gap-2">
          {/* Demo Guide Button */}
          <button
            onClick={onOpenDemoGuide}
            className="flex items-center gap-1.5 bg-[#0369a1]/30 hover:bg-[#0284c7]/40 border border-[#0ea5e9]/50 text-[#7dd3fc] px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer"
            title="Open Interactive Demo Workflow Guide"
          >
            <Play className="w-3 h-3 text-[#38bdf8]" />
            <span className="font-mono">Demo Flow</span>
          </button>

          {/* Ask the Evidence Button */}
          <button
            onClick={onOpenAskEvidence}
            className="flex items-center gap-1.5 bg-[#1e293b] hover:bg-[#283548] border border-[#334155] text-[#cbd5e1] px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer"
          >
            <Search className="w-3 h-3 text-[#38bdf8]" />
            <span>Ask the Evidence</span>
          </button>

          {/* Trace to Source Quick Button */}
          <button
            onClick={onOpenTrace}
            className="flex items-center gap-1.5 bg-[#152e3d] hover:bg-[#1b3d52] border border-[#0284c7]/60 text-[#38bdf8] px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer"
          >
            <GitBranch className="w-3 h-3 text-[#38bdf8]" />
            <span className="font-bold tracking-tight">TRACE TO SOURCE</span>
          </button>

          <div className="h-4 w-[1px] bg-[#2d3748] mx-1" />

          {/* Write Blocker Hardware Status */}
          <div className="flex items-center gap-1.5 bg-[#11241a] border border-[#166534] px-2 py-0.5 rounded text-[11px] text-[#4ade80]">
            <Lock className="w-3 h-3 text-[#22c55e]" />
            <span className="font-mono">WRITE-BLOCKED (T8u)</span>
          </div>

          {/* Integrity Match Status */}
          <div className="flex items-center gap-1.5 bg-[#0d2818] border border-[#15803d] px-2 py-0.5 rounded text-[11px] text-[#86efac]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22c55e]" />
            <span className="font-mono font-bold">INTEGRITY: MATCH</span>
          </div>
        </div>
      </div>

      {/* Sub-toolbar: Active Case Context & Multi-Vendor Parser Selector */}
      <div className="h-8 px-3 bg-[#0d1017] flex items-center justify-between text-[11px] text-[#8b949e]">
        {/* Case & Evidence Meta Breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[#64748b]">CASE:</span>
            <span className="text-white font-semibold bg-[#1e2533] px-1.5 py-0.5 rounded border border-[#2b3547]">
              CASE-EVT-2026-001
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[#64748b]">EVIDENCE:</span>
            <span className="text-[#38bdf8] font-semibold bg-[#0f2438] px-1.5 py-0.5 rounded border border-[#0284c7]/40">
              EVID-NVR-001
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#64748b]">EXAMINER:</span>
            <span className="text-[#cbd5e1]">Insp. R. Varma, DFC-418</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-[#64748b]">CLOCK SKEW:</span>
            <span className="text-[#f59e0b] font-medium">+00:03:17 (Normalized)</span>
          </div>
        </div>

        {/* Vendor Parser Adapter Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[#64748b] text-[10px] uppercase tracking-wider font-semibold">
            Vendor Parser Adapter:
          </span>
          <div className="relative inline-flex items-center">
            <select
              value={selectedVendor}
              onChange={(e) => onSelectVendor(e.target.value as VendorId)}
              className="bg-[#182030] text-[#e2e8f0] border border-[#2e3b52] rounded px-2.5 py-0.5 text-xs font-mono font-medium focus:outline-none focus:border-[#38bdf8] cursor-pointer"
            >
              <option value="HIKVISION">● HIKVISION (HikFS v4.2 / HKFS)</option>
              <option value="DAHUA">○ DAHUA (DHFS 4.1 / SmartParser)</option>
              <option value="CP_PLUS">○ CP PLUS (OrangeFS / UVR Stream)</option>
              <option value="HONEYWELL">○ HONEYWELL (SecureFS / MaxPro)</option>
              <option value="TP_LINK">○ TP-LINK (VIGI Raw Stream v2)</option>
              <option value="UNIVIEW">○ UNIVIEW (UNV-StorageFS / U-Code)</option>
              <option value="MATRIX">○ MATRIX (SATATYA Clustered BlockFS)</option>
            </select>
          </div>
          <span className="text-[10px] text-[#10b981] font-mono bg-[#064e3b]/40 border border-[#059669]/40 px-1.5 py-0.5 rounded">
            {currentAdapter.parserConfidence}% Confidence
          </span>
        </div>
      </div>
    </header>
  );
};
