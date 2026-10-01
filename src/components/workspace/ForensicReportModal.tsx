import React, { useRef } from 'react';
import {
  FileText,
  Printer,
  Download,
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  HardDrive,
  Cpu,
  Calendar,
  Layers,
  Sparkles,
  Flame,
  Clock
} from 'lucide-react';
import {
  CaseInfo,
  DeviceInfo,
  VideoRecording,
  AIFinding,
  TimelineEvent,
  CustodyRecord,
  RecoveryFragment,
  CaseNote,
  EvidenceBookmark
} from '../../types/forensics';

interface ForensicReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseInfo: CaseInfo;
  deviceInfo: DeviceInfo;
  recordings: VideoRecording[];
  aiFindings: AIFinding[];
  timelineEvents: TimelineEvent[];
  custodyRecords: CustodyRecord[];
  fragments: RecoveryFragment[];
  notes: CaseNote[];
  bookmarks: EvidenceBookmark[];
}

export const ForensicReportModal: React.FC<ForensicReportModalProps> = ({
  isOpen,
  onClose,
  caseInfo,
  deviceInfo,
  recordings,
  aiFindings,
  timelineEvents,
  custodyRecords,
  fragments,
  notes,
  bookmarks
}) => {
  const reportRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 select-none font-mono">
      <div className="bg-[#0f131c] border border-[#2d3748] rounded-lg shadow-2xl w-full max-w-4xl h-[92vh] flex flex-col overflow-hidden text-xs text-[#cbd5e1]">
        {/* Top Controls Bar */}
        <div className="h-12 px-4 bg-[#151a26] border-b border-[#242c3d] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#38bdf8]" />
            <div>
              <span className="font-bold text-white text-sm">
                OFFICIAL DIGITAL FORENSIC EXAMINATION REPORT
              </span>
              <span className="text-[10px] text-[#38bdf8] ml-2">
                ISO/IEC 27037 & SECTION 65B INDIAN EVIDENCE ACT COMPLIANT
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white px-3 py-1.5 rounded font-bold cursor-pointer shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT / EXPORT PDF</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-[#8b949e] hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Formal Forensic Printable Report Document */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#ffffff] text-[#111827] font-serif leading-relaxed">
          <div ref={reportRef} className="max-w-3xl mx-auto space-y-6">
            {/* Header Document Seal */}
            <div className="border-b-2 border-black pb-4 text-center space-y-1">
              <div className="font-bold tracking-widest text-sm uppercase">
                GOVERNMENT FORENSIC SCIENCE LABORATORY
              </div>
              <div className="text-xs font-semibold text-gray-700 uppercase">
                DIGITAL EVIDENCE EXAMINATION DIVISION — SURVEILLANCE FORENSICS WING
              </div>
              <div className="text-base font-bold underline pt-2">
                EXPERT OPINION & FORENSIC EXAMINATION REPORT
              </div>
              <div className="text-[11px] font-mono text-gray-600">
                CASE REF: {caseInfo.id} | COURT REF: {caseInfo.courtCaseRef} | REPORT NO: FSL/DIG/2026/0994
              </div>
            </div>

            {/* 1. Case Information */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5">
                1. Case Information
              </h2>
              <table className="w-full text-xs font-sans">
                <tbody>
                  <tr>
                    <td className="w-1/3 font-semibold text-gray-700">Case Title:</td>
                    <td>{caseInfo.title}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-gray-700">Investigating Agency:</td>
                    <td>{caseInfo.organization}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-gray-700">Lead Forensic Examiner:</td>
                    <td>{caseInfo.investigator}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-gray-700">Incident Date & Location:</td>
                    <td>{caseInfo.incidentDate} — {caseInfo.location}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 2. Evidence Information */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5">
                2. Evidence Information
              </h2>
              <table className="w-full text-xs font-sans">
                <tbody>
                  <tr>
                    <td className="w-1/3 font-semibold text-gray-700">Evidence Identifier:</td>
                    <td className="font-mono font-bold">EVID-NVR-001</td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-gray-700">Seized Packaging:</td>
                    <td>Anti-Static Tamper Evident Bag #TEB-88914 (Intact Seals)</td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-gray-700">Date/Time Received:</td>
                    <td>2026-09-29 08:15:00 IST</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 3. Device Information */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5">
                3. Hardware Device Details
              </h2>
              <table className="w-full text-xs font-sans">
                <tbody>
                  <tr>
                    <td className="w-1/3 font-semibold text-gray-700">Manufacturer & Model:</td>
                    <td>{deviceInfo.manufacturer} {deviceInfo.model}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-gray-700">Hardware Serial Number:</td>
                    <td className="font-mono">{deviceInfo.serialNumber}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-gray-700">Firmware Build:</td>
                    <td className="font-mono">{deviceInfo.firmware}</td>
                  </tr>
                  <tr>
                    <td className="font-semibold text-gray-700">Storage Subsystem:</td>
                    <td>1x 4.0 TB SATA Surveillance HDD (Seagate SkyHawk)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4. Acquisition Method & Write-Blocker Certification */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5">
                4. Acquisition Method & Write-Blocker Certification
              </h2>
              <p className="text-xs text-gray-800">
                Bit-stream acquisition was performed utilizing hardware write-blocker <strong>{deviceInfo.writeBlockerModel}</strong>. Physical SCSI write commands (0x2A) were intercepted and rejected by hardware bridge firmware. The bit-stream raw image was acquired into container file <strong>EVID-NVR-001.E01</strong> in accordance with ISO/IEC 27037 standards.
              </p>
            </div>

            {/* 5. Hash Verification */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5">
                5. Cryptographic Hash Verification
              </h2>
              <table className="w-full text-xs font-mono border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-1 border text-left">ALGORITHM</th>
                    <th className="p-1 border text-left">ACQUISITION HASH</th>
                    <th className="p-1 border text-left">VERIFICATION HASH</th>
                    <th className="p-1 border text-left">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-1 border font-bold">MD5</td>
                    <td className="p-1 border text-[10px]">{deviceInfo.acquisitionHashMD5}</td>
                    <td className="p-1 border text-[10px]">{deviceInfo.acquisitionHashMD5}</td>
                    <td className="p-1 border text-green-700 font-bold">MATCH</td>
                  </tr>
                  <tr>
                    <td className="p-1 border font-bold">SHA-256</td>
                    <td className="p-1 border text-[10px]">{deviceInfo.acquisitionHashSHA256}</td>
                    <td className="p-1 border text-[10px]">{deviceInfo.acquisitionHashSHA256}</td>
                    <td className="p-1 border text-green-700 font-bold">MATCH</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 6. Storage Examination */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5">
                6. Storage & File-System Examination
              </h2>
              <p className="text-xs text-gray-800">
                Examiner utilized EviTwin HikFS v4.2 extent parsing adapter. Analysis revealed 37 storage blocks with 12 unallocated extents where video streams had been deleted from master volume index tables.
              </p>
            </div>

            {/* 7. Recording Inventory */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5">
                7. Surveillance Recording Inventory (Key Incident Extracts)
              </h2>
              <table className="w-full text-[10px] font-sans border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-1 border text-left">REC ID</th>
                    <th className="p-1 border text-left">CHANNEL</th>
                    <th className="p-1 border text-left">RAW TIME</th>
                    <th className="p-1 border text-left">NORMALIZED TIME</th>
                    <th className="p-1 border text-left">DURATION</th>
                    <th className="p-1 border text-left">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {recordings.slice(0, 5).map((r) => (
                    <tr key={r.id}>
                      <td className="p-1 border font-mono font-bold">{r.id}</td>
                      <td className="p-1 border">{r.cameraId} ({r.cameraName.split(' ')[0]})</td>
                      <td className="p-1 border font-mono">{r.startTime}</td>
                      <td className="p-1 border font-mono text-blue-700">{r.normalizedStartTime}</td>
                      <td className="p-1 border">{r.durationFormatted}</td>
                      <td className="p-1 border font-bold">{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 8. Recovery & Carving Results */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5">
                8. Deleted Footage Carving & Reconstruction
              </h2>
              <p className="text-xs text-gray-800">
                Unallocated storage cluster at byte offset <strong>0x8A23F000</strong> (Fragment <strong>FRAG-00382</strong>) was successfully carved. By reconstructing NAL unit sequence parameters (HEVC SPS/PPS) and correcting DTS/PTS continuity, 519 seconds of deleted surveillance footage was reconstructed as evidence item <strong>REC-CH04-019</strong> (Confidence: 87%).
              </p>
            </div>

            {/* 9. Timestamp Forensics & Normalization */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5">
                9. Timestamp Forensics & Normalization Analysis
              </h2>
              <p className="text-xs text-gray-800">
                Comparison of the internal NVR real-time hardware clock against standard Indian Standard Time (IST / UTC+05:30) atomic reference clock revealed a drift offset of <strong>+00:03:17 (ahead)</strong>. All event timecodes were normalized analytically while maintaining the pristine raw metadata on the original E01 bit-stream image.
              </p>
            </div>

            {/* 10. AI Findings & Event Timeline */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5">
                10. Grounded AI Findings & Cross-Camera Timeline
              </h2>
              <table className="w-full text-[10px] font-sans border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-1 border text-left">FINDING ID</th>
                    <th className="p-1 border text-left">OBJECT / TYPE</th>
                    <th className="p-1 border text-left">CAMERA</th>
                    <th className="p-1 border text-left">NORMALIZED TIME</th>
                    <th className="p-1 border text-left">FRAME #</th>
                    <th className="p-1 border text-left">CONFIDENCE</th>
                  </tr>
                </thead>
                <tbody>
                  {aiFindings.filter(f => f.addedToReport).map((f) => (
                    <tr key={f.id}>
                      <td className="p-1 border font-mono font-bold">{f.id}</td>
                      <td className="p-1 border font-semibold">{f.type}</td>
                      <td className="p-1 border">{f.cameraId} - {f.cameraName}</td>
                      <td className="p-1 border font-mono">{f.normalizedTimestamp}</td>
                      <td className="p-1 border font-mono">#{f.frameNumber}</td>
                      <td className="p-1 border font-bold text-green-700">{f.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 11. Chain of Custody Summary */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-gray-400 pb-0.5">
                11. Chain of Custody Verification
              </h2>
              <p className="text-xs text-gray-800">
                Total custody events recorded: <strong>{custodyRecords.length} transfers</strong>. Evidence was handled continuously under lock and seal without interruption of legal custody.
              </p>
            </div>

            {/* 12. Examiner Conclusion */}
            <div className="space-y-2 pt-2 border-t-2 border-black">
              <h2 className="text-xs font-bold uppercase tracking-wider">
                12. Formal Forensic Opinion & Conclusion
              </h2>
              <p className="text-xs text-gray-900 leading-normal">
                Based upon the scientific examination conducted in accordance with established digital forensic principles:
              </p>
              <ol className="list-decimal pl-5 text-xs space-y-1 text-gray-900">
                <li>
                  The surveillance bit-stream acquisition is authentic, complete, and verified with identical SHA-256 hash digests before and after examination.
                </li>
                <li>
                  Surveillance footage from Channel 04 (East Ground Corridor) between 21:14:32 and 21:23:11 was deleted from the active filesystem table but successfully recovered from unallocated physical storage extents.
                </li>
                <li>
                  The recovered footage depicts an unidentified individual tampering with the door access terminal of Server Vault 4B, correlating with cross-camera sightings of a dark sedan entering Gate 1 at 21:14:02 and exiting Gate 3 at 21:15:19.
                </li>
              </ol>

              {/* Signature Blocks */}
              <div className="pt-10 flex justify-between items-end text-xs font-sans">
                <div className="text-center">
                  <div className="border-t border-gray-500 pt-1 w-48 font-bold">
                    Sub-Insp. K. Sengar
                  </div>
                  <div className="text-[10px] text-gray-600">Investigating Officer (IO)</div>
                </div>

                <div className="text-center">
                  <div className="border-t border-gray-500 pt-1 w-56 font-bold">
                    Insp. Rajesh Varma (DFC-418)
                  </div>
                  <div className="text-[10px] text-gray-600">Lead Digital Forensics Examiner, FSL</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="h-10 px-4 bg-[#151a26] border-t border-[#242c3d] flex items-center justify-between text-xs text-[#8b949e]">
          <span>Generated by EviTwin Multi-Vendor DVR/NVR Forensics Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1 bg-[#1e293b] hover:bg-[#2b3a52] text-white rounded cursor-pointer font-bold"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
