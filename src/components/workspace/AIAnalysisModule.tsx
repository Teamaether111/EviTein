import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  Eye,
  GitBranch,
  Bookmark,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Filter,
  Search,
  AlertTriangle
} from 'lucide-react';
import { AIFinding, VideoRecording } from '../../types/forensics';

interface AIAnalysisModuleProps {
  aiFindings: AIFinding[];
  onOpenRecordingAtFrame: (recordingId: string, frameNumber: number) => void;
  onOpenTrace: (finding: AIFinding) => void;
  onAddFindingToReport: (findingId: string) => void;
  onAddBookmark: (recordingId: string, frameNumber: number, title: string) => void;
}

export const AIAnalysisModule: React.FC<AIAnalysisModuleProps> = ({
  aiFindings,
  onOpenRecordingAtFrame,
  onOpenTrace,
  onAddFindingToReport,
  onAddBookmark
}) => {
  const [selectedFindingId, setSelectedFindingId] = useState<string>('AIF-001');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFindings = aiFindings.filter((f) => {
    if (filterType !== 'ALL' && !f.type.toLowerCase().includes(filterType.toLowerCase())) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        f.id.toLowerCase().includes(q) ||
        f.type.toLowerCase().includes(q) ||
        f.cameraName.toLowerCase().includes(q) ||
        f.cameraId.toLowerCase().includes(q) ||
        f.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedFinding =
    aiFindings.find((f) => f.id === selectedFindingId) || aiFindings[0];

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e14] h-full overflow-hidden select-none font-mono text-xs">
      {/* Top Header */}
      <div className="h-10 px-4 bg-[#141822] border-b border-[#242c3d] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <Sparkles className="w-4 h-4 text-[#c084fc]" />
            <span>AI-ASSISTED EVIDENCE DETECTION MODULE</span>
          </div>
          <span className="text-[#475569]">|</span>
          <span className="text-[#38bdf8]">TENSORRT / YOLO-FORENSICS PIPELINE</span>
          <span className="text-[#22c55e]">[ALL RESULTS STRICTLY GROUNDED IN RAW BYTES]</span>
        </div>

        {/* Prototype notice */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#3b0764] text-[#e9d5ff] px-2 py-0.5 rounded border border-[#7e22ce] font-bold">
            ZERO HALLUCINATION POLICY
          </span>
          <span className="text-[10px] bg-[#1e293b] text-[#94a3b8] px-2 py-0.5 rounded border border-[#334155]">
            SIH26150 PROTOTYPE
          </span>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="p-3 bg-[#0d1017] border-b border-[#1f2635] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {['ALL', 'Vehicle', 'Person', 'License Plate', 'Motion Anomaly', 'Loitering'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 rounded text-[11px] border cursor-pointer font-bold ${
                filterType === type
                  ? 'bg-[#3b0764] border-[#a855f7] text-white'
                  : 'bg-[#141822] border-[#242c3d] text-[#8b949e] hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="w-64">
          <input
            type="text"
            placeholder="Search AI findings, frames, cameras..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161c27] text-white text-xs px-3 py-1 rounded border border-[#2b3547] focus:outline-none focus:border-[#38bdf8] placeholder-[#556173]"
          />
        </div>
      </div>

      {/* Main split: Findings List (Left) & Inspector / Frame Reference (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Findings Table */}
        <div className="flex-1 flex flex-col p-3 overflow-hidden border-r border-[#1f2635]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#38bdf8]" />
              DETECTED EVIDENCE ARTIFACTS ({filteredFindings.length})
            </span>
            <span className="text-[10px] text-[#8b949e]">
              Click any finding to inspect provenance chain or jump to video frame
            </span>
          </div>

          <div className="flex-1 bg-[#0e1219] rounded border border-[#222a3a] overflow-hidden flex flex-col">
            {filteredFindings.length === 0 ? (
              <div className="p-8 text-center text-[#8b949e]">
                <AlertTriangle className="w-6 h-6 text-[#f59e0b] mx-auto mb-2" />
                <div className="font-bold text-white mb-1">No supporting evidence found.</div>
                <div className="text-[11px]">
                  EviTwin forensic policy prohibits fabricating unsubstantiated AI results.
                </div>
              </div>
            ) : (
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#161c27] text-[#64748b] sticky top-0 border-b border-[#1f2635]">
                    <tr>
                      <th className="p-2">FINDING ID</th>
                      <th className="p-2">CLASSIFICATION</th>
                      <th className="p-2">CAMERA</th>
                      <th className="p-2">TIMESTAMP (NORM)</th>
                      <th className="p-2">FRAME #</th>
                      <th className="p-2">CONFIDENCE</th>
                      <th className="p-2">RECORDING REF</th>
                      <th className="p-2">REPORT STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#18202d]">
                    {filteredFindings.map((finding) => {
                      const isSelected = selectedFindingId === finding.id;
                      const isCarved = Boolean(finding.sourceFragmentId);

                      return (
                        <tr
                          key={finding.id}
                          onClick={() => setSelectedFindingId(finding.id)}
                          className={`hover:bg-[#182232] cursor-pointer transition ${
                            isSelected ? 'bg-[#1b263b] text-white font-bold' : 'text-[#cbd5e1]'
                          }`}
                        >
                          <td className="p-2 font-mono text-[#38bdf8] flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#c084fc]" />
                            <span>{finding.id}</span>
                          </td>
                          <td className="p-2">
                            <span className="bg-[#24133b] text-[#e9d5ff] px-1.5 py-0.5 rounded border border-[#6b21a8]">
                              {finding.type}
                            </span>
                          </td>
                          <td className="p-2">
                            <span className="font-bold">{finding.cameraId}</span> ({finding.cameraName.split(' ')[0]})
                          </td>
                          <td className="p-2 text-[#f59e0b]">{finding.normalizedTimestamp.split(' ')[1]}</td>
                          <td className="p-2 font-mono">#{finding.frameNumber}</td>
                          <td className="p-2 font-bold text-[#4ade80]">{finding.confidence}%</td>
                          <td className="p-2 text-[#38bdf8]">{finding.recordingId}</td>
                          <td className="p-2">
                            {finding.addedToReport ? (
                              <span className="text-[#22c55e] flex items-center gap-1 font-bold">
                                <CheckCircle2 className="w-3 h-3" /> Included
                              </span>
                            ) : (
                              <span className="text-[#64748b]">Unfiled</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right: Technical Inspector for Selected AI Finding */}
        <div className="w-96 flex flex-col p-3 bg-[#0d1017] overflow-y-auto space-y-3">
          <div className="bg-[#121620] border border-[#242c3d] rounded p-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1e2533] mb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#c084fc]" />
                FINDING: {selectedFinding.id}
              </span>
              <span className="text-[10px] text-[#22c55e] bg-[#064e3b] px-1.5 py-0.5 rounded border border-[#059669] font-bold">
                {selectedFinding.confidence}% CONFIDENCE
              </span>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Object Type:</span>
                <span className="text-[#fde047] font-bold">{selectedFinding.type}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Camera:</span>
                <span className="text-white">{selectedFinding.cameraId} — {selectedFinding.cameraName}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Raw Timestamp:</span>
                <span className="text-[#fca5a5] font-bold">{selectedFinding.timestamp}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Normalized Timestamp:</span>
                <span className="text-[#38bdf8] font-bold">{selectedFinding.normalizedTimestamp}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Frame Reference:</span>
                <span className="text-white font-bold">Frame #{selectedFinding.frameNumber}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Recording Container:</span>
                <span className="text-[#38bdf8]">{selectedFinding.recordingId}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Underlying Model:</span>
                <span className="text-white truncate max-w-[170px]">{selectedFinding.model}</span>
              </div>
              {selectedFinding.sourceFragmentId && (
                <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                  <span className="text-[#f59e0b]">Carved Source Fragment:</span>
                  <span className="text-[#f59e0b] font-bold">{selectedFinding.sourceFragmentId}</span>
                </div>
              )}
            </div>

            <div className="mt-3 p-2 bg-[#090b10] rounded text-[10px] text-[#cbd5e1] border border-[#1a2130]">
              <strong className="text-[#a78bfa]">Forensic Observations:</strong> {selectedFinding.details}
            </div>

            {/* Bounding box coords */}
            <div className="mt-2 text-[10px] text-[#64748b]">
              Bounding Box: [X: {selectedFinding.boundingBox.x}%, Y: {selectedFinding.boundingBox.y}%, W: {selectedFinding.boundingBox.width}%, H: {selectedFinding.boundingBox.height}%]
            </div>
          </div>

          {/* Action buttons */}
          <div className="bg-[#121620] border border-[#242c3d] rounded p-3 space-y-2">
            <button
              onClick={() =>
                onOpenRecordingAtFrame(selectedFinding.recordingId, selectedFinding.frameNumber)
              }
              className="w-full bg-[#0369a1] hover:bg-[#0284c7] text-white py-2 px-3 rounded font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>VIEW IN FORENSIC VIDEO VIEWER</span>
            </button>

            <button
              onClick={() => onOpenTrace(selectedFinding)}
              className="w-full bg-gradient-to-r from-[#0369a1] to-[#0284c7] hover:from-[#0284c7] hover:to-[#38bdf8] text-white py-2 px-3 rounded font-bold flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <GitBranch className="w-4 h-4" />
              <span>TRACE TO SOURCE PROVENANCE</span>
            </button>

            <button
              onClick={() => onAddFindingToReport(selectedFinding.id)}
              className="w-full bg-[#1a2130] hover:bg-[#242f45] border border-[#2b3547] text-[#cbd5e1] py-1.5 rounded flex items-center justify-center gap-1.5 cursor-pointer text-[10px] font-bold"
            >
              <FileText className="w-3 h-3 text-[#38bdf8]" />
              <span>{selectedFinding.addedToReport ? 'INCLUDED IN REPORT' : 'ADD TO REPORT EXHIBIT'}</span>
            </button>

            <button
              onClick={() =>
                onAddBookmark(
                  selectedFinding.recordingId,
                  selectedFinding.frameNumber,
                  `${selectedFinding.type}: ${selectedFinding.cameraName}`
                )
              }
              className="w-full bg-[#1a2130] hover:bg-[#242f45] border border-[#2b3547] text-[#cbd5e1] py-1.5 rounded flex items-center justify-center gap-1.5 cursor-pointer text-[10px] font-bold"
            >
              <Bookmark className="w-3 h-3 text-[#f59e0b]" />
              <span>CREATE EVIDENCE BOOKMARK</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
