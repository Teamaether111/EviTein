import React, { useState } from 'react';
import {
  FileText,
  Bookmark,
  Plus,
  Play,
  Calendar,
  User,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Tag
} from 'lucide-react';
import { CaseInfo, CaseNote, EvidenceBookmark } from '../../types/forensics';

interface CaseNotesBookmarksProps {
  caseInfo: CaseInfo;
  notes: CaseNote[];
  bookmarks: EvidenceBookmark[];
  onOpenBookmark: (bookmark: EvidenceBookmark) => void;
  onAddNote: (note: Omit<CaseNote, 'id'>) => void;
  onDeleteBookmark: (bkmId: string) => void;
}

export const CaseNotesBookmarks: React.FC<CaseNotesBookmarksProps> = ({
  caseInfo,
  notes,
  bookmarks,
  onOpenBookmark,
  onAddNote,
  onDeleteBookmark
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'CASE_INFO' | 'NOTES' | 'BOOKMARKS'>('CASE_INFO');
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [newNoteRef, setNewNoteRef] = useState<string>('REC-CH04-019');
  const [newNoteImportance, setNewNoteImportance] = useState<'Standard' | 'Critical' | 'Exhibitory'>('Standard');

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const now = new Date().toLocaleTimeString('en-IN', { hour12: false });
    onAddNote({
      analyst: 'Insp. Rajesh Varma, Lead Examiner',
      createdTime: now,
      evidenceRef: newNoteRef,
      recordingId: newNoteRef,
      timestamp: '2026-09-28 21:14:32',
      observation: newNoteText,
      importance: newNoteImportance
    });
    setNewNoteText('');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e14] h-full overflow-hidden select-none font-mono text-xs">
      {/* Top Header */}
      <div className="h-10 px-4 bg-[#141822] border-b border-[#242c3d] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <FileText className="w-4 h-4 text-[#38bdf8]" />
            <span>CASE MANAGEMENT, NOTES & EVIDENCE BOOKMARKS</span>
          </div>
          <span className="text-[#475569]">|</span>
          <span className="text-[#38bdf8] font-bold">{caseInfo.id}</span>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('CASE_INFO')}
            className={`px-3 py-1 rounded text-[11px] font-bold cursor-pointer border ${
              activeSubTab === 'CASE_INFO'
                ? 'bg-[#0284c7] border-[#38bdf8] text-white'
                : 'bg-[#182030] border-[#2b3547] text-[#8b949e]'
            }`}
          >
            Case Dossier
          </button>
          <button
            onClick={() => setActiveSubTab('BOOKMARKS')}
            className={`px-3 py-1 rounded text-[11px] font-bold cursor-pointer border ${
              activeSubTab === 'BOOKMARKS'
                ? 'bg-[#0284c7] border-[#38bdf8] text-white'
                : 'bg-[#182030] border-[#2b3547] text-[#8b949e]'
            }`}
          >
            Bookmarks ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveSubTab('NOTES')}
            className={`px-3 py-1 rounded text-[11px] font-bold cursor-pointer border ${
              activeSubTab === 'NOTES'
                ? 'bg-[#0284c7] border-[#38bdf8] text-white'
                : 'bg-[#182030] border-[#2b3547] text-[#8b949e]'
            }`}
          >
            Examiner Notes ({notes.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* SUBTAB 1: CASE INFORMATION */}
        {activeSubTab === 'CASE_INFO' && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="bg-[#121620] border border-[#242c3d] rounded p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1e2533]">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
                  <span>CASE RECORD OVERVIEW: {caseInfo.id}</span>
                </h3>
                <span className="text-[10px] bg-[#142e20] text-[#4ade80] px-2 py-0.5 rounded border border-[#166534] font-bold">
                  {caseInfo.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px]">
                <div className="space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-[#1a2130]">
                    <span className="text-[#64748b]">Case Identification:</span>
                    <span className="text-white font-bold">{caseInfo.id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1a2130]">
                    <span className="text-[#64748b]">Court Case Ref:</span>
                    <span className="text-[#38bdf8] font-bold">{caseInfo.courtCaseRef}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1a2130]">
                    <span className="text-[#64748b]">Lead Examiner:</span>
                    <span className="text-white">{caseInfo.investigator}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#64748b]">Organization:</span>
                    <span className="text-[#cbd5e1]">{caseInfo.organization}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between py-1 border-b border-[#1a2130]">
                    <span className="text-[#64748b]">Incident Date/Time:</span>
                    <span className="text-[#f59e0b] font-bold">{caseInfo.incidentDate}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1a2130]">
                    <span className="text-[#64748b]">Incident Location:</span>
                    <span className="text-white">{caseInfo.location}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1a2130]">
                    <span className="text-[#64748b]">Seized Evidence:</span>
                    <span className="text-[#38bdf8] font-bold">EVID-NVR-001 (4.0 TB)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#64748b]">Acquisition Hash:</span>
                    <span className="text-[#22c55e] font-bold">MATCH (Zero Bit Discrepancy)</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1e2533]">
                <span className="text-[10px] text-[#64748b] block mb-1">CASE SUMMARY & MANDATE:</span>
                <p className="text-[11px] text-[#cbd5e1] bg-[#0a0d14] p-3 rounded border border-[#1a2130] leading-relaxed">
                  {caseInfo.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: BOOKMARKS */}
        {activeSubTab === 'BOOKMARKS' && (
          <div className="max-w-4xl mx-auto space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-white text-xs">
                BOOKMARKED FORENSIC TIMECODES & ARTIFACTS ({bookmarks.length})
              </span>
              <span className="text-[10px] text-[#8b949e]">
                Click jump icon to navigate video player to exact frame
              </span>
            </div>

            <div className="space-y-2">
              {bookmarks.map((bkm) => (
                <div
                  key={bkm.id}
                  className="bg-[#121620] border border-[#242c3d] rounded p-3 flex items-center justify-between hover:bg-[#161c29] transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#f59e0b] font-bold">{bkm.id}</span>
                      <span className="text-[#64748b]">|</span>
                      <span className="text-[#38bdf8] font-bold">{bkm.cameraId}</span>
                      <span className="text-white font-mono">{bkm.timestamp}</span>
                      <span className="text-[10px] bg-[#1e293b] text-[#94a3b8] px-1.5 py-0.2 rounded">
                        Frame #{bkm.frameNumber}
                      </span>
                    </div>
                    <div className="font-bold text-white text-[12px]">{bkm.title}</div>
                    <p className="text-[10px] text-[#94a3b8]">{bkm.description}</p>
                    <div className="text-[9px] text-[#64748b]">
                      Analyst: {bkm.analyst} | Saved: {bkm.createdTime}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenBookmark(bkm)}
                      className="bg-[#0369a1] hover:bg-[#0284c7] text-white px-3 py-1.5 rounded font-bold cursor-pointer flex items-center gap-1 shadow"
                    >
                      <Play className="w-3 h-3" />
                      <span>JUMP TO FRAME</span>
                    </button>
                    <button
                      onClick={() => onDeleteBookmark(bkm.id)}
                      className="p-1.5 bg-[#1e2430] hover:bg-[#7f1d1d] text-[#64748b] hover:text-white rounded cursor-pointer"
                      title="Delete bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 3: EXAMINER NOTES */}
        {activeSubTab === 'NOTES' && (
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Create New Note Form */}
            <div className="bg-[#121620] border border-[#242c3d] rounded p-4">
              <h3 className="font-bold text-white text-xs mb-2 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>APPEND FORENSIC OBSERVATION NOTE</span>
              </h3>

              <form onSubmit={handleCreateNote} className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <label className="text-[#64748b] block mb-1">Target Evidence / Clip:</label>
                    <input
                      type="text"
                      value={newNoteRef}
                      onChange={(e) => setNewNoteRef(e.target.value)}
                      className="w-full bg-[#161c28] text-white p-1.5 rounded border border-[#2b3547] text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[#64748b] block mb-1">Evidentiary Weight:</label>
                    <select
                      value={newNoteImportance}
                      onChange={(e) => setNewNoteImportance(e.target.value as any)}
                      className="w-full bg-[#161c28] text-white p-1.5 rounded border border-[#2b3547] text-xs font-mono"
                    >
                      <option value="Standard">Standard Forensic Note</option>
                      <option value="Critical">Critical Incident Finding</option>
                      <option value="Exhibitory">Court Exhibit Evidence</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[#64748b] block mb-1">Observation & Forensic Reasoning:</label>
                  <textarea
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Enter technical observation, header analysis, or anomalous behavior..."
                    className="w-full bg-[#161c28] text-white p-2 rounded border border-[#2b3547] text-xs h-20 font-mono"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#0284c7] hover:bg-[#0369a1] text-white px-4 py-1.5 rounded font-bold cursor-pointer"
                  >
                    Append to Case Dossier
                  </button>
                </div>
              </form>
            </div>

            {/* Existing Notes List */}
            <div className="space-y-2">
              <span className="font-bold text-white text-xs block">
                RECORDED EXAMINER OBSERVATIONS ({notes.length})
              </span>

              {notes.map((note) => (
                <div key={note.id} className="bg-[#121620] border border-[#242c3d] rounded p-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#38bdf8]">{note.id}</span>
                      <span className="text-[#64748b]">|</span>
                      <span className="text-white font-mono">{note.evidenceRef}</span>
                      <span className="text-[#f59e0b]">{note.timestamp}</span>
                    </div>

                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        note.importance === 'Critical'
                          ? 'bg-[#7f1d1d] text-[#fca5a5] border border-[#dc2626]'
                          : note.importance === 'Exhibitory'
                          ? 'bg-[#14532d] text-[#86efac] border border-[#16a34a]'
                          : 'bg-[#1e293b] text-[#cbd5e1] border border-[#334155]'
                      }`}
                    >
                      {note.importance.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#cbd5e1] leading-relaxed pt-1">
                    {note.observation}
                  </p>

                  <div className="text-[9px] text-[#64748b] pt-1 border-t border-[#1a2130]">
                    Examiner: {note.analyst} | Logged: {note.createdTime}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
