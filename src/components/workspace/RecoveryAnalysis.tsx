import React, { useState } from 'react';
import {
  Flame,
  HardDrive,
  FileVideo,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  GitBranch,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';
import { RecoveryFragment, VideoRecording } from '../../types/forensics';

interface RecoveryAnalysisProps {
  fragments: RecoveryFragment[];
  onOpenRecording: (recId: string) => void;
  onOpenTrace: (finding?: any) => void;
}

export const RecoveryAnalysis: React.FC<RecoveryAnalysisProps> = ({
  fragments,
  onOpenRecording,
  onOpenTrace
}) => {
  const [selectedFragmentId, setSelectedFragmentId] = useState<string>('FRAG-00382');
  const [isReconstructing, setIsReconstructing] = useState<boolean>(false);
  const [reconstructionProgress, setReconstructionProgress] = useState<number>(0);
  const [reconstructionStep, setReconstructionStep] = useState<string>('');
  const [reconstructedSuccess, setReconstructedSuccess] = useState<boolean>(false);

  const selectedFragment = fragments.find((f) => f.id === selectedFragmentId) || fragments[0];

  const handleStartReconstruction = () => {
    setIsReconstructing(true);
    setReconstructionProgress(10);
    setReconstructionStep('Scanning unallocated extent at offset 0x8A23F000...');
    setReconstructedSuccess(false);

    setTimeout(() => {
      setReconstructionProgress(35);
      setReconstructionStep('Extracting HEVC SPS/PPS sequence headers (1920x1080 @ 25fps)...');
    }, 700);

    setTimeout(() => {
      setReconstructionProgress(65);
      setReconstructionStep('Stitching contiguous NAL unit slices (4,210 NAL packets)...');
    }, 1400);

    setTimeout(() => {
      setReconstructionProgress(90);
      setReconstructionStep('Recalculating presentation timestamps (PTS/DTS) and container index...');
    }, 2100);

    setTimeout(() => {
      setReconstructionProgress(100);
      setReconstructionStep('Reconstruction complete! Generated REC-CH04-019 (SHA-256 verified).');
      setIsReconstructing(false);
      setReconstructedSuccess(true);
    }, 2800);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e14] h-full overflow-hidden select-none font-mono text-xs">
      {/* Top Header */}
      <div className="h-10 px-4 bg-[#141822] border-b border-[#242c3d] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <Flame className="w-4 h-4 text-[#f59e0b]" />
            <span>DELETED & DAMAGED FOOTAGE RECOVERY MODULE</span>
          </div>
          <span className="text-[#475569]">|</span>
          <span className="text-[#38bdf8]">STORAGE: DISK 0 (EXTENT CARVER)</span>
        </div>

        {/* Prototype notice tag */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#451a03] text-[#fde047] px-2 py-0.5 rounded border border-[#b45309] font-bold">
            SYNTHETIC RECOVERY SIMULATION
          </span>
          <span className="text-[10px] bg-[#1e293b] text-[#94a3b8] px-2 py-0.5 rounded border border-[#334155]">
            SIH26150 PROTOTYPE
          </span>
        </div>
      </div>

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 p-3 bg-[#0d1017] border-b border-[#1f2635]">
        <div className="bg-[#121620] p-2 rounded border border-[#242c3d]">
          <div className="text-[10px] text-[#64748b]">FRAGMENTS FOUND</div>
          <div className="text-lg font-bold text-white">37</div>
        </div>
        <div className="bg-[#121620] p-2 rounded border border-[#242c3d]">
          <div className="text-[10px] text-[#ef4444]">DELETED EXTENTS</div>
          <div className="text-lg font-bold text-[#ef4444]">12</div>
        </div>
        <div className="bg-[#121620] p-2 rounded border border-[#242c3d]">
          <div className="text-[10px] text-[#22c55e]">RECOVERABLE</div>
          <div className="text-lg font-bold text-[#22c55e]">8</div>
        </div>
        <div className="bg-[#121620] p-2 rounded border border-[#242c3d]">
          <div className="text-[10px] text-[#c084fc]">FRAGMENTED</div>
          <div className="text-lg font-bold text-[#c084fc]">5</div>
        </div>
        <div className="bg-[#121620] p-2 rounded border border-[#242c3d]">
          <div className="text-[10px] text-[#94a3b8]">OVERWRITTEN</div>
          <div className="text-lg font-bold text-[#94a3b8]">9</div>
        </div>
        <div className="bg-[#121620] p-2 rounded border border-[#242c3d]">
          <div className="text-[10px] text-[#64748b]">UNKNOWN RAW</div>
          <div className="text-lg font-bold text-[#64748b]">3</div>
        </div>
        <div className="bg-[#121620] p-2 rounded border border-[#0284c7]">
          <div className="text-[10px] text-[#38bdf8]">RECONSTRUCTED</div>
          <div className="text-lg font-bold text-[#38bdf8]">3 CLIPS</div>
        </div>
      </div>

      {/* Main Split: Fragments Table (Left) & Reconstruction Console (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Fragments Table */}
        <div className="flex-1 flex flex-col border-r border-[#1f2635] p-3 overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#38bdf8]" />
              CARVED STORAGE FRAGMENT INVENTORY
            </span>
            <span className="text-[10px] text-[#8b949e]">
              Target incident fragment: <strong className="text-[#f59e0b]">FRAG-00382 (CH-04 Corridor)</strong>
            </span>
          </div>

          <div className="flex-1 bg-[#0e1219] rounded border border-[#222a3a] overflow-hidden flex flex-col">
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-[#161c27] text-[#64748b] sticky top-0 border-b border-[#1f2635]">
                  <tr>
                    <th className="p-2">FRAGMENT ID</th>
                    <th className="p-2">STORAGE OFFSET</th>
                    <th className="p-2">ESTIMATED TIME</th>
                    <th className="p-2">CAMERA</th>
                    <th className="p-2">SIZE</th>
                    <th className="p-2">CODEC</th>
                    <th className="p-2">STATUS</th>
                    <th className="p-2">CONFIDENCE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#18202d]">
                  {fragments.map((frag) => {
                    const isSelected = selectedFragmentId === frag.id;
                    const isTarget = frag.id === 'FRAG-00382';
                    return (
                      <tr
                        key={frag.id}
                        onClick={() => setSelectedFragmentId(frag.id)}
                        className={`hover:bg-[#182232] cursor-pointer transition ${
                          isSelected ? 'bg-[#1b263b] text-white font-bold' : 'text-[#cbd5e1]'
                        } ${isTarget ? 'border-l-4 border-l-[#f59e0b]' : ''}`}
                      >
                        <td className="p-2 font-mono text-[#38bdf8] flex items-center gap-1">
                          {isTarget && <Flame className="w-3 h-3 text-[#f59e0b]" />}
                          <span>{frag.id}</span>
                        </td>
                        <td className="p-2 font-mono">{frag.storageOffsetHex}</td>
                        <td className="p-2">{frag.estimatedTimestamp}</td>
                        <td className="p-2">
                          <span className="font-bold">{frag.cameraId}</span> ({frag.cameraName.split(' ')[0]})
                        </td>
                        <td className="p-2">{frag.sizeMb} MB</td>
                        <td className="p-2 text-[#94a3b8]">{frag.codec.split(' ')[0]}</td>
                        <td className="p-2">
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
                        <td className="p-2 font-bold text-[#38bdf8]">{frag.recoveryConfidence}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Prototype disclaimer footer */}
          <div className="mt-2 p-2 bg-[#121620] rounded border border-[#222a3a] text-[10px] text-[#8b949e] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#f59e0b] shrink-0" />
            <span>
              <strong>Forensic Prototype Note:</strong> Carving algorithms detect MPEG/H.264/H.265 SPS/PPS NAL headers in unallocated clusters. Recovery success depends on sector overwrite state.
            </span>
          </div>
        </div>

        {/* Right: Selected Fragment Details & Reconstruction Console */}
        <div className="w-96 flex flex-col p-3 bg-[#0d1017] overflow-y-auto space-y-3">
          {/* Fragment Card */}
          <div className="bg-[#121620] border border-[#242c3d] rounded p-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e2533] mb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#f59e0b]" />
                FRAGMENT: {selectedFragment.id}
              </span>
              <span className="text-[10px] text-[#22c55e] bg-[#064e3b] px-1.5 py-0.5 rounded border border-[#059669]">
                {selectedFragment.recoveryConfidence}% CONFIDENCE
              </span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Storage Region:</span>
                <span className="text-white">{selectedFragment.sourceRegion}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Start Offset:</span>
                <span className="text-[#38bdf8] font-bold">{selectedFragment.storageOffsetHex}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Estimated Time:</span>
                <span className="text-[#fca5a5] font-bold">{selectedFragment.estimatedTimestamp}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Normalized Time:</span>
                <span className="text-[#38bdf8] font-bold">{selectedFragment.normalizedTimestamp}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Channel:</span>
                <span className="text-white">{selectedFragment.cameraId} - {selectedFragment.cameraName}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">NAL Slices Found:</span>
                <span className="text-[#22c55e] font-bold">{selectedFragment.nalUnitCount.toLocaleString()} units</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">SPS/PPS Sequence:</span>
                <span className={selectedFragment.hasSPS_PPS ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                  {selectedFragment.hasSPS_PPS ? 'VALID HEADERS DETECTED' : 'MISSING (INTERPOLATION REQUIRED)'}
                </span>
              </div>
            </div>

            <div className="mt-2 p-2 bg-[#090b10] rounded text-[10px] text-[#94a3b8] border border-[#1a2130]">
              {selectedFragment.notes}
            </div>
          </div>

          {/* Reconstruction Engine Card */}
          <div className="bg-[#121620] border border-[#242c3d] rounded p-3 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-[#1e2533] mb-2 font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#38bdf8]" />
                  NAL STREAM RECONSTRUCTOR
                </span>
                <span className="text-[10px] text-[#38bdf8]">H.265 CARVER</span>
              </div>

              <p className="text-[10px] text-[#8b949e] mb-3">
                Selects carved slices, reconstructs container atoms (moov/mdat), resolves discontinuous DTS/PTS presentation timestamps, and yields verified playable stream.
              </p>

              {/* Progress bar during simulation */}
              {isReconstructing && (
                <div className="space-y-2 mb-3 bg-[#0a0d14] p-2 rounded border border-[#1e2533]">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#38bdf8] flex items-center gap-1">
                      <RotateCw className="w-3 h-3 animate-spin" />
                      RECONSTRUCTING STREAM...
                    </span>
                    <span className="text-white font-bold">{reconstructionProgress}%</span>
                  </div>
                  <div className="h-2 bg-[#1a2130] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0284c7] to-[#38bdf8] transition-all duration-300"
                      style={{ width: `${reconstructionProgress}%` }}
                    />
                  </div>
                  <div className="text-[9px] text-[#94a3b8] break-words">
                    {reconstructionStep}
                  </div>
                </div>
              )}

              {/* Success Result Box */}
              {reconstructedSuccess && (
                <div className="bg-[#052e16] border border-[#16a34a] p-2.5 rounded text-[10px] space-y-1.5 mb-3">
                  <div className="flex items-center gap-1 text-[#4ade80] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>RECONSTRUCTION SUCCESSFUL</span>
                  </div>
                  <div className="text-[#bbf7d0]">
                    Stream assembled: <strong className="text-white">REC-CH04-019</strong>
                  </div>
                  <div className="text-[#86efac] text-[9px] font-mono break-all">
                    SHA-256: 9a31bc0872efda345021a830172bf421e091244bbca890123ef61720894ca1e7
                  </div>
                  <button
                    onClick={() => onOpenRecording('REC-CH04-019')}
                    className="w-full mt-2 bg-[#16a34a] hover:bg-[#15803d] text-white py-1.5 rounded font-bold flex items-center justify-center gap-1 cursor-pointer shadow"
                  >
                    <Play className="w-3 h-3" />
                    <span>OPEN RECONSTRUCTED FOOTAGE IN VIEWER</span>
                  </button>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2 border-t border-[#1e2533]">
              <button
                onClick={handleStartReconstruction}
                disabled={isReconstructing}
                className={`w-full py-2 px-3 rounded font-bold flex items-center justify-center gap-2 cursor-pointer transition shadow ${
                  isReconstructing
                    ? 'bg-[#1e293b] text-[#64748b] cursor-not-allowed'
                    : 'bg-[#d97706] hover:bg-[#b45309] text-white'
                }`}
              >
                <Flame className="w-4 h-4 text-white" />
                <span>RECONSTRUCT RECORDING</span>
              </button>

              <button
                onClick={() => onOpenTrace()}
                className="w-full bg-[#161c27] hover:bg-[#202838] border border-[#2b3547] text-[#38bdf8] py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <GitBranch className="w-3 h-3" />
                <span>TRACE FRAGMENT PROVENANCE</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
