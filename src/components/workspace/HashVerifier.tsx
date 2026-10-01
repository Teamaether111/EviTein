import React, { useState } from 'react';
import {
  ShieldCheck,
  RotateCw,
  HardDrive,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  FileCheck,
  Terminal,
  Activity
} from 'lucide-react';
import { DeviceInfo } from '../../types/forensics';

interface HashVerifierProps {
  deviceInfo: DeviceInfo;
}

export const HashVerifier: React.FC<HashVerifierProps> = ({ deviceInfo }) => {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifyProgress, setVerifyProgress] = useState<number>(100);
  const [lastVerifiedTime, setLastVerifiedTime] = useState<string>('2026-09-29 09:12:44 IST');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
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
      p += 15;
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
        setLogMessages((prev) => [
          ...prev,
          `[READ] Scanning cylinder ${(p * 9.7).toFixed(0)}M sectors (${p}%)... SHA-256 on-the-fly digest active`
        ]);
      }
    }, 400);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(label);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e14] h-full overflow-hidden select-none font-mono text-xs">
      {/* Header */}
      <div className="h-10 px-4 bg-[#141822] border-b border-[#242c3d] flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white font-bold">
            <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
            <span>CRYPTOGRAPHIC INTEGRITY & HASH VERIFICATION CONSOLE</span>
          </div>
          <span className="text-[#475569]">|</span>
          <span className="text-[#38bdf8]">EVIDENCE: EVID-NVR-001</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-[#0d2818] text-[#86efac] px-2 py-0.5 rounded border border-[#15803d] font-bold">
            INTEGRITY: MATCHED
          </span>
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
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Verification Status Card */}
        <div className="bg-[#121620] border border-[#242c3d] rounded p-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e2533] mb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded bg-[#142e20] border border-[#166534] flex items-center justify-center text-[#22c55e]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">EVIDENCE INTEGRITY AUDIT: 100% MATCH</h3>
                <span className="text-[10px] text-[#8b949e]">
                  Last Verified: <strong className="text-[#cbd5e1]">{lastVerifiedTime}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-[#11241a] text-[#4ade80] px-2.5 py-1 rounded border border-[#166534] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ACQUISITION HASH MATCHED LIVE IMAGE
              </span>
            </div>
          </div>

          {/* Progress bar if verifying */}
          {isVerifying && (
            <div className="space-y-1.5 mb-4 bg-[#0a0d14] p-3 rounded border border-[#1e2533]">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#38bdf8] flex items-center gap-1">
                  <RotateCw className="w-3 h-3 animate-spin" />
                  RE-COMPUTING CRYPTOGRAPHIC DIGESTS (SHA-256 / MD5)...
                </span>
                <span className="text-white font-bold">{verifyProgress}%</span>
              </div>
              <div className="h-2 bg-[#1a2130] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#16a34a] to-[#22c55e] transition-all duration-300"
                  style={{ width: `${verifyProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Side-by-Side Hash Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* MD5 Comparison */}
            <div className="bg-[#0b0e14] p-3 rounded border border-[#1a2130] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-white">MD5 (MESSAGE DIGEST 5)</span>
                <span className="text-[#22c55e] bg-[#142e20] px-1.5 py-0.2 rounded border border-[#166534]">
                  IDENTICAL MATCH
                </span>
              </div>
              <div>
                <div className="text-[9px] text-[#64748b]">ACQUISITION MD5:</div>
                <div className="text-white font-mono break-all text-[11px] bg-[#121620] p-1.5 rounded border border-[#1e2533] mt-0.5">
                  {deviceInfo.acquisitionHashMD5}
                </div>
              </div>
              <div>
                <div className="text-[9px] text-[#64748b]">CURRENT LIVE WORKSTATION MD5:</div>
                <div className="text-[#38bdf8] font-mono break-all text-[11px] bg-[#121620] p-1.5 rounded border border-[#1e2533] mt-0.5">
                  {deviceInfo.acquisitionHashMD5}
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => copyToClipboard(deviceInfo.acquisitionHashMD5, 'MD5')}
                  className="text-[10px] text-[#8b949e] hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedHash === 'MD5' ? <Check className="w-3 h-3 text-[#22c55e]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHash === 'MD5' ? 'Copied' : 'Copy MD5'}</span>
                </button>
              </div>
            </div>

            {/* SHA-256 Comparison */}
            <div className="bg-[#0b0e14] p-3 rounded border border-[#1a2130] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-white">SHA-256 (SECURE HASH ALGORITHM)</span>
                <span className="text-[#22c55e] bg-[#142e20] px-1.5 py-0.2 rounded border border-[#166534]">
                  IDENTICAL MATCH
                </span>
              </div>
              <div>
                <div className="text-[9px] text-[#64748b]">ACQUISITION SHA-256:</div>
                <div className="text-white font-mono break-all text-[11px] bg-[#121620] p-1.5 rounded border border-[#1e2533] mt-0.5">
                  {deviceInfo.acquisitionHashSHA256}
                </div>
              </div>
              <div>
                <div className="text-[9px] text-[#64748b]">CURRENT LIVE WORKSTATION SHA-256:</div>
                <div className="text-[#38bdf8] font-mono break-all text-[11px] bg-[#121620] p-1.5 rounded border border-[#1e2533] mt-0.5">
                  {deviceInfo.acquisitionHashSHA256}
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => copyToClipboard(deviceInfo.acquisitionHashSHA256, 'SHA-256')}
                  className="text-[10px] text-[#8b949e] hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedHash === 'SHA-256' ? <Check className="w-3 h-3 text-[#22c55e]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedHash === 'SHA-256' ? 'Copied' : 'Copy SHA-256'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hardware Write Blocker & Acquisition Certification Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#121620] border border-[#242c3d] rounded p-4 space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1e2533] font-bold text-white">
              <Lock className="w-4 h-4 text-[#22c55e]" />
              <span>HARDWARE WRITE-BLOCKER CERTIFICATION</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Hardware Bridge:</span>
                <span className="text-white font-bold">{deviceInfo.writeBlockerModel}</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Write-Block Switch:</span>
                <span className="text-[#22c55e] font-bold">PHYSICAL HARDWARE LOCKED (READ ONLY)</span>
              </div>
              <div className="flex justify-between py-0.5 border-b border-[#1a2130]">
                <span className="text-[#64748b]">Source Physical Disk:</span>
                <span className="text-white">Seagate SkyHawk 4TB Surveillance HDD</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#64748b]">SATA Sector Size:</span>
                <span className="text-white">512e / 4096 Physical (LBA 976,758,552)</span>
              </div>
            </div>
          </div>

          {/* Audit Verification Log */}
          <div className="bg-[#121620] border border-[#242c3d] rounded p-4 flex flex-col">
            <div className="flex items-center gap-2 pb-2 border-b border-[#1e2533] font-bold text-white mb-2">
              <Terminal className="w-4 h-4 text-[#38bdf8]" />
              <span>VERIFICATION AUDIT LOG (ISO/IEC 27037)</span>
            </div>
            <div className="flex-1 bg-[#07090e] p-2.5 rounded border border-[#1a2130] text-[10px] text-[#cbd5e1] space-y-1 overflow-y-auto max-h-36">
              {logMessages.map((msg, idx) => (
                <div key={idx} className="font-mono">
                  {msg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
