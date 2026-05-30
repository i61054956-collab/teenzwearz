import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, MessageCircle, Star, ShoppingCart, Eye } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  msrp: number;
  price: number;
  image: string;
  description: string;
  colors: string[];
  sizes: string[];
  features: string[];
  rating: number;
}

interface LuxuryProductCardProps {
  key?: string | number;
  product: Product;
  onInspect: (product: Product) => void;
  onAddToCart: (product: Product, size: string) => void;
}

export function LuxuryProductCard({ product, onInspect, onAddToCart }: LuxuryProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');

  // Calculate high conversion savings percentage
  const discountPercent = Math.round(((product.msrp - product.price) / product.msrp) * 100);

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col justify-between h-full rounded-2xl bg-[#090f0b]/90 border border-[#162f1a]/80 overflow-hidden shadow-2xl transition-all duration-300 hover:border-[#ffeaa7]/40"
      id={`luxury-card-${product.id}`}
    >
      {/* Dynamic top edge glow line */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 transition-all duration-500 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 opacity-60 group-hover:opacity-100"
      />

      {/* Floating High Savings Tag */}
      <div className="absolute top-3 left-3 z-20 bg-[#122e18]/90 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#2b5932] shadow-sm flex items-center gap-1.5">
        <Sparkles size={10} className="text-[#ffeaa7] animate-pulse" />
        <span className="text-[10px] font-mono font-bold tracking-wider text-[#ffeaa7]">
          {discountPercent}% SURPLUS SAVE
        </span>
      </div>

      {/* Product Image Stage */}
      <div className="relative h-64 overflow-hidden bg-black flex items-center justify-center">
        {/* Subtle grid wires */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(24,58,32,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(24,58,32,0.15)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        {/* Ambient color burst in background */}
        <div className="absolute w-44 h-44 rounded-full bg-emerald-900/20 filter blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-700" />

        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-95"
          referrerPolicy="no-referrer"
          id={`product-image-${product.id}`}
        />

        {/* Hover overlay icons */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={() => onInspect(product)}
            className="p-3 rounded-full bg-[#1c3821] text-white hover:bg-[#ffeaa7] hover:text-[#040805] border border-[#a4ffa2]/20 transition-all shadow-lg active:scale-95"
            title="Inspect Details"
          >
            <Eye size={18} />
          </button>
          
          <button
            onClick={() => onAddToCart(product, selectedSize)}
            className="p-3 rounded-full bg-[#a3802e] text-white hover:bg-[#ffeaa7] hover:text-[#040805] border border-amber-500/20 transition-all shadow-lg active:scale-95"
            title="Add to Cart"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* Product Metadata & Actions */}
      <div className="p-5 flex flex-col justify-between flex-grow text-left space-y-4">
        
        <div className="space-y-2">
          {/* Category & Star rating row */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[2px] text-[#719671]">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-[10.5px] font-mono text-white/80 font-bold">{product.rating}</span>
            </div>
          </div>

          <h3 
            onClick={() => onInspect(product)}
            className="font-serif text-lg md:text-xl font-medium text-white group-hover:text-[#ffeaa7] transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          <p className="text-[11.5px] text-[#9ebfa0] font-light leading-relaxed line-clamp-2 h-9">
            {product.description}
          </p>
        </div>

        {/* Quick Size selector pills */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-mono uppercase tracking-wider text-[#719671] block font-bold">In-Stock Surplus Sizes:</span>
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((sz) => (
              <button
                key={sz}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSize(sz);
                }}
                className={`w-7 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase transition-all border ${
                  selectedSize === sz
                    ? 'bg-[#122e18] border-[#a4ffa2] text-[#a4ffa2] shadow-inner'
                    : 'bg-black/40 border-[#1f3e23] text-white/50 hover:bg-black/80 hover:text-white'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Savings progress & Price tag metrics */}
        <div className="pt-3 border-t border-[#142618]">
          <div className="flex items-center justify-between">
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-mono text-white/40 line-through">
                MSRP ₹{product.msrp.toLocaleString('en-IN')}
              </span>
              <span className="text-md font-serif text-[#ffeaa7] font-bold tracking-wide">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[9px] font-mono bg-[#142618] border border-[#2b5932] px-2 py-0.5 rounded text-[#a4ffa2] font-semibold">
              SAVE ₹{(product.msrp - product.price).toLocaleString('en-IN')} ✦
            </span>
          </div>

          <div className="mt-2 text-[9px] font-mono text-[#ffeaa7]/90 bg-[#a3802e]/10 border border-[#a3802e]/20 px-2 py-1 rounded-md flex items-center justify-between gap-1">
            <span className="flex items-center gap-1 font-semibold">
              <MessageCircle size={10} className="text-[#ffeaa7] animate-pulse" />
              Prices not fixed! Negotiate on WhatsApp 💬
            </span>
            <span className="text-[7.5px] uppercase bg-[#a3802e] text-white px-1 py-0.5 rounded font-bold">CHAT</span>
          </div>
        </div>

        {/* Action controls */}
        <div className="grid grid-cols-2 gap-2 pt-1 select-none">
          <button
            onClick={() => onInspect(product)}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[#234529] hover:bg-[#122e18] text-white text-[11px] font-bold uppercase tracking-wider transition-all"
            id={`inspect-details-${product.id}`}
          >
            Inspect Info
          </button>
          
          <button
            onClick={() => onAddToCart(product, selectedSize)}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#a3802e] hover:bg-[#ffeaa7] hover:text-[#040805] text-white text-[11px] font-bold uppercase tracking-wider transition-all shadow-md shadow-amber-950/20"
            id={`card-add-to-cart-${product.id}`}
          >
            Add To Cart
          </button>
        </div>

      </div>
    </motion.div>
  );
}
