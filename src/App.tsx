/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shirt, Scissors, Sparkles, MessageCircle, MapPin, Clock, Phone, 
  Instagram, Facebook, Sliders, ChevronRight, Check, X,
  Wand2, RefreshCw, User, Atom, Flame, ArrowRight, Eye, EyeOff, LayoutGrid, Info,
  ShoppingBag, Search, Filter, Star, Heart, Award, Trash2, Plus, Minus, ArrowUp, Zap, HelpCircle, Play, SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, PRODUCT_CATALOGUE } from './data';
import { LuxuryProductCard } from './components/LuxuryProductCard';
import { CinematicIntro } from './components/CinematicIntro';
import { MotionBackground } from './components/MotionBackground';

interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      return localStorage.getItem('teenz_wearz_intro_seen_direct') !== 'true';
    } catch {
      return true;
    }
  });
  const [currentPage, setCurrentPage] = useState<'home' | 'catalogue' | 'curator' | 'about' | 'contact'>('home');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(null);
  
  // Custom Outfit Sandbox coordinates
  const [curatorTop, setCuratorTop] = useState<Product>(
    PRODUCT_CATALOGUE.find(p => ['Shirts', 'Polos', 'Stuffing Tshirts'].includes(p.category)) || PRODUCT_CATALOGUE[0]
  );
  const [curatorBottom, setCuratorBottom] = useState<Product>(
    PRODUCT_CATALOGUE.find(p => ['Jeans', 'Shorts'].includes(p.category)) || PRODUCT_CATALOGUE[4]
  );
  const [curatorSize, setCuratorSize] = useState<string>('L');

  // Multi-page smooth scroll helper
  const navigateToPage = (pageName: 'home' | 'catalogue' | 'curator' | 'about' | 'contact') => {
    setCurrentPage(pageName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync basket items with local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('teenz_wearz_cart_direct');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("Cart retrieval failure", err);
      }
    }
  }, []);

  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem('teenz_wearz_cart_direct', JSON.stringify(updatedCart));
  };

  const handleAddToCart = (product: Product, size: string) => {
    const existingIdx = cart.findIndex(item => item.product.id === product.id && item.selectedSize === size);
    let newCart = [...cart];
    if (existingIdx > -1) {
      newCart[existingIdx].quantity += 1;
    } else {
      newCart.push({ product, selectedSize: size, quantity: 1 });
    }
    saveCartToStorage(newCart);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, size: string, change: number) => {
    const existingIdx = cart.findIndex(item => item.product.id === productId && item.selectedSize === size);
    if (existingIdx === -1) return;
    let newCart = [...cart];
    const newQty = newCart[existingIdx].quantity + change;
    if (newQty <= 0) {
      newCart.splice(existingIdx, 1);
    } else {
      newCart[existingIdx].quantity = newQty;
    }
    saveCartToStorage(newCart);
  };

  const handleRemoveFromCart = (productId: string, size: string) => {
    const newCart = cart.filter(item => !(item.product.id === productId && item.selectedSize === size));
    saveCartToStorage(newCart);
  };

  const handleClearCart = () => {
    saveCartToStorage([]);
  };

  // Basket totals
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartMsrpTotal = cart.reduce((acc, item) => acc + (item.product.msrp * item.quantity), 0);
  const totalSaved = cartMsrpTotal - cartSubtotal;
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // WhatsApp formatted summaries
  const getWhatsAppMessage = () => {
    let text = `Hi Teenz Wearz (Thoothukudi), I custom selected these items from your online catalogue portal! 🛒\n\n`;
    text += `*🛍️ ORDER DETAILS:*\n`;
    cart.forEach((item, idx) => {
      text += `${idx + 1}. *${item.product.name}*\n`;
      text += `   - Size: ${item.selectedSize}\n`;
      text += `   - Qty: ${item.quantity}x\n`;
      text += `   - Outlet rate: ₹${item.product.price} each\n\n`;
    });
    text += `*💰 PRICING SUMMARY:*\n`;
    text += `- Aggregate direct rate: *₹${cartSubtotal}*\n`;
    text += `- Standard retail MSRP: ~~₹${cartMsrpTotal}~~\n`;
    text += `- 🎉 Potential savings: *₹${totalSaved}* (Prices not fixed, let's negotiate custom sizing/rates on this chat!)\n\n`;
    text += `Please check in-stock availability on W.G.C Road. Ready to book!`;
    return encodeURIComponent(text);
  };

  const getBespokeCuratorWhatsApp = () => {
    let text = `Hi Teenz Wearz, I designed a stunning outfit matching set on your Style Creator tab! 🌟\n\n`;
    text += `*🎨 Direct Coordinate Selects:*\n`;
    text += `- Upper Top: *${curatorTop.name}* (Size: ${curatorSize}, Outlet: ₹${curatorTop.price})\n`;
    text += `- Lower Bottom: *${curatorBottom.name}* (Size: ${curatorSize}, Outlet: ₹${curatorBottom.price})\n`;
    text += `- Combined Outlet subtotal: *₹${curatorTop.price + curatorBottom.price}*\n`;
    text += `- Standard MSRP retail value: ~~₹${curatorTop.msrp + curatorBottom.msrp}~~\n`;
    text += `- Saved Over ₹${(curatorTop.msrp + curatorBottom.msrp) - (curatorTop.price + curatorBottom.price)}!\n\n`;
    text += `Can we negotiate structural discounts? Ready to collect at Thoothukudi!`;
    return encodeURIComponent(text);
  };

  // Catalogue filters
  const filteredProducts = PRODUCT_CATALOGUE.filter(prod => {
    const matchesCategory = activeCategory === 'All' || prod.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort catalogue products on state changes
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price-low') {
      return a.price - b.price;
    }
    if (sortOption === 'price-high') {
      return b.price - a.price;
    }
    if (sortOption === 'savings') {
      const aSaved = a.msrp - a.price;
      const bSaved = b.msrp - b.price;
      return bSaved - aSaved;
    }
    if (sortOption === 'rating') {
      return b.rating - a.rating;
    }
    return 0; // default featured order
  });

  return (
    <div className="min-h-screen bg-[#040805] text-[#e0ebd5] font-sans overflow-x-hidden selection:bg-[#ffeaa7] selection:text-[#040805]">
      
      {/* Dynamic Cinematic Intro component */}
      <AnimatePresence>
        {showIntro && (
          <CinematicIntro onComplete={() => {
            setShowIntro(false);
            try {
              localStorage.setItem('teenz_wearz_intro_seen_direct', 'true');
            } catch (err) {
              console.error("Local storage error tracking seen state", err);
            }
          }} />
        )}
      </AnimatePresence>

      {/* 1. SOLID WHATSAPP NEGOTIATION HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#122e18] via-[#a3802e] to-[#122e18] text-[#ffeaa7] py-2 px-4 text-center font-mono text-[9px] sm:text-[10px] uppercase tracking-[3px] font-bold relative z-40 flex items-center justify-center gap-2 flex-wrap">
        <Zap size={11} className="animate-bounce shrink-0" />
        <span>⚠️ All outlet prices are negotiable! Message us on WhatsApp for bulk/individual pricing deals ✦</span>
        <a 
          href="https://wa.me/919677984004?text=Hi%20Teenz%20Wearz%2C%20I%20am%20negotiating%20surplus%20rates%20for%20branded%20cotton%20items."
          target="_blank"
          rel="noopener noreferrer"
          className="underline inline-flex items-center gap-1 text-white hover:text-green-300 font-extrabold normal-case leading-none ml-2 tracking-normal shrink-0"
        >
          <MessageCircle size={11} /> Negotiate Rates Now →
        </a>
      </div>

      {/* 2. STICKY DYNAMIC HEADER */}
      <header className="sticky top-0 z-30 bg-[#040805]/95 backdrop-blur-xl border-b border-[#162f1a]/80 px-4 md:px-8 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Identity & Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigateToPage('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#122e18] to-black flex items-center justify-center border border-[#1b3d22] shadow-[0_0_15px_rgba(20,55,25,0.3)]">
              <Shirt className="text-[#ffeaa7]" size={18} />
            </div>
            <div className="flex flex-col text-left">
              <h1 className="font-serif text-lg tracking-[5px] font-bold text-white uppercase leading-none">
                TEENZ WEARZ
              </h1>
              <span className="text-[9px] font-mono uppercase tracking-[3px] text-[#597a58] font-bold mt-1">
                Direct Export Surplus Clearance
              </span>
            </div>
          </div>

          {/* Elegant Page-Link Tab Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-mono text-[10px] font-bold uppercase tracking-widest text-[#a1baa2]">
            <button 
              onClick={() => navigateToPage('home')} 
              className={`px-2.5 py-1.5 transition-all rounded ${
                currentPage === 'home' 
                  ? 'text-white bg-[#122e18] border border-[#2b5932]' 
                  : 'hover:text-white hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              Main
            </button>
            <button 
              onClick={() => navigateToPage('catalogue')} 
              className={`px-2.5 py-1.5 transition-all rounded ${
                currentPage === 'catalogue' 
                  ? 'text-white bg-[#122e18] border border-[#2b5932]' 
                  : 'hover:text-white hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              Catalogue
            </button>
            <button 
              onClick={() => navigateToPage('curator')} 
              className={`px-2.5 py-1.5 transition-all rounded ${
                currentPage === 'curator' 
                  ? 'text-white bg-[#122e18] border border-[#2b5932]' 
                  : 'hover:text-white hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              Style Lab
            </button>
            <button 
              onClick={() => navigateToPage('about')} 
              className={`px-2.5 py-1.5 transition-all rounded ${
                currentPage === 'about' 
                  ? 'text-white bg-[#122e18] border border-[#2b5932]' 
                  : 'hover:text-white hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              Sourcing core
            </button>
            <button 
              onClick={() => navigateToPage('contact')} 
              className={`px-2.5 py-1.5 transition-all rounded ${
                currentPage === 'contact' 
                  ? 'text-white bg-[#122e18] border border-[#2b5932]' 
                  : 'hover:text-white hover:bg-white/[0.02] border border-transparent'
              }`}
            >
              Locate depot
            </button>
          </nav>

          {/* Quick-actions & Cart Widget */}
          <div className="flex items-center gap-3">
            
            {/* Replay intro option */}
            <button
              onClick={() => {
                setShowIntro(true);
                window.scrollTo({ top: 0 });
              }}
              className="p-2 rounded-lg border border-white/5 bg-black/40 text-white/50 hover:text-white tooltip flex items-center justify-center"
              title="Replay Cinematic Intro"
            >
              <Play size={13} />
            </button>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-lg border border-[#162f1a] hover:border-[#a4ffa2]/40 bg-black/40 text-white transition-all flex items-center justify-center cursor-pointer"
              title="Open Shopping Basket"
            >
              <ShoppingBag size={16} />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#a3802e] text-[#ffeaa7] text-[9.5px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center border border-black shadow-lg">
                  {totalCartCount}
                </span>
              )}
            </button>

            <a 
              href="https://wa.me/919677984004?text=Hi%20Teenz%20Wearz%20Thoothukudi%2C%20please%20send%20me%20your%20bargain%20outlet%20collection."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 bg-[#102414] hover:bg-emerald-900 border border-[#2b5932] px-4 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-[#a4ffa2] transition-all"
            >
              <MessageCircle size={13} />
              Bargain Chat
            </a>
          </div>

        </div>
      </header>

      {/* MULTI-PAGE SCREEN SWAPPING VIEWPORTS (ANIMATED WITH framer motion) */}
      <main className="relative min-h-[70vh]">
        
        {/* Absolute Background Kinetic Motion Graphic Waves */}
        <MotionBackground />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="relative z-10"
          >
            
            {/* ==================== PAGE 1: HOME ==================== */}
            {currentPage === 'home' && (
              <div className="py-8 md:py-16 space-y-24">
                
                {/* Hero Showcase */}
                <section className="px-4 md:px-8 max-w-7xl mx-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    <div className="lg:col-span-7 space-y-6 text-left">
                      <div className="inline-flex items-center gap-2 bg-[#122e18]/85 px-3.5 py-1.5 rounded-full border border-[#2b5932] text-[#a4ffa2] text-[10.5px] font-mono font-bold uppercase tracking-[3px]">
                        <Sparkles size={11} className="text-amber-400" />
                        8 Categories // Heavy fabric imports
                      </div>

                      <h2 className="font-serif text-4xl sm:text-5xl md:text-6.5xl text-white font-light leading-none tracking-tight">
                        Premium Fits.<br />
                        <span className="relative inline-block mt-1 italic font-medium bg-gradient-to-r from-[#ffeaa7] via-emerald-400 to-white bg-clip-text text-transparent leading-normal pb-2">
                          Rates negotiable on WhatsApp.
                        </span>
                      </h2>

                      <p className="text-[#a1baa2] text-xs md:text-sm lg:text-base font-light leading-relaxed max-w-2xl">
                        Say goodbye to standard middle-retail markups of 300%. <strong>Teenz Wearz Thoothukudi</strong> clears brand canceled shipments and surplus overruns directly. Heavy combed cotton weaves, perfect washes, and luxury aesthetics at direct-to-consumer negotiable pricing.
                      </p>

                      {/* Prominent WhatsApp negotiation label card */}
                      <div className="bg-[#122e18]/30 border border-[#a3802e]/30 p-4 rounded-xl flex items-start gap-3.5 text-left max-w-2xl">
                        <MessageCircle size={22} className="text-[#ffeaa7] shrink-0 mt-0.5 animate-pulse" />
                        <div className="space-y-1">
                          <h4 className="text-[11.5px] font-mono uppercase font-extrabold text-[#ffeaa7] tracking-wider">Prices are not fixed!</h4>
                          <p className="text-xs text-[#9ebfa0] leading-snug">
                            Every price displayed here can be bartered & negotiated directly via WhatsApp based on your sizes & bulk counts. Tap the WhatsApp icon on any product to bargain!
                          </p>
                        </div>
                      </div>

                      {/* Core Metrics Grid */}
                      <div className="grid grid-cols-3 gap-3 max-w-xl">
                        <div className="bg-[#090f0b]/90 border border-[#162f1a] p-3 rounded-xl">
                          <span className="text-[8px] font-mono text-[#a4ffa2] uppercase tracking-wider block font-bold">SAVINGS INDEX</span>
                          <span className="text-lg font-serif text-white block mt-0.5 font-bold">60% - 80% OFF</span>
                          <span className="text-[8.5px] text-[#597a58] block mt-0.5">Below Mall MSRP</span>
                        </div>
                        <div className="bg-[#090f0b]/90 border border-[#162f1a] p-3 rounded-xl">
                          <span className="text-[8px] font-mono text-[#a4ffa2] uppercase tracking-wider block font-bold">MILL ORIGINS</span>
                          <span className="text-lg font-serif text-white block mt-0.5 font-bold">100% Original</span>
                          <span className="text-[8.5px] text-[#597a58] block mt-0.5">Heavyweight wash</span>
                        </div>
                        <div className="bg-[#090f0b]/90 border border-[#162f1a] p-3 rounded-xl">
                          <span className="text-[8px] font-mono text-[#a4ffa2] uppercase tracking-wider block font-bold">DISPATCH CORNER</span>
                          <span className="text-lg font-serif text-white block mt-0.5 font-bold">Thoothukudi</span>
                          <span className="text-[8.5px] text-[#597a58] block mt-0.5">Tamil Nadu Depot</span>
                        </div>
                      </div>

                      {/* Direct CTA navigators */}
                      <div className="pt-2 flex flex-wrap gap-3">
                        <button
                          onClick={() => navigateToPage('catalogue')}
                          className="px-8 py-3.5 rounded-xl bg-[#a3802e] hover:bg-[#ffeaa7] text-white hover:text-[#040805] text-[11px] font-mono font-bold tracking-widest uppercase transition-all shadow-[0_4px_20px_rgba(163,128,46,0.3)] hover:scale-[1.02] cursor-pointer"
                        >
                          Explore 8 Categories Catalogue
                        </button>
                        <button
                          onClick={() => navigateToPage('curator')}
                          className="px-6 py-3.5 rounded-xl border border-[#1a381f] hover:bg-[#122e18]/40 text-[#a4ffa2] text-[11px] font-mono font-bold tracking-widest uppercase transition-all cursor-pointer"
                        >
                          Curator style lab →
                        </button>
                      </div>

                    </div>

                    {/* Right stage: Polaroid graphic */}
                    <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px]">
                      <div className="relative w-80 h-[420px] select-none">
                        <div className="absolute inset-0 border-2 border-emerald-950/60 rounded-3xl -rotate-6 transform scale-95" />
                        <div className="absolute inset-0 border-2 border-[#a3802e]/40 rounded-3xl rotate-3 transform scale-95" />

                        <div className="absolute inset-0 rounded-3xl bg-[#090f0b] border border-[#2b5932]/70 overflow-hidden shadow-2xl flex flex-col justify-end p-5">
                          <img 
                            src="https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=600"
                            alt="Teenz Wearz Editorial Lookbook" 
                            className="absolute inset-0 w-full h-full object-cover filter brightness-90 saturate-110"
                            referrerPolicy="no-referrer"
                          />
                          
                          <div className="relative z-10 bg-[#040805]/90 backdrop-blur-md border border-[#2b5932]/50 p-4 rounded-xl space-y-1.5 text-left">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] font-mono text-[#a4ffa2] tracking-wider uppercase font-extrabold">AUTHENTIC OVERSTOCK DECK</span>
                              <span className="text-[9px] font-mono text-amber-400">★ 5.0</span>
                            </div>
                            <h4 className="font-serif text-md text-white font-medium">The Sovereign Loom</h4>
                            <div className="flex items-center justify-between pt-1 border-t border-white/5">
                              <span className="text-[9px] text-white/50">Direct Bargain Price</span>
                              <span className="text-xs font-mono font-bold text-[#ffeaa7]">₹849 (Negotiable)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </section>

                {/* Hot Arrivals teaser Deck */}
                <section className="px-4 md:px-8 max-w-7xl mx-auto space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 border-b border-[#162f1a] pb-4">
                    <div className="text-left">
                      <span className="text-[9px] font-mono uppercase tracking-[4px] text-[#a3802e] font-bold block">IN-DE DEPOT TEASER</span>
                      <h3 className="font-serif text-2xl md:text-3.5xl text-white font-light">Newest Arrivals Cleared This Week</h3>
                    </div>
                    <button 
                      onClick={() => navigateToPage('catalogue')}
                      className="text-[#a4ffa2] text-[10.5px] font-mono uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Browse full index ({PRODUCT_CATALOGUE.length} Threads) →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {PRODUCT_CATALOGUE.slice(0, 3).map((prod) => (
                      <LuxuryProductCard 
                        key={prod.id}
                        product={prod}
                        onInspect={(product) => setInspectedProduct(product)}
                        onAddToCart={(product, size) => handleAddToCart(product, size)}
                      />
                    ))}
                  </div>
                </section>

                {/* Sourcing Advantages bento highlight */}
                <section className="px-4 md:px-8 max-w-7xl mx-auto space-y-12">
                  <div className="space-y-1 text-center max-w-xl mx-auto">
                    <span className="text-[10px] font-mono uppercase tracking-[5px] text-[#597a58] font-bold block">SAVINGS PROTOCOL RULES</span>
                    <h3 className="font-serif text-3xl font-light text-white">Direct Sourcing, Authentic Threads</h3>
                    <p className="text-xs text-[#9bb89a]">We bypass luxury boutique marks and broker fees to deliver direct mill overflows.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div className="bg-[#090f0b]/80 border border-[#162f1a] p-6 rounded-2xl flex flex-col justify-between space-y-4">
                      <div className="w-9 h-9 rounded-lg bg-orange-950/40 text-orange-400 border border-orange-500/20 flex items-center justify-center">
                        <Award size={15} />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg text-white font-medium">Canceled Carrier Shipments</h4>
                        <p className="text-xs text-[#9ebfa0] leading-relaxed font-light mt-1.5">
                          Large retail exports cancel orders due to minute schedule changes. We claim these complete flawless production lots directly corresponding with mills.
                        </p>
                      </div>
                      <span className="text-[8.5px] font-mono text-orange-400 font-bold uppercase tracking-wider">GENUINE APPARELS ONLY</span>
                    </div>

                    <div className="bg-[#090f0b]/80 border border-[#162f1a] p-6 rounded-2xl flex flex-col justify-between space-y-4">
                      <div className="w-9 h-9 rounded-lg bg-[#122e18] text-[#a4ffa2] border border-[#23532c] flex items-center justify-center">
                        <Atom size={15} />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg text-white font-medium">Indestructible Materials</h4>
                        <p className="text-xs text-[#9ebfa0] leading-relaxed font-light mt-1.5">
                          Heavy combed loop hooks and organic fibers subjected to advanced pre-washing washes. Does not stretch, warp, or fade like thin retail alternatives.
                        </p>
                      </div>
                      <span className="text-[8.5px] font-mono text-[#a4ffa2] font-semibold uppercase tracking-wider">320+ GSM STUFFINGS INCLUDED</span>
                    </div>

                    <div className="bg-gradient-to-kb from-[#112314]/80 to-[#040805] border border-[#2b5932] p-6 rounded-2xl flex flex-col justify-between space-y-4">
                      <div className="w-9 h-9 rounded-lg bg-[#a3802e]/30 text-[#ffeaa7] border border-amber-500/20 flex items-center justify-center">
                        <MessageCircle size={15} />
                      </div>
                      <div>
                        <h4 className="font-serif text-lg text-white font-medium">Whisper-level bargaining</h4>
                        <p className="text-xs text-yellow-50/70 leading-relaxed font-light mt-1.5">
                          Since prices are not fixed, we welcome negotiation. Message custom parameters on WhatsApp and secure extra discounts from our Thoothukudi team.
                        </p>
                      </div>
                      <span className="text-[8.5px] font-mono text-amber-300 font-extrabold uppercase tracking-wider">NEVER FIX RATE CLEAR UP TO 80%</span>
                    </div>
                  </div>
                </section>

              </div>
            )}

            {/* ==================== PAGE 2: CATALOGUE ==================== */}
            {currentPage === 'catalogue' && (
              <div className="py-8 md:py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-8 text-left">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#162f1a] pb-6 mb-2">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono uppercase tracking-[5px] text-[#a3802e] font-extrabold block">DEPOT VAULT INVENTORY ✦</span>
                    <h3 className="font-serif text-3xl font-light text-white">Browse Curated Surplus Batches</h3>
                    <p className="text-xs text-[#9ebfa0] max-w-xl font-light leading-relaxed">
                      Select export-combed clothing. Note that listed rates are standard outlet indices. <strong>All prices are negotiable on WhatsApp!</strong>
                    </p>
                  </div>
                  
                  <span className="text-[10px] font-mono bg-[#122e18] px-3.5 py-1.5 border border-[#2b5932] rounded text-[#a4ffa2] font-semibold">
                    🔑 {sortedProducts.length} Exclusive Overstocks Online
                  </span>
                </div>

                {/* Filters, search and Sorting Tool Bar */}
                <div className="bg-[#090f0b]/90 border border-[#162f1a] p-4 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-4">
                  
                  {/* Category Selection Carousel */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none select-none">
                    {['All', 'Shirts', 'Polos', 'Hoodies', 'Jeans', 'Shorts', 'Stuffing Tshirts', 'Pet Dress', 'Suits'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-[9.5px] font-mono font-bold uppercase tracking-wider transition-all border shrink-0 cursor-pointer ${
                          activeCategory === cat
                            ? 'bg-[#122e18] border-[#a4ffa2] text-[#a4ffa2] shadow-inner'
                            : 'bg-black/35 border-[#152e19] text-white/50 hover:bg-[#122e18]/20 hover:text-white'
                        }`}
                      >
                        {cat === 'All' ? 'All Weaves' : cat}
                      </button>
                    ))}
                  </div>

                  {/* Search and Sort controls */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    
                    {/* Search Field */}
                    <div className="relative w-full sm:w-60">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={13} />
                      <input
                        type="text"
                        placeholder="Search specs, fits..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/60 border border-[#162f1a] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#a4ffa2]/50 transition-all font-mono"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>

                    {/* Sorting Dropdown */}
                    <div className="relative w-full sm:w-auto flex items-center gap-2 bg-black/40 border border-[#162f1a] px-3 py-2 rounded-xl text-xs font-mono text-white/70">
                      <SlidersHorizontal size={12} className="text-white/40" />
                      <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="bg-transparent border-none text-white text-xs font-mono focus:outline-none cursor-pointer pr-4"
                      >
                        <option value="featured" className="bg-[#040805] text-white">Featured Default</option>
                        <option value="price-low" className="bg-[#040805] text-white">Price: Low to High</option>
                        <option value="price-high" className="bg-[#040805] text-white">Price: High to Low</option>
                        <option value="savings" className="bg-[#040805] text-white">Bargain: Best Savings</option>
                        <option value="rating" className="bg-[#040805] text-white">Rank: Top Ratings</option>
                      </select>
                    </div>

                  </div>

                </div>

                {/* Main Catalogue Grid */}
                {sortedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                    {sortedProducts.map((prod) => (
                      <LuxuryProductCard 
                        key={prod.id}
                        product={prod}
                        onInspect={(product) => setInspectedProduct(product)}
                        onAddToCart={(product, size) => handleAddToCart(product, size)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-black/40 border border-dashed border-[#162f1a] rounded-2xl max-w-xl mx-auto space-y-4">
                    <Search className="text-[#ffeaa7]/50 mx-auto" size={24} />
                    <div>
                      <span className="block text-sm font-mono font-bold uppercase text-white">No Threads Found</span>
                      <p className="text-xs text-[#8ca38d] max-w-xs mx-auto mt-1">
                        Try modifying search parameters or category selectors to check our weekly list.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('All');
                        setSortOption('featured');
                      }}
                      className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider text-white transition-colors cursor-pointer"
                    >
                      Reset Filter Parameters
                    </button>
                  </div>
                )}

              </div>
            )}

            {/* ==================== PAGE 3: STYLE WORKSPACE (CURATOR) ==================== */}
            {currentPage === 'curator' && (
              <div className="py-8 md:py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-[#162f1a] pb-6">
                  <div className="space-y-1.5 text-left">
                    <span className="text-[9.5px] font-mono uppercase tracking-[5px] text-[#a3802e] font-extrabold block">SARTORIAL WORKSPACE HUB</span>
                    <h3 className="font-serif text-3xl font-light text-white">Bespoke Editorial Outfit Coordinator</h3>
                    <p className="text-xs text-[#9ebfa0] max-w-xl font-light leading-relaxed">
                      Coordinate heavy shirts or athletic pique polos with deep selvedge raw indigo denim or utility boardshorts in real time. Customize fit sizing and negotiate combined bundle values.
                    </p>
                  </div>
                  
                  <div className="text-[10px] font-mono text-[#597a58] shrink-0 uppercase tracking-widest font-extrabold bg-[#090f0b] border border-[#162f1a] px-3.5 py-1.5 rounded-lg">
                    Couture coordinate active
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  
                  {/* Outfit Preview Board (Left segment) */}
                  <div className="lg:col-span-7 flex flex-col justify-between bg-[#040805]/90 border border-[#162f1a] rounded-2xl p-6 md:p-8 relative overflow-hidden min-h-[480px]">
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(24,58,32,0.1)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                    <div className="absolute top-4 left-4 text-[8px] font-mono text-[#597a58] tracking-widest uppercase">
                      STUDIO FITTING COMBOS // TEENZ DIGITAL LAB
                    </div>

                    <div className="my-auto flex flex-col md:flex-row items-center justify-center gap-6 py-6 z-10">
                      
                      {/* TOP COMPONENT SELECT */}
                      <motion.div 
                        key={`curator-top-${curatorTop.id}`}
                        initial={{ opacity: 0, scale: 0.95, x: -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        className="w-56 bg-[#090f0b] border border-[#2b5932] p-3 rounded-2xl shadow-2xl flex flex-col text-left space-y-3"
                      >
                        <div className="h-44 rounded-xl overflow-hidden relative bg-black">
                          <img src={curatorTop.image} alt={curatorTop.name} className="w-full h-full object-cover filter brightness-90" referrerPolicy="no-referrer" />
                          <span className="absolute top-2 left-2 bg-[#a3802e] text-[#ffeaa7] text-[8px] font-mono px-2 py-0.5 rounded font-extrabold uppercase">
                            {curatorTop.category}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-serif text-[13px] font-bold text-white leading-tight line-clamp-1">{curatorTop.name}</h4>
                          <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-1 text-[11px]">
                            <span className="text-white/40 font-mono text-[9px]">Direct outlet</span>
                            <span className="font-mono text-[#ffeaa7] font-bold">₹{curatorTop.price}</span>
                          </div>
                        </div>
                      </motion.div>

                      <div className="text-[#a3802e] font-serif text-3xl font-extralight py-2">+</div>

                      {/* BOTTOM COMPONENT SELECT */}
                      <motion.div 
                        key={`curator-bottom-${curatorBottom.id}`}
                        initial={{ opacity: 0, scale: 0.95, x: 10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        className="w-56 bg-[#090f0b] border border-[#2b5932] p-3 rounded-2xl shadow-2xl flex flex-col text-left space-y-3"
                      >
                        <div className="h-44 rounded-xl overflow-hidden relative bg-black">
                          <img src={curatorBottom.image} alt={curatorBottom.name} className="w-full h-full object-cover filter brightness-90" referrerPolicy="no-referrer" />
                          <span className="absolute top-2 left-2 bg-[#a3802e] text-[#ffeaa7] text-[8px] font-mono px-2 py-0.5 rounded font-extrabold uppercase">
                            {curatorBottom.category}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-serif text-[13px] font-bold text-white leading-tight line-clamp-1">{curatorBottom.name}</h4>
                          <div className="flex justify-between items-center pt-2 border-t border-white/5 mt-1 text-[11px]">
                            <span className="text-white/40 font-mono text-[9px]">Direct outlet</span>
                            <span className="font-mono text-[#ffeaa7] font-bold">₹{curatorBottom.price}</span>
                          </div>
                        </div>
                      </motion.div>

                    </div>

                    <div className="border-t border-[#162f1a] pt-4 flex flex-col sm:flex-row items-center justify-between text-left gap-3 z-10">
                      <div>
                        <span className="text-[8px] font-mono text-[#597a58] uppercase block tracking-widest">AGGREGATE OUTFIT VALUATION:</span>
                        <span className="text-yellow-100 font-mono text-[10.5px] font-bold mt-0.5 block">
                          Combined Standard MSRP: ~~₹{curatorTop.msrp + curatorBottom.msrp}~~ ✦ Outlet Value: ₹{curatorTop.price + curatorBottom.price}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono bg-[#122e18] text-[#a4ffa2] px-3.5 py-1 rounded-full border border-[#2b5932] shrink-0 font-bold">
                        🎉 INSTANT COMBINED SAVING: ₹{(curatorTop.msrp + curatorBottom.msrp) - (curatorTop.price + curatorBottom.price)}
                      </span>
                    </div>

                  </div>

                  {/* Curator Workspace Panel Control Segment (Right segment) */}
                  <div className="lg:col-span-5 bg-[#090f0b]/90 border border-[#162f1a] p-6 rounded-2xl flex flex-col justify-between space-y-6 text-left">
                    
                    <div className="space-y-4">
                      
                      {/* Step 1 Select top piece */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono uppercase tracking-[3px] text-[#a3802e] block font-extrabold">STEP 01: DEFINE ENHANCED TOP CODES</span>
                        <p className="text-[10.5px] text-[#9ebfa0]">Choose luxurious upper garments in stock:</p>
                        
                        <div className="grid grid-cols-1 gap-2 pt-1">
                          {PRODUCT_CATALOGUE.filter(p => ['Shirts', 'Polos', 'Stuffing Tshirts'].includes(p.category)).slice(0, 3).map(topItem => (
                            <button
                              key={topItem.id}
                              onClick={() => setCuratorTop(topItem)}
                              className={`flex items-center gap-3 p-2 rounded-xl text-left border transition-all cursor-pointer ${
                                curatorTop.id === topItem.id
                                  ? 'bg-[#122e18] border-[#a4ffa2] text-[#a4ffa2] shadow-md shadow-emerald-950/40'
                                  : 'bg-black/40 border-[#1a2f1c] text-white hover:border-[#ffeaa7]/50'
                              }`}
                            >
                              <img src={topItem.image} alt={topItem.name} className="w-10 h-10 rounded-lg object-cover bg-black" />
                              <div className="flex-grow">
                                <span className="block text-[11px] font-serif font-bold tracking-tight text-white leading-tight line-clamp-1">{topItem.name}</span>
                                <span className="block text-[9px] font-mono text-white/50">Surplus Rate: ₹{topItem.price} (Negotiable)</span>
                              </div>
                              <ChevronRight size={14} className="opacity-40" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Step 2 Select bottom piece */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono uppercase tracking-[3px] text-[#a3802e] block font-extrabold">STEP 02: SELECT LUX LOWER TROUSER CODES</span>
                        <p className="text-[10.5px] text-[#9ebfa0]">Coordinate bottom fits:</p>
                        
                        <div className="grid grid-cols-1 gap-2 pt-1">
                          {PRODUCT_CATALOGUE.filter(p => ['Jeans', 'Shorts'].includes(p.category)).slice(0, 3).map(bottomItem => (
                            <button
                              key={bottomItem.id}
                              onClick={() => setCuratorBottom(bottomItem)}
                              className={`flex items-center gap-3 p-2 rounded-xl text-left border transition-all cursor-pointer ${
                                curatorBottom.id === bottomItem.id
                                  ? 'bg-[#122e18] border-[#a4ffa2] text-[#a4ffa2] shadow-md shadow-emerald-950/40'
                                  : 'bg-black/40 border-[#1a2f1c] text-white hover:border-[#ffeaa7]/50'
                              }`}
                            >
                              <img src={bottomItem.image} alt={bottomItem.name} className="w-10 h-10 rounded-lg object-cover bg-black" />
                              <div className="flex-grow">
                                <span className="block text-[11px] font-serif font-bold tracking-tight text-white leading-tight line-clamp-1">{bottomItem.name}</span>
                                <span className="block text-[9px] font-mono text-white/50">Surplus Rate: ₹{bottomItem.price} (Negotiable)</span>
                              </div>
                              <ChevronRight size={14} className="opacity-40" />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Step 3 Select Size parameters */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono uppercase tracking-[3px] text-[#a3802e] block font-extrabold">STEP 03: DEFINE SIZING SPEC</span>
                        <div className="flex gap-1.5">
                          {['S', 'M', 'L', 'XL', 'XXL'].map(sz => (
                            <button
                              key={sz}
                              onClick={() => setCuratorSize(sz)}
                              className={`flex-grow py-1.5 rounded-lg text-[9.5px] font-mono font-bold uppercase transition-all cursor-pointer ${
                                curatorSize === sz
                                  ? 'bg-[#ffeaa7] text-[#040805] font-extrabold shadow-lg shadow-yellow-900/10 border border-[#a3802e]'
                                  : 'bg-black/30 border border-[#1a2f1c] text-white/70 hover:bg-black/70'
                              }`}
                            >
                              {sz} Code
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Interactive execution card */}
                    <div className="pt-4 border-t border-[#132c18]/60 space-y-2">
                      <div className="bg-[#a3802e]/10 border border-[#a3802e]/20 p-3 rounded-lg text-[9.5px] text-[#ffeaa7] font-mono flex items-center gap-2">
                        <MessageCircle size={14} className="shrink-0 text-amber-400 animate-pulse" />
                        <span>Combo Price is negotiable! Let's arrange bulk sizing clearances on WhatsApp message.</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            handleAddToCart(curatorTop, curatorSize);
                            handleAddToCart(curatorBottom, curatorSize);
                          }}
                          className="flex items-center justify-center gap-1.5 py-3 rounded-xl border border-[#ffeaa7]/25 bg-[#122e18] text-white text-[11px] font-mono font-bold tracking-wide uppercase transition-all shadow-md cursor-pointer hover:border-emerald-400"
                        >
                          <ShoppingBag size={13} /> Add Bundle
                        </button>

                        <a 
                          href={`https://wa.me/919677984004?text=${getBespokeCuratorWhatsApp()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 bg-[#a3802e] hover:bg-[#ffeaa7] text-white hover:text-[#040805] py-3 rounded-xl text-[11.5px] font-mono font-bold tracking-wide uppercase transition-all shadow-md cursor-pointer"
                        >
                          <MessageCircle size={13} /> Chat Bargain
                        </a>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* ==================== PAGE 4: ABOUT SOURCING ==================== */}
            {currentPage === 'about' && (
              <div className="py-8 md:py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-16 text-left">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-[#162f1a] pb-6 mb-8">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-[5px] text-[#ffeaa7] font-bold block">SARTORIAL AUDIT REPORT</span>
                    <h3 className="font-serif text-3xl font-light text-white">Direct-from-Mill Sourcing System</h3>
                    <p className="text-xs text-[#9bb89a] max-w-xl font-light leading-relaxed">
                      Spliced from canceled export shipment clearances and excess mill roll stocks, Teenz Wearz bridges high-grade fabrics straight to customers near W.G.C Road.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 space-y-6">
                    <h4 className="font-serif text-xl sm:text-2xl text-white font-medium">Why we don't fix our prices</h4>
                    <p className="text-xs text-[#9ebfa0] leading-relaxed font-light">
                      Surplus collections are bought in varying bulk volumes from manufacturing centers. Pricing changes according to market clearances, size parameters, and order quantities.
                    </p>
                    <p className="text-xs text-[#9ebfa0] leading-relaxed font-light">
                      We believe retail should be a conversation, not a static matrix. If you find multiple items in our catalogue that you love, or if a specific size is critical, <strong>you are encouraged to chat, negotiate, and swap details with our friendly team in Tuticorin!</strong>
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-3 text-xs">
                        <Check className="text-[#a4ffa2]" size={15} />
                        <span className="font-semibold text-white">Genuine Export Surplus Fabrics only</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <Check className="text-[#a4ffa2]" size={15} />
                        <span className="font-semibold text-white">Heavy-weight combed loop fibers (up to 420 GSM hoodie options)</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <Check className="text-[#a4ffa2]" size={15} />
                        <span className="font-semibold text-white">Highly reactive hot washed pre-shrub materials</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <img 
                      src="https://images.unsplash.com/photo-1551238258-4029436d367c?auto=format&fit=crop&q=80&w=600" 
                      alt="Tailoring Loom Thread Matrix" 
                      className="rounded-2xl border border-emerald-900 shadow-2xl brightness-90 saturate-75 w-full h-[320px] object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* ==================== PAGE 5: LOCATE DEPOT ==================== */}
            {currentPage === 'contact' && (
              <div className="py-8 md:py-16 px-4 md:px-8 max-w-7xl mx-auto space-y-12 text-left">
                
                <div className="border-b border-[#162f1a] pb-6 mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-[5px] text-[#ffeaa7] font-bold block">HUB COORDINATES</span>
                  <h3 className="font-serif text-3xl font-light text-white">Teenz Wearz Thoothukudi Depot</h3>
                  <p className="text-xs text-[#9bb89a] font-light mt-1.5">
                    Centrally located within Tamil Nadu. Visually inspect, feel, and try on heavy export cotton weights offline today!
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
                  
                  {/* Left Segment: Location indexes */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="space-y-4">
                      
                      <div className="flex items-start gap-3">
                        <MapPin className="text-[#a4ffa2] shrink-0 mt-0.5" size={15} />
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono text-white/50 block font-bold uppercase">PHYSICAL DEPOT MAP ADDR:</span>
                          <p className="text-[11.5px] text-white">
                            Teenz Wearz, W.G.C Road,<br />Thoothukudi, Tamil Nadu - 628002
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="text-[#ffeaa7] shrink-0 mt-0.5" size={15} />
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono text-white/50 block font-bold uppercase">GATE RE-OPEN HOURS:</span>
                          <p className="text-[11.5px] text-white">
                            10:00 AM — 09:30 PM (Operating Daily)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="text-[#a4ffa2] shrink-0 mt-0.5" size={15} />
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono text-white/50 block font-bold uppercase">HOTLINE ENQUIRY VERIFY:</span>
                          <p className="text-[11.5px] text-[#ffeaa7] font-mono font-bold">
                            +91 96779 84004
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Social connection handles */}
                    <div className="pt-4 border-t border-[#162f1a] space-y-3">
                      <span className="block text-[10px] font-mono text-[#5a7f5d] uppercase tracking-wider font-extrabold">DIGITAL CHANNELS CORE:</span>
                      <div className="flex flex-wrap gap-2">
                        <a 
                          href="https://www.instagram.com/teenz_wearz_thoothukudi?igsh=ZGw5c2RoOXRqc2R6"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-[#090f0b] border border-[#1b3d22] text-[#a4ffa2] hover:bg-[#ffeaa7] hover:text-[#040805] px-4 py-2 rounded-xl text-[10.5px] font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                        >
                          <Instagram size={13} className="text-pink-500 hover:text-black" /> Instagram Feed
                        </a>

                        <a 
                          href="https://www.facebook.com/share/1ChvLnUCLj/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-[#090f0b] border border-[#1b3d22] text-white hover:bg-blue-600 px-4 py-2 rounded-xl text-[10.5px] font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                        >
                          <Facebook size={13} className="text-blue-500" /> Facebook Core
                        </a>
                      </div>
                    </div>

                  </div>

                  {/* Right Segment: Simulated Atmospheric Digital Radar Track */}
                  <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[#1a3a20] relative min-h-[350px] bg-black">
                    <div className="absolute inset-0 bg-[#040805]/75 z-10 p-6 flex flex-col justify-between pointer-events-none">
                      <div className="space-y-1">
                        <span className="bg-[#122e18] border border-[#2b5932] px-2.5 py-1 text-[9px] text-[#a4ffa2] font-mono rounded font-bold uppercase tracking-wider block w-fit">
                          Direct Radar Target Node W.G.C
                        </span>
                        <p className="text-[12px] text-white font-serif font-light pt-2 max-w-sm">
                          Landmark parameters: Situated direct near principal wholesale complexes in inner Thoothukudi squares.
                        </p>
                      </div>

                      <div className="bg-black/90 p-4 rounded-xl border border-white/5 space-y-2 pointer-events-auto max-w-sm">
                        <div className="flex items-center gap-2">
                          <MapPin size={13} className="text-[#ffeaa7]" />
                          <span className="text-[10px] font-mono text-[#a4ffa2] font-bold">ACTIVE ROUTING REQUESTS</span>
                        </div>
                        <p className="text-[10px] text-[#8ca38d] leading-snug">
                          Would you like to fetch a precise matching offline GPS coordinates map pin on your mobile?
                        </p>
                        <a 
                          href="https://wa.me/919677984004?text=Hi%20Teenz%20Wearz%2C%20please%20send%20me%20your%20exact%20WGC%20Road%20coordinates%20GPS%20map%20pin!"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#ffeaa7] hover:underline"
                        >
                          Request direct GPS coordinates pin →
                        </a>
                      </div>
                    </div>

                    {/* Radial background grids */}
                    <div className="absolute inset-0 bg-[#020503] bg-[radial-gradient(rgba(163,128,46,0.12)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-40">
                      <div className="w-80 h-80 rounded-full border border-[#ffeaa7]/5 flex items-center justify-center animate-spin-slow">
                        <div className="w-56 h-56 rounded-full border border-[#ffeaa7]/5 flex items-center justify-center" />
                      </div>
                      <div className="absolute w-2 h-2 bg-[#a4ffa2] rounded-full animate-ping" />
                      <div className="absolute w-3 h-3 bg-[#ffeaa7] rounded-full border border-black shadow" />
                    </div>
                  </div>

                </div>

              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </main>

      {/* ==================== SHOPPING CART DRAWER PANEL ==================== */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md pointer-events-auto"
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                className="w-screen max-w-md bg-[#070c08] border-l border-[#1b3d22]/80 p-6 shadow-2xl flex flex-col justify-between"
              >
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#142d18] pb-4">
                  <div className="flex items-center gap-2 text-left">
                    <ShoppingBag size={18} className="text-[#ffeaa7]" />
                    <h3 className="font-serif text-lg text-white font-medium">Bespoke Store Basket</h3>
                    <span className="text-[10px] font-mono bg-[#122e18] border border-[#2b5932] px-2 py-0.5 rounded text-[#a4ffa2] font-semibold font-bold">
                      {totalCartCount} items
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-1.5 rounded-lg border border-[#142d18] hover:border-white/20 text-white/60 hover:text-white cursor-pointer"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Items collection */}
                <div className="flex-grow overflow-y-auto py-6 space-y-4 text-left scrollbar-thin">
                  {cart.length > 0 ? (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div 
                          key={`${item.product.id}-${item.selectedSize}`}
                          className="flex items-stretch gap-4 p-3 bg-black/40 border border-[#142a17] rounded-xl"
                        >
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-16 h-16 rounded-lg object-cover bg-black shrink-0" 
                            referrerPolicy="no-referrer"
                          />
                          
                          <div className="flex-grow flex flex-col justify-between">
                            <div>
                              <h4 className="text-white text-xs font-serif font-bold leading-tight">{item.product.name}</h4>
                              <span className="text-[9.5px] font-mono text-[#587e5b] tracking-wider uppercase block mt-0.5">
                                Size: {item.selectedSize} • Direct Surplus Check
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              {/* Quantity increments */}
                              <div className="flex items-center gap-2.5 bg-black/75 px-2 py-0.5 rounded border border-[#142d18]">
                                <button 
                                  onClick={() => handleUpdateQuantity(item.product.id, item.selectedSize, -1)}
                                  className="text-white/40 hover:text-[#ffeaa7] cursor-pointer"
                                >
                                  <Minus size={11} />
                                </button>
                                <span className="text-[10.5px] font-mono text-white font-bold">{item.quantity}</span>
                                <button 
                                  onClick={() => handleUpdateQuantity(item.product.id, item.selectedSize, 1)}
                                  className="text-white/40 hover:text-[#ffeaa7] cursor-pointer"
                                >
                                  <Plus size={11} />
                                </button>
                              </div>

                              <span className="font-mono text-xs text-[#ffeaa7] font-bold">
                                ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          <button 
                            onClick={() => handleRemoveFromCart(item.product.id, item.selectedSize)}
                            className="text-white/20 hover:text-red-400 self-center cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}

                      <button 
                        onClick={handleClearCart}
                        className="text-[9px] font-mono uppercase tracking-wider text-red-400 hover:underline flex items-center gap-1 pt-1 cursor-pointer font-bold"
                      >
                        <Trash2 size={10} /> Clear entire basket selections
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-20 space-y-3 opacity-60">
                      <ShoppingBag size={32} className="text-white/10 mx-auto" />
                      <div>
                        <span className="block text-xs font-mono font-bold uppercase text-white/50">Your basket is empty</span>
                        <p className="text-[9.5px] text-[#587e5b] max-w-[200px] mx-auto mt-1 leading-snug">
                          Populate items and shapes from the active Store Catalogue!
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Subtotals & WhatsApp Checkout trigger */}
                <div className="border-t border-[#142d18] pt-4 space-y-4">
                  {cart.length > 0 && (
                    <div className="space-y-2 bg-[#09110a] p-3.5 rounded-xl border border-[#142c17]">
                      <div className="flex justify-between text-xs text-white/50">
                        <span>Original MSRP Total:</span>
                        <span className="line-through">₹{cartMsrpTotal.toLocaleString('en-IN')}</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm font-medium border-t border-white/5 pt-2">
                        <span className="text-white">Active Outlet Price:</span>
                        <span className="text-md font-serif text-[#ffeaa7] font-extrabold font-mono font-bold">
                          ₹{cartSubtotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="text-[9px] font-mono text-[#a4ffa2] text-center pt-1.5 block font-semibold uppercase leading-snug bg-emerald-950/20 border border-emerald-500/10 p-2 rounded">
                        💡 Saving ₹{totalSaved.toLocaleString('en-IN')} ✦ Prices not fixed! Tap button below to negotiate custom bargain rates on WhatsApp!
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 text-center">
                    {cart.length > 0 ? (
                      <a 
                        href={`https://wa.me/919677984004?text=${getWhatsAppMessage()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-[#a3802e] hover:bg-[#ffeaa7] hover:text-[#040805] text-white py-3.5 rounded-xl text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-lg active:scale-95 cursor-pointer border border-[#ffeaa7]/10"
                      >
                        <MessageCircle size={14} /> Negotiatate & checkout on WhatsApp
                      </a>
                    ) : (
                      <button 
                        disabled
                        className="w-full py-3.5 rounded-xl text-xs font-mono font-bold text-white/30 bg-white/5 cursor-not-allowed border border-white/5 uppercase tracking-widest"
                      >
                        Empty shopping basket
                      </button>
                    )}
                    
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="text-[9px] font-mono text-[#587e5b] tracking-wider uppercase hover:text-white cursor-pointer"
                    >
                      ← Back to viewing surplus garments
                    </button>
                  </div>

                </div>

              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== PRODUCT DETAIL LIGHTBOX / MODEL ==================== */}
      <AnimatePresence>
        {inspectedProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectedProduct(null)}
              className="absolute inset-0 bg-black/92 backdrop-blur-md pointer-events-auto"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative w-full max-w-3xl bg-[#090f0b] border border-[#1b3d22] rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row items-stretch text-left"
            >
              {/* Product dynamic image stage */}
              <div className="w-full md:w-1/2 relative min-h-[300px] bg-black shrink-0">
                <img 
                  src={inspectedProduct.image} 
                  alt={inspectedProduct.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute top-4 left-4 bg-[#122e18]/85 backdrop-blur-md px-3 py-1 rounded-md border border-[#2b5932] text-[#a4ffa2] text-[10px] font-mono uppercase tracking-wider font-bold">
                  Surplus verified rating: ★ {inspectedProduct.rating}
                </div>
              </div>

              {/* Detail specs sheet */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-[2px] text-[#597a58]">
                        EXPORT BATCH // {inspectedProduct.category}
                      </span>
                      <h4 className="font-serif text-2.5xl text-white font-medium mt-1 leading-snug">
                        {inspectedProduct.name}
                      </h4>
                    </div>

                    <button 
                      onClick={() => setInspectedProduct(null)}
                      className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white cursor-pointer shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <p className="text-xs text-[#9ebfa0] leading-relaxed font-light">
                    {inspectedProduct.description}
                  </p>

                  {/* Bullet requirements summary */}
                  <div className="space-y-1.5">
                    <span className="text-[9.5px] font-mono uppercase tracking-wider text-[#597a58] font-bold block">Spec attributes:</span>
                    <ul className="space-y-1">
                      {inspectedProduct.features.map((fea, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-[11px] text-[#e0ebd5]">
                          <Check size={11} className="text-[#a4ffa2] shrink-0" />
                          <span>{fea}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pricing contrast highlights */}
                  <div className="bg-[#050906] p-3 rounded-xl border border-white/5 flex justify-between items-center bg-black/40">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-mono text-white/40 line-through block">MSRP Retail: ₹{inspectedProduct.msrp}</span>
                      <span className="text-lg font-serif text-[#ffeaa7] font-bold block">Outlet Price: ₹{inspectedProduct.price}</span>
                    </div>

                    <span className="text-[10.5px] font-mono bg-[#122e18] text-[#a4ffa2] border border-[#2b5932] py-1 px-2.5 rounded font-bold">
                      SAVE ₹{inspectedProduct.msrp - inspectedProduct.price} (Bargain Available)
                    </span>
                  </div>

                  {/* Prices are not fixed warning */}
                  <div className="bg-[#a3802e]/10 border border-[#a3802e]/20 p-2.5 rounded-lg text-[9px] font-mono text-[#ffeaa7] text-center leading-snug">
                    ⚠️ Did you know? This rate is completely negotiable! Message us directly on WhatsApp to coordinate size combinations and fetch custom bargain discounts.
                  </div>
                </div>

                {/* Modal controls actions inline */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5 select-none font-mono">
                  <button
                    onClick={() => {
                      handleAddToCart(inspectedProduct, inspectedProduct.sizes[0] || 'L');
                      setInspectedProduct(null);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 bg-[#a3802e] hover:bg-[#ffeaa7] hover:text-[#040805] text-white py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer border border-transparent"
                  >
                    Quick Add Basket
                  </button>

                  <a 
                    href={`https://wa.me/919677984004?text=Hi%20Teenz%20Wearz%2C%20I%20want%20to%20negotiate%20the%20rate%20for%20the%20*${encodeURIComponent(inspectedProduct.name)}*%20(${encodeURIComponent(inspectedProduct.category)})%21`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 bg-black/40 border border-[#1b3e21] hover:bg-[#122e18] hover:border-[#a4ffa2]/50 text-[#a4ffa2] py-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all active:scale-95"
                  >
                    <MessageCircle size={13} /> Negotiate rate
                  </a>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== FOOTER SECTION ==================== */}
      <footer className="bg-[#030604] border-t border-[#162f1a] pt-16 pb-12 px-4 md:px-8 mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 text-left pb-12 border-b border-white/5">
          
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-950 to-black flex items-center justify-center border border-[#1e4423]">
                <Shirt className="text-[#ffeaa7]" size={16} />
              </div>
              <span className="font-serif text-lg tracking-[4px] text-white font-bold uppercase">TEENZ WEARZ</span>
            </div>
            
            <p className="text-xs text-[#a1baa2] leading-relaxed max-w-sm">
              Premium clothing surplus clearances directly corresponding with export manufacturing mills. Beautiful heavy combed cotton, no luxury retailer fluff overheads.
            </p>

            <span className="block text-[10.5px] font-mono text-[#ffeaa7] font-bold">
              📞 +91 96779 84004 ✦ Thoothukudi, Tamil Nadu
            </span>
          </div>

          <div className="md:col-span-4 space-y-4">
            <span className="block text-[10px] font-mono text-white/50 tracking-[3px] uppercase font-bold">DIRECT STORE METRICS</span>
            <ul className="space-y-2.5 text-xs text-[#9ebfa0]">
              <li className="flex items-center gap-2">
                <MapPin size={12} className="text-[#ffeaa7] shrink-0" />
                <span>Teenz Wearz, W.G.C Road, Thoothukudi, TN - 628002</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={12} className="text-[#a4ffa2] shrink-0" />
                <span>Everyday: 10:00 AM — 09:30 PM (Operating Daily)</span>
              </li>
              <li className="flex items-center gap-2">
                <Info size={12} className="text-amber-400" />
                <span>Weekly overstock clearances arrivals on Fridays!</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-4">
            <span className="block text-[10px] font-mono text-white/50 tracking-[3px] uppercase font-bold">BARGAIN BARTER SYSTEM</span>
            <p className="text-xs text-[#9ebfa0] leading-relaxed">
              We source excess clearances and canceled international drafts. Since quantities and clearances are dynamic, <strong>our prices are fully negotiable on WhatsApp based on size availability and bulk preferences.</strong>
            </p>
            
            <a 
              href="https://wa.me/919677984004?text=Hi%20Teenz%20Wearz%2C%20I%20want%20to%20negotiate%20surplus%20rates%20offline%20at%20WGC%20Road."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#ffeaa7] hover:underline"
            >
              Acquire GPS Location Map Coordinates →
            </a>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[9.5px] font-mono text-[#5a7f5d] tracking-wider gap-4">
          <span>© 2026 TEENZ WEARZ DEPOT. ALL COMPONENT GRAPHICS LICENSED ACCORDINGLY.</span>
          <span>APPROVED EXPORT COMBED CORE CLEARANCE CELL</span>
        </div>
      </footer>

    </div>
  );
}
