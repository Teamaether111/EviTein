import React, { useState } from 'react';
import {
  FileCheck,
  ShieldCheck,
  Plus,
  User,
  Clock,
  MapPin,
  Lock,
  CheckCircle2,
  X,
  FileText
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
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newAction, setNewAction] = useState<string>('Evidence Handover / Forensic Verification');
  const [newPerson, setNewPerson] = useState<string>('Insp. Rajesh Varma (ID: DFC-418)');
  const [newRole, setNewRole] = useState<string>('Lead Digital Forensics Examiner');
  const [newOrg, setNewOrg] = useState<string>('State Cyber Crime FSL Division');
  const [newLocation, setNewLocation] = useState<string>('Cyber Forensics Secured Vault #2');
  const [newNotes, setNewNotes] = useState<string>('Evidence stored in temperature-regulated anti-static evidence safe. Tamper seals verified.');

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
      {/* Header */}
      <div className="h-10 px-4 bg-[#141822] border-b border-[#242c3d] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <FileCheck className="w-4 h-4 text-[#22c55e]" />
            <span>LEGAL CHAIN OF CUSTODY (COC) LEDGER</span>
          </div>
          <span className="text-[#475569]">|</span>
          <span className="text-[#38bdf8]">EVIDENCE: EVID-NVR-001</span>
          <span className="text-[#22c55e]">[STATUTORY ADMISSIBILITY]</span>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-[#15803d] hover:bg-[#166534] text-white px-3 py-1 rounded font-bold cursor-pointer shadow"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>LOG CUSTODY EVENT</span>
        </button>
      </div>

      {/* Ledger Table */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-[#0e1219] rounded border border-[#222a3a] overflow-hidden">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-[#161c27] text-[#64748b] border-b border-[#1f2635]">
              <tr>
                <th className="p-3">DATE / TIME</th>
                <th className="p-3">ACTION PERFORMED</th>
                <th className="p-3">OFFICER / EXAMINER</th>
                <th className="p-3">ROLE & AGENCY</th>
                <th className="p-3">EVIDENCE ID</th>
                <th className="p-3">CRYPTOGRAPHIC HASH</th>
                <th className="p-3">LOCATION</th>
                <th className="p-3">INTEGRITY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#18202d] text-[#cbd5e1]">
              {custodyRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#131924]">
                  <td className="p-3 font-mono text-[#f59e0b] whitespace-nowrap">{rec.timestamp}</td>
                  <td className="p-3 font-bold text-white">
                    <div>{rec.action}</div>
                    <div className="text-[10px] text-[#8b949e] font-normal mt-0.5">{rec.notes}</div>
                  </td>
                  <td className="p-3 text-[#38bdf8] font-semibold">{rec.person}</td>
                  <td className="p-3 text-[#94a3b8]">
                    <div>{rec.role}</div>
                    <div className="text-[10px] text-[#64748b]">{rec.organization}</div>
                  </td>
                  <td className="p-3 font-mono text-white">{rec.evidenceId}</td>
                  <td className="p-3 font-mono text-[9px] text-[#cbd5e1] truncate max-w-[140px]" title={rec.hash}>
                    {rec.hash}
                  </td>
                  <td className="p-3 text-[#94a3b8]">{rec.location}</td>
                  <td className="p-3">
                    <span className="bg-[#064e3b] text-[#34d399] px-2 py-0.5 rounded border border-[#059669] font-bold flex items-center gap-1 w-fit text-[10px]">
                      <ShieldCheck className="w-3 h-3" /> {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Custody Event Modal */}
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
                  className="w-full bg-[#161c27] text-white p-2 rounded border border-[#2b3547] text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-[#8b949e] block mb-1">Examiner / Custodian:</label>
                  <input
                    type="text"
                    value={newPerson}
                    onChange={(e) => setNewPerson(e.target.value)}
                    className="w-full bg-[#161c27] text-white p-2 rounded border border-[#2b3547] text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#8b949e] block mb-1">Official Role:</label>
                  <input
                    type="text"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-[#161c27] text-white p-2 rounded border border-[#2b3547] text-xs"
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
                  className="w-full bg-[#161c27] text-white p-2 rounded border border-[#2b3547] text-xs"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-[#8b949e] block mb-1">Observational Notes:</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-[#161c27] text-white p-2 rounded border border-[#2b3547] text-xs h-16"
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
