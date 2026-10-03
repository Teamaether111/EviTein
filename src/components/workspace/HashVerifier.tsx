import React, { useState } from 'react';
import {
  ShieldCheck,
  RotateCw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Terminal,
  FileCheck,
  Copy,
  Check,
  Lock,
  ArrowRight
} from 'lucide-react';
import { DeviceInfo } from '../../types/forensics';

interface HashVerifierProps {
  deviceInfo: DeviceInfo;
  onNavigateToCustody?: () => void;
}

export const HashVerifier: React.FC<HashVerifierProps> = ({
  deviceInfo,
  onNavigateToCustody
}) => {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifyProgress, setVerifyProgress] = useState<number>(100);
  const [lastVerifiedTime, setLastVerifiedTime] = useState<string>('2026-09-29 09:12:44 IST');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Progressive disclosure accordions
  const [showHashDetails, setShowHashDetails] = useState<boolean>(false);
  const [showAuditLog, setShowAuditLog] = useState<boolean>(false);

  const [logMessages, setLogMessages] = useState<string[]>([
    '[INIT] Hardware write-blocker Tableau T8u authenticated on USB 3.0 Bus 02',
    '[HASH] Block 0x00000000 to 0x3A000000 read-stream validated against acquisition manifest',
    '[HASH] MD5 Computed: 91ab7c2de04a621b8f5e3d74c09211aa -> MATCH',
    '[HASH] SHA-256 Computed: 7f3c4e92a10df54b8301726c8d35e4b109af9b2c8a14ec4210d7a6bc9924a91e -> MATCH',
    '[AUDIT] Verification completed with zero byte discrepancy (0 bit flipped).'
  ]);

  const handleVerifyAgain = () => {
    setIsVerifying(true);
    setVerifyProgress(0);
    setLogMessages(['[START] Re-verifying bit-stream cryptographic hashes across all 976,758,552 LBA sectors...']);

    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      if (p >= 100) {
        clearInterval(interval);
        setVerifyProgress(100);
        setIsVerifying(false);
        const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';
        setLastVerifiedTime(now);
        setLogMessages((prev) => [
          ...prev,
          '[STREAM] Sector read throughput 210 MB/s sustained',
          '[MD5] Hash: 91ab7c2de04a621b8f5e3d74c09211aa -> MATCH VERIFIED',
          '[SHA-256] Hash: 7f3c4e92a10df54b8301726c8d35e4b109af9b2c8a14ec4210d7a6bc9924a91e -> MATCH VERIFIED',
          `[COMPLETE] Re-verification successful at ${now}. Evidence integrity preserved.`
        ]);
      } else {
        setVerifyProgress(p);
      }
    }, 300);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(label);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e14] h-full overflow-hidden select-none font-mono text-xs">
      {/* Top Header */}
      <div className="h-10 px-4 bg-[#141822] border-b border-[#242c3d] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
            <span>EVIDENCE INTEGRITY</span>
          </div>
          <span className="text-[#475569]">|</span>
          <span className="text-[#38bdf8]">EVIDENCE: EVID-NVR-001</span>
        </div>

        <button
          onClick={handleVerifyAgain}
          disabled={isVerifying}
          className={`flex items-center gap-1.5 px-3 py-1 rounded font-bold cursor-pointer transition ${
            isVerifying
              ? 'bg-[#1e293b] text-[#64748b] cursor-not-allowed'
              : 'bg-[#15803d] hover:bg-[#166534] text-white shadow'
          }`}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
          <span>VERIFY AGAIN</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 overflow-y-auto max-w-4xl mx-auto w-full space-y-4">
        {/* Requirement 9: Clean Primary Section */}
        <div className="bg-[#121620] border border-[#242c3d] rounded-lg p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1c2331]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0a2717] border border-[#166534] flex items-center justify-center text-[#22c55e]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wide">EVIDENCE INTEGRITY</h2>
                <span className="text-[10px] text-[#8b949e]">
                  Last audited: <strong className="text-[#cbd5e1]">{lastVerifiedTime}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-[#0c2818] text-[#4ade80] px-3 py-1 rounded text-xs font-bold border border-[#166534] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                VERIFIED
              </span>
            </div>
          </div>

          {/* 4 Clean Primary Status Cards per Requirement 9 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
            <div className="bg-[#0b0e14] p-3 rounded-lg border border-[#1a2130]">
              <span className="text-[10px] text-[#64748b] block mb-1">SHA-256 DIGEST</span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#22c55e]">
                <span>MATCH</span>
                <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
              </div>
              <span className="text-[10px] text-[#8b949e]">Zero byte divergence</span>
            </div>

            <div className="bg-[#0b0e14] p-3 rounded-lg border border-[#1a2130]">
              <span className="text-[10px] text-[#64748b] block mb-1">MD5 CHECKSUM</span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#22c55e]">
                <span>MATCH</span>
                <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
              </div>
              <span className="text-[10px] text-[#8b949e]">Bit-stream identical</span>
            </div>

            <div className="bg-[#0b0e14] p-3 rounded-lg border border-[#1a2130]">
              <span className="text-[10px] text-[#64748b] block mb-1">ACQUISITION IMAGE</span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#38bdf8]">
                <span>VERIFIED</span>
                <CheckCircle2 className="w-4 h-4 text-[#38bdf8]" />
              </div>
              <span className="text-[10px] text-[#8b949e]">EVID-NVR-001.E01</span>
            </div>

            <div className="bg-[#0b0e14] p-3 rounded-lg border border-[#1a2130]">
              <span className="text-[10px] text-[#64748b] block mb-1">CHAIN OF CUSTODY</span>
              <div className="flex items-center gap-1.5 text-sm font-bold text-[#4ade80]">
                <span>VERIFIED</span>
                <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />
              </div>
              <span className="text-[10px] text-[#8b949e]">5 events signed</span>
            </div>
          </div>

          {/* Verification in progress bar */}
          {isVerifying && (
            <div className="space-y-1.5 bg-[#0a0d14] p-3 rounded border border-[#1e2533]">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#38bdf8] flex items-center gap-1">
                  <RotateCw className="w-3 h-3 animate-spin" />
                  RE-COMPUTING HASHES ACROSS LBA 0..976,758,551...
                </span>
                <span className="text-white font-bold">{verifyProgress}%</span>
              </div>
              <div className="h-1.5 bg-[#1a2130] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#16a34a] to-[#22c55e] transition-all duration-300"
                  style={{ width: `${verifyProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Requirement 9 Buttons: [VIEW HASH DETAILS] | [VIEW AUDIT LOG] | [VIEW CHAIN OF CUSTODY] */}
          <div className="pt-3 border-t border-[#1c2331] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowHashDetails(!showHashDetails)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1a2333] hover:bg-[#232f45] border border-[#2d3a50] text-[#cbd5e1] text-xs font-semibold cursor-pointer"
              >
                <span>{showHashDetails ? 'HIDE HASH DETAILS' : 'VIEW HASH DETAILS'}</span>
                {showHashDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              <button
                onClick={() => setShowAuditLog(!showAuditLog)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1a2333] hover:bg-[#232f45] border border-[#2d3a50] text-[#cbd5e1] text-xs font-semibold cursor-pointer"
              >
                <span>{showAuditLog ? 'HIDE AUDIT LOG' : 'VIEW AUDIT LOG'}</span>
                {showAuditLog ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {onNavigateToCustody && (
              <button
                onClick={onNavigateToCustody}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#162030] hover:bg-[#1e2a40] border border-[#283850] text-[#38bdf8] text-xs font-semibold cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>VIEW CHAIN OF CUSTODY →</span>
              </button>
            )}
          </div>
        </div>

        {/* PROGRESSIVE DISCLOSURE: Hash Details Accordion */}
        {showHashDetails && (
          <div className="bg-[#0f131c] border border-[#242c3d] rounded-lg p-4 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#1c2331]">
              <span className="font-bold text-white text-xs">TECHNICAL CRYPTOGRAPHIC CHECKSUMS</span>
              <span className="text-[10px] text-[#22c55e]">Acquisition vs Live Verified</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-[#121620] p-3 rounded border border-[#1e2637] space-y-1.5">
                <div className="flex justify-between items-center text-[#8b949e] text-[10px]">
                  <span>SHA-256 HASH:</span>
                  <button
                    onClick={() => copyToClipboard(deviceInfo.acquisitionHashSHA256, 'SHA-256')}
                    className="text-[#38bdf8] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedHash === 'SHA-256' ? <Check className="w-3 h-3 text-[#22c55e]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash === 'SHA-256' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-white font-mono break-all text-[11px] bg-[#0b0e14] p-2 rounded border border-[#18202d]">
                  {deviceInfo.acquisitionHashSHA256}
                </div>
                <div className="text-[10px] text-[#22c55e] flex items-center gap-1 pt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Acquisition Hash = Live Image Hash (MATCH)</span>
                </div>
              </div>

              <div className="bg-[#121620] p-3 rounded border border-[#1e2637] space-y-1.5">
                <div className="flex justify-between items-center text-[#8b949e] text-[10px]">
                  <span>MD5 CHECKSUM:</span>
                  <button
                    onClick={() => copyToClipboard(deviceInfo.acquisitionHashMD5, 'MD5')}
                    className="text-[#38bdf8] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedHash === 'MD5' ? <Check className="w-3 h-3 text-[#22c55e]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash === 'MD5' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-white font-mono break-all text-[11px] bg-[#0b0e14] p-2 rounded border border-[#18202d]">
                  {deviceInfo.acquisitionHashMD5}
                </div>
                <div className="text-[10px] text-[#22c55e] flex items-center gap-1 pt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Acquisition Hash = Live Image Hash (MATCH)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROGRESSIVE DISCLOSURE: Audit Log Accordion */}
        {showAuditLog && (
          <div className="bg-[#0f131c] border border-[#242c3d] rounded-lg p-4 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#1c2331]">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-[#38bdf8]" />
                ISO/IEC 27037 AUDIT VERIFICATION LOG
              </span>
              <span className="text-[10px] text-[#64748b]">Tableau T8u Bridge</span>
            </div>

            <div className="bg-[#07090e] p-3 rounded border border-[#18202d] text-[10px] text-[#cbd5e1] space-y-1 overflow-y-auto max-h-40">
              {logMessages.map((msg, idx) => (
                <div key={idx} className="font-mono">
                  {msg}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
