import React, { useState } from 'react';
import {
  HardDrive,
  Cpu,
  Layers,
  FileVideo,
  Flame,
  ChevronDown,
  ChevronUp,
  Crosshair,
  ArrowRight
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
  const [showRawHexDetails, setShowRawHexDetails] = useState<boolean>(true);

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

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e14] h-full overflow-hidden select-none font-mono text-xs">
      {/* Top Header */}
      <div className="h-10 px-4 bg-[#141822] border-b border-[#242c3d] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <HardDrive className="w-4 h-4 text-[#38bdf8]" />
            <span>STORAGE & FILE-SYSTEM ANALYSIS</span>
          </div>
          <span className="text-[#475569]">|</span>
          <span className="text-[#38bdf8]">DISK 0 (4.0 TB / SATA-3)</span>
        </div>

        <button
          onClick={() => onNavigateToRecovery()}
          className="text-[#8b949e] hover:text-white px-2.5 py-1 rounded bg-[#182030] border border-[#2b3547] text-[11px] cursor-pointer"
        >
          Carved Fragments Inventory →
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-y-auto max-w-5xl mx-auto w-full space-y-4">
        {/* Requirement 12: Storage Overview Card */}
        <div className="bg-[#121620] border border-[#242c3d] rounded-lg p-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1c2331] mb-3">
            <span className="font-bold text-white text-xs">STORAGE OVERVIEW</span>
            <span className="text-[10px] text-[#38bdf8] bg-[#0369a1]/20 px-2 py-0.5 rounded border border-[#0284c7]/30">
              CLUSTER ALLOCATION MAP
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 text-center">
            <div className="bg-[#0b0e14] p-2 rounded border border-[#1a2130]">
              <span className="text-[10px] text-[#64748b] block">DISK</span>
              <span className="text-sm font-bold text-white">4 TB</span>
            </div>
            <div className="bg-[#0b0e14] p-2 rounded border border-[#1a2130]">
              <span className="text-[10px] text-[#64748b] block">FILESYSTEM</span>
              <span className="text-sm font-bold text-[#38bdf8] truncate block" title={adapter.filesystem}>
                {adapter.filesystem.split(' ')[0]}
              </span>
            </div>
            <div className="bg-[#0b0e14] p-2 rounded border border-[#1a2130]">
              <span className="text-[10px] text-[#64748b] block">BLOCKS</span>
              <span className="text-sm font-bold text-white">37</span>
            </div>
            <div className="bg-[#0b0e14] p-2 rounded border border-[#1a2130]">
              <span className="text-[10px] text-[#fbbf24] block">RECOVERABLE</span>
              <span className="text-sm font-bold text-[#fbbf24]">5</span>
            </div>
            <div className="bg-[#0b0e14] p-2 rounded border border-[#1a2130]">
              <span className="text-[10px] text-[#f87171] block">DELETED</span>
              <span className="text-sm font-bold text-[#f87171]">4</span>
            </div>
            <div className="bg-[#0b0e14] p-2 rounded border border-[#1a2130]">
              <span className="text-[10px] text-[#c084fc] block">FRAGMENTED</span>
              <span className="text-sm font-bold text-[#c084fc]">2</span>
            </div>
            <div className="bg-[#0b0e14] p-2 rounded border border-[#1a2130]">
              <span className="text-[10px] text-[#a1a1aa] block">OVERWRITTEN</span>
              <span className="text-sm font-bold text-[#a1a1aa]">3</span>
            </div>
          </div>
        </div>

        {/* Sector Map Visualizer Grid */}
        <div className="bg-[#121620] border border-[#242c3d] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs">PHYSICAL STORAGE BLOCKS (EXTENT VISUALIZER)</span>
              <span className="text-[10px] text-[#64748b]">— Select a block to inspect raw byte details</span>
            </div>

            {/* Quick status filters */}
            <div className="flex items-center gap-1.5 text-[10px]">
              {['ALL', 'ACTIVE', 'RECOVERABLE', 'DELETED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2 py-0.5 rounded border cursor-pointer ${
                    filterStatus === st
                      ? 'bg-[#1e293b] border-[#38bdf8] text-white font-bold'
                      : 'bg-[#10141d] border-[#1e2637] text-[#64748b]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Block Grid */}
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-1.5 p-2 bg-[#090b10] rounded-lg border border-[#1a2130]">
            {filteredSectors.map((sec) => {
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

          {/* Legend */}
          <div className="flex items-center justify-between text-[10px] text-[#8b949e] pt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-[#064e3b] border border-[#059669]" /> Active
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-[#451a03] border border-[#d97706]" /> Recoverable
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-[#450a0a] border border-[#b91c1c]" /> Deleted
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded bg-[#3b0764] border border-[#9333ea]" /> Fragmented
              </span>
            </div>
            <span>64 KB Clusters</span>
          </div>
        </div>

        {/* Selected Block Technical Detail Inspector (Requirement 12: Appears when a block is selected) */}
        <div className="bg-[#121620] border border-[#242c3d] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1c2331]">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-[#38bdf8]" />
              <span className="font-bold text-white text-xs">
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

            <button
              onClick={() => setShowRawHexDetails(!showRawHexDetails)}
              className="text-[#38bdf8] hover:underline text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>{showRawHexDetails ? 'Hide Raw Bytes' : 'Inspect Raw Bytes'}</span>
              {showRawHexDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
            <div>
              <span className="text-[#64748b] block text-[10px]">BYTE OFFSET:</span>
              <span className="text-[#38bdf8] font-bold font-mono">{selectedSector.offsetHex}</span>
            </div>
            <div>
              <span className="text-[#64748b] block text-[10px]">ALLOCATION:</span>
              <span className={selectedSector.clusterAllocated ? 'text-[#22c55e]' : 'text-[#f59e0b]'}>
                {selectedSector.clusterAllocated ? 'Allocated Table' : 'Unallocated Space'}
              </span>
            </div>
            <div>
              <span className="text-[#64748b] block text-[10px]">SHANNON ENTROPY:</span>
              <span className="text-white font-bold">{selectedSector.entropy} / 8.0</span>
            </div>
            <div>
              <span className="text-[#64748b] block text-[10px]">ASSOCIATED ARTIFACT:</span>
              <span className="text-[#f59e0b] truncate block">
                {selectedSector.fragmentId || selectedSector.recordingId || 'Free Extent'}
              </span>
            </div>
          </div>

          {/* Raw Bytes & Parser Notes (Progressive disclosure) */}
          {showRawHexDetails && (
            <div className="pt-2 border-t border-[#1c2331] space-y-2 text-[11px] animate-in fade-in duration-150">
              <div className="bg-[#07090d] p-3 rounded border border-[#1a2130] font-mono text-[10px] space-y-1">
                <span className="text-[#64748b] text-[9px] block">RAW STREAM BYTES (HEADER SLICES):</span>
                <div className="text-[#38bdf8] tracking-widest break-all font-bold">
                  {selectedSector.hexSample}
                </div>
                <div className="text-[#a78bfa] tracking-widest pt-1">
                  {selectedSector.asciiSample}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                {selectedSector.fragmentId ? (
                  <button
                    onClick={() => onNavigateToRecovery(selectedSector.fragmentId)}
                    className="bg-[#b45309] hover:bg-[#d97706] text-white px-3 py-1.5 rounded font-bold text-xs cursor-pointer flex items-center gap-1"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Carve Stream Recovery ({selectedSector.fragmentId}) →</span>
                  </button>
                ) : selectedSector.recordingId ? (
                  <button
                    onClick={() => onNavigateToRecording(selectedSector.recordingId!)}
                    className="bg-[#0369a1] hover:bg-[#0284c7] text-white px-3 py-1.5 rounded font-bold text-xs cursor-pointer flex items-center gap-1"
                  >
                    <FileVideo className="w-3.5 h-3.5" />
                    <span>Open Associated Video ({selectedSector.recordingId}) →</span>
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
