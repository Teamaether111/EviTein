import React, { useState } from 'react';
import {
  HardDrive,
  Cpu,
  Layers,
  Search,
  ExternalLink,
  Flame,
  FileVideo,
  Info,
  ChevronRight,
  ShieldCheck,
  Eye,
  Crosshair
} from 'lucide-react';
import { StorageSector, DeviceInfo, VendorId } from '../../types/forensics';
import { VENDOR_ADAPTERS } from '../../data/mockForensicData';

interface StorageExplorerProps {
  sectors: StorageSector[];
  deviceInfo: DeviceInfo;
  selectedVendor: VendorId;
  onSelectSectorToExamine: (sector: StorageSector) => void;
  onNavigateToRecording: (recId: string) => void;
  onNavigateToRecovery: (fragmentId?: string) => void;
}

export const StorageExplorer: React.FC<StorageExplorerProps> = ({
  sectors,
  deviceInfo,
  selectedVendor,
  onSelectSectorToExamine,
  onNavigateToRecording,
  onNavigateToRecovery
}) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>('SEC-013'); // FRAG-00382 block
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const selectedSector = sectors.find((s) => s.id === selectedSectorId) || sectors[0];
  const adapter = VENDOR_ADAPTERS[selectedVendor];

  const statusColors: Record<string, { bg: string; border: string; text: string; label: string }> = {
    ACTIVE: { bg: 'bg-[#064e3b]', border: 'border-[#059669]', text: 'text-[#34d399]', label: 'Active Extent' },
    DELETED: { bg: 'bg-[#450a0a]', border: 'border-[#b91c1c]', text: 'text-[#f87171]', label: 'Deleted / Zeroed' },
    RECOVERABLE: { bg: 'bg-[#451a03]', border: 'border-[#d97706]', text: 'text-[#fbbf24]', label: 'Recoverable Carve' },
    FRAGMENTED: { bg: 'bg-[#3b0764]', border: 'border-[#9333ea]', text: 'text-[#c084fc]', label: 'Fragmented GOP' },
    OVERWRITTEN: { bg: 'bg-[#18181b]', border: 'border-[#3f3f46]', text: 'text-[#a1a1aa]', label: 'Overwritten Pattern' },
    UNKNOWN: { bg: 'bg-[#1e293b]', border: 'border-[#475569]', text: 'text-[#94a3b8]', label: 'Unknown / Raw' }
  };

  const filteredSectors = sectors.filter((sec) => {
    if (filterStatus === 'ALL') return true;
    return sec.status === filterStatus;
  });

  // Calculate sector metrics
  const activeCount = sectors.filter((s) => s.status === 'ACTIVE').length;
  const deletedCount = sectors.filter((s) => s.status === 'DELETED').length;
  const recoverableCount = sectors.filter((s) => s.status === 'RECOVERABLE').length;
  const fragmentedCount = sectors.filter((s) => s.status === 'FRAGMENTED').length;
  const overwrittenCount = sectors.filter((s) => s.status === 'OVERWRITTEN').length;

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e14] h-full overflow-hidden select-none font-mono text-xs">
      {/* Header bar */}
      <div className="h-10 px-4 bg-[#141822] border-b border-[#242c3d] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <HardDrive className="w-4 h-4 text-[#38bdf8]" />
            <span>STORAGE & FILE-SYSTEM EXAMINATION</span>
          </div>
          <span className="text-[#475569]">|</span>
          <span className="text-[#38bdf8]">DISK 0 (4.0 TB / SATA-3)</span>
          <span className="text-[#94a3b8]">[{adapter.filesystem}]</span>
        </div>

        {/* Prototype notice */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#1e293b] text-[#94a3b8] px-2 py-0.5 rounded border border-[#334155]">
            SECTOR BLOCK SIZE: 4096 B (CLUSTER: 64 KB)
          </span>
          <span className="text-[10px] bg-[#0c4a6e]/40 text-[#7dd3fc] px-2 py-0.5 rounded border border-[#0284c7]/40">
            RAW EXTENT MAPPER
          </span>
        </div>
      </div>

      {/* Main split view: Sector Grid on Left, Hex & Technical Inspector on Right */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Sector Map & Filters */}
        <div className="flex-1 flex flex-col border-r border-[#1f2635] p-3 overflow-y-auto">
          {/* Status summary filter bar */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-2.5 py-1 rounded text-[11px] border cursor-pointer font-bold ${
                filterStatus === 'ALL'
                  ? 'bg-[#1e293b] border-[#38bdf8] text-white'
                  : 'bg-[#141822] border-[#242c3d] text-[#64748b]'
              }`}
            >
              ALL ({sectors.length})
            </button>
            <button
              onClick={() => setFilterStatus('ACTIVE')}
              className={`px-2.5 py-1 rounded text-[11px] border cursor-pointer ${
                filterStatus === 'ACTIVE'
                  ? 'bg-[#064e3b] border-[#059669] text-white font-bold'
                  : 'bg-[#141822] border-[#242c3d] text-[#34d399]'
              }`}
            >
              ACTIVE ({activeCount})
            </button>
            <button
              onClick={() => setFilterStatus('RECOVERABLE')}
              className={`px-2.5 py-1 rounded text-[11px] border cursor-pointer ${
                filterStatus === 'RECOVERABLE'
                  ? 'bg-[#451a03] border-[#d97706] text-white font-bold'
                  : 'bg-[#141822] border-[#242c3d] text-[#fbbf24]'
              }`}
            >
              RECOVERABLE ({recoverableCount})
            </button>
            <button
              onClick={() => setFilterStatus('DELETED')}
              className={`px-2.5 py-1 rounded text-[11px] border cursor-pointer ${
                filterStatus === 'DELETED'
                  ? 'bg-[#450a0a] border-[#b91c1c] text-white font-bold'
                  : 'bg-[#141822] border-[#242c3d] text-[#f87171]'
              }`}
            >
              DELETED ({deletedCount})
            </button>
            <button
              onClick={() => setFilterStatus('FRAGMENTED')}
              className={`px-2.5 py-1 rounded text-[11px] border cursor-pointer ${
                filterStatus === 'FRAGMENTED'
                  ? 'bg-[#3b0764] border-[#9333ea] text-white font-bold'
                  : 'bg-[#141822] border-[#242c3d] text-[#c084fc]'
              }`}
            >
              FRAGMENTED ({fragmentedCount})
            </button>
            <button
              onClick={() => setFilterStatus('OVERWRITTEN')}
              className={`px-2.5 py-1 rounded text-[11px] border cursor-pointer ${
                filterStatus === 'OVERWRITTEN'
                  ? 'bg-[#27272a] border-[#52525b] text-white font-bold'
                  : 'bg-[#141822] border-[#242c3d] text-[#a1a1aa]'
              }`}
            >
              OVERWRITTEN ({overwrittenCount})
            </button>
          </div>

          {/* Sector Block Grid Visualizer (Authentic forensic disk block map) */}
          <div className="bg-[#0e1219] p-3 rounded border border-[#222a3a] mb-3">
            <div className="flex items-center justify-between text-[11px] text-[#8b949e] mb-2 font-semibold">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>PHYSICAL STORAGE SECTOR BLOCKS (DISK 0 EXTENTS)</span>
              </span>
              <span className="text-[10px] text-[#64748b]">Select block to inspect raw byte offset & hex entropy</span>
            </div>

            {/* Grid of Sector Blocks */}
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5 p-1 bg-[#090b10] rounded border border-[#1a2130]">
              {sectors.map((sec) => {
                const isSelected = selectedSectorId === sec.id;
                const style = statusColors[sec.status];
                const isTargetCarve = sec.id === 'SEC-013';

                return (
                  <div
                    key={sec.id}
                    onClick={() => {
                      setSelectedSectorId(sec.id);
                      onSelectSectorToExamine(sec);
                    }}
                    title={`${sec.id} | Offset: ${sec.offsetHex} | Status: ${sec.status} | Entropy: ${sec.entropy}`}
                    className={`h-11 rounded border cursor-pointer p-1 flex flex-col justify-between transition relative ${
                      style.bg
                    } ${isSelected ? 'ring-2 ring-[#38bdf8] scale-105 z-10 border-white' : style.border} ${
                      isTargetCarve ? 'animate-pulse' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] font-bold">
                      <span className={isSelected ? 'text-white' : style.text}>#{sec.blockNumber}</span>
                      {sec.cameraId && <span className="text-[8px] text-white/80">{sec.cameraId}</span>}
                    </div>
                    <div className="text-[8px] text-[#94a3b8] truncate font-mono">
                      {sec.offsetHex.slice(2, 6)}..
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Storage map legend */}
            <div className="flex items-center justify-between text-[10px] text-[#8b949e] mt-3 pt-2 border-t border-[#1a2130]">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#064e3b] border border-[#059669]" /> ACTIVE
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#451a03] border border-[#d97706]" /> RECOVERABLE
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#450a0a] border border-[#b91c1c]" /> DELETED
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#3b0764] border border-[#9333ea]" /> FRAGMENTED
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded bg-[#18181b] border border-[#3f3f46]" /> OVERWRITTEN
                </span>
              </div>
              <span className="text-[#38bdf8]">64 KB CLUSTERS</span>
            </div>
          </div>

          {/* Sector Table Listing */}
          <div className="flex-1 bg-[#0e1219] rounded border border-[#222a3a] overflow-hidden flex flex-col">
            <div className="h-7 px-3 bg-[#161c27] border-b border-[#222a3a] flex items-center justify-between text-[10px] text-[#8b949e] font-semibold">
              <span>STORAGE EXTENT TABLE (FILTERED)</span>
              <span>COUNT: {filteredSectors.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-[10px]">
                <thead className="bg-[#121620] text-[#64748b] sticky top-0 border-b border-[#1f2635]">
                  <tr>
                    <th className="p-1.5">BLOCK</th>
                    <th className="p-1.5">BYTE OFFSET</th>
                    <th className="p-1.5">STATUS</th>
                    <th className="p-1.5">ALLOCATED</th>
                    <th className="p-1.5">CHANNEL</th>
                    <th className="p-1.5">RECORDING / FRAG</th>
                    <th className="p-1.5">ENTROPY</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#18202d]">
                  {filteredSectors.map((s) => {
                    const isSelected = selectedSectorId === s.id;
                    const style = statusColors[s.status];
                    return (
                      <tr
                        key={s.id}
                        onClick={() => setSelectedSectorId(s.id)}
                        className={`hover:bg-[#182232] cursor-pointer ${
                          isSelected ? 'bg-[#1b263b] text-white font-bold' : 'text-[#cbd5e1]'
                        }`}
                      >
                        <td className="p-1.5 font-mono">#{s.blockNumber}</td>
                        <td className="p-1.5 font-mono text-[#38bdf8]">{s.offsetHex}</td>
                        <td className="p-1.5">
                          <span className={`px-1 py-0.2 rounded border text-[9px] ${style.bg} ${style.border} ${style.text}`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="p-1.5">
                          {s.clusterAllocated ? (
                            <span className="text-[#22c55e]">YES</span>
                          ) : (
                            <span className="text-[#ef4444]">UNALLOCATED</span>
                          )}
                        </td>
                        <td className="p-1.5">{s.cameraId || '—'}</td>
                        <td className="p-1.5 text-[#f59e0b] truncate max-w-[120px]">
                          {s.fragmentId || s.recordingId || '—'}
                        </td>
                        <td className="p-1.5 font-mono">{s.entropy.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Technical Hex & Block Inspector */}
        <div className="w-96 flex flex-col p-3 bg-[#0d1017] overflow-y-auto space-y-3">
          {/* Block Overview Card */}
          <div className="bg-[#121620] border border-[#242c3d] rounded p-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e2533] mb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-[#38bdf8]" />
                BLOCK #{selectedSector.blockNumber} ({selectedSector.id})
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] border font-bold ${
                  statusColors[selectedSector.status].bg
                } ${statusColors[selectedSector.status].border} ${statusColors[selectedSector.status].text}`}
              >
                {selectedSector.status}
              </span>
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Absolute Offset:</span>
                <span className="text-[#38bdf8] font-mono font-bold">{selectedSector.offsetHex}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Extent Allocation:</span>
                <span className={selectedSector.clusterAllocated ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                  {selectedSector.clusterAllocated ? 'Allocated In File Table' : 'Unallocated Space (Carveable)'}
                </span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Shannon Entropy:</span>
                <span className="text-white font-bold">{selectedSector.entropy} / 8.0</span>
              </div>
              {selectedSector.fragmentId && (
                <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                  <span className="text-[#f59e0b]">Carved Fragment:</span>
                  <span className="text-[#f59e0b] font-bold">{selectedSector.fragmentId}</span>
                </div>
              )}
              {selectedSector.recordingId && (
                <div className="flex justify-between py-0.5">
                  <span className="text-[#38bdf8]">Associated Video:</span>
                  <span className="text-white">{selectedSector.recordingId}</span>
                </div>
              )}
            </div>

            {/* Quick action buttons for this block */}
            <div className="mt-3 pt-2 border-t border-[#1e2533] flex gap-2">
              {selectedSector.recordingId && (
                <button
                  onClick={() => onNavigateToRecording(selectedSector.recordingId!)}
                  className="flex-1 bg-[#0369a1] hover:bg-[#0284c7] text-white py-1 rounded text-center text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1"
                >
                  <FileVideo className="w-3 h-3" />
                  <span>Examine Recording</span>
                </button>
              )}
              {selectedSector.fragmentId && (
                <button
                  onClick={() => onNavigateToRecovery(selectedSector.fragmentId)}
                  className="flex-1 bg-[#b45309] hover:bg-[#d97706] text-white py-1 rounded text-center text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1"
                >
                  <Flame className="w-3 h-3" />
                  <span>Carve Recovery</span>
                </button>
              )}
            </div>
          </div>

          {/* Raw Hex & ASCII Dump View */}
          <div className="bg-[#121620] border border-[#242c3d] rounded p-3 flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e2533] mb-2 text-[10px] text-[#8b949e]">
              <span className="font-semibold text-white">RAW STREAM BYTES & HEADERS</span>
              <span>OFFSET: {selectedSector.offsetHex}</span>
            </div>

            {/* Hex Dump Table */}
            <div className="bg-[#07090d] p-2 rounded border border-[#1a2130] font-mono text-[10px] text-[#cbd5e1] space-y-1 overflow-x-auto">
              <div className="text-[#64748b] text-[9px] pb-1 border-b border-[#161c28]">
                HEX STREAM DUMP (FIRST 24 BYTES):
              </div>
              <div className="text-[#38bdf8] tracking-widest break-all font-bold">
                {selectedSector.hexSample}
              </div>
              <div className="text-[#64748b] text-[9px] pt-1.5 border-t border-[#161c28]">
                ASCII INTERPRETATION:
              </div>
              <div className="text-[#a78bfa] tracking-widest">
                {selectedSector.asciiSample}
              </div>
            </div>

            {/* Header Signature Analysis */}
            <div className="mt-3 p-2 bg-[#161c27] rounded border border-[#242e40] text-[10px] space-y-1">
              <div className="text-[#f59e0b] font-bold flex items-center gap-1">
                <Info className="w-3 h-3" />
                <span>FORENSIC HEADER PARSER NOTES</span>
              </div>
              {selectedSector.hexSample.startsWith('00 00 00 01') ? (
                <div className="text-[#cbd5e1]">
                  Detected standard MPEG/H.264/H.265 NAL unit start prefix <code className="text-[#38bdf8]">0x00000001</code>. Valid video stream slice signature.
                </div>
              ) : selectedSector.hexSample.startsWith('48 4B 46 53') ? (
                <div className="text-[#cbd5e1]">
                  Detected proprietary Hikvision HikFS container signature <code className="text-[#38bdf8]">HKFS</code>. Contains volume extent metadata table.
                </div>
              ) : selectedSector.status === 'OVERWRITTEN' ? (
                <div className="text-[#94a3b8]">
                  Zeroed or static bitfill pattern. No recoverable video stream headers detected in this cluster.
                </div>
              ) : (
                <div className="text-[#cbd5e1]">
                  Interleaved audio/video container stream payload. Carving boundary active.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
