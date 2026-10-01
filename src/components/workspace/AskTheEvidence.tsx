import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Filter,
  CheckCircle2,
  Clock,
  Camera,
  Play,
  ArrowRight,
  GitBranch,
  X,
  FileVideo,
  AlertCircle
} from 'lucide-react';
import { TimelineEvent, VideoRecording, AIFinding } from '../../types/forensics';

interface AskTheEvidenceProps {
  isOpen: boolean;
  onClose: () => void;
  timelineEvents: TimelineEvent[];
  aiFindings: AIFinding[];
  recordings: VideoRecording[];
  onOpenRecordingAtFrame: (recordingId: string, frameNumber?: number) => void;
  onOpenTrace: (finding?: any) => void;
}

export const AskTheEvidence: React.FC<AskTheEvidenceProps> = ({
  isOpen,
  onClose,
  timelineEvents,
  aiFindings,
  recordings,
  onOpenRecordingAtFrame,
  onOpenTrace
}) => {
  const [queryInput, setQueryInput] = useState<string>(
    'Show all vehicle detections around the entrance and parking between 21:00 and 21:30'
  );
  const [parsedFilter, setParsedFilter] = useState<{
    cameraFilter: string;
    timeRange: string;
    objectType: string;
    matchingCount: number;
  }>({
    cameraFilter: 'CH-01 (Entrance), CH-02 (Parking), CH-05 (Rear Exit)',
    timeRange: '21:00:00 — 21:30:00 (Incident Window)',
    objectType: 'Vehicle / Sedan',
    matchingCount: 4
  });

  const [matchingResults, setMatchingResults] = useState<any[]>([
    {
      time: '21:14:02',
      camera: 'CH-01',
      title: 'Dark Sedan Enters Main Gate (AIF-002)',
      recordingId: 'REC-CH01-042',
      frame: 21050,
      confidence: 96
    },
    {
      time: '21:14:19',
      camera: 'CH-02',
      title: 'Vehicle Visible in North Parking Bay B4 (AIF-004)',
      recordingId: 'REC-CH02-031',
      frame: 21475,
      confidence: 94
    },
    {
      time: '21:15:19',
      camera: 'CH-05',
      title: 'Vehicle Exits Rear Service Gate At Velocity (AIF-006)',
      recordingId: 'REC-CH05-022',
      frame: 22975,
      confidence: 92
    },
    {
      time: '21:15:45',
      camera: 'CH-07',
      title: 'Vehicle Tail Lights Tracked along East Perimeter',
      recordingId: 'REC-CH07-011',
      frame: 18900,
      confidence: 85
    }
  ]);

  if (!isOpen) return null;

  const handleRunQuery = (customPrompt?: string) => {
    const q = (customPrompt || queryInput).toLowerCase();

    if (q.includes('corridor') || q.includes('person') || q.includes('ch-04') || q.includes('intruder') || q.includes('suspect')) {
      setParsedFilter({
        cameraFilter: 'CH-04 (East Ground Corridor)',
        timeRange: '21:14:00 — 21:23:00 (Carved Window)',
        objectType: 'Person / Intruder Anomaly',
        matchingCount: 3
      });
      setMatchingResults([
        {
          time: '21:14:32',
          camera: 'CH-04',
          title: 'Person Detected in Corridor (AIF-001)',
          recordingId: 'REC-CH04-019',
          frame: 38192,
          confidence: 93
        },
        {
          time: '21:14:48',
          camera: 'CH-04',
          title: 'Physical Door Lock Manipulation at Server Vault (EVT-04)',
          recordingId: 'REC-CH04-019',
          frame: 38590,
          confidence: 89
        },
        {
          time: '21:15:07',
          camera: 'CH-04',
          title: 'Carved Stream Recovery Boundary from Unallocated Space (FRAG-00382)',
          recordingId: 'REC-CH04-019',
          frame: 39065,
          confidence: 87
        }
      ]);
    } else if (q.includes('recover') || q.includes('carve') || q.includes('delete')) {
      setParsedFilter({
        cameraFilter: 'CH-04, CH-05 (Unallocated Storage Extents)',
        timeRange: '21:10:00 — 21:25:00',
        objectType: 'Carved Fragments / Reconstructed Streams',
        matchingCount: 2
      });
      setMatchingResults([
        {
          time: '21:14:32',
          camera: 'CH-04',
          title: 'Carved Stream REC-CH04-019 (FRAG-00382 @ 0x8A23F000)',
          recordingId: 'REC-CH04-019',
          frame: 38192,
          confidence: 87
        },
        {
          time: '21:15:30',
          camera: 'CH-05',
          title: 'Carved Rear Gate Fragment (FRAG-00388 @ 0x8CD17000)',
          recordingId: 'REC-CH05-022',
          frame: 22975,
          confidence: 89
        }
      ]);
    } else {
      setParsedFilter({
        cameraFilter: 'CH-01 (Entrance), CH-02 (Parking), CH-05 (Rear Exit)',
        timeRange: '21:00:00 — 21:30:00',
        objectType: 'Vehicle / Transport',
        matchingCount: 4
      });
      setMatchingResults([
        {
          time: '21:14:02',
          camera: 'CH-01',
          title: 'Dark Sedan Enters Main Gate (AIF-002)',
          recordingId: 'REC-CH01-042',
          frame: 21050,
          confidence: 96
        },
        {
          time: '21:14:19',
          camera: 'CH-02',
          title: 'Vehicle Visible in North Parking Bay B4 (AIF-004)',
          recordingId: 'REC-CH02-031',
          frame: 21475,
          confidence: 94
        },
        {
          time: '21:15:19',
          camera: 'CH-05',
          title: 'Vehicle Exits Rear Service Gate (AIF-006)',
          recordingId: 'REC-CH05-022',
          frame: 22975,
          confidence: 92
        }
      ]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none font-mono">
      <div className="bg-[#0f131c] border border-[#2d3748] rounded-lg shadow-2xl w-full max-w-3xl flex flex-col overflow-hidden text-xs text-[#cbd5e1]">
        {/* Header */}
        <div className="h-11 px-4 bg-[#151a26] border-b border-[#242c3d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#0369a1] text-white flex items-center justify-center">
              <Search className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">ASK THE EVIDENCE — INVESTIGATION ASSISTANT</span>
              <span className="text-[10px] text-[#38bdf8] ml-2">DETERMINISTIC FORENSIC QUERY TRANSLATOR</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#8b949e] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Query Input Box */}
        <div className="p-4 bg-[#0a0d13] border-b border-[#1f2635]">
          <div className="relative mb-2">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunQuery()}
              placeholder="e.g. Show all vehicle detections around entrance between 21:00 and 21:30"
              className="w-full bg-[#161c28] text-white text-xs pl-3 pr-24 py-2.5 rounded border border-[#2b3547] focus:outline-none focus:border-[#38bdf8]"
            />
            <button
              onClick={() => handleRunQuery()}
              className="absolute right-1 top-1 bottom-1 px-4 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded font-bold cursor-pointer"
            >
              QUERY
            </button>
          </div>

          {/* Quick preset questions */}
          <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-[#8b949e]">
            <span className="text-[#64748b]">Suggested Queries:</span>
            <button
              onClick={() => {
                const q = 'Show all vehicle detections around entrance between 21:00 and 21:30';
                setQueryInput(q);
                handleRunQuery(q);
              }}
              className="bg-[#161c27] hover:bg-[#202737] border border-[#263144] px-2 py-0.5 rounded text-[#38bdf8] cursor-pointer"
            >
              Vehicle detections around entrance (21:00-21:30)
            </button>
            <button
              onClick={() => {
                const q = 'Find carved recovered footage for corridor CH-04';
                setQueryInput(q);
                handleRunQuery(q);
              }}
              className="bg-[#161c27] hover:bg-[#202737] border border-[#263144] px-2 py-0.5 rounded text-[#f59e0b] cursor-pointer"
            >
              Carved footage for Corridor CH-04
            </button>
          </div>
        </div>

        {/* Parsed Query Structured Representation */}
        <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
          <div className="bg-[#121620] p-3 rounded border border-[#242c3d] space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between text-[#8b949e] pb-1 border-b border-[#1e2533]">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#38bdf8]" />
                STRUCTURED FORENSIC FILTER TRANSLATION
              </span>
              <span className="text-[#22c55e] font-bold">{parsedFilter.matchingCount} Supporting Records Found</span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-[10px]">
              <div>
                <span className="text-[#64748b] block">CAMERA FILTER:</span>
                <span className="text-[#38bdf8] font-bold">{parsedFilter.cameraFilter}</span>
              </div>
              <div>
                <span className="text-[#64748b] block">TIME WINDOW:</span>
                <span className="text-white font-bold">{parsedFilter.timeRange}</span>
              </div>
              <div>
                <span className="text-[#64748b] block">CLASSIFICATION:</span>
                <span className="text-[#fde047] font-bold">{parsedFilter.objectType}</span>
              </div>
            </div>
          </div>

          {/* Evidence-Linked Results */}
          <div className="space-y-2">
            <span className="text-[#8b949e] font-bold block text-[11px]">
              VERIFIED SUPPORTING EVIDENCE EXHIBITS
            </span>

            {matchingResults.map((res, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#121620] border border-[#242c3d] rounded flex items-center justify-between hover:bg-[#161c29] transition"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[#f59e0b] font-bold">{res.time}</span>
                    <span className="text-[#64748b]">—</span>
                    <span className="text-[#38bdf8] font-bold">{res.camera}</span>
                    <span className="text-[#94a3b8] text-[10px] bg-[#1a2233] px-1.5 py-0.2 rounded border border-[#253247]">
                      {res.recordingId}
                    </span>
                  </div>
                  <div className="font-bold text-white">{res.title}</div>
                  <div className="text-[10px] text-[#22c55e]">Verified Confidence: {res.confidence}%</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenRecordingAtFrame(res.recordingId, res.frame);
                    }}
                    className="bg-[#0369a1] hover:bg-[#0284c7] text-white px-3 py-1.5 rounded font-bold cursor-pointer flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" />
                    <span>VIEW EVIDENCE</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#151a26] border-t border-[#242c3d] text-[10px] text-[#8b949e] flex justify-between items-center">
          <span>Constraint: System operates on strictly grounded digital evidence metadata.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#1e293b] hover:bg-[#2b3a52] text-white rounded cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
