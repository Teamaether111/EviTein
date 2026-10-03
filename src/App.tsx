import React, { useState } from 'react';
import {
  ForensicWorkspaceTab,
  VendorId,
  DeviceInfo,
  VideoRecording,
  StorageSector,
  RecoveryFragment,
  AIFinding,
  TimelineEvent,
  CustodyRecord,
  EvidenceBookmark,
  CaseNote,
  CaseInfo
} from './types/forensics';
import {
  VENDOR_ADAPTERS,
  INITIAL_CASE,
  INITIAL_DEVICE,
  CAMERA_CHANNELS,
  INITIAL_RECORDINGS,
  STORAGE_SECTORS,
  RECOVERY_FRAGMENTS,
  TIMELINE_EVENTS,
  AI_FINDINGS,
  CHAIN_OF_CUSTODY_RECORDS,
  INITIAL_BOOKMARKS,
  INITIAL_CASE_NOTES
} from './data/mockForensicData';

import { TopToolbar } from './components/layout/TopToolbar';
import { StatusBar } from './components/layout/StatusBar';
import { CaseEvidenceExplorer } from './components/layout/CaseEvidenceExplorer';
import { VideoEvidenceViewer } from './components/workspace/VideoEvidenceViewer';
import { EvidenceInspector } from './components/workspace/EvidenceInspector';
import { StorageExplorer } from './components/workspace/StorageExplorer';
import { RecoveryAnalysis } from './components/workspace/RecoveryAnalysis';
import { CrossCameraTimeline } from './components/workspace/CrossCameraTimeline';
import { AIAnalysisModule } from './components/workspace/AIAnalysisModule';
import { HashVerifier } from './components/workspace/HashVerifier';
import { AcquisitionConsole } from './components/workspace/AcquisitionConsole';
import { EvidenceCompare } from './components/workspace/EvidenceCompare';
import { ChainOfCustodyView } from './components/workspace/ChainOfCustodyView';
import { CaseNotesBookmarks } from './components/workspace/CaseNotesBookmarks';
import { TraceToSourceModal } from './components/workspace/TraceToSourceModal';
import { AskTheEvidence } from './components/workspace/AskTheEvidence';
import { ForensicReportModal } from './components/workspace/ForensicReportModal';
import { DemoGuideModal } from './components/workspace/DemoGuideModal';

