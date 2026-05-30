export interface Product {
  id: string;
  name: string;
  category: string;
  msrp: number; // Struck through original price
  price: number; // Low factory outlet price!
  image: string; // High quality Unsplash fashion image
  description: string;
  colors: string[];
  sizes: string[];
  features: string[];
  rating: number;
}

// Complete high-contrast, premium products representing branded surpluses in Thoothukudi
export const PRODUCT_CATALOGUE: Product[] = [
  {
    id: 'prod1',
    name: 'Ambassador Forest Dress Shirt',
    category: 'Shirts',
    msrp: 2499,
    price: 849,
    image: 'https://images.unsplash.com/photo-1620012253295-c05518e9933a?auto=format&fit=crop&q=80&w=600',
    description: 'Immaculately woven formal shirt in forest emerald green hue. 100% fine Egyptian combed cotton, dual-button barrel cuffs, premium classic stiff turn collars.',
    colors: ['#0d2a14', '#ffffff', '#1a1a1a'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    features: ['100% Combed Fine Weave Cotton', 'Pre-Shrunk double wash treatment', 'Rigorous double-stitching joins'],
    rating: 4.9
  },
  {
    id: 'prod1_alt',
    name: 'Oxford Linen Classic Shirt',
    category: 'Shirts',
    msrp: 2299,
    price: 799,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600',
    description: 'Classic fine woven breathable casual linen cotton shirt in a sophisticated sandstone hue. Double needle side seams, curved hem line perfect for untucked styles.',
    colors: ['#dfd3c3', '#ffffff', '#222222'],
    sizes: ['M', 'L', 'XL'],
    features: ['Premium linen-cotton blend', 'Perfect summer breathable structure', 'Horn style aesthetic buttons'],
    rating: 4.8
  },
  {
    id: 'prod2',
    name: 'Thoothukudi Premium Knit Polo',
    category: 'Polos',
    msrp: 1899,
    price: 649,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1ec820?auto=format&fit=crop&q=80&w=600',
    description: 'Contrast knit collar athletic polo constructed from luxurious pique cotton loops. Designed with a structured, tailored waist specifically for warm coastal summers.',
    colors: ['#edf7ef', '#112213', '#d4af37'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    features: ['High-absorption pique structure', 'Fade-resistant yarn dye', 'Robust knit flat collar'],
    rating: 4.8
  },
  {
    id: 'prod3',
    name: 'Coastal Heavyweight Fleece Hoodie',
    category: 'Hoodies',
    msrp: 3199,
    price: 1099,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600',
    description: 'Ultra-dense, high-grammage fleece hoodie featuring double-welded panel lock joints, drop shoulder drape, and dual hand-warming utility pockets.',
    colors: ['#221d19', '#192b1a', '#22252a'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: ['420 GSM heavy brushing cotton', 'Durable loop rib panels', 'Wind-breaking dynamic collar structure'],
    rating: 4.9
  },
  {
    id: 'prod4',
    name: 'Imperial Gold Selvedge Denim',
    category: 'Jeans',
    msrp: 2999,
    price: 999,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=600',
    description: 'Raw indigo Japanese weaver Twill denims. Decorated with authentic gold copper stitching and deep contrast orange hems. Perfect heavy handle structure.',
    colors: ['#121d2b', '#1e2022'],
    sizes: ['30', '32', '34', '36'],
    features: ['14oz dense unwashed denim', 'Reinforced key brass rivets', 'Authentic selvedge seam stitching'],
    rating: 4.9
  },
  {
    id: 'prod4_alt',
    name: 'Washed Indigo Distressed Denim',
    category: 'Jeans',
    msrp: 2799,
    price: 949,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600',
    description: 'Beautiful stonewashed denim with custom distressed scraping & hand-rubbed whiskers. Loose tapered comfort fit with reinforced pocket entries.',
    colors: ['#427494', '#283c4f'],
    sizes: ['30', '32', '34', '36'],
    features: ['Organic cotton stretch twill', 'Premium copper zip sliders', 'Reinforced knee line stress points'],
    rating: 4.7
  },
  {
    id: 'prod_shorts1',
    name: 'Breeze Cargo Surplus Shorts',
    category: 'Shorts',
    msrp: 1699,
    price: 549,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=600',
    description: 'Heavy duty tactical cargo shorts featuring deep expandable bellows pockets, integrated nylon quick-release web belt, and water-repellent shell.',
    colors: ['#424832', '#1a1c12', '#222222'],
    sizes: ['30', '32', '34', '36'],
    features: ['Heavyweight ripstop fabric', 'Nylon utility belt setup', 'Snap flap secure storage'],
    rating: 4.8
  },
  {
    id: 'prod_shorts2',
    name: 'Coastline Board Shorts',
    category: 'Shorts',
    msrp: 1499,
    price: 499,
    image: 'https://images.unsplash.com/photo-1565438122261-33c85d820b1e?auto=format&fit=crop&q=80&w=600',
    description: 'Lightweight quick-drying premium surf board shorts. Features high tensile drawstrings, flatlock non-chafe seams, and side mesh-lined zippered utility keys pocket.',
    colors: ['#0d2e40', '#3b1842', '#333333'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: ['Hydrophobic quick-dry treatment', 'Four-way flexibility spandex', 'Reinforced seam joins'],
    rating: 4.6
  },
  {
    id: 'prod_tshirt1',
    name: '320 GSM Overstuffed Heavy Knit Tee',
    category: 'Stuffing Tshirts',
    msrp: 1299,
    price: 449,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
    description: 'Thick, heavy boxed-fit t-shirt packed with dense loopback organic cotton threads. Maintains clean structural lines and sits beautifully on the shoulders with a premium retro look.',
    colors: ['#ffffff', '#000000', '#4a4238'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    features: ['Ultra-dense 320 GSM yarn structure', 'Zero-sag rib collar neckband', 'Premium heavy packing stitches'],
    rating: 4.9
  },
  {
    id: 'prod_tshirt2',
    name: 'Retro Puffed Graphic Tee',
    category: 'Stuffing Tshirts',
    msrp: 1399,
    price: 499,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600',
    description: 'High-density puff ink embossed graphic on heavyweight cotton. Unique minimalist celestial seal screenprint, pre-shrunk and double-dyed in charcoal tones.',
    colors: ['#1c1c1c', '#dedede'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: ['3D embossed puff graphic sealer', 'Dual-stitched hem and drop shoulders', 'Reactive organic pigment dye'],
    rating: 5.0
  },
  {
    id: 'prod_pet1',
    name: 'Royal Canine Knit Polo',
    category: 'Pet Dress',
    msrp: 999,
    price: 349,
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=600',
    description: 'Adorable export-grade mini polo engineered with expandable cotton loops. Match your pet dog/cat in premium aesthetic green hues. Complete with classic rib collar and side vents.',
    colors: ['#0d2a14', '#a11d1d'],
    sizes: ['XS', 'S', 'M', 'L'],
    features: ['Highly elastic comfort weave', 'High-belly cutout for dry walks', 'Soft neck non-restrictive collar'],
    rating: 4.9
  },
  {
    id: 'prod_pet2',
    name: 'Sartorial Canine Tuxedo Suit',
    category: 'Pet Dress',
    msrp: 1599,
    price: 599,
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600',
    description: 'Dapper and dandy black-tie jacket suit for your pet companion. Classic satin lapels, Velcro stretch-joint bindings, and hand-embroidered gold trim buttons.',
    colors: ['#121513', '#ffffff'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: ['Hypoallergenic soft satin interior', 'Easy Velcro belly straps', 'Dual leash attachment cutouts'],
    rating: 4.8
  },
  {
    id: 'prod5',
    name: 'Royal Heritage Double-Breasted Suit',
    category: 'Suits',
    msrp: 6499,
    price: 2199,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600',
    description: 'Masterclass elegant black jacket with a tailored waistline and gold-rimmed buttons. Created using surplus structural wool for elite celebrations and corporate drapes.',
    colors: ['#111512', '#2c2214'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    features: ['Sartorial luxury satin interior lining', 'Classic dual rear vents', 'Padded structure shoulders'],
    rating: 5.0
  },
  {
    id: 'prod6',
    name: 'Surplus Utility Tactical Cargo',
    category: 'Jeans',
    msrp: 2699,
    price: 899,
    image: 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=600',
    description: 'Sturdy canvas multi-pocket urban cargo trousers. Side bellows utility flaps with snap metal sliders, double seat seat reinforcement for maximum lifespan.',
    colors: ['#282c21', '#1f1e1a'],
    sizes: ['30', '32', '34', '36'],
    features: ['Heavy cotton ripstop weave', 'Deep slash security pockets', 'Gaiter ankle drawstring options'],
    rating: 4.7
  }
];
