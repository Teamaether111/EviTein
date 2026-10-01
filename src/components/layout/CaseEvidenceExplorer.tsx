import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileVideo,
  HardDrive,
  Cpu,
  Camera,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Search,
  AlertCircle,
  Clock,
  Sparkles,
  Bookmark,
  FileText,
  FileCheck,
  Layers,
  Flame,
  Radio,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import {
  ForensicWorkspaceTab,
  CameraChannel,
  VideoRecording,
  DeviceInfo,
  VendorId
} from '../../types/forensics';

interface CaseEvidenceExplorerProps {
  activeTab: ForensicWorkspaceTab;
  onSelectTab: (tab: ForensicWorkspaceTab) => void;
  cameras: CameraChannel[];
  recordings: VideoRecording[];
  selectedCameraId: string | null;
  onSelectCamera: (cameraId: string | null) => void;
  selectedRecordingId: string;
  onSelectRecording: (recordingId: string) => void;
  deviceInfo: DeviceInfo;
  selectedVendor: VendorId;
  recoveredCount: number;
  aiFindingsCount: number;
  timelineEventsCount: number;
  bookmarksCount: number;
}

export const CaseEvidenceExplorer: React.FC<CaseEvidenceExplorerProps> = ({
  activeTab,
  onSelectTab,
  cameras,
  recordings,
  selectedCameraId,
  onSelectCamera,
  selectedRecordingId,
  onSelectRecording,
  deviceInfo,
  selectedVendor,
  recoveredCount,
  aiFindingsCount,
  timelineEventsCount,
  bookmarksCount
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Tree expansion states
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    caseRoot: true,
    evidenceRoot: true,
    deviceNode: true,
    storageNode: false,
    camerasNode: true,
    recordingsNode: true,
    recoveredNode: true,
    aiNode: false,
    timelineNode: false
  });

  const toggleNode = (nodeKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [nodeKey]: !prev[nodeKey] }));
  };

  const filteredRecordings = recordings.filter(r => {
    if (selectedCameraId && r.cameraId !== selectedCameraId) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.id.toLowerCase().includes(term) ||
      r.cameraName.toLowerCase().includes(term) ||
      r.startTime.toLowerCase().includes(term) ||
      r.status.toLowerCase().includes(term)
    );
  });

  return (
    <aside className="w-72 bg-[#12161f] border-r border-[#242c3d] flex flex-col shrink-0 text-xs text-[#c9d1d9] select-none h-full overflow-hidden">
      {/* Explorer Header */}
      <div className="h-8 px-3 bg-[#161b26] border-b border-[#242c3d] flex items-center justify-between font-mono text-[11px] font-semibold text-[#8b949e]">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>CASE & EVIDENCE TREE</span>
        </div>
        <span className="text-[10px] text-[#64748b]">v1.4</span>
      </div>

      {/* Quick Search */}
      <div className="p-2 border-b border-[#1f2635] bg-[#0e121a]">
        <div className="relative">
          <Search className="w-3 h-3 absolute left-2 top-2 text-[#64748b]" />
          <input
            type="text"
            placeholder="Filter cameras, clips, hashes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#161c27] text-white text-xs pl-7 pr-2 py-1 rounded border border-[#2b3547] focus:outline-none focus:border-[#38bdf8] placeholder-[#556173] font-mono text-[11px]"
          />
        </div>
      </div>

      {/* Hierarchical Tree Body */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-[11px]">
        {/* CASE NODE */}
        <div>
          <div
            onClick={() => onSelectTab('NOTES')}
            className={`flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-[#1a2130] cursor-pointer group ${
              activeTab === 'NOTES' ? 'bg-[#1e293b] text-[#38bdf8] font-bold' : 'text-white'
            }`}
          >
            <span
              onClick={(e) => toggleNode('caseRoot', e)}
              className="text-[#64748b] hover:text-white p-0.5"
            >
              {expandedNodes.caseRoot ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </span>
            <FolderOpen className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span className="truncate">CASE-EVT-2026-001</span>
          </div>

          {expandedNodes.caseRoot && (
            <div className="pl-4 border-l border-[#242c3d] ml-3 mt-1 space-y-0.5">
              {/* Case Info Item */}
              <div
                onClick={() => onSelectTab('NOTES')}
                className={`flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-[#1a2130] cursor-pointer ${
                  activeTab === 'NOTES' ? 'bg-[#1a2233] text-[#38bdf8]' : 'text-[#94a3b8]'
                }`}
              >
                <FileText className="w-3 h-3 text-[#94a3b8]" />
                <span>Case Information & Notes</span>
              </div>

              {/* Chain of Custody Item */}
              <div
                onClick={() => onSelectTab('CUSTODY')}
                className={`flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-[#1a2130] cursor-pointer ${
                  activeTab === 'CUSTODY' ? 'bg-[#1a2233] text-[#38bdf8]' : 'text-[#94a3b8]'
                }`}
              >
                <FileCheck className="w-3 h-3 text-[#22c55e]" />
                <span className="flex-1">Chain of Custody</span>
                <span className="text-[10px] bg-[#142e20] text-[#4ade80] px-1 rounded border border-[#166534]">
                  Verified
                </span>
              </div>

              {/* EVIDENCE ROOT */}
              <div className="pt-1">
                <div
                  onClick={() => onSelectTab('VIEWER')}
                  className="flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-[#1a2130] cursor-pointer text-white font-medium"
                >
                  <span
                    onClick={(e) => toggleNode('evidenceRoot', e)}
                    className="text-[#64748b] hover:text-white p-0.5"
                  >
                    {expandedNodes.evidenceRoot ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </span>
                  <HardDrive className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>EVID-NVR-001</span>
                </div>

                {expandedNodes.evidenceRoot && (
                  <div className="pl-4 border-l border-[#242c3d] ml-3 mt-1 space-y-0.5">
                    {/* Device Node */}
                    <div>
                      <div
                        onClick={() => onSelectTab('INTEGRITY')}
                        className="flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-[#1a2130] cursor-pointer text-[#cbd5e1]"
                      >
                        <span
                          onClick={(e) => toggleNode('deviceNode', e)}
                          className="text-[#64748b] hover:text-white p-0.5"
                        >
                          {expandedNodes.deviceNode ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </span>
                        <Cpu className="w-3 h-3 text-[#a78bfa]" />
                        <span>Device: {deviceInfo.manufacturer}</span>
                      </div>

                      {expandedNodes.deviceNode && (
                        <div className="pl-4 border-l border-[#222938] ml-2 text-[10px] text-[#8b949e] py-0.5 space-y-0.5">
                          <div className="px-1 py-0.5 truncate">Model: {deviceInfo.model.split(' ')[0]}</div>
                          <div className="px-1 py-0.5 truncate">SN: {deviceInfo.serialNumber.slice(0, 14)}...</div>
                          <div className="px-1 py-0.5 text-[#38bdf8]">Channels: {deviceInfo.totalChannels} ({deviceInfo.activeCameras} Active)</div>
                        </div>
                      )}
                    </div>

                    {/* Storage / Filesystem Node */}
                    <div>
                      <div
                        onClick={() => onSelectTab('STORAGE')}
                        className={`flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-[#1a2130] cursor-pointer ${
                          activeTab === 'STORAGE' ? 'bg-[#1a2233] text-[#38bdf8]' : 'text-[#cbd5e1]'
                        }`}
                      >
                        <span
                          onClick={(e) => toggleNode('storageNode', e)}
                          className="text-[#64748b] hover:text-white p-0.5"
                        >
                          {expandedNodes.storageNode ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </span>
                        <HardDrive className="w-3 h-3 text-[#38bdf8]" />
                        <span className="flex-1">Storage: Disk 0</span>
                        <span className="text-[10px] text-[#64748b]">4 TB</span>
                      </div>

                      {expandedNodes.storageNode && (
                        <div className="pl-4 border-l border-[#222938] ml-2 text-[10px] text-[#8b949e] py-0.5 space-y-0.5">
                          <div className="px-1 py-0.5 flex items-center justify-between text-[#22c55e]">
                            <span>● Active Extents:</span>
                            <span>24</span>
                          </div>
                          <div className="px-1 py-0.5 flex items-center justify-between text-[#ef4444]">
                            <span>● Deleted/Zeroed:</span>
                            <span>5</span>
                          </div>
                          <div className="px-1 py-0.5 flex items-center justify-between text-[#f59e0b]">
                            <span>● Recoverable Carve:</span>
                            <span>5</span>
                          </div>
                          <div className="px-1 py-0.5 flex items-center justify-between text-[#a855f7]">
                            <span>● Fragmented:</span>
                            <span>3</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cameras Tree Node */}
                    <div>
                      <div
                        onClick={() => onSelectCamera(null)}
                        className={`flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-[#1a2130] cursor-pointer ${
                          selectedCameraId === null && activeTab === 'VIEWER' ? 'bg-[#1a2233] text-[#38bdf8]' : 'text-[#cbd5e1]'
                        }`}
                      >
                        <span
                          onClick={(e) => toggleNode('camerasNode', e)}
                          className="text-[#64748b] hover:text-white p-0.5"
                        >
                          {expandedNodes.camerasNode ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </span>
                        <Camera className="w-3 h-3 text-[#38bdf8]" />
                        <span className="flex-1">Cameras ({cameras.length})</span>
                      </div>

                      {expandedNodes.camerasNode && (
                        <div className="pl-4 border-l border-[#222938] ml-2 space-y-0.5 py-0.5">
                          {cameras.map((cam) => {
                            const isSelected = selectedCameraId === cam.id;
                            const isFocusCam = cam.id === 'CH-04';
                            return (
                              <div
                                key={cam.id}
                                onClick={() => {
                                  onSelectCamera(cam.id);
                                  onSelectTab('VIEWER');
                                }}
                                className={`flex items-center justify-between px-1.5 py-1 rounded hover:bg-[#1a2130] cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#1e293b] text-[#38bdf8] font-semibold border-l-2 border-[#38bdf8]'
                                    : 'text-[#94a3b8]'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  <span className={`w-1.5 h-1.5 rounded-full ${cam.status === 'Active' ? 'bg-[#22c55e]' : 'bg-[#f59e0b]'}`} />
                                  <span className="font-bold text-[10px]">{cam.id}</span>
                                  <span className="truncate text-[10px]">{cam.name.split(' ')[0]}</span>
                                </div>
                                {isFocusCam && (
                                  <span className="text-[9px] bg-[#dc2626]/30 text-[#fca5a5] px-1 rounded border border-[#ef4444]/40 font-bold">
                                    INCIDENT
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Recordings Node */}
                    <div>
                      <div
                        onClick={() => onSelectTab('VIEWER')}
                        className={`flex items-center gap-1.5 px-1.5 py-1 rounded hover:bg-[#1a2130] cursor-pointer ${
                          activeTab === 'VIEWER' ? 'bg-[#1a2233] text-[#38bdf8]' : 'text-[#cbd5e1]'
                        }`}
                      >
                        <span
                          onClick={(e) => toggleNode('recordingsNode', e)}
                          className="text-[#64748b] hover:text-white p-0.5"
                        >
                          {expandedNodes.recordingsNode ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                        </span>
                        <FileVideo className="w-3 h-3 text-[#38bdf8]" />
                        <span className="flex-1">Recordings ({recordings.length})</span>
                      </div>

                      {expandedNodes.recordingsNode && (
                        <div className="pl-4 border-l border-[#222938] ml-2 space-y-0.5 py-0.5 max-h-48 overflow-y-auto">
                          {filteredRecordings.map((rec) => {
                            const isSelected = selectedRecordingId === rec.id;
                            const isRecovered = rec.status === 'Recovered';
                            return (
                              <div
                                key={rec.id}
                                onClick={() => {
                                  onSelectRecording(rec.id);
                                  onSelectTab('VIEWER');
                                }}
                                className={`flex items-center justify-between px-1.5 py-1 rounded hover:bg-[#1a2130] cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#1e293b] text-[#38bdf8] font-bold border-l-2 border-[#38bdf8]'
                                    : 'text-[#94a3b8]'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  <FileVideo className={`w-3 h-3 ${isRecovered ? 'text-[#f59e0b]' : 'text-[#64748b]'}`} />
                                  <span className="text-[10px] truncate">{rec.id}</span>
                                </div>
                                <span className={`text-[9px] px-1 rounded font-mono ${
                                  isRecovered ? 'bg-[#78350f]/50 text-[#fde68a] border border-[#f59e0b]/40' : 'text-[#64748b]'
                                }`}>
                                  {isRecovered ? 'CARVED' : rec.cameraId}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Recovered Carved Evidence Node */}
                    <div
                      onClick={() => onSelectTab('RECOVERY')}
                      className={`flex items-center justify-between px-1.5 py-1 rounded hover:bg-[#1a2130] cursor-pointer ${
                        activeTab === 'RECOVERY' ? 'bg-[#1a2233] text-[#38bdf8]' : 'text-[#cbd5e1]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-3 h-3 text-[#f59e0b]" />
                        <span>Carved & Recovered</span>
                      </div>
                      <span className="text-[10px] bg-[#451a03] text-[#fde047] px-1.5 py-0.2 rounded border border-[#b45309]">
                        {recoveredCount} Frags
                      </span>
                    </div>

                    {/* AI Findings Node */}
                    <div
                      onClick={() => onSelectTab('AI_ANALYSIS')}
                      className={`flex items-center justify-between px-1.5 py-1 rounded hover:bg-[#1a2130] cursor-pointer ${
                        activeTab === 'AI_ANALYSIS' ? 'bg-[#1a2233] text-[#38bdf8]' : 'text-[#cbd5e1]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-[#c084fc]" />
                        <span>AI Video Findings</span>
                      </div>
                      <span className="text-[10px] bg-[#3b0764] text-[#e9d5ff] px-1.5 py-0.2 rounded border border-[#7e22ce]">
                        {aiFindingsCount}
                      </span>
                    </div>

                    {/* Timeline Events Node */}
                    <div
                      onClick={() => onSelectTab('TIMELINE')}
                      className={`flex items-center justify-between px-1.5 py-1 rounded hover:bg-[#1a2130] cursor-pointer ${
                        activeTab === 'TIMELINE' ? 'bg-[#1a2233] text-[#38bdf8]' : 'text-[#cbd5e1]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#38bdf8]" />
                        <span>Correlated Timeline</span>
                      </div>
                      <span className="text-[10px] bg-[#0c4a6e] text-[#bae6fd] px-1.5 py-0.2 rounded border border-[#0369a1]">
                        {timelineEventsCount}
                      </span>
                    </div>

                    {/* Hash & Integrity Verification */}
                    <div
                      onClick={() => onSelectTab('INTEGRITY')}
                      className={`flex items-center justify-between px-1.5 py-1 rounded hover:bg-[#1a2130] cursor-pointer ${
                        activeTab === 'INTEGRITY' ? 'bg-[#1a2233] text-[#38bdf8]' : 'text-[#cbd5e1]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3 text-[#22c55e]" />
                        <span>Hash Integrity Verification</span>
                      </div>
                      <span className="text-[9px] text-[#22c55e] font-mono">MATCH</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explorer Footer Badges */}
      <div className="p-2 border-t border-[#1e2533] bg-[#0a0d13] text-[10px] font-mono flex items-center justify-between text-[#64748b]">
        <span>SECTOR CARVER: <strong className="text-[#38bdf8]">IDR/SPS READY</strong></span>
        <span>HIK-HCS</span>
      </div>
    </aside>
  );
};
