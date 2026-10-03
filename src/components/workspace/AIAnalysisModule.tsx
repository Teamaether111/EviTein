import React, { useState } from 'react';
import {
  Sparkles,
  Eye,
  GitBranch,
  Bookmark,
  FileText,
  CheckCircle2,
  Filter,
  Search,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { AIFinding } from '../../types/forensics';

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
            <span>AI FORENSIC TRIAGE & FINDINGS</span>
          </div>
          <span className="text-[#475569]">|</span>
          <span className="text-[#38bdf8]">EVIDENCE-GROUNDED ARTIFACTS</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#3b0764] text-[#e9d5ff] px-2 py-0.5 rounded border border-[#7e22ce] font-bold">
            ZERO HALLUCINATIONS
          </span>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="p-3 bg-[#0d1017] border-b border-[#1f2635] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          {['ALL', 'Vehicle', 'Person', 'License Plate', 'Motion'].map((type) => (
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

        <div className="w-56">
          <input
            type="text"
            placeholder="Filter findings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#161c27] text-white text-[11px] px-2.5 py-1 rounded border border-[#2b3547] focus:outline-none focus:border-[#38bdf8] placeholder-[#556173]"
          />
        </div>
      </div>

      {/* Main split: Simplified Primary Table (Left) & Rich Finding Detail Panel (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Simplified Clean Findings Table (Requirement 8) */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden border-r border-[#1f2635]">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-white text-xs">
              AI DETECTIONS ({filteredFindings.length})
            </span>
            <span className="text-[10px] text-[#8b949e]">
              Click a row to view complete provenance & frame details
            </span>
          </div>

          <div className="flex-1 bg-[#121620] border border-[#242c3d] rounded-lg overflow-hidden flex flex-col">
            {filteredFindings.length === 0 ? (
              <div className="p-8 text-center text-[#8b949e] my-auto">
                <AlertTriangle className="w-6 h-6 text-[#f59e0b] mx-auto mb-2" />
                <div className="font-bold text-white mb-1">No supporting evidence found.</div>
                <div className="text-[11px]">Strict evidentiary grounding active.</div>
              </div>
            ) : (
              <div className="overflow-y-auto flex-1">
                {/* Clean 4-column primary table per Requirement 8: Finding | Camera | Time | Confidence */}
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-[#10141d] text-[#64748b] sticky top-0 border-b border-[#1f2635]">
                    <tr>
                      <th className="p-2.5">FINDING</th>
                      <th className="p-2.5">CAMERA</th>
                      <th className="p-2.5">TIME</th>
                      <th className="p-2.5">CONFIDENCE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#18202d] text-[#cbd5e1]">
                    {filteredFindings.map((finding) => {
                      const isSelected = selectedFindingId === finding.id;

                      return (
                        <tr
                          key={finding.id}
                          onClick={() => setSelectedFindingId(finding.id)}
                          className={`hover:bg-[#182232] cursor-pointer transition ${
                            isSelected ? 'bg-[#1b263b] text-white font-bold' : ''
                          }`}
                        >
                          <td className="p-2.5 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#c084fc]" />
                            <span className="text-[#fde047]">{finding.type}</span>
                          </td>
                          <td className="p-2.5">
                            <span className="font-bold text-white">{finding.cameraId}</span>
                            <span className="text-[#8b949e] text-[10px] ml-1">({finding.cameraName.split(' ')[0]})</span>
                          </td>
                          <td className="p-2.5 text-[#38bdf8] font-mono">
                            {finding.normalizedTimestamp.split(' ')[1]}
                          </td>
                          <td className="p-2.5 font-bold text-[#4ade80]">
                            {finding.confidence}%
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

        {/* Right: Rich Finding Detail Panel (Requirement 8) */}
        <div className="w-96 p-4 bg-[#0d1017] flex flex-col justify-between overflow-y-auto space-y-3">
          <div className="space-y-3">
            {/* Header */}
            <div className="bg-[#121620] border border-[#242c3d] rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#1c2331]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#c084fc]" />
                  <span className="font-bold text-white text-xs">{selectedFinding.type}</span>
                </div>
                <span className="bg-[#0c2818] text-[#4ade80] text-[10px] font-bold px-2 py-0.5 rounded border border-[#166534]">
                  {selectedFinding.confidence}% Conf
                </span>
              </div>

              {/* Requirement 8 details */}
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between py-0.5 border-b border-[#18202d]">
                  <span className="text-[#64748b]">Finding ID:</span>
                  <span className="text-white font-mono">{selectedFinding.id}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#18202d]">
                  <span className="text-[#64748b]">Camera Sensor:</span>
                  <span className="text-white">{selectedFinding.cameraId} — {selectedFinding.cameraName}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#18202d]">
                  <span className="text-[#64748b]">Timestamp (Norm):</span>
                  <span className="text-[#38bdf8] font-mono font-bold">{selectedFinding.normalizedTimestamp}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#18202d]">
                  <span className="text-[#64748b]">Raw Timestamp:</span>
                  <span className="text-[#fca5a5] font-mono">{selectedFinding.timestamp}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#18202d]">
                  <span className="text-[#64748b]">Source Recording:</span>
                  <span className="text-white font-mono font-semibold">{selectedFinding.recordingId}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#18202d]">
                  <span className="text-[#64748b]">Frame Reference:</span>
                  <span className="text-white font-bold">Frame #{selectedFinding.frameNumber}</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-[#18202d]">
                  <span className="text-[#64748b]">AI Model:</span>
                  <span className="text-[#cbd5e1] truncate max-w-[170px]">{selectedFinding.model}</span>
                </div>
                {selectedFinding.sourceFragmentId && (
                  <div className="flex justify-between py-0.5 border-b border-[#18202d]">
                    <span className="text-[#f59e0b]">Carved Provenance:</span>
                    <span className="text-[#f59e0b] font-bold">{selectedFinding.sourceFragmentId}</span>
                  </div>
                )}
                <div className="flex justify-between py-0.5">
                  <span className="text-[#64748b]">Report Exhibit:</span>
                  <span className={selectedFinding.addedToReport ? 'text-[#22c55e] font-bold' : 'text-[#8b949e]'}>
                    {selectedFinding.addedToReport ? 'Included in Report' : 'Not Added'}
                  </span>
                </div>
              </div>

              {/* Observation note */}
              <div className="mt-2 p-2 bg-[#090b10] rounded border border-[#1a2130] text-[10px] text-[#cbd5e1]">
                <strong className="text-[#c084fc]">Analysis:</strong> {selectedFinding.details}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            {/* Requirement 8: [TRACE TO SOURCE] */}
            <button
              onClick={() => onOpenTrace(selectedFinding)}
              className="w-full bg-[#0369a1] hover:bg-[#0284c7] text-white py-2 px-3 rounded font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow transition"
            >
              <GitBranch className="w-4 h-4" />
              <span>TRACE TO SOURCE</span>
            </button>

            <button
              onClick={() =>
                onOpenRecordingAtFrame(selectedFinding.recordingId, selectedFinding.frameNumber)
              }
              className="w-full bg-[#182232] hover:bg-[#202d42] border border-[#2b394e] text-white py-1.5 px-3 rounded font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>View in Video Viewer</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => onAddFindingToReport(selectedFinding.id)}
                className="flex-1 bg-[#141b27] hover:bg-[#1c2738] border border-[#243144] text-[#cbd5e1] py-1.5 rounded text-[10px] font-semibold cursor-pointer"
              >
                {selectedFinding.addedToReport ? 'Added to Report ✓' : 'Add to Report'}
              </button>

              <button
                onClick={() =>
                  onAddBookmark(
                    selectedFinding.recordingId,
                    selectedFinding.frameNumber,
                    `${selectedFinding.type}: ${selectedFinding.cameraName}`
                  )
                }
                className="flex-1 bg-[#141b27] hover:bg-[#1c2738] border border-[#243144] text-[#cbd5e1] py-1.5 rounded text-[10px] font-semibold cursor-pointer"
              >
                Create Bookmark
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
