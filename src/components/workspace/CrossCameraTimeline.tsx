import React, { useState } from 'react';
import {
  Clock,
  Car,
  User,
  Flame,
  GitBranch,
  ChevronDown,
  ChevronUp,
  Play,
  ArrowRight,
  ShieldCheck,
  Info
} from 'lucide-react';
import {
  CameraChannel,
  TimelineEvent,
  VideoRecording,
  AIFinding
} from '../../types/forensics';

interface CrossCameraTimelineProps {
  cameras: CameraChannel[];
  timelineEvents: TimelineEvent[];
  recordings: VideoRecording[];
  onSelectEvent: (event: TimelineEvent) => void;
  onOpenTrace: (finding?: AIFinding) => void;
  aiFindings: AIFinding[];
}

export const CrossCameraTimeline: React.FC<CrossCameraTimelineProps> = ({
  cameras,
  timelineEvents,
  recordings,
  onSelectEvent,
  onOpenTrace,
  aiFindings
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string>('EVT-03');
  const [showTimestampDetails, setShowTimestampDetails] = useState<boolean>(false);

  const selectedEvent =
    timelineEvents.find((e) => e.id === selectedEventId) || timelineEvents[0];

  // Helper to calculate marker percentage in 30-min window (21:00:00 to 21:30:00)
  const getEventPositionPct = (timeStr: string) => {
    const parts = timeStr.split(' ')[1]?.split(':') || ['21', '00', '00'];
    const min = parseInt(parts[1], 10);
    const sec = parseInt(parts[2], 10);
    const totalMinutes = min + sec / 60;
    return Math.max(0, Math.min(100, (totalMinutes / 30) * 100));
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e14] h-full overflow-hidden select-none font-mono text-xs">
      {/* Top Header */}
      <div className="h-10 px-4 bg-[#141822] border-b border-[#242c3d] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <Clock className="w-4 h-4 text-[#38bdf8]" />
            <span>UNIFIED TIMELINE</span>
          </div>
          <span className="text-[#475569]">|</span>
          <span className="text-[#f59e0b] font-semibold">Incident Window: 21:00 – 21:30</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Progressive disclosure toggle: Timestamp Details */}
          <button
            onClick={() => setShowTimestampDetails(!showTimestampDetails)}
            className="flex items-center gap-1 px-3 py-1 rounded bg-[#182030] hover:bg-[#202b40] border border-[#2b3547] text-[#cbd5e1] text-[11px] font-semibold cursor-pointer transition"
          >
            <span>{showTimestampDetails ? 'Hide Timestamp Details' : 'TIMESTAMP DETAILS'}</span>
            {showTimestampDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          <button
            onClick={() => onOpenTrace()}
            className="bg-[#0369a1] hover:bg-[#0284c7] text-white px-3 py-1 rounded text-[11px] font-bold cursor-pointer flex items-center gap-1 shadow"
          >
            <GitBranch className="w-3 h-3" />
            <span>Trace Timeline Provenance</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-y-auto max-w-5xl mx-auto w-full space-y-4">
        {/* Requirement 7: Visual Camera Timeline Tracks */}
        <div className="bg-[#121620] border border-[#242c3d] rounded-lg p-4 space-y-2">
          {/* Timeline Scale Marks */}
          <div className="flex items-center justify-between pl-24 pr-4 pb-1.5 border-b border-[#1c2331] text-[10px] text-[#64748b]">
            <span>21:00</span>
            <span>21:05</span>
            <span>21:10</span>
            <span className="text-[#f59e0b] font-bold">21:14 (INCIDENT)</span>
            <span>21:20</span>
            <span>21:25</span>
            <span>21:30</span>
          </div>

          {/* Camera Track Lines */}
          <div className="space-y-1.5 pt-1">
            {cameras.slice(0, 7).map((cam) => {
              const camEvents = timelineEvents.filter((e) => e.cameraId === cam.id);
              const isIncidentFocus = cam.id === 'CH-04';

              return (
                <div
                  key={cam.id}
                  className={`flex items-center h-8 px-2 rounded border transition ${
                    isIncidentFocus
                      ? 'bg-[#151c27] border-[#0284c7]/50'
                      : 'bg-[#0b0e14] border-[#18202d]'
                  }`}
                >
                  {/* Camera ID and name label */}
                  <div className="w-24 shrink-0 flex items-center gap-1.5 text-[10px]">
                    <span className="font-bold text-white">{cam.id}</span>
                    <span className="text-[#8b949e] truncate">{cam.name.split(' ')[0]}</span>
                  </div>

                  {/* Horizontal Track Ribbon with event pins */}
                  <div className="flex-1 relative h-full flex items-center px-4 overflow-hidden">
                    {/* Track Line */}
                    <div className="absolute left-0 right-0 h-1 bg-[#1e2738] rounded-full" />

                    {/* Incident zone highlight */}
                    <div
                      className="absolute h-2.5 bg-[#0369a1]/25 border-l border-r border-[#0284c7]/50"
                      style={{ left: `${(13 / 30) * 100}%`, width: `${(4 / 30) * 100}%` }}
                    />

                    {/* Event pin markers */}
                    {camEvents.map((evt) => {
                      const pos = getEventPositionPct(evt.timestamp);
                      const isSelected = selectedEventId === evt.id;
                      const isCar = evt.category === 'VEHICLE';
                      const isRecovered = evt.category === 'RECOVERED';

                      return (
                        <div
                          key={evt.id}
                          onClick={() => {
                            setSelectedEventId(evt.id);
                            onSelectEvent(evt);
                          }}
                          title={`[${evt.timestamp}] ${evt.title}`}
                          className={`absolute -ml-2.5 z-10 cursor-pointer flex items-center justify-center transition-transform hover:scale-125 ${
                            isSelected ? 'scale-125 z-20' : ''
                          }`}
                          style={{ left: `${pos}%` }}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shadow ${
                              isSelected
                                ? 'bg-white text-black border-[#38bdf8] ring-2 ring-[#38bdf8]'
                                : isRecovered
                                ? 'bg-[#f59e0b] text-black border-amber-300'
                                : isCar
                                ? 'bg-[#0284c7] text-white border-sky-300'
                                : 'bg-[#ef4444] text-white border-red-300'
                            }`}
                          >
                            {isCar ? <Car className="w-2.5 h-2.5" /> : isRecovered ? <Flame className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Badge for Focus Camera */}
                  {isIncidentFocus && (
                    <span className="text-[9px] bg-[#dc2626]/30 text-[#fca5a5] px-1.5 py-0.2 rounded border border-[#ef4444]/40 font-bold shrink-0">
                      INCIDENT
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Requirement 7: CORRELATED EVENTS List */}
        <div className="bg-[#121620] border border-[#242c3d] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1c2331]">
            <span className="font-bold text-white text-xs">CORRELATED EVENTS SEQUENCE</span>
            <span className="text-[10px] text-[#22c55e]">Chronological Reconstruction</span>
          </div>

          <div className="space-y-2">
            {timelineEvents.slice(0, 6).map((evt, idx) => {
              const isSelected = selectedEventId === evt.id;
              return (
                <div
                  key={evt.id}
                  onClick={() => {
                    setSelectedEventId(evt.id);
                    onSelectEvent(evt);
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#1b263b] border-[#38bdf8]'
                      : 'bg-[#0b0e14] border-[#1a2130] hover:bg-[#151c27]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#162030] text-[#38bdf8] font-bold text-[10px] flex items-center justify-center shrink-0 border border-[#24334a]">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-bold text-white text-xs flex items-center gap-2">
                        <span>{evt.title}</span>
                        <span className="text-[10px] text-[#38bdf8] bg-[#0c4a6e]/30 px-1 rounded">
                          {evt.cameraId}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#8b949e] line-clamp-1">{evt.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[#f59e0b] font-mono text-[11px] font-bold">
                      {evt.timestamp.split(' ')[1]}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(evt);
                      }}
                      className="bg-[#0284c7] hover:bg-[#0369a1] text-white px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer flex items-center gap-1"
                    >
                      <Play className="w-2.5 h-2.5" />
                      <span>Jump</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PROGRESSIVE DISCLOSURE: Detailed Timestamp Normalization Data */}
        {showTimestampDetails && (
          <div className="bg-[#0f131c] border border-[#242c3d] rounded-lg p-4 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#1c2331]">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#f59e0b]" />
                DETAILED TIMESTAMP NORMALIZATION ANALYSIS
              </span>
              <span className="text-[10px] text-[#22c55e]">Master Clock Aligned</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div className="bg-[#121620] p-2.5 rounded border border-[#1e2637]">
                <span className="text-[#64748b] text-[10px] block">RAW DEVICE TIME:</span>
                <span className="text-[#fca5a5] font-bold">2026-09-28 21:14:32</span>
              </div>
              <div className="bg-[#121620] p-2.5 rounded border border-[#1e2637]">
                <span className="text-[#64748b] text-[10px] block">DETECTED OFFSET:</span>
                <span className="text-[#f59e0b] font-bold">+00:03:17 (Fast)</span>
              </div>
              <div className="bg-[#121620] p-2.5 rounded border border-[#1e2637]">
                <span className="text-[#64748b] text-[10px] block">NORMALIZED TIME:</span>
                <span className="text-[#38bdf8] font-bold">2026-09-28 21:11:15</span>
              </div>
              <div className="bg-[#121620] p-2.5 rounded border border-[#1e2637]">
                <span className="text-[#64748b] text-[10px] block">STANDARDIZATION:</span>
                <span className="text-white">UTC+05:30 (IST)</span>
              </div>
            </div>

            <p className="text-[10px] text-[#8b949e]">
              <strong>Forensic Principle:</strong> Time normalization creates an analytical representation for cross-camera correlation without modifying the original bit-stream timestamps stored on the E01 forensic image.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
