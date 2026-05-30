import React from 'react';
import { motion } from 'motion/react';

export function MotionBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* 1. Slow weaving radial light hubs */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#122e18]/20 rounded-full filter blur-[140px] pointer-events-none transform -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-2/3 right-1/4 w-[600px] h-[600px] bg-[#a3802e]/8 rounded-full filter blur-[150px] pointer-events-none transform translate-x-1/2 translate-y-1/2" />

      {/* 2. Abstract Thread Networks (CSS Loom grids) */}
      <div className="absolute inset-0 bg-[#040805] opacity-20 bg-[linear-gradient(rgba(163,128,46,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(163,128,46,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
      
      {/* 3. Interactive Floating Geometric Thread Coordinates */}
      <div className="absolute inset-0 opacity-45">
        
        {/* Floating Star Code 01 */}
        <motion.div 
          animate={{ 
            y: [-15, 15, -15],
            x: [-10, 10, -10],
            rotate: [0, 360],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-24 left-1/12 w-32 h-32 border border-[#ffeaa7]/5 rounded-full flex items-center justify-center"
        >
          <div className="w-20 h-20 border border-dashed border-[#ffeaa7]/5 rounded-full" />
          <div className="absolute w-1.5 h-1.5 bg-amber-400/50 rounded-full" />
        </motion.div>

        {/* Floating Star Code 02 */}
        <motion.div 
          animate={{ 
            y: [20, -20, 20],
            x: [15, -15, 15],
            rotate: [360, 0],
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 right-1/10 w-44 h-44 border border-[#a4ffa2]/5 rounded-3xl flex items-center justify-center rotate-45"
        >
          <div className="absolute w-2 h-2 bg-emerald-400/40 rounded-full" />
          <div className="w-12 h-12 border border-dashed border-[#a4ffa2]/10 rounded-full animate-pulse" />
        </motion.div>

        {/* Floating Star Code 03 */}
        <motion.div 
          animate={{ 
            y: [-30, 30, -30],
            rotate: [180, -180],
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-24 left-1/3 w-24 h-24 border border-white/5 rounded-full"
        >
          <div className="absolute top-0 left-1/2 -ml-[1px] h-full w-[2px] bg-gradient-to-b from-transparent via-[#ffeaa7]/40 to-transparent" />
          <div className="absolute left-0 top-1/2 -mt-[1px] w-full h-[2px] bg-gradient-to-r from-transparent via-[#ffeaa7]/40 to-transparent" />
        </motion.div>

      </div>

      {/* 4. Kinetic Mesh Waves (SVG animated vector weave representing direct cotton strands) */}
      <svg className="absolute bottom-0 left-0 w-full h-40 opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path fill="#122e18" fillOpacity="1" d="M0,224L48,229.3C96,235,192,245,288,218.7C384,192,480,128,576,122.7C672,117,768,171,864,197.3C960,224,1056,224,1152,208C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>
  );
}