export default function App() {
  // Navigation & Workspace Mode
  const [activeTab, setActiveTab] = useState<ForensicWorkspaceTab>('VIEWER');
  const [selectedVendor, setSelectedVendor] = useState<VendorId>('HIKVISION');
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const [selectedRecordingId, setSelectedRecordingId] = useState<string>('REC-CH04-019');

  // Modals state
  const [isTraceOpen, setIsTraceOpen] = useState<boolean>(false);
  const [isAskEvidenceOpen, setIsAskEvidenceOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState<boolean>(false);
  const [activeFindingForTrace, setActiveFindingForTrace] = useState<AIFinding | undefined>(undefined);

  // Forensic Data state
  const [caseInfo] = useState<CaseInfo>(INITIAL_CASE);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(INITIAL_DEVICE);
  const [cameras] = useState(CAMERA_CHANNELS);
  const [recordings, setRecordings] = useState<VideoRecording[]>(INITIAL_RECORDINGS);
  const [sectors, setSectors] = useState<StorageSector[]>(STORAGE_SECTORS);
  const [fragments, setFragments] = useState<RecoveryFragment[]>(RECOVERY_FRAGMENTS);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(TIMELINE_EVENTS);
  const [aiFindings, setAiFindings] = useState<AIFinding[]>(AI_FINDINGS);
  const [custodyRecords, setCustodyRecords] = useState<CustodyRecord[]>(CHAIN_OF_CUSTODY_RECORDS);
  const [bookmarks, setBookmarks] = useState<EvidenceBookmark[]>(INITIAL_BOOKMARKS);
  const [notes, setNotes] = useState<CaseNote[]>(INITIAL_CASE_NOTES);

  // Active target recording object
  const activeRecording =
    recordings.find((r) => r.id === selectedRecordingId) || recordings[0];
  const activeFinding =
    aiFindings.find((f) => f.recordingId === activeRecording.id) || aiFindings[0];
  const activeFragment =
    fragments.find((f) => f.id === activeRecording.recoveredFromFragmentId);

  // Handle Vendor Switching (Demonstration of multi-vendor architecture)
  const handleSelectVendor = (vendor: VendorId) => {
    setSelectedVendor(vendor);
    const adapter = VENDOR_ADAPTERS[vendor];
    setDeviceInfo((prev) => ({
      ...prev,
      manufacturer: vendor,
      vendorId: vendor,
      model:
        vendor === 'DAHUA'
          ? 'DHI-NVR5216-16P-4KS2E'
          : vendor === 'CP_PLUS'
          ? 'CP-UVR-1601E1-CS 16 Channel'
          : vendor === 'HONEYWELL'
          ? 'HEN16104 Performance Series NVR'
          : vendor === 'TP_LINK'
          ? 'VIGI NVR1016H 16 Channel'
          : vendor === 'UNIVIEW'
          ? 'NVR302-16S-P16 4K NVR'
          : 'DS-7616NI-K2/16P Embedded 4K NVR',
      filesystem: adapter.filesystem,
      supportedCodecs: adapter.codecSupport.join(' / ')
    }));
  };

  // Quick action: Open Trace to Source
  const handleOpenTrace = (finding?: AIFinding) => {
    setActiveFindingForTrace(finding || activeFinding);
    setIsTraceOpen(true);
  };

  // Add finding to report
  const handleAddFindingToReport = (findingId: string) => {
    setAiFindings((prev) =>
      prev.map((f) => (f.id === findingId ? { ...f, addedToReport: true } : f))
    );
  };

  // Add bookmark
  const handleAddBookmark = (
    recording: VideoRecording,
    frameNumber: number,
    timecodeTitle: string
  ) => {
    const newBkm: EvidenceBookmark = {
      id: `BKM-00${bookmarks.length + 1}`,
      cameraId: recording.cameraId,
      timestamp: timecodeTitle,
      normalizedTimestamp: `${recording.normalizedStartTime}`,
      recordingId: recording.id,
      frameNumber,
      title: `Snapshot / Frame Reference: ${recording.cameraName}`,
      description: `Forensic bookmark recorded by examiner for exhibit review on ${recording.cameraId}.`,
      createdTime: new Date().toLocaleTimeString('en-IN', { hour12: false }),
      analyst: 'Insp. R. Varma',
      status: 'Verified'
    };
    setBookmarks((prev) => [newBkm, ...prev]);
  };

  // Add Note
  const handleAddNote = (newNoteData: Omit<CaseNote, 'id'>) => {
    const newNote: CaseNote = {
      ...newNoteData,
      id: `NOTE-00${notes.length + 1}`
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  // Add Custody Record
  const handleAddCustodyRecord = (newRec: Omit<CustodyRecord, 'id'>) => {
    const record: CustodyRecord = {
      ...newRec,
      id: `COC-00${custodyRecords.length + 1}`
    };
    setCustodyRecords((prev) => [...prev, record]);
  };

  // Execute Demo Walkthrough Step
  const handleExecuteDemoStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        setActiveTab('NOTES');
        break;
      case 2:
        setActiveTab('INTEGRITY');
        break;
      case 3:
        setActiveTab('STORAGE');
        break;
      case 4:
        setActiveTab('RECOVERY');
        break;
      case 5:
        setActiveTab('RECOVERY');
        break;
      case 6:
        setSelectedRecordingId('REC-CH04-019');
        setActiveTab('VIEWER');
        break;
      case 7:
        setActiveTab('TIMELINE');
        break;
      case 8:
        setActiveTab('AI_ANALYSIS');
        break;
      case 9:
        setActiveFindingForTrace(aiFindings[0]);
        setIsTraceOpen(true);
        break;
      case 10:
        setActiveTab('INTEGRITY');
        break;
      case 11:
        setActiveTab('CUSTODY');
        break;
      case 12:
        setIsReportOpen(true);
        break;
      default:
        setActiveTab('VIEWER');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0a0d13] text-[#cbd5e1] font-sans">
      {/* 1. TOP MENU & APPLICATION TOOLBAR */}
      <TopToolbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        selectedVendor={selectedVendor}
        onSelectVendor={handleSelectVendor}
        onOpenTrace={() => handleOpenTrace(activeFinding)}
        onOpenAskEvidence={() => setIsAskEvidenceOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenCompare={() => setActiveTab('COMPARE')}
        onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
      />

      {/* 2. MAIN FORENSIC EXAMINATION THREE-PANEL WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: Case / Evidence Hierarchical Explorer */}
        <CaseEvidenceExplorer
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          cameras={cameras}
          recordings={recordings}
          selectedCameraId={selectedCameraId}
          onSelectCamera={setSelectedCameraId}
          selectedRecordingId={selectedRecordingId}
          onSelectRecording={setSelectedRecordingId}
          deviceInfo={deviceInfo}
          selectedVendor={selectedVendor}
          recoveredCount={fragments.length}
          aiFindingsCount={aiFindings.length}
          timelineEventsCount={timelineEvents.length}
          bookmarksCount={bookmarks.length}
        />

        {/* CENTER PRIMARY WORKSPACE: Dynamic Module View */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#0b0e14]">
          {activeTab === 'VIEWER' && (
            <VideoEvidenceViewer
              recording={activeRecording}
              deviceInfo={deviceInfo}
              aiFindings={aiFindings}
              timelineEvents={timelineEvents}
              onOpenTrace={handleOpenTrace}
              onAddBookmark={handleAddBookmark}
              onSwitchToAIFindings={() => setActiveTab('AI_ANALYSIS')}
              onSwitchToCompare={() => setActiveTab('COMPARE')}
              onAddNote={(rec, timeStr) => {
                handleAddNote({
                  analyst: 'Insp. Rajesh Varma',
                  createdTime: new Date().toLocaleTimeString('en-IN', { hour12: false }),
                  evidenceRef: rec.id,
                  recordingId: rec.id,
                  timestamp: timeStr,
                  observation: `Frame examination at ${timeStr}. Verified continuity and NAL unit slice.`,
                  importance: 'Standard'
                });
                setActiveTab('NOTES');
              }}
            />
          )}

          {activeTab === 'STORAGE' && (
            <StorageExplorer
              sectors={sectors}
              deviceInfo={deviceInfo}
              selectedVendor={selectedVendor}
              onSelectSectorToExamine={(sec) => {
                if (sec.recordingId && recordings.find((r) => r.id === sec.recordingId)) {
                  setSelectedRecordingId(sec.recordingId);
                }
              }}
              onNavigateToRecording={(recId) => {
                setSelectedRecordingId(recId);
                setActiveTab('VIEWER');
              }}
              onNavigateToRecovery={(fragId) => {
                setActiveTab('RECOVERY');
              }}
            />
          )}

          {activeTab === 'RECOVERY' && (
            <RecoveryAnalysis
              fragments={fragments}
              onOpenRecording={(recId) => {
                setSelectedRecordingId(recId);
                setActiveTab('VIEWER');
              }}
              onOpenTrace={handleOpenTrace}
              onSwitchToStorage={() => setActiveTab('STORAGE')}
            />
          )}

          {activeTab === 'TIMELINE' && (
            <CrossCameraTimeline
              cameras={cameras}
              timelineEvents={timelineEvents}
              recordings={recordings}
              onSelectEvent={(evt) => {
                setSelectedRecordingId(evt.recordingId);
                setActiveTab('VIEWER');
              }}
              onOpenTrace={handleOpenTrace}
              aiFindings={aiFindings}
            />
          )}

          {activeTab === 'AI_ANALYSIS' && (
            <AIAnalysisModule
              aiFindings={aiFindings}
              onOpenRecordingAtFrame={(recId, frameNum) => {
                setSelectedRecordingId(recId);
                setActiveTab('VIEWER');
              }}
              onOpenTrace={handleOpenTrace}
              onAddFindingToReport={handleAddFindingToReport}
              onAddBookmark={(recId, frameNum, title) => {
                const rec = recordings.find((r) => r.id === recId) || activeRecording;
                handleAddBookmark(rec, frameNum, title);
              }}
            />
          )}

          {activeTab === 'ACQUISITION' && (
            <AcquisitionConsole
              deviceInfo={deviceInfo}
              selectedVendor={selectedVendor}
              onNavigateToViewer={() => setActiveTab('VIEWER')}
            />
          )}

          {activeTab === 'INTEGRITY' && (
            <HashVerifier
              deviceInfo={deviceInfo}
              onNavigateToCustody={() => setActiveTab('CUSTODY')}
            />
          )}

          {activeTab === 'COMPARE' && (
            <EvidenceCompare
              recordings={recordings}
              onOpenTrace={() => handleOpenTrace()}
            />
          )}

          {activeTab === 'CUSTODY' && (
            <ChainOfCustodyView
              custodyRecords={custodyRecords}
              onAddCustodyRecord={handleAddCustodyRecord}
            />
          )}

          {activeTab === 'NOTES' && (
            <CaseNotesBookmarks
              caseInfo={caseInfo}
              notes={notes}
              bookmarks={bookmarks}
              onOpenBookmark={(bkm) => {
                setSelectedRecordingId(bkm.recordingId);
                setActiveTab('VIEWER');
              }}
              onAddNote={handleAddNote}
              onDeleteBookmark={(bkmId) => {
                setBookmarks((prev) => prev.filter((b) => b.id !== bkmId));
              }}
            />
          )}
        </main>

        {/* RIGHT PANEL: Technical Evidence Property Inspector (Shown in Viewer, Storage, and Recovery) */}
        {(activeTab === 'VIEWER' || activeTab === 'STORAGE' || activeTab === 'RECOVERY') && (
          <EvidenceInspector
            recording={activeRecording}
            deviceInfo={deviceInfo}
            activeFinding={activeFinding}
            fragmentInfo={activeFragment}
            onOpenTrace={() => handleOpenTrace(activeFinding)}
            onNavigateToStorage={() => setActiveTab('STORAGE')}
            onNavigateToRecovery={() => setActiveTab('RECOVERY')}
          />
        )}
      </div>

      {/* 3. STATUS BAR (BOTTOM FORENSIC STRIP) */}
      <StatusBar
        selectedVendor={selectedVendor}
        activeRecordingId={activeRecording.id}
        recoveryFragmentsCount={fragments.length}
        totalRecordingsCount={recordings.length}
      />

      {/* 4. MODALS & TOOLS */}
      <TraceToSourceModal
        isOpen={isTraceOpen}
        onClose={() => setIsTraceOpen(false)}
        activeFinding={activeFindingForTrace}
        activeRecording={activeRecording}
        deviceInfo={deviceInfo}
        onNavigateToTab={(tab) => {
          setActiveTab(tab);
        }}
      />

      <AskTheEvidence
        isOpen={isAskEvidenceOpen}
        onClose={() => setIsAskEvidenceOpen(false)}
        timelineEvents={timelineEvents}
        aiFindings={aiFindings}
        recordings={recordings}
        onOpenRecordingAtFrame={(recId, frameNum) => {
          setSelectedRecordingId(recId);
          setActiveTab('VIEWER');
        }}
        onOpenTrace={handleOpenTrace}
      />

      <ForensicReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        caseInfo={caseInfo}
        deviceInfo={deviceInfo}
        recordings={recordings}
        aiFindings={aiFindings}
        timelineEvents={timelineEvents}
        custodyRecords={custodyRecords}
        fragments={fragments}
        notes={notes}
        bookmarks={bookmarks}
      />

      <DemoGuideModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        onExecuteDemoStep={handleExecuteDemoStep}
      />
    </div>
  );
}
