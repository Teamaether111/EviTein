import React from 'react';
import {
  Play,
  CheckCircle2,
  X,
  ArrowRight,
  GitBranch,
  ShieldCheck,
  Flame,
  Clock,
  HardDrive,
  Cpu,
  FileText
} from 'lucide-react';
import { ForensicWorkspaceTab } from '../../types/forensics';

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteDemoStep: (stepNumber: number) => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  isOpen,
  onClose,
  onExecuteDemoStep
}) => {
  if (!isOpen) return null;

  const demoSteps = [
    {
      step: 1,
      title: 'Open Primary Case',
      desc: 'Open CASE-EVT-2026-001: Commercial Surveillance Evidence Examination.',
      tab: 'NOTES',
      icon: FileText
    },
    {
      step: 2,
      title: 'Open Evidence & Device Identification',
      desc: 'Inspect EVID-NVR-001, HIKVISION NVR DS-7616NI-K2 with 16 Channels & 4TB Storage.',
      tab: 'INTEGRITY',
      icon: Cpu
    },
    {
      step: 3,
      title: 'Examine Storage & Extents',
      desc: 'Examine Disk 0 sector blocks, active vs unallocated extents, and Shannon entropy.',
      tab: 'STORAGE',
      icon: HardDrive
    },
    {
      step: 4,
      title: 'Select Carved Fragment FRAG-00382',
      desc: 'Select deleted fragment at 0x8A23F000 carved from Corridor 4B.',
      tab: 'RECOVERY',
      icon: Flame
    },
    {
      step: 5,
      title: 'Reconstruct Recording',
      desc: 'Execute NAL stream reconstructor to assemble REC-CH04-019 from carved unallocated space.',
      tab: 'RECOVERY',
      icon: Flame
    },
    {
      step: 6,
      title: 'Examine Reconstructed Footage & Timestamp Normalization',
      desc: 'Open REC-CH04-019 in Forensic Video Viewer. Inspect +00:03:17 clock offset normalization.',
      tab: 'VIEWER',
      icon: Clock
    },
    {
      step: 7,
      title: 'Open Cross-Camera Timeline',
      desc: 'Correlate synchronized tracks across Gate, North Parking, Corridor, and Rear Alley.',
      tab: 'TIMELINE',
      icon: Clock
    },
    {
      step: 8,
      title: 'Inspect AI Evidence Detection',
      desc: 'Examine AIF-001 Vehicle/Person detection at 21:14:32 (Frame #38192).',
      tab: 'AI_ANALYSIS',
      icon: Play
    },
    {
      step: 9,
      title: 'TRACE TO SOURCE (Signature Engine)',
      desc: 'Explore unbroken 8-layer provenance: Finding → Frame → Recording → Camera → Fragment → Storage → Image → Hardware.',
      action: 'TRACE',
      icon: GitBranch
    },
    {
      step: 10,
      title: 'Verify Bit-Stream Integrity Hashes',
      desc: 'Audit SHA-256 and MD5 hashes with Tableau T8u write-blocker verification.',
      tab: 'INTEGRITY',
      icon: ShieldCheck
    },
    {
      step: 11,
      title: 'Review Chain of Custody',
      desc: 'Verify unbroken statutory custody transfers from seizure to FSL laboratory.',
      tab: 'CUSTODY',
      icon: ShieldCheck
    },
    {
      step: 12,
      title: 'Generate Official Forensic Examination Report',
      desc: 'Preview and print official 17-section ISO/IEC 27037 formal digital evidence report.',
      action: 'REPORT',
      icon: FileText
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none font-mono">
      <div className="bg-[#0f131c] border border-[#2d3748] rounded-lg shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden text-xs text-[#cbd5e1] max-h-[90vh]">
        {/* Header */}
        <div className="h-11 px-4 bg-[#151a26] border-b border-[#242c3d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#0369a1] text-white flex items-center justify-center font-bold">
              <Play className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">SIH26150 FORENSIC DEMONSTRATION WORKFLOW</span>
              <span className="text-[10px] text-[#38bdf8] ml-2">3–5 MIN EVALUATOR WALKTHROUGH</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#8b949e] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2">
          <div className="p-2.5 bg-[#121620] border border-[#222a3a] rounded text-[11px] text-[#94a3b8] mb-3">
            Click any step below to instantly jump the workstation into that exact forensic examination phase:
          </div>

          <div className="space-y-2">
            {demoSteps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  onClick={() => {
                    onClose();
                    onExecuteDemoStep(s.step);
                  }}
                  className="p-3 bg-[#121620] border border-[#242c3d] hover:border-[#38bdf8] hover:bg-[#161c29] rounded flex items-center justify-between cursor-pointer transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1e293b] text-[#38bdf8] group-hover:bg-[#0284c7] group-hover:text-white flex items-center justify-center font-bold text-xs shrink-0 transition">
                      {s.step}
                    </div>
                    <div>
                      <div className="font-bold text-white text-[12px] group-hover:text-[#38bdf8] transition">
                        {s.title}
                      </div>
                      <div className="text-[10px] text-[#8b949e]">{s.desc}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[#38bdf8] text-[11px] font-bold shrink-0">
                    <span>EXECUTE</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#151a26] border-t border-[#242c3d] flex justify-between items-center text-[10px] text-[#8b949e]">
          <span>EviTwin SIH26150 — Multi-Vendor DVR/NVR Forensics Standard</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#1e293b] hover:bg-[#2b3a52] text-white rounded cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
