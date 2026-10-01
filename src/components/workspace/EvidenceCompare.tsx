import React, { useState } from 'react';
import {
  SplitSquareVertical,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  GitBranch,
  Crosshair,
  FileVideo
} from 'lucide-react';
import { VideoRecording } from '../../types/forensics';

interface EvidenceCompareProps {
  recordings: VideoRecording[];
  onOpenTrace: () => void;
}

export const EvidenceCompare: React.FC<EvidenceCompareProps> = ({
  recordings,
  onOpenTrace
}) => {
  const [leftRecId, setLeftRecId] = useState<string>('REC-CH04-018'); // Original Active
  const [rightRecId, setRightRecId] = useState<string>('REC-CH04-019'); // Carved Recovered
  const [compareMode, setCompareMode] = useState<'ORIG_VS_REC' | 'CAM_VS_CAM' | 'TIME_NORMALIZED'>('ORIG_VS_REC');
  const [syncScrub, setSyncScrub] = useState<boolean>(true);
  const [syncFrame, setSyncFrame] = useState<number>(38192);

  const leftRec = recordings.find((r) => r.id === leftRecId) || recordings[1];
  const rightRec = recordings.find((r) => r.id === rightRecId) || recordings[0];

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e14] h-full overflow-hidden select-none font-mono text-xs">
      {/* Top Header */}
      <div className="h-10 px-4 bg-[#141822] border-b border-[#242c3d] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <SplitSquareVertical className="w-4 h-4 text-[#38bdf8]" />
            <span>FORENSIC EVIDENCE DUAL-STREAM COMPARISON ENGINE</span>
          </div>
          <span className="text-[#475569]">|</span>
          <span className="text-[#38bdf8]">SYNCHRONIZED TIMECODE COMPARATOR</span>
        </div>

        {/* Comparison Preset Modes */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setCompareMode('ORIG_VS_REC');
              setLeftRecId('REC-CH04-018');
              setRightRecId('REC-CH04-019');
            }}
            className={`px-2.5 py-1 rounded text-[11px] border cursor-pointer font-bold ${
              compareMode === 'ORIG_VS_REC'
                ? 'bg-[#0284c7] border-[#38bdf8] text-white'
                : 'bg-[#182030] border-[#2b3547] text-[#8b949e]'
            }`}
          >
            ORIGINAL VS RECOVERED
          </button>
          <button
            onClick={() => {
              setCompareMode('CAM_VS_CAM');
              setLeftRecId('REC-CH01-042');
              setRightRecId('REC-CH05-022');
            }}
            className={`px-2.5 py-1 rounded text-[11px] border cursor-pointer font-bold ${
              compareMode === 'CAM_VS_CAM'
                ? 'bg-[#0284c7] border-[#38bdf8] text-white'
                : 'bg-[#182030] border-[#2b3547] text-[#8b949e]'
            }`}
          >
            GATE IN (CH-01) VS GATE OUT (CH-05)
          </button>
          <button
            onClick={() => {
              setCompareMode('TIME_NORMALIZED');
              setLeftRecId('REC-CH04-019');
              setRightRecId('REC-CH04-019');
            }}
            className={`px-2.5 py-1 rounded text-[11px] border cursor-pointer font-bold ${
              compareMode === 'TIME_NORMALIZED'
                ? 'bg-[#0284c7] border-[#38bdf8] text-white'
                : 'bg-[#182030] border-[#2b3547] text-[#8b949e]'
            }`}
          >
            RAW CLOCK VS NORMALIZED
          </button>
        </div>
      </div>

      {/* Main Split Comparison View */}
      <div className="flex-1 flex flex-col p-3 overflow-hidden">
        {/* Dual Video Viewports */}
        <div className="flex-1 grid grid-cols-2 gap-3 mb-3">
          {/* Left Viewport */}
          <div className="bg-[#0e1219] rounded border border-[#222a3a] flex flex-col overflow-hidden">
            {/* Viewport Header */}
            <div className="h-8 px-3 bg-[#161c27] border-b border-[#222a3a] flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8]" />
                <span>EXHIBIT A: {leftRec.id}</span>
                <span className="text-[#94a3b8]">({leftRec.cameraName})</span>
              </div>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                leftRec.status === 'Recovered' ? 'bg-[#78350f] text-[#fde047]' : 'bg-[#064e3b] text-[#34d399]'
              }`}>
                {leftRec.status}
              </span>
            </div>

            {/* Simulated Frame Canvas */}
            <div className="flex-1 bg-black flex flex-col items-center justify-center relative p-3">
              <div className="w-full h-full bg-[#111622] rounded border border-[#1f2838] flex flex-col justify-between p-3 relative overflow-hidden">
                {/* Surveillance OSD */}
                <div className="flex justify-between text-[#fde047] font-bold text-[11px]">
                  <span>{leftRec.cameraId} - RAW DEVICE STREAM</span>
                  <span className="text-white font-mono">{leftRec.startTime}</span>
                </div>

                <div className="text-center text-[#64748b] my-auto">
                  <FileVideo className="w-10 h-10 mx-auto mb-1 text-[#38bdf8]/40" />
                  <div className="text-white font-bold">{leftRec.cameraName}</div>
                  <div className="text-[10px] text-[#94a3b8]">Resolution: {leftRec.resolution} | Codec: {leftRec.codec}</div>
                </div>

                <div className="flex justify-between text-[10px] text-[#94a3b8] border-t border-[#1e2533] pt-1">
                  <span>MD5: {leftRec.md5.slice(0, 16)}...</span>
                  <span className="text-[#38bdf8]">FRAME #{syncFrame}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Viewport */}
          <div className="bg-[#0e1219] rounded border border-[#222a3a] flex flex-col overflow-hidden">
            {/* Viewport Header */}
            <div className="h-8 px-3 bg-[#161c27] border-b border-[#222a3a] flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                <span>EXHIBIT B: {rightRec.id}</span>
                <span className="text-[#94a3b8]">({rightRec.cameraName})</span>
              </div>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                rightRec.status === 'Recovered' ? 'bg-[#78350f] text-[#fde047]' : 'bg-[#064e3b] text-[#34d399]'
              }`}>
                {rightRec.status === 'Recovered' ? 'CARVED & RECONSTRUCTED' : rightRec.status}
              </span>
            </div>

            {/* Simulated Frame Canvas */}
            <div className="flex-1 bg-black flex flex-col items-center justify-center relative p-3">
              <div className="w-full h-full bg-[#151a24] rounded border border-[#1f2838] flex flex-col justify-between p-3 relative overflow-hidden">
                {/* Surveillance OSD */}
                <div className="flex justify-between text-[#fde047] font-bold text-[11px]">
                  <span>{rightRec.cameraId} - {rightRec.status === 'Recovered' ? 'CARVED EXTENT' : 'STREAM'}</span>
                  <span className="text-[#38bdf8] font-bold font-mono">
                    {compareMode === 'TIME_NORMALIZED' ? `${rightRec.normalizedStartTime} [NORM]` : rightRec.startTime}
                  </span>
                </div>

                <div className="text-center text-[#64748b] my-auto">
                  <FileVideo className="w-10 h-10 mx-auto mb-1 text-[#f59e0b]/40" />
                  <div className="text-white font-bold">{rightRec.cameraName}</div>
                  <div className="text-[10px] text-[#fde047]">
                    {rightRec.status === 'Recovered' ? 'Unallocated Carve Confidence: 87%' : 'Active Stream'}
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-[#94a3b8] border-t border-[#1e2533] pt-1">
                  <span>MD5: {rightRec.md5.slice(0, 16)}...</span>
                  <span className="text-[#f59e0b]">FRAME #{syncFrame}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Property Delta Table */}
        <div className="h-44 bg-[#121620] rounded border border-[#242c3d] p-3 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#1e2533] mb-1 font-bold text-white text-[11px]">
            <span>TECHNICAL METADATA DELTA COMPARISON</span>
            <button
              onClick={onOpenTrace}
              className="text-[#38bdf8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <GitBranch className="w-3 h-3" />
              <span>Trace Provenance</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-[10px]">
              <thead className="text-[#64748b] border-b border-[#1a2130]">
                <tr>
                  <th className="py-1">METRIC</th>
                  <th className="py-1">EXHIBIT A ({leftRec.id})</th>
                  <th className="py-1">EXHIBIT B ({rightRec.id})</th>
                  <th className="py-1">CORRELATION / DELTA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18202d] text-[#cbd5e1]">
                <tr>
                  <td className="py-1 text-[#8b949e]">Storage Provenance:</td>
                  <td className="py-1 text-white">{leftRec.storageRegion}</td>
                  <td className="py-1 text-white">{rightRec.storageRegion}</td>
                  <td className="py-1 text-[#f59e0b]">Contiguous Extent Boundary</td>
                </tr>
                <tr>
                  <td className="py-1 text-[#8b949e]">Raw Device Start Time:</td>
                  <td className="py-1 text-[#fca5a5]">{leftRec.startTime}</td>
                  <td className="py-1 text-[#fca5a5]">{rightRec.startTime}</td>
                  <td className="py-1 text-white">Delta: 00:44:32</td>
                </tr>
                <tr>
                  <td className="py-1 text-[#8b949e]">Normalized Timestamp:</td>
                  <td className="py-1 text-[#38bdf8]">{leftRec.normalizedStartTime}</td>
                  <td className="py-1 text-[#38bdf8]">{rightRec.normalizedStartTime}</td>
                  <td className="py-1 text-[#22c55e]">Master Clock Aligned</td>
                </tr>
                <tr>
                  <td className="py-1 text-[#8b949e]">File Size / Container:</td>
                  <td className="py-1">{leftRec.fileSizeMb} MB ({leftRec.format})</td>
                  <td className="py-1">{rightRec.fileSizeMb} MB ({rightRec.format})</td>
                  <td className="py-1 text-[#38bdf8]">Valid NAL Packets</td>
                </tr>
                <tr>
                  <td className="py-1 text-[#8b949e]">SHA-256 Digest:</td>
                  <td className="py-1 font-mono text-[9px] truncate max-w-[200px]">{leftRec.sha256}</td>
                  <td className="py-1 font-mono text-[9px] truncate max-w-[200px]">{rightRec.sha256}</td>
                  <td className="py-1 text-[#22c55e]">Unique Immutable Hashes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
