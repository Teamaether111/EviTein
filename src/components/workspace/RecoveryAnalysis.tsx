import React, { useState } from 'react';
import {
  Flame,
  FileVideo,
  CheckCircle2,
  Play,
  RotateCw,
  GitBranch,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Info,
  Cpu,
  Layers
} from 'lucide-react';
import { RecoveryFragment } from '../../types/forensics';

interface RecoveryAnalysisProps {
  fragments: RecoveryFragment[];
  onOpenRecording: (recId: string) => void;
  onOpenTrace: (finding?: any) => void;
  onSwitchToStorage?: () => void;
}

export const RecoveryAnalysis: React.FC<RecoveryAnalysisProps> = ({
  fragments,
  onOpenRecording,
  onOpenTrace,
  onSwitchToStorage
}) => {
  const [selectedFragmentId, setSelectedFragmentId] = useState<string>('FRAG-00382');
  const [isReconstructing, setIsReconstructing] = useState<boolean>(false);
  const [reconstructionProgress, setReconstructionProgress] = useState<number>(100);
  const [reconstructionStep, setReconstructionStep] = useState<string>('Generated REC-CH04-019 (SHA-256 verified).');
  const [reconstructedSuccess, setReconstructedSuccess] = useState<boolean>(true);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  const selectedFragment = fragments.find((f) => f.id === selectedFragmentId) || fragments[0];

  const handleStartReconstruction = () => {
    setIsReconstructing(true);
    setReconstructionProgress(10);
    setReconstructionStep('Scanning unallocated extent at offset 0x8A23F000...');
    setReconstructedSuccess(false);

    setTimeout(() => {
      setReconstructionProgress(40);
      setReconstructionStep('Extracting HEVC SPS/PPS sequence headers (1920x1080 @ 25fps)...');
    }, 500);

    setTimeout(() => {
      setReconstructionProgress(70);
      setReconstructionStep('Stitching contiguous NAL unit slices (4,210 NAL packets)...');
    }, 1100);

    setTimeout(() => {
      setReconstructionProgress(100);
      setReconstructionStep('Reconstruction complete! Generated REC-CH04-019 (SHA-256 verified).');
      setIsReconstructing(false);
      setReconstructedSuccess(true);
    }, 1700);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e14] h-full overflow-hidden select-none font-mono text-xs">
      {/* Top Header with sub-mode tabs */}
      <div className="h-10 px-4 bg-[#141822] border-b border-[#242c3d] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <Flame className="w-4 h-4 text-[#f59e0b]" />
            <span>RECOVERY & CARVING ANALYSIS</span>
          </div>
          <span className="text-[#475569]">|</span>
          <span className="text-[#38bdf8]">DISK 0 UNALLOCATED EXTENTS</span>
        </div>

        {/* Sub-navigation between Recovery and Storage */}
        <div className="flex items-center gap-2">
          {onSwitchToStorage && (
            <button
              onClick={onSwitchToStorage}
              className="px-2.5 py-1 rounded bg-[#182030] hover:bg-[#202b40] border border-[#2b3547] text-[#8b949e] hover:text-white cursor-pointer text-[11px]"
            >
              View Storage Block Map →
            </button>
          )}
          <span className="text-[10px] bg-[#451a03] text-[#fde047] px-2 py-0.5 rounded border border-[#b45309] font-bold">
            SYNTHETIC RECOVERY
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-y-auto max-w-5xl mx-auto w-full space-y-4">
        {/* Requirement 6: Prominent summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-[#121620] p-3 rounded-lg border border-[#242c3d] text-center">
            <span className="text-[10px] text-[#22c55e] font-semibold block mb-0.5">RECOVERABLE</span>
            <span className="text-xl font-bold text-white">8</span>
          </div>
          <div className="bg-[#121620] p-3 rounded-lg border border-[#0284c7] text-center bg-[#0369a1]/10">
            <span className="text-[10px] text-[#38bdf8] font-semibold block mb-0.5">RECONSTRUCTED</span>
            <span className="text-xl font-bold text-[#38bdf8]">3</span>
          </div>
          <div className="bg-[#121620] p-3 rounded-lg border border-[#242c3d] text-center">
            <span className="text-[10px] text-[#c084fc] font-semibold block mb-0.5">FRAGMENTED</span>
            <span className="text-xl font-bold text-white">5</span>
          </div>
          <div className="bg-[#121620] p-3 rounded-lg border border-[#242c3d] text-center">
            <span className="text-[10px] text-[#ef4444] font-semibold block mb-0.5">DELETED</span>
            <span className="text-xl font-bold text-white">12</span>
          </div>
          <div className="bg-[#121620] p-3 rounded-lg border border-[#242c3d] text-center">
            <span className="text-[10px] text-[#94a3b8] font-semibold block mb-0.5">OVERWRITTEN</span>
            <span className="text-xl font-bold text-white">9</span>
          </div>
        </div>

        {/* Requirement 6: Prominent Banner */}
        <div className="bg-[#052e16] border border-[#16a34a] rounded-lg p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#166534] text-white flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5 text-[#4ade80]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">3 recordings reconstructed successfully</h3>
              <p className="text-[11px] text-[#86efac]">
                Primary incident footage (REC-CH04-019) restored from unallocated cluster 0x8A23F000
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenRecording('REC-CH04-019')}
              className="bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-2 rounded font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow"
            >
              <Play className="w-3.5 h-3.5" />
              <span>VIEW RECOVERED EVIDENCE</span>
            </button>
          </div>
        </div>

        {/* Clean Fragment Inventory Table */}
        <div className="bg-[#121620] border border-[#242c3d] rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 bg-[#161c27] border-b border-[#242c3d] flex items-center justify-between">
            <span className="font-bold text-white text-xs">
              CARVED STORAGE FRAGMENTS ({fragments.length})
            </span>
            <span className="text-[10px] text-[#8b949e]">
              Click a fragment to inspect technical forensic details
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-[#10141d] text-[#64748b] border-b border-[#1f2635]">
                <tr>
                  <th className="p-2.5">FRAGMENT ID</th>
                  <th className="p-2.5">OFFSET</th>
                  <th className="p-2.5">CAMERA</th>
                  <th className="p-2.5">ESTIMATED TIME</th>
                  <th className="p-2.5">STATUS</th>
                  <th className="p-2.5">CONFIDENCE</th>
                  <th className="p-2.5 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18202d] text-[#cbd5e1]">
                {fragments.map((frag) => {
                  const isSelected = selectedFragmentId === frag.id;
                  const isTarget = frag.id === 'FRAG-00382';
                  return (
                    <tr
                      key={frag.id}
                      onClick={() => setSelectedFragmentId(frag.id)}
                      className={`hover:bg-[#182232] cursor-pointer transition ${
                        isSelected ? 'bg-[#1b263b] text-white font-semibold' : ''
                      }`}
                    >
                      <td className="p-2.5 font-mono text-[#38bdf8] flex items-center gap-1.5">
                        {isTarget && <Flame className="w-3.5 h-3.5 text-[#f59e0b]" />}
                        <span>{frag.id}</span>
                      </td>
                      <td className="p-2.5 font-mono text-[#8b949e]">{frag.storageOffsetHex}</td>
                      <td className="p-2.5">
                        <span className="font-bold">{frag.cameraId}</span> ({frag.cameraName.split(' ')[0]})
                      </td>
                      <td className="p-2.5 text-[#8b949e]">{frag.estimatedTimestamp.split(' ')[1]}</td>
                      <td className="p-2.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            frag.status === 'Recoverable'
                              ? 'bg-[#064e3b] text-[#34d399] border border-[#059669]'
                              : frag.status === 'Deleted'
                              ? 'bg-[#450a0a] text-[#f87171] border border-[#b91c1c]'
                              : 'bg-[#3b0764] text-[#c084fc] border border-[#9333ea]'
                          }`}
                        >
                          {frag.status}
                        </span>
                      </td>
                      <td className="p-2.5 font-bold text-[#38bdf8]">{frag.recoveryConfidence}%</td>
                      <td className="p-2.5 text-right">
                        {frag.associatedRecordingId ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenRecording(frag.associatedRecordingId!);
                            }}
                            className="text-[#38bdf8] hover:underline font-bold text-[10px]"
                          >
                            Open Stream →
                          </button>
                        ) : (
                          <span className="text-[#64748b] text-[10px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Fragment Detail & Reconstruction Drawer (Progressive Disclosure) */}
        <div className="bg-[#121620] border border-[#242c3d] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1c2331]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs">
                SELECTED FRAGMENT: {selectedFragment.id}
              </span>
              <span className="text-[10px] bg-[#0c2818] text-[#4ade80] px-1.5 py-0.5 rounded border border-[#166534]">
                {selectedFragment.recoveryConfidence}% Confidence
              </span>
            </div>

            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="text-[#38bdf8] hover:underline text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>{showTechnicalDetails ? 'Hide Technical Metadata' : 'View Technical Metadata'}</span>
              {showTechnicalDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <div>
              <span className="text-[#64748b] block text-[10px]">STORAGE OFFSET:</span>
              <span className="text-white font-mono font-bold">{selectedFragment.storageOffsetHex}</span>
            </div>
            <div>
              <span className="text-[#64748b] block text-[10px]">EXTENT SIZE:</span>
              <span className="text-white font-bold">{selectedFragment.sizeMb} MB</span>
            </div>
            <div>
              <span className="text-[#64748b] block text-[10px]">STREAM CODEC:</span>
              <span className="text-white">{selectedFragment.codec}</span>
            </div>
            <div>
              <span className="text-[#64748b] block text-[10px]">NAL SLICES:</span>
              <span className="text-[#22c55e] font-bold">{selectedFragment.nalUnitCount.toLocaleString()} units</span>
            </div>
          </div>

          {/* Technical expansion */}
          {showTechnicalDetails && (
            <div className="pt-2 border-t border-[#1c2331] space-y-2 text-[11px] animate-in fade-in duration-150">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0b0e14] p-2.5 rounded border border-[#1a2130]">
                  <span className="text-[#64748b] text-[10px] block">PROVENANCE REGION:</span>
                  <span className="text-[#38bdf8]">{selectedFragment.sourceRegion}</span>
                  <span className="text-[10px] text-[#8b949e] block mt-1">
                    SPS/PPS Sequence: {selectedFragment.hasSPS_PPS ? 'Validated in stream' : 'Interpolated'}
                  </span>
                </div>
                <div className="bg-[#0b0e14] p-2.5 rounded border border-[#1a2130]">
                  <span className="text-[#64748b] text-[10px] block">OBSERVATIONAL NOTES:</span>
                  <span className="text-[#cbd5e1]">{selectedFragment.notes}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 border-t border-[#1c2331] flex items-center justify-between">
            <button
              onClick={() => onOpenTrace()}
              className="bg-[#161f2e] hover:bg-[#1f2c42] border border-[#2b374a] text-[#38bdf8] px-3 py-1.5 rounded font-bold text-xs cursor-pointer flex items-center gap-1.5"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>TRACE FRAGMENT PROVENANCE</span>
            </button>

            <button
              onClick={handleStartReconstruction}
              disabled={isReconstructing}
              className="bg-[#d97706] hover:bg-[#b45309] text-white px-4 py-1.5 rounded font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow"
            >
              <Flame className={`w-3.5 h-3.5 ${isReconstructing ? 'animate-spin' : ''}`} />
              <span>{isReconstructing ? 'RECONSTRUCTING...' : 'RECONSTRUCT RECORDING'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
