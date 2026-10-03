import React, { useState } from 'react';
import {
  FileCheck,
  ShieldCheck,
  Plus,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  User,
  Lock
} from 'lucide-react';
import { CustodyRecord } from '../../types/forensics';

interface ChainOfCustodyViewProps {
  custodyRecords: CustodyRecord[];
  onAddCustodyRecord: (record: Omit<CustodyRecord, 'id'>) => void;
}

export const ChainOfCustodyView: React.FC<ChainOfCustodyViewProps> = ({
  custodyRecords,
  onAddCustodyRecord
}) => {
  const [selectedRecordId, setSelectedRecordId] = useState<string>(
    custodyRecords[0]?.id || 'COC-001'
  );
  const [showFullTable, setShowFullTable] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New custody event form states
  const [newAction, setNewAction] = useState<string>('Forensic Report Verification & Evidence Return');
  const [newPerson, setNewPerson] = useState<string>('Insp. Rajesh Varma (ID: DFC-418)');
  const [newRole, setNewRole] = useState<string>('Lead Digital Forensics Examiner');
  const [newOrg, setNewOrg] = useState<string>('State Cyber Crime FSL Division');
  const [newLocation, setNewLocation] = useState<string>('Cyber Forensics Secured Safe Vault');
  const [newNotes, setNewNotes] = useState<string>('Evidence sealed in tamper-evident container with unbroken verification seals.');

  const selectedRecord =
    custodyRecords.find((r) => r.id === selectedRecordId) || custodyRecords[0];

  // Requirement 10: Major milestones pipeline
  const majorPipelineSteps = [
    { label: 'Evidence Seized', time: '2026-09-28 23:45', id: 'COC-001' },
    { label: 'Evidence Ingested', time: '2026-09-29 08:15', id: 'COC-002' },
    { label: 'Forensic Image Created', time: '2026-09-29 09:05', id: 'COC-003' },
    { label: 'Storage Parsed', time: '2026-09-29 11:20', id: 'COC-004' },
    { label: 'Evidence Recovered', time: '2026-09-29 14:40', id: 'COC-005' },
    { label: 'Analysis & Report Prepared', time: '2026-09-29 16:30', id: 'COC-005' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';
    onAddCustodyRecord({
      timestamp: now,
      action: newAction,
      person: newPerson,
      role: newRole,
      organization: newOrg,
      evidenceId: 'EVID-NVR-001',
      hash: 'SHA256: 7f3c4e92a10df54b8301726c8d35e4b109af9b2c8a14ec4210d7a6bc9924a91e',
      location: newLocation,
      status: 'Verified',
      notes: newNotes
    });
    setShowAddModal(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e14] h-full overflow-hidden select-none font-mono text-xs">
      {/* Top Header */}
      <div className="h-10 px-4 bg-[#141822] border-b border-[#242c3d] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <FileCheck className="w-4 h-4 text-[#22c55e]" />
            <span>CHAIN OF CUSTODY</span>
          </div>
          <span className="text-[#475569]">|</span>
          <span className="text-[#38bdf8]">EVID-NVR-001</span>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-[#15803d] hover:bg-[#166534] text-white px-3 py-1 rounded font-bold cursor-pointer shadow text-[11px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>LOG CUSTODY EVENT</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 overflow-y-auto max-w-4xl mx-auto w-full space-y-4">
        {/* Requirement 10: Clean Primary Section */}
        <div className="bg-[#121620] border border-[#242c3d] rounded-lg p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1c2331]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0a2717] border border-[#166534] flex items-center justify-center text-[#22c55e]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wide">CHAIN OF CUSTODY</h2>
                <span className="text-[10px] text-[#8b949e]">
                  Continuous legal custody ledger with unbroken cryptographic continuity
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-[#0c2818] text-[#4ade80] px-3 py-1 rounded text-xs font-bold border border-[#166534] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" />
                ✓ VERIFIED
              </span>
            </div>
          </div>

          {/* Requirement 10: Clean Chronological Pipeline of Major Custody Events */}
          <div className="py-2">
            <span className="text-[10px] text-[#64748b] block mb-2 font-bold uppercase tracking-wider">
              Major Custody Progression Pipeline:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {majorPipelineSteps.map((step, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    const match = custodyRecords.find((r) => r.id === step.id);
                    if (match) setSelectedRecordId(match.id);
                  }}
                  className="bg-[#0b0e14] p-2.5 rounded-lg border border-[#1a2130] hover:border-[#38bdf8] cursor-pointer transition flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[9px] text-[#38bdf8] font-bold block mb-1">
                      STEP {idx + 1}
                    </span>
                    <span className="text-white font-bold text-[11px] block leading-tight">
                      {step.label}
                    </span>
                  </div>
                  <span className="text-[9px] text-[#22c55e] mt-2 block font-mono">
                    ✓ Verified
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Toggle between clean pipeline / selected event and full table */}
          <div className="pt-2 border-t border-[#1c2331] flex items-center justify-between">
            <button
              onClick={() => setShowFullTable(!showFullTable)}
              className="text-[#38bdf8] hover:underline text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>{showFullTable ? 'Hide Complete Ledger Table' : 'View Complete Ledger Table (5 Events)'}</span>
              {showFullTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <span className="text-[10px] text-[#8b949e]">
              Selected Event: <strong className="text-white">{selectedRecord.id}</strong>
            </span>
          </div>
        </div>

        {/* Selected Event Details (Clean & Focused) */}
        <div className="bg-[#121620] border border-[#242c3d] rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1c2331]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-xs">{selectedRecord.action}</span>
              <span className="text-[10px] bg-[#1a2233] text-[#38bdf8] px-1.5 py-0.2 rounded border border-[#253247]">
                {selectedRecord.id}
              </span>
            </div>
            <span className="text-[10px] text-[#f59e0b] font-mono">{selectedRecord.timestamp}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
            <div>
              <span className="text-[#64748b] block text-[10px]">CUSTODIAN / OFFICER:</span>
              <span className="text-white font-semibold">{selectedRecord.person}</span>
              <span className="text-[#8b949e] text-[10px] block">{selectedRecord.role}</span>
            </div>
            <div>
              <span className="text-[#64748b] block text-[10px]">ORGANIZATION / FACILITY:</span>
              <span className="text-white">{selectedRecord.organization}</span>
              <span className="text-[#8b949e] text-[10px] block">{selectedRecord.location}</span>
            </div>
            <div>
              <span className="text-[#64748b] block text-[10px]">INTEGRITY STATUS:</span>
              <span className="text-[#22c55e] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Intact
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1c2331]">
            <span className="text-[#64748b] text-[10px] block mb-1">CUSTODIAL NOTES & AUDIT MANIFEST:</span>
            <p className="text-[#cbd5e1] text-[11px] bg-[#0b0e14] p-2.5 rounded border border-[#1a2130]">
              {selectedRecord.notes}
            </p>
          </div>
        </div>

        {/* PROGRESSIVE DISCLOSURE: Complete Ledger Table */}
        {showFullTable && (
          <div className="bg-[#121620] border border-[#242c3d] rounded-lg overflow-hidden animate-in fade-in duration-150">
            <div className="px-4 py-2 bg-[#161c27] border-b border-[#242c3d] font-bold text-white text-xs">
              COMPLETE CHAIN OF CUSTODY AUDIT LOG
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-[#10141d] text-[#64748b] border-b border-[#1f2635]">
                  <tr>
                    <th className="p-2.5">TIME</th>
                    <th className="p-2.5">ACTION</th>
                    <th className="p-2.5">OFFICER</th>
                    <th className="p-2.5">LOCATION</th>
                    <th className="p-2.5">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#18202d] text-[#cbd5e1]">
                  {custodyRecords.map((rec) => (
                    <tr
                      key={rec.id}
                      onClick={() => setSelectedRecordId(rec.id)}
                      className="hover:bg-[#182232] cursor-pointer"
                    >
                      <td className="p-2.5 font-mono text-[#f59e0b] whitespace-nowrap">{rec.timestamp}</td>
                      <td className="p-2.5 font-bold text-white">{rec.action}</td>
                      <td className="p-2.5 text-[#38bdf8]">{rec.person.split('(')[0]}</td>
                      <td className="p-2.5 text-[#8b949e]">{rec.location}</td>
                      <td className="p-2.5 text-[#22c55e] font-bold">✓ Verified</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Custody Event Modal Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-[#2b3547] rounded-lg shadow-2xl w-full max-w-lg overflow-hidden text-xs text-[#cbd5e1]">
            <div className="h-10 px-4 bg-[#161c28] border-b border-[#242c3d] flex items-center justify-between font-bold text-white">
              <span>RECORD NEW CHAIN OF CUSTODY EVENT</span>
              <button onClick={() => setShowAddModal(false)} className="text-[#8b949e] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div>
                <label className="text-[10px] text-[#8b949e] block mb-1">Action Description:</label>
                <input
                  type="text"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  className="w-full bg-[#161c27] text-white p-2 rounded border border-[#2b3547] text-xs font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#8b949e] block mb-1">Officer / Examiner:</label>
                  <input
                    type="text"
                    value={newPerson}
                    onChange={(e) => setNewPerson(e.target.value)}
                    className="w-full bg-[#161c27] text-white p-2 rounded border border-[#2b3547] text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#8b949e] block mb-1">Role / Rank:</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-[#161c27] text-white p-2 rounded border border-[#2b3547] text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#8b949e] block mb-1">Location / Safe Facility:</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-[#161c27] text-white p-2 rounded border border-[#2b3547] text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-[#8b949e] block mb-1">Observational Notes:</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-[#161c27] text-white p-2 rounded border border-[#2b3547] text-xs h-16 font-mono"
                  required
                />
              </div>

              <div className="pt-2 border-t border-[#1e2533] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded bg-[#1e293b] text-[#8b949e] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#15803d] hover:bg-[#166534] text-white font-bold cursor-pointer"
                >
                  Sign & Append to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
