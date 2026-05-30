import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles, Terminal, Cpu, ArrowUpRight, CheckCircle, Zap } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
}

export function CinematicIntro({ onComplete }: CinematicIntroProps) {
  const [progress, setProgress] = useState(0);
  const [activeLogIndex, setActiveLogIndex] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isDecrypted, setIsDecrypted] = useState(false);

  const rawSystemLogs = [
    "Establishing encrypted connection to premium mills...",
    "Retrieving unused cancelled export collections...",
    "Analyzing yarn details & heavy-knit 320 GSM counts...",
    "Re-routing brand surplus batches away from mall markups...",
    "Pinpointing warehouse coordinates: W.G.C Road, Thoothukudi...",
    "Loading 8 sartorial surplus categories: Shorts, Pet Dress, Stuffing Tees...",
    "Securing direct WhatsApp pricing negotiation protocols...",
    "Connection successful. Welcome to Teenz Wearz direct depot."
  ];

  // Progressive progress bar loader - optimized for warp speeds!
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDecrypted(true);
          return 100;
        }
        // Snap forward very quickly
        const increment = Math.floor(Math.random() * 15) + 12;
        return Math.min(prev + increment, 100);
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  // System logs stagger timer - optimized for extreme snappiness!
  useEffect(() => {
    if (activeLogIndex < rawSystemLogs.length - 1) {
      const logTimer = setTimeout(() => {
        setLogs(prev => [...prev, rawSystemLogs[activeLogIndex]]);
        setActiveLogIndex(prev => prev + 1);
      }, 80);
      return () => clearTimeout(logTimer);
    } else if (logs.length === rawSystemLogs.length - 1) {
      setLogs(prev => [...prev, rawSystemLogs[rawSystemLogs.length - 1]]);
    }
  }, [activeLogIndex, logs]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 bg-[#040805] text-[#ffeaa7] flex flex-col justify-between p-6 md:p-12 overflow-hidden font-mono select-none"
    >
      {/* Decorative cyber backdrop & grids */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(18,46,24,0.3)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-[#102e17]/10 pointer-events-none" />
      
      {/* Glowing atmospheric waves */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#122e18]/20 filter blur-[120px] pointer-events-none animate-pulse" />
      
      {/* Top Meta info */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto border-b border-[#142d18] pb-4 z-10">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-[#a4ffa2] animate-pulse" />
          <span className="text-[10px] uppercase tracking-[3px] text-white/50 font-bold">
            NODE_0628 // OVERSTOCK DECRYPTER
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-[#ffeaa7]/40 bg-[#ffeaa7]/5 border border-[#ffeaa7]/10 px-2 py-0.5 rounded hidden sm:inline-block">
             तमिलनाडु STATE TERMINAL
          </span>
          <button
            onClick={onComplete}
            className="text-[10px] font-bold text-[#a4ffa2] border border-[#a4ffa2]/30 hover:border-[#a4ffa2] hover:bg-[#a4ffa2]/10 bg-black/40 px-3 py-1 rounded transition-all cursor-pointer pointer-events-auto flex items-center gap-1.5 shadow-sm"
          >
            Skip Decryption →
          </button>
        </div>
      </div>

      {/* Main Core View Area */}
      <div className="flex-grow flex flex-col items-center justify-center max-w-2xl mx-auto w-full space-y-12 z-10 my-8">
        
        {/* Glowing Radar Hub */}
        <div className="relative flex items-center justify-center w-28 h-28">
          <div className="absolute inset-0 rounded-full border border-[#ffeaa7]/10 animate-ping" />
          <div className="absolute w-20 h-20 rounded-full border border-dashed border-[#a3802e]/30 flex items-center justify-center animate-spin-slow" />
          <div className="absolute w-12 h-12 rounded-full bg-gradient-to-br from-[#122e18] to-black border border-[#2b5932] flex items-center justify-center shadow-2xl">
            <Cpu size={18} className="text-[#ffeaa7] animate-pulse" />
          </div>
        </div>

        {/* Central Display */}
        <div className="text-center space-y-3">
          <motion.h4 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="text-[10px] tracking-[6px] uppercase font-bold text-[#597a58]"
          >
            SARTORIAL ORIGIN DETECTED
          </motion.h4>
          
          <h2 className="font-serif text-4xl sm:text-5xl font-extrabold tracking-[8px] text-white uppercase relative">
            TEENZ WEARZ
            <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ffeaa7]/40 to-transparent" />
          </h2>

          <p className="text-[10px] text-white/40 uppercase tracking-[2px] pt-1">
            W.G.C Road, Thoothukudi Direct Warehouse
          </p>
        </div>

        {/* Progressive Loading State Card */}
        <div className="w-full bg-black/60 border border-[#142d18] rounded-xl p-5 space-y-4 shadow-2xl">
          
          {/* Progress bar info */}
          <div className="flex items-center justify-between text-[10px] tracking-wider font-bold">
            <span className="text-white/60">OUTLET ACCESS LEVEL:</span>
            <span className={progress === 100 ? "text-[#a4ffa2]" : "text-[#ffeaa7]"}>
              {progress === 100 ? "READY" : "LOADING"} - {progress}%
            </span>
          </div>

          {/* Progress bar track */}
          <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden border border-[#142d18]">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#122e18] via-[#a3802e] to-[#a4ffa2]"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>

          {/* Terminal simulated log screen */}
          <div className="h-28 overflow-y-auto bg-black/90 p-3 rounded-lg border border-white/5 text-left text-[9.5px] font-mono leading-relaxed space-y-1 scrollbar-thin">
            <AnimatePresence>
              {logs.map((log, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-2 text-white/70"
                >
                  <span className="text-[#a4ffa2] shrink-0">{index === rawSystemLogs.length - 1 ? "✓" : ">"}</span>
                  <span className={index === rawSystemLogs.length - 1 ? "text-[#a4ffa2] font-semibold" : ""}>
                    {log}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {progress < 100 && (
              <div className="text-white/40 animate-pulse flex items-center gap-1">
                <span>_</span>
              </div>
            )}
          </div>

        </div>

        {/* Big styled access buttons */}
        <AnimatePresence>
          {isDecrypted && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-full text-center"
            >
              <button
                onClick={onComplete}
                className="group relative w-full sm:w-auto px-12 py-4 rounded-xl bg-gradient-to-r from-[#122e18] via-[#a3802e] to-[#122e18] text-[#ffeaa7] font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.03] shadow-[0_5px_25px_rgba(163,128,46,0.3)] hover:text-white flex items-center justify-center gap-2 border border-[#ffeaa7]/20 cursor-pointer"
              >
                <Zap size={14} className="text-yellow-400 group-hover:rotate-12 transition-transform" />
                ENTER SURPLUS VAULT
                <ArrowUpRight size={14} className="opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              <p className="text-[9.5px] text-white/30 tracking-widest uppercase mt-3">
                Negotiation channel active on WhatsApp. Enjoy 60%-80% Savings.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Cyber display footer */}
      <div className="w-full max-w-7xl mx-auto border-t border-white/5 pt-4 flex flex-col sm:flex-row items-center justify-between text-[9px] text-[#597a58] tracking-widest uppercase z-10 gap-3">
        <span>TEENZ WEARZ INC. CODES: SECURITY APPROVED</span>
        <span>2026 OUTLET SPECIFICATION STATIONS</span>
      </div>

    </motion.div>
  );
}
