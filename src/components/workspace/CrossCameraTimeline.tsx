import React, { useState } from 'react';
import {
  Clock,
  Camera,
  Car,
  User,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Sparkles,
  GitBranch,
  Play,
  ArrowRight,
  Filter,
  Eye,
  Sliders
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
  const [timelineScrubTime, setTimelineScrubTime] = useState<number>(14.5); // Minutes past 21:00 (i.e. 21:14:30)
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');

  const selectedEvent =
    timelineEvents.find((e) => e.id === selectedEventId) || timelineEvents[0];

  // Helper to convert event time to position percentage in 30-min window (21:00:00 to 21:30:00)
  const getEventPositionPct = (timeStr: string) => {
    // Parse time
    const parts = timeStr.split(' ')[1]?.split(':') || ['21', '00', '00'];
    const min = parseInt(parts[1], 10);
    const sec = parseInt(parts[2], 10);
    const totalMinutes = min + sec / 60;
    // Map 0 to 30 mins -> 0% to 100%
    return Math.max(0, Math.min(100, (totalMinutes / 30) * 100));
  };

  const filteredEvents = timelineEvents.filter((e) => {
    if (activeCategoryFilter === 'ALL') return true;
    return e.category === activeCategoryFilter;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e14] h-full overflow-hidden select-none font-mono text-xs">
      {/* Header */}
      <div className="h-10 px-4 bg-[#141822] border-b border-[#242c3d] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <Clock className="w-4 h-4 text-[#38bdf8]" />
            <span>CROSS-CAMERA SYNCHRONIZED TIMELINE & EVENT CORRELATION</span>
          </div>
          <span className="text-[#475569]">|</span>
          <span className="text-[#38bdf8]">INCIDENT WINDOW: 21:00:00 — 21:30:00</span>
          <span className="text-[#f59e0b]">[NORMALIZED TO MASTER NTP]</span>
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'VEHICLE', 'PERSON', 'RECOVERED', 'ALARM'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-2 py-0.5 rounded text-[10px] border cursor-pointer ${
                activeCategoryFilter === cat
                  ? 'bg-[#0284c7] border-[#38bdf8] text-white font-bold'
                  : 'bg-[#182030] border-[#2b3547] text-[#8b949e] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Multi-Track Timeline & Event Correlation Chain */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top: Multi-Camera Horizontal Track Lanes */}
        <div className="h-3/5 border-b border-[#1f2635] p-3 flex flex-col overflow-y-auto bg-[#0d1017]">
          {/* Timeline Scale Ruler */}
          <div className="flex items-center mb-2 pl-36 pr-4">
            <div className="flex-1 flex justify-between text-[10px] text-[#64748b] border-b border-[#242c3d] pb-1 font-semibold">
              <span>21:00:00</span>
              <span>21:05:00</span>
              <span>21:10:00</span>
              <span className="text-[#f59e0b]">21:14:00 (INCIDENT FOCUS)</span>
              <span>21:20:00</span>
              <span>21:25:00</span>
              <span>21:30:00</span>
            </div>
          </div>

          {/* Camera Track Rows */}
          <div className="flex-1 space-y-2 relative">
            {cameras.map((cam) => {
              const camEvents = filteredEvents.filter((e) => e.cameraId === cam.id);
              const isFocusCam = cam.id === 'CH-04';

              return (
                <div
                  key={cam.id}
                  className={`flex items-center group h-10 rounded border ${
                    isFocusCam
                      ? 'bg-[#151c27] border-[#0284c7]/60'
                      : 'bg-[#11151e] border-[#1d2535]'
                  }`}
                >
                  {/* Camera Name Label */}
                  <div className="w-36 px-2 flex items-center gap-1.5 border-r border-[#1f2838] shrink-0 text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                    <span className="font-bold text-[#38bdf8]">{cam.id}</span>
                    <span className="text-[#94a3b8] truncate">{cam.name.split(' ')[0]}</span>
                  </div>

                  {/* Track Bar Lane */}
                  <div className="flex-1 relative h-full flex items-center px-4 overflow-hidden">
                    {/* Continuous recording ribbon */}
                    <div className="absolute left-0 right-0 h-2 bg-[#1e293b] rounded" />

                    {/* Highlighted incident period (21:13 to 21:17) */}
                    <div
                      className="absolute h-3 bg-[#0369a1]/25 border-l border-r border-[#0284c7]/40"
                      style={{
                        left: `${(13 / 30) * 100}%`,
                        width: `${(4 / 30) * 100}%`
                      }}
                    />

                    {/* Event pins */}
                    {camEvents.map((evt) => {
                      const pos = getEventPositionPct(evt.timestamp);
                      const isSelected = selectedEventId === evt.id;
                      const isRecovered = evt.category === 'RECOVERED';
                      const isVehicle = evt.category === 'VEHICLE';

                      return (
                        <div
                          key={evt.id}
                          onClick={() => {
                            setSelectedEventId(evt.id);
                            onSelectEvent(evt);
                          }}
                          title={`[${evt.timestamp}] ${evt.title}`}
                          className={`absolute -ml-3 z-10 cursor-pointer flex items-center justify-center transition-transform hover:scale-125 ${
                            isSelected ? 'scale-125 z-20' : ''
                          }`}
                          style={{ left: `${pos}%` }}
                        >
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shadow-lg ${
                              isSelected
                                ? 'bg-white text-black border-[#38bdf8] ring-2 ring-[#38bdf8]'
                                : isRecovered
                                ? 'bg-[#f59e0b] text-black border-amber-300'
                                : isVehicle
                                ? 'bg-[#0284c7] text-white border-sky-300'
                                : 'bg-[#ef4444] text-white border-red-300'
                            }`}
                          >
                            {isVehicle ? (
                              <Car className="w-3 h-3" />
                            ) : isRecovered ? (
                              <Flame className="w-3 h-3" />
                            ) : (
                              <User className="w-3 h-3" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom: Event Correlation Flow & Reconstruction Sequence */}
        <div className="h-2/5 p-3 bg-[#0a0d13] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1a2130]">
            <div className="flex items-center gap-2">
              <GitBranch className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span className="font-bold text-white text-xs">
                CROSS-CAMERA MULTI-STAGE EVENT CORRELATION CHAIN
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#8b949e]">
              <span>7 Verified Forensic Events Linked</span>
              <button
                onClick={() => onOpenTrace()}
                className="bg-[#0369a1] hover:bg-[#0284c7] text-white px-2.5 py-1 rounded font-bold cursor-pointer flex items-center gap-1"
              >
                <GitBranch className="w-3 h-3" />
                <span>TRACE CHAIN PROVENANCE</span>
              </button>
            </div>
          </div>

          {/* Chronological Flow Cards Sequence */}
          <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-1">
            {timelineEvents.map((evt, idx) => {
              const isSelected = selectedEventId === evt.id;
              return (
                <React.Fragment key={evt.id}>
                  <div
                    onClick={() => {
                      setSelectedEventId(evt.id);
                      onSelectEvent(evt);
                    }}
                    className={`min-w-[200px] max-w-[230px] p-2.5 rounded border cursor-pointer transition flex flex-col justify-between shrink-0 h-full ${
                      isSelected
                        ? 'bg-[#1a263b] border-[#38bdf8] ring-1 ring-[#38bdf8]'
                        : 'bg-[#121620] border-[#222a3a] hover:bg-[#161d2a]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-[#38bdf8] font-bold">#{evt.sequenceOrder} {evt.cameraId}</span>
                        <span className="text-[#f59e0b] font-mono">{evt.timestamp.split(' ')[1]}</span>
                      </div>
                      <div className="font-bold text-white text-[11px] truncate mb-1">
                        {evt.title}
                      </div>
                      <p className="text-[10px] text-[#94a3b8] line-clamp-2">
                        {evt.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#1a2230] mt-1 flex items-center justify-between text-[9px]">
                      <span className="text-[#22c55e]">Confidence: {evt.confidence || 90}%</span>
                      <span className="text-[#38bdf8] font-bold flex items-center gap-0.5">
                        <Play className="w-2.5 h-2.5" /> JUMP
                      </span>
                    </div>
                  </div>

                  {idx < timelineEvents.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-[#475569] shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
