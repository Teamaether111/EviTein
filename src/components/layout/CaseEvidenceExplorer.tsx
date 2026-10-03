import React, { useState } from 'react';
import {
  FolderOpen,
  FileVideo,
  HardDrive,
  Cpu,
  Camera,
  ChevronRight,
  ChevronDown,
  Search,
  FileText,
  FileCheck,
  Layers,
  Flame,
  Sparkles,
  Clock,
  ShieldCheck
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
  
  // Requirement 3: Collapsed by default!
  // Only the main case and evidence root are expanded.
  // Cameras, Recordings, Storage, Recovered Evidence are collapsed by default.
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    caseRoot: true,
    evidenceRoot: true,
    deviceNode: false,
    storageNode: false,
    camerasNode: false,
    recordingsNode: false,
    recoveredNode: false,
    aiNode: false,
    timelineNode: false
  });

  const toggleNode = (nodeKey: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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
    <aside className="w-64 bg-[#0f131b] border-r border-[#1f2635] flex flex-col shrink-0 text-xs text-[#c9d1d9] select-none h-full overflow-hidden">
      {/* Explorer Header */}
      <div className="h-9 px-3 bg-[#131822] border-b border-[#1f2635] flex items-center justify-between font-mono text-[11px] font-semibold text-[#8b949e]">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span>EVIDENCE TREE</span>
        </div>
        <span className="text-[10px] text-[#64748b]">CASE EXPLORER</span>
      </div>

      {/* Quick Search */}
      <div className="p-2 border-b border-[#1a2130] bg-[#0b0e14]">
        <div className="relative">
          <Search className="w-3 h-3 absolute left-2.5 top-2 text-[#64748b]" />
          <input
            type="text"
            placeholder="Search channels, clips, hashes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#131824] text-white text-[11px] pl-7 pr-2 py-1 rounded border border-[#242e40] focus:outline-none focus:border-[#38bdf8] placeholder-[#556173] font-mono"
          />
        </div>
      </div>

      {/* Hierarchical Tree Body with Progressive Disclosure */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-[11px]">
        {/* CASE ROOT */}
        <div>
          <div
            onClick={() => onSelectTab('NOTES')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[#161c28] cursor-pointer group ${
              activeTab === 'NOTES' ? 'bg-[#1b263b] text-[#38bdf8] font-bold' : 'text-white'
            }`}
          >
            <span
              onClick={(e) => toggleNode('caseRoot', e)}
              className="text-[#64748b] hover:text-white p-0.5"
            >
              {expandedNodes.caseRoot ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </span>
            <FolderOpen className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span className="truncate font-semibold">CASE-EVT-2026-001</span>
          </div>

          {expandedNodes.caseRoot && (
            <div className="pl-3.5 border-l border-[#1f2838] ml-3 mt-1 space-y-0.5">
              {/* Case Info Item */}
              <div
                onClick={() => onSelectTab('NOTES')}
                className={`flex items-center gap-2 px-2 py-1 rounded hover:bg-[#161c28] cursor-pointer ${
                  activeTab === 'NOTES' ? 'bg-[#182234] text-[#38bdf8]' : 'text-[#8b949e]'
                }`}
              >
                <FileText className="w-3 h-3 text-[#94a3b8]" />
                <span>Case Information</span>
              </div>

              {/* Chain of Custody Item */}
              <div
                onClick={() => onSelectTab('CUSTODY')}
                className={`flex items-center justify-between px-2 py-1 rounded hover:bg-[#161c28] cursor-pointer ${
                  activeTab === 'CUSTODY' ? 'bg-[#182234] text-[#38bdf8]' : 'text-[#8b949e]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileCheck className="w-3 h-3 text-[#22c55e]" />
                  <span>Chain of Custody</span>
                </div>
                <span className="text-[9px] bg-[#0c2818] text-[#4ade80] px-1 rounded border border-[#166534]">
                  Verified
                </span>
              </div>

              {/* EVIDENCE NODE */}
              <div className="pt-0.5">
                <div
                  onClick={() => onSelectTab('VIEWER')}
                  className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-[#161c28] cursor-pointer text-white font-medium"
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
                  <div className="pl-3.5 border-l border-[#1f2838] ml-3 mt-1 space-y-0.5">
                    {/* Device Node (Collapsed by default) */}
                    <div>
                      <div
                        onClick={(e) => toggleNode('deviceNode', e)}
                        className="flex items-center justify-between px-2 py-1 rounded hover:bg-[#161c28] cursor-pointer text-[#cbd5e1]"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#64748b] p-0.5">
                            {expandedNodes.deviceNode ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </span>
                          <Cpu className="w-3 h-3 text-[#a78bfa]" />
                          <span>Device: {deviceInfo.manufacturer}</span>
                        </div>
                      </div>

                      {expandedNodes.deviceNode && (
                        <div className="pl-4 border-l border-[#222b3b] ml-3 text-[10px] text-[#8b949e] py-1 space-y-1">
                          <div className="px-1 truncate">Model: {deviceInfo.model.split(' ')[0]}</div>
                          <div className="px-1 truncate font-mono">SN: {deviceInfo.serialNumber.slice(0, 14)}...</div>
                          <div className="px-1 text-[#38bdf8]">Channels: {deviceInfo.totalChannels} ({deviceInfo.activeCameras} Active)</div>
                          <div
                            onClick={() => onSelectTab('ACQUISITION')}
                            className="px-1 text-[#4ade80] hover:underline cursor-pointer flex items-center gap-1 pt-0.5"
                          >
                            <span>Inspect Acquisition →</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Storage Node (Collapsed by default) */}
                    <div>
                      <div
                        onClick={() => {
                          toggleNode('storageNode');
                          onSelectTab('STORAGE');
                        }}
                        className={`flex items-center justify-between px-2 py-1 rounded hover:bg-[#161c28] cursor-pointer ${
                          activeTab === 'STORAGE' ? 'bg-[#182234] text-[#38bdf8]' : 'text-[#cbd5e1]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#64748b] p-0.5" onClick={(e) => { e.stopPropagation(); toggleNode('storageNode'); }}>
                            {expandedNodes.storageNode ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </span>
                          <HardDrive className="w-3 h-3 text-[#38bdf8]" />
                          <span>Storage: 4 TB</span>
                        </div>
                        <span className="text-[10px] text-[#64748b]">Disk 0</span>
                      </div>

                      {expandedNodes.storageNode && (
                        <div className="pl-4 border-l border-[#222b3b] ml-3 text-[10px] text-[#8b949e] py-1 space-y-0.5">
                          <div className="px-1 py-0.5 flex justify-between text-[#22c55e]">
                            <span>Active Blocks:</span>
                            <span>24</span>
                          </div>
                          <div className="px-1 py-0.5 flex justify-between text-[#f59e0b]">
                            <span>Recoverable:</span>
                            <span>5</span>
                          </div>
                          <div className="px-1 py-0.5 flex justify-between text-[#ef4444]">
                            <span>Deleted:</span>
                            <span>5</span>
                          </div>
                          <div
                            onClick={() => onSelectTab('STORAGE')}
                            className="px-1 pt-1 text-[#38bdf8] hover:underline cursor-pointer"
                          >
                            View Block Map →
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Cameras (8) (Collapsed by default) */}
                    <div>
                      <div
                        onClick={() => toggleNode('camerasNode')}
                        className={`flex items-center justify-between px-2 py-1 rounded hover:bg-[#161c28] cursor-pointer ${
                          expandedNodes.camerasNode ? 'text-white' : 'text-[#cbd5e1]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#64748b] p-0.5">
                            {expandedNodes.camerasNode ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </span>
                          <Camera className="w-3 h-3 text-[#38bdf8]" />
                          <span>Cameras ({cameras.length})</span>
                        </div>
                        <span className="text-[9px] text-[#64748b]">{selectedCameraId ? selectedCameraId : 'All'}</span>
                      </div>

                      {expandedNodes.camerasNode && (
                        <div className="pl-4 border-l border-[#222b3b] ml-3 space-y-0.5 py-1">
                          <div
                            onClick={() => {
                              onSelectCamera(null);
                              onSelectTab('VIEWER');
                            }}
                            className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                              selectedCameraId === null ? 'bg-[#1b263b] text-[#38bdf8] font-bold' : 'text-[#8b949e] hover:text-white'
                            }`}
                          >
                            Show All Channels
                          </div>
                          {cameras.map((cam) => {
                            const isSelected = selectedCameraId === cam.id;
                            const isIncident = cam.id === 'CH-04';
                            return (
                              <div
                                key={cam.id}
                                onClick={() => {
                                  onSelectCamera(cam.id);
                                  onSelectTab('VIEWER');
                                }}
                                className={`flex items-center justify-between px-1.5 py-1 rounded hover:bg-[#161c28] cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#1b263b] text-[#38bdf8] font-semibold border-l-2 border-[#38bdf8]'
                                    : 'text-[#8b949e]'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  <span className={`w-1.5 h-1.5 rounded-full ${cam.status === 'Active' ? 'bg-[#22c55e]' : 'bg-[#f59e0b]'}`} />
                                  <span className="font-bold text-[10px]">{cam.id}</span>
                                  <span className="truncate text-[10px]">{cam.name.split(' ')[0]}</span>
                                </div>
                                {isIncident && (
                                  <span className="text-[8px] bg-[#dc2626]/30 text-[#fca5a5] px-1 rounded font-bold">
                                    FOCUS
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Recordings (Collapsed by default) */}
                    <div>
                      <div
                        onClick={() => toggleNode('recordingsNode')}
                        className={`flex items-center justify-between px-2 py-1 rounded hover:bg-[#161c28] cursor-pointer ${
                          expandedNodes.recordingsNode ? 'text-white' : 'text-[#cbd5e1]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#64748b] p-0.5">
                            {expandedNodes.recordingsNode ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                          </span>
                          <FileVideo className="w-3 h-3 text-[#38bdf8]" />
                          <span>Recordings ({recordings.length})</span>
                        </div>
                      </div>

                      {expandedNodes.recordingsNode && (
                        <div className="pl-4 border-l border-[#222b3b] ml-3 space-y-0.5 py-1 max-h-48 overflow-y-auto">
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
                                className={`flex items-center justify-between px-1.5 py-1 rounded hover:bg-[#161c28] cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#1b263b] text-[#38bdf8] font-bold border-l-2 border-[#38bdf8]'
                                    : 'text-[#8b949e]'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 truncate">
                                  <FileVideo className={`w-3 h-3 ${isRecovered ? 'text-[#f59e0b]' : 'text-[#64748b]'}`} />
                                  <span className="text-[10px] truncate">{rec.id}</span>
                                </div>
                                <span className={`text-[9px] px-1 rounded font-mono ${
                                  isRecovered ? 'bg-[#78350f]/50 text-[#fde68a]' : 'text-[#64748b]'
                                }`}>
                                  {isRecovered ? 'CARVED' : rec.cameraId}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Recovered Evidence Link */}
                    <div
                      onClick={() => onSelectTab('RECOVERY')}
                      className={`flex items-center justify-between px-2 py-1 rounded hover:bg-[#161c28] cursor-pointer ${
                        activeTab === 'RECOVERY' ? 'bg-[#182234] text-[#38bdf8]' : 'text-[#cbd5e1]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Flame className="w-3 h-3 text-[#f59e0b]" />
                        <span>Recovered ({recoveredCount})</span>
                      </div>
                      <span className="text-[9px] bg-[#451a03] text-[#fde047] px-1.5 py-0.2 rounded">
                        Active
                      </span>
                    </div>

                    {/* AI Findings Link */}
                    <div
                      onClick={() => onSelectTab('AI_ANALYSIS')}
                      className={`flex items-center justify-between px-2 py-1 rounded hover:bg-[#161c28] cursor-pointer ${
                        activeTab === 'AI_ANALYSIS' ? 'bg-[#182234] text-[#38bdf8]' : 'text-[#cbd5e1]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-[#c084fc]" />
                        <span>AI Findings ({aiFindingsCount})</span>
                      </div>
                    </div>

                    {/* Timeline Link */}
                    <div
                      onClick={() => onSelectTab('TIMELINE')}
                      className={`flex items-center justify-between px-2 py-1 rounded hover:bg-[#161c28] cursor-pointer ${
                        activeTab === 'TIMELINE' ? 'bg-[#182234] text-[#38bdf8]' : 'text-[#cbd5e1]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-[#38bdf8]" />
                        <span>Timeline Events ({timelineEventsCount})</span>
                      </div>
                    </div>

                    {/* Hash Integrity Link */}
                    <div
                      onClick={() => onSelectTab('INTEGRITY')}
                      className={`flex items-center justify-between px-2 py-1 rounded hover:bg-[#161c28] cursor-pointer ${
                        activeTab === 'INTEGRITY' ? 'bg-[#182234] text-[#38bdf8]' : 'text-[#cbd5e1]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-[#22c55e]" />
                        <span>Hash Integrity</span>
                      </div>
                      <span className="text-[9px] text-[#22c55e]">MATCH</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explorer Footer */}
      <div className="p-2 border-t border-[#1a2130] bg-[#0b0e14] text-[10px] font-mono flex items-center justify-between text-[#64748b]">
        <span>TABLEAU T8U</span>
        <span className="text-[#22c55e]">READ-ONLY</span>
      </div>
    </aside>
  );
};
