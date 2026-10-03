import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Camera as CameraIcon,
  Bookmark,
  FileText,
  GitBranch,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  Layers,
  Sliders,
  Crosshair,
  Maximize2
} from 'lucide-react';
import {
  VideoRecording,
  AIFinding,
  TimelineEvent,
  FrameMetadata,
  DeviceInfo
} from '../../types/forensics';

interface VideoEvidenceViewerProps {
  recording: VideoRecording;
  deviceInfo: DeviceInfo;
  aiFindings: AIFinding[];
  timelineEvents: TimelineEvent[];
  onOpenTrace: (finding?: AIFinding) => void;
  onAddBookmark: (recording: VideoRecording, frameNum: number, timeStr: string) => void;
  onAddNote: (recording: VideoRecording, timeStr: string) => void;
  onSwitchToAIFindings?: () => void;
  onSwitchToCompare?: () => void;
}

export const VideoEvidenceViewer: React.FC<VideoEvidenceViewerProps> = ({
  recording,
  deviceInfo,
  aiFindings,
  timelineEvents,
  onOpenTrace,
  onAddBookmark,
  onAddNote,
  onSwitchToAIFindings,
  onSwitchToCompare
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentFrame, setCurrentFrame] = useState<number>(
    recording.id === 'REC-CH04-019' ? 38192 : 21050
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [showReticle, setShowReticle] = useState<boolean>(true);
  const [snapshotTaken, setSnapshotTaken] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Time calculations
  const totalFrames = recording.framesCount || 15000;
  const progressRatio = Math.min(1, Math.max(0, currentFrame / totalFrames));

  // Find AI findings or events at or near current frame
  const activeAIFinding = aiFindings.find(
    (f) => f.recordingId === recording.id && Math.abs(f.frameNumber - currentFrame) < 30
  ) || aiFindings.find((f) => f.recordingId === recording.id);

  // Simulated frame stepper playback loop
  useEffect(() => {
    let animId: number;
    if (isPlaying) {
      const interval = 1000 / (recording.fps * playbackSpeed);
      const timer = setInterval(() => {
        setCurrentFrame((prev) => {
          if (prev >= totalFrames) {
            setIsPlaying(false);
            return totalFrames;
          }
          return prev + 1;
        });
      }, interval);
      return () => clearInterval(timer);
    }
  }, [isPlaying, playbackSpeed, recording.fps, totalFrames]);

  // Render forensic CCTV canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#080a0e';
    ctx.fillRect(0, 0, width, height);

    // Camera environment styling based on camera ID
    const isCorridor = recording.cameraId === 'CH-04';
    const isEntrance = recording.cameraId === 'CH-01';
    const isParking = recording.cameraId === 'CH-02';

    // Background gradient representing camera view
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    if (isCorridor) {
      grad.addColorStop(0, '#151921');
      grad.addColorStop(0.5, '#1e2430');
      grad.addColorStop(1, '#0e1117');
    } else if (isEntrance) {
      grad.addColorStop(0, '#1a222d');
      grad.addColorStop(0.7, '#131922');
      grad.addColorStop(1, '#0a0d12');
    } else {
      grad.addColorStop(0, '#121820');
      grad.addColorStop(1, '#090c10');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Draw architectural perspective lines (hallway / corridor / roadway)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;

    // Perspective vanish point
    const vpX = width * 0.52;
    const vpY = height * 0.42;

    ctx.beginPath();
    ctx.moveTo(0, height * 0.85);
    ctx.lineTo(vpX, vpY);
    ctx.moveTo(width, height * 0.85);
    ctx.lineTo(vpX, vpY);
    ctx.moveTo(0, height * 0.2);
    ctx.lineTo(vpX, vpY);
    ctx.moveTo(width, height * 0.2);
    ctx.lineTo(vpX, vpY);
    ctx.stroke();

    // Corridor doors / structures
    if (isCorridor) {
      // Door 4B (Server Vault) on right wall
      ctx.fillStyle = '#252d3a';
      ctx.beginPath();
      ctx.moveTo(width * 0.68, height * 0.32);
      ctx.lineTo(width * 0.84, height * 0.24);
      ctx.lineTo(width * 0.84, height * 0.78);
      ctx.lineTo(width * 0.68, height * 0.72);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Access control keypad indicator
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(width * 0.66, height * 0.48, 6, 10);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '9px monospace';
      ctx.fillText('VAULT 4B', width * 0.71, height * 0.4);

      // Draw Suspect Figure Silhouette in corridor
      const figX = width * 0.46;
      const figY = height * 0.45;
      ctx.fillStyle = 'rgba(15, 20, 28, 0.95)';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1;

      // Body / Hooded Coat
      ctx.beginPath();
      ctx.arc(figX + 16, figY + 12, 14, 0, Math.PI * 2); // Hooded Head
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(figX + 2, figY + 26);
      ctx.lineTo(figX + 30, figY + 26);
      ctx.lineTo(figX + 38, figY + 95);
      ctx.lineTo(figX - 6, figY + 95);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Legs
      ctx.fillRect(figX + 2, figY + 95, 10, 48);
      ctx.fillRect(figX + 18, figY + 95, 10, 48);
    } else if (isEntrance || isParking) {
      // Vehicle silhouette
      const carX = width * 0.35;
      const carY = height * 0.48;
      ctx.fillStyle = 'rgba(12, 16, 22, 0.92)';
      ctx.beginPath();
      ctx.roundRect(carX, carY + 20, 160, 60, [10, 25, 5, 5]);
      ctx.fill();
      // Roof
      ctx.beginPath();
      ctx.moveTo(carX + 30, carY + 20);
      ctx.lineTo(carX + 60, carY - 15);
      ctx.lineTo(carX + 120, carY - 15);
      ctx.lineTo(carX + 145, carY + 20);
      ctx.closePath();
      ctx.fill();
      // Headlights glow
      ctx.fillStyle = 'rgba(254, 240, 138, 0.15)';
      ctx.beginPath();
      ctx.moveTo(carX + 160, carY + 30);
      ctx.lineTo(width * 0.85, height * 0.6);
      ctx.lineTo(width * 0.85, height * 0.8);
      ctx.closePath();
      ctx.fill();
    }

    // AI Bounding Box Overlays
    if (showOverlays && activeAIFinding) {
      const box = activeAIFinding.boundingBox;
      const bbX = (box.x / 100) * width;
      const bbY = (box.y / 100) * height;
      const bbW = (box.width / 100) * width;
      const bbH = (box.height / 100) * height;

      // Box border
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 2]);
      ctx.strokeRect(bbX, bbY, bbW, bbH);
      ctx.setLineDash([]);

      // Corner target brackets
      const cLen = 10;
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 2.5;
      // Top-left
      ctx.beginPath();
      ctx.moveTo(bbX, bbY + cLen);
      ctx.lineTo(bbX, bbY);
      ctx.lineTo(bbX + cLen, bbY);
      ctx.stroke();
      // Top-right
      ctx.beginPath();
      ctx.moveTo(bbX + bbW - cLen, bbY);
      ctx.lineTo(bbX + bbW, bbY);
      ctx.lineTo(bbX + bbW, bbY + cLen);
      ctx.stroke();
      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(bbX, bbY + bbH - cLen);
      ctx.lineTo(bbX, bbY + bbH);
      ctx.lineTo(bbX + cLen, bbY + bbH);
      ctx.stroke();
      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(bbX + bbW - cLen, bbY + bbH);
      ctx.lineTo(bbX + bbW, bbY + bbH);
      ctx.lineTo(bbX + bbW, bbY + bbH - cLen);
      ctx.stroke();

      // Tag badge
      ctx.fillStyle = 'rgba(2, 132, 199, 0.85)';
      ctx.fillRect(bbX, bbY - 20, 150, 18);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`${activeAIFinding.type.toUpperCase()} [${activeAIFinding.confidence}%]`, bbX + 4, bbY - 7);
    }

    // Reticle Center Mark
    if (showReticle) {
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1;
      const cx = width / 2;
      const cy = height / 2;
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy);
      ctx.lineTo(cx + 20, cy);
      ctx.moveTo(cx, cy - 20);
      ctx.lineTo(cx, cy + 20);
      ctx.arc(cx, cy, 35, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Surveillance OSD Header Overlay (Standard Forensic CCTV Yellow/White Monospace)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, 0, width, 30);
    ctx.fillRect(0, height - 30, width, 30);

    ctx.fillStyle = '#fde047'; // CCTV OSD yellow
    ctx.font = 'bold 12px monospace';
    ctx.fillText(`${recording.cameraId} - ${recording.cameraName.toUpperCase()}`, 14, 20);

    // Raw Device vs Normalized Time
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px monospace';
    ctx.fillText(`RAW: ${recording.startTime}`, width - 260, 20);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`NORM: ${recording.normalizedStartTime} [SYNCED]`, 14, height - 10);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText(`FRM #${currentFrame} / ${totalFrames} | ${recording.codec} | ${recording.resolution}`, width - 360, height - 10);

  }, [recording, currentFrame, totalFrames, showOverlays, showReticle, activeAIFinding]);

  // Calculate current timestamp string
  const currentOffsetSec = Math.floor((currentFrame / totalFrames) * recording.durationSeconds);
  const minutes = Math.floor(currentOffsetSec / 60);
  const seconds = currentOffsetSec % 60;
  const formattedPlaybackTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleFrameStep = (delta: number) => {
    setIsPlaying(false);
    setCurrentFrame((prev) => Math.min(totalFrames, Math.max(0, prev + delta)));
  };

  const handleSnapshot = () => {
    setSnapshotTaken(`SNAP-${recording.id}-F${currentFrame}.PNG`);
    setTimeout(() => setSnapshotTaken(null), 3500);
    onAddBookmark(
      recording,
      currentFrame,
      `${recording.startTime} +${formattedPlaybackTime}`
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e14] h-full overflow-hidden select-none">
      {/* Viewer Header Bar */}
      <div className="h-9 px-3 bg-[#141822] border-b border-[#242c3d] flex items-center justify-between text-xs font-mono text-[#cbd5e1] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <Crosshair className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>FORENSIC VIDEO EXAMINATION WORKSPACE</span>
          </div>
          <span className="text-[#64748b]">|</span>
          <span className="text-[#38bdf8] font-bold">{recording.id}</span>
          <span className="text-[#94a3b8]">({recording.cameraName})</span>
          {recording.status === 'Recovered' && (
            <span className="bg-[#78350f] text-[#fde047] text-[10px] px-1.5 py-0.5 rounded border border-[#b45309] font-bold">
              CARVED & RECONSTRUCTED
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onSwitchToAIFindings && (
            <button
              onClick={onSwitchToAIFindings}
              className="px-2 py-0.5 rounded text-[11px] bg-[#161c28] hover:bg-[#20293a] border border-[#2b3547] text-[#c084fc] cursor-pointer"
            >
              AI Findings Table →
            </button>
          )}
          {onSwitchToCompare && (
            <button
              onClick={onSwitchToCompare}
              className="px-2 py-0.5 rounded text-[11px] bg-[#161c28] hover:bg-[#20293a] border border-[#2b3547] text-[#8b949e] hover:text-white cursor-pointer"
            >
              Dual Compare
            </button>
          )}
          <div className="h-4 w-[1px] bg-[#2d3748] mx-0.5" />
          {/* Overlay toggles */}
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`px-2 py-0.5 rounded text-[11px] border cursor-pointer ${
              showOverlays
                ? 'bg-[#0369a1]/30 border-[#0284c7] text-[#38bdf8]'
                : 'bg-[#182030] border-[#2b3547] text-[#64748b]'
            }`}
          >
            AI Detections
          </button>
          <button
            onClick={() => setShowReticle(!showReticle)}
            className={`px-2 py-0.5 rounded text-[11px] border cursor-pointer ${
              showReticle
                ? 'bg-[#0369a1]/30 border-[#0284c7] text-[#38bdf8]'
                : 'bg-[#182030] border-[#2b3547] text-[#64748b]'
            }`}
          >
            Reticle
          </button>
          <div className="h-4 w-[1px] bg-[#2d3748] mx-1" />
          {/* Zoom controls */}
          <button
            onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
            className="p-1 rounded hover:bg-[#1f2737] text-[#94a3b8] hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] text-[#38bdf8] w-10 text-center font-bold">
            {zoomLevel.toFixed(1)}x
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
            className="p-1 rounded hover:bg-[#1f2737] text-[#94a3b8] hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Video Viewport Canvas */}
      <div className="flex-1 relative bg-[#06080b] flex items-center justify-center overflow-hidden p-2">
        <div
          className="relative max-w-full max-h-full aspect-video shadow-2xl border border-[#1f2838] rounded overflow-hidden"
          style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.15s ease' }}
        >
          <canvas
            ref={canvasRef}
            width={960}
            height={540}
            className="w-full h-full block bg-black"
          />

          {/* Snapshot Notification toast */}
          {snapshotTaken && (
            <div className="absolute top-4 right-4 bg-[#065f46] border border-[#10b981] text-white px-3 py-1.5 rounded shadow-lg text-xs font-mono flex items-center gap-2 animate-bounce">
              <ShieldCheck className="w-4 h-4 text-[#34d399]" />
              <span>Forensic Snapshot Saved: {snapshotTaken}</span>
            </div>
          )}
        </div>
      </div>

      {/* Precision Playback & Timeline Scrubber Area */}
      <div className="bg-[#12161f] border-t border-[#242c3d] p-3 text-xs shrink-0 font-mono">
        {/* Scrubber with Markers */}
        <div className="space-y-1 mb-2">
          <div className="flex items-center justify-between text-[11px] text-[#8b949e]">
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">{formattedPlaybackTime}</span>
              <span className="text-[#64748b]">/</span>
              <span>{recording.durationFormatted}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#38bdf8]">
                FRAME: <strong className="text-white">{currentFrame}</strong> / {totalFrames}
              </span>
              <span className="text-[#22c55e] bg-[#142e20] px-1 rounded border border-[#166534]">
                {currentFrame % 15 === 0 ? 'I-FRAME (KEY)' : 'P-FRAME'}
              </span>
            </div>
          </div>

          {/* Interactive Scrub Track */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              setCurrentFrame(Math.floor(ratio * totalFrames));
            }}
            className="relative h-6 bg-[#1a2130] rounded cursor-pointer border border-[#2b3547] overflow-hidden group"
          >
            {/* Progress fill */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-[#0284c7]/40 border-r-2 border-[#38bdf8]"
              style={{ width: `${progressRatio * 100}%` }}
            />

            {/* Timeline event markers */}
            {timelineEvents
              .filter((e) => e.recordingId === recording.id)
              .map((evt) => {
                const pos = evt.frameNumber
                  ? (evt.frameNumber / totalFrames) * 100
                  : 50;
                return (
                  <div
                    key={evt.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (evt.frameNumber) setCurrentFrame(evt.frameNumber);
                    }}
                    title={`${evt.title} (${evt.timestamp})`}
                    className="absolute top-0 bottom-0 w-2 -ml-1 bg-[#ef4444] hover:bg-[#ff0000] cursor-pointer z-10 opacity-80 hover:opacity-100 flex items-center justify-center"
                    style={{ left: `${pos}%` }}
                  >
                    <div className="w-1 h-3 bg-white rounded-full" />
                  </div>
                );
              })}

            {/* AI Finding markers */}
            {aiFindings
              .filter((f) => f.recordingId === recording.id)
              .map((f) => {
                const pos = (f.frameNumber / totalFrames) * 100;
                return (
                  <div
                    key={f.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentFrame(f.frameNumber);
                    }}
                    title={`AI Finding: ${f.type} (${f.confidence}%)`}
                    className="absolute top-0 bottom-0 w-2.5 -ml-1.5 bg-[#a855f7] hover:bg-[#c084fc] cursor-pointer z-10 opacity-85 flex items-center justify-center border border-white"
                    style={{ left: `${pos}%` }}
                  />
                );
              })}
          </div>

          {/* Marker Legend */}
          <div className="flex items-center justify-between text-[10px] text-[#64748b] pt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#ef4444]" /> Incident Event
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#a855f7]" /> AI Finding
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Recovered Fragment
              </span>
            </div>
            <span>Click scrub-bar or markers to jump to frame</span>
          </div>
        </div>

        {/* Playback Controls & Precision Frame Steppers */}
        <div className="flex items-center justify-between pt-1 border-t border-[#1a2130]">
          {/* Left: Transport buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleFrameStep(-100)}
              className="p-1.5 rounded bg-[#1c2433] hover:bg-[#253043] text-[#cbd5e1] border border-[#2b3547] cursor-pointer"
              title="Jump -100 Frames"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleFrameStep(-1)}
              className="p-1.5 rounded bg-[#1c2433] hover:bg-[#253043] text-[#cbd5e1] border border-[#2b3547] cursor-pointer"
              title="Previous Frame (Step Back)"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold flex items-center gap-1 cursor-pointer shadow"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>
            <button
              onClick={() => handleFrameStep(1)}
              className="p-1.5 rounded bg-[#1c2433] hover:bg-[#253043] text-[#cbd5e1] border border-[#2b3547] cursor-pointer"
              title="Next Frame (Step Forward)"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            {/* Playback speed selector */}
            <div className="flex items-center ml-2 bg-[#1c2433] rounded border border-[#2b3547] text-[10px]">
              {[0.25, 0.5, 1, 2, 4].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={`px-1.5 py-1 ${
                    playbackSpeed === speed
                      ? 'bg-[#0284c7] text-white font-bold'
                      : 'text-[#94a3b8] hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Right: Forensic Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSnapshot}
              className="flex items-center gap-1 bg-[#1a2332] hover:bg-[#222e42] border border-[#2c3b52] text-[#cbd5e1] px-2.5 py-1.5 rounded text-xs cursor-pointer font-medium"
              title="Capture authentic verified frame snapshot"
            >
              <CameraIcon className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Snapshot</span>
            </button>

            <button
              onClick={() =>
                onAddBookmark(recording, currentFrame, `${recording.startTime} +${formattedPlaybackTime}`)
              }
              className="flex items-center gap-1 bg-[#1a2332] hover:bg-[#222e42] border border-[#2c3b52] text-[#cbd5e1] px-2.5 py-1.5 rounded text-xs cursor-pointer font-medium"
            >
              <Bookmark className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>Bookmark</span>
            </button>

            <button
              onClick={() => onAddNote(recording, `${recording.startTime} +${formattedPlaybackTime}`)}
              className="flex items-center gap-1 bg-[#1a2332] hover:bg-[#222e42] border border-[#2c3b52] text-[#cbd5e1] px-2.5 py-1.5 rounded text-xs cursor-pointer font-medium"
            >
              <FileText className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span>Add Note</span>
            </button>

            {/* Trace To Source Button */}
            <button
              onClick={() => onOpenTrace(activeAIFinding)}
              className="flex items-center gap-1.5 bg-[#0369a1] hover:bg-[#0284c7] text-white px-3 py-1.5 rounded text-xs font-bold font-mono tracking-tight cursor-pointer shadow-md"
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>TRACE TO SOURCE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
