import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shirt, Scissors, Sparkles, Sliders, CheckCircle, Flame } from 'lucide-react';

interface PolaroidItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  badge: string;
  gradFrom: string;
  gradTo: string;
  textColor: string;
  detailNum: string;
}

export function PolaroidPile() {
  const [cards, setCards] = useState<PolaroidItem[]>([
    {
      id: 'pol1',
      title: 'Heavy Emerald Brocade',
      tag: 'Surplus Guild #049',
      description: 'Hand-inspected heavy velvet brocade, sourced directly from premier South-Indian looms. Double washed & pre-shrunked.',
      badge: 'STREETWEAR KING',
      gradFrom: '#04160a',
      gradTo: '#0b2d16',
      textColor: '#a4ffa2',
      detailNum: 'S26-V8'
    },
    {
      id: 'pol2',
      title: 'Midnight Indigo Twill',
      tag: 'Authentic 14oz Denim',
      description: 'Raw, heavy-handle construction featuring gold selvedge seams. Tailored specifically for structural jackets and cloaks.',
      badge: 'RAW & UNWASHED',
      gradFrom: '#09152e',
      gradTo: '#102554',
      textColor: '#93c5fd',
      detailNum: 'D14-SE'
    },
    {
      id: 'pol3',
      title: 'Imperial Golden Sateen',
      tag: 'Italian Mill Overflow',
      description: 'Slippery-smooth dual-tone weave reflecting dynamic copper highlights under spotlight coordinates. Pure luxury, zero markup.',
      badge: 'LIMITED COUTS',
      gradFrom: '#241a04',
      gradTo: '#4d390a',
      textColor: '#fcd34d',
      detailNum: 'S-79'
    },
    {
      id: 'pol4',
      title: 'Cyberpunk Emissive Trim',
      tag: 'Tech-Luminescence Lab',
      description: 'High-density reflective polyester threads interwoven with custom fluorescent polymer. Shines like a constellation in flight.',
      badge: 'NEXT-GEN ACTIVE',
      gradFrom: '#1c1c1c',
      gradTo: '#0c0d0c',
      textColor: '#0dfc71',
      detailNum: 'EM-400'
    },
  ]);

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Cycle the stack when user clicks the top card
  const handleShuffleDeck = () => {
    setCards((prev) => {
      const copy = [...prev];
      const top = copy.shift();
      if (top) copy.push(top);
      return copy;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-md mx-auto select-none" id="interactive-curation-deck">
      <div className="relative w-72 h-96 flex items-center justify-center cursor-pointer" onClick={handleShuffleDeck}>
        <AnimatePresence mode="popLayout">
          {cards.map((card, idx) => {
            // Cards are stacked sequentially.
            // Under normal state: stacked with slight offsets.
            // On hovered: fan out horizontally to show off their labels!
            const isTop = idx === 0;
            const isSecond = idx === 1;
            const isThird = idx === 2;
            
            // Calculate rotational tilt and translate coordinates
            let rotate = (idx - 1) * 3;
            let x = (idx - 1) * 5;
            let y = (idx - 1) * -4;
            let scale = 1 - idx * 0.04;
            let zIndex = 40 - idx;

            if (hoveredIdx !== null) {
              // Fan out layout when mouse is hovering on the workspace
              const offsetFromCenter = idx - (cards.length - 1) / 2;
              rotate = offsetFromCenter * 11;
              x = offsetFromCenter * 32;
              y = Math.abs(offsetFromCenter) * 8;
              scale = isTop ? 1.05 : 0.98;
            }

            return (
              <motion.div
                key={card.id}
                layout
                style={{ zIndex }}
                animate={{
                  x,
                  y,
                  rotate,
                  scale,
                  boxShadow: isTop 
                    ? '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 15px rgba(164,255,162,0.1)'
                    : '0 8px 16px rgba(0,0,0,0.5)',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 140,
                  damping: 18,
                }}
                whileHover={isTop ? { scale: 1.05, y: y - 10 } : undefined}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="absolute w-64 h-88 rounded-xl bg-[#090f0a] border border-[#1b3d22]/45 p-3 flex flex-col justify-between shadow-2xl transition-colors duration-300"
              >
                {/* Visual Image Block inside Polaroid */}
                <div 
                  className="w-full h-44 rounded-lg relative overflow-hidden flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${card.gradFrom} 0%, ${card.gradTo} 100%)`
                  }}
                >
                  {/* Subtle decorative target grids */}
                  <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:12px_12px] opacity-75" />
                  
                  {/* Neon laser border indicator */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-bold text-white/75 border border-white/5">
                    <Sparkles size={8} style={{ color: card.textColor }} /> {card.detailNum}
                  </div>

                  <span 
                    className="absolute top-2 right-2 text-[7px] font-mono uppercase bg-[#122e18]/80 text-[#a4ffa2] border border-[#2b5932] px-1.5 py-0.2 rounded"
                    style={{ color: card.textColor, borderColor: `${card.textColor}33` }}
                  >
                    {card.badge}
                  </span>

                  {/* Flow icon of garment components */}
                  <div className="relative z-10 flex flex-col items-center gap-1">
                    <Shirt size={32} style={{ color: card.textColor }} className="drop-shadow-lg animate-pulse" />
                    <span className="text-[10px] font-serif tracking-widest text-white/50 uppercase">
                      SURPLUS WEAVE
                    </span>
                  </div>

                  {/* Bottom neon light band */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1.5 filter blur-xs"
                    style={{ backgroundColor: card.textColor }}
                  />
                </div>

                {/* Classic Paper Label Block (Handwritten feel) */}
                <div className="bg-[#0b120c] rounded-lg p-2.5 space-y-1 text-left border border-[#1b3d22]/25 relative overflow-hidden">
                  <div className="absolute right-2 bottom-2 text-white/10 font-bold text-2xl font-mono">
                    #{(idx + 1).toString().padStart(2, '0')}
                  </div>
                  
                  <span className="text-[9px] uppercase tracking-wider font-mono" style={{ color: card.textColor }}>
                    {card.tag}
                  </span>
                  
                  <h4 className="font-serif text-sm font-semibold text-white tracking-wide">
                    {card.title}
                  </h4>
                  
                  <p className="text-[9.5px] text-[#8ea790] leading-relaxed font-sans line-clamp-2">
                    {card.description}
                  </p>
                </div>

                {/* Bottom instructions bar */}
                {isTop && (
                  <div className="text-center font-mono text-[8px] text-[#597a58] uppercase tracking-[2px] animate-pulse">
                    ✦ Click to shuffle vault stack ✦
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex items-center gap-1.5 bg-black/40 border border-[#1b3a20] px-4 py-1.5 rounded-full text-[9px] text-[#9bb89a] font-mono tracking-wider">
        <Flame size={10} className="text-amber-400 animate-pulse" />
        <span>HOVER to expand. CLICK to shuffle cards.</span>
      </div>
    </div>
  );
}
