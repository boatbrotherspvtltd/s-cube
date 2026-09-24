export const company = {
  name: "S-Cube Mercantile",
  shortName: "S-Cube",
  tagline: "Powering a Sustainable Tomorrow",
  model: "CNF · Distributor · Dealer",
  city: "Guwahati, Assam",
  region: "Assam & the Northeast",
  website: "https://scubemercantile.in",
  websiteLabel: "scubemercantile.in",
  email: "Info.scubemercantile@gmail.com",
  // Replace digits only, country code included, no + or spaces. Example: 919876543210
  whatsapp: "91XXXXXXXXXX",
  gstn: "18EBPPS8578K4Z8",
  iso: "ISO 9001:2015",
  years: "7+",
  address:
    "C/o Suchii Group, 1st Floor, Nikita Pinacle, Opp. of Vivanta by Taj, Khanpara, Guwahati, Assam, India – 781022",
  summary:
    "S-Cube Mercantile is a Guwahati-based CNF, distributor and dealer of solar energy products. For more than seven years the company has supplied genuine renewable-energy equipment to dealers, installers, retailers and end customers across Assam and the Northeast.",
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/solutions", label: "Solutions" },
  { href: "/brands", label: "Brands" },
  { href: "/gallery", label: "Gallery" },
];

export const stats = [
  { value: "7+", label: "Years of service" },
  { value: "ISO 9001:2015", label: "Certified firm" },
  { value: "5", label: "Authorised brands" },
  { value: "Northeast", label: "Regional reach" },
];

export const brands = [
  {
    name: "Adani Solar",
    products: ["Solar PV Modules"],
    logo: "/images/brands/adani.jpg",
  },
  {
    name: "Waaree Energies",
    products: ["Solar PV Modules", "Solar Solutions"],
    logo: "/images/brands/waaree.png",
  },
  {
    name: "Luminous",
    products: ["Solar Inverters", "Batteries", "Solar Solutions"],
    logo: "/images/brands/luminous.avif",
  },
  {
    name: "Microtek",
    products: ["Solar Inverters", "Panels", "Batteries"],
    logo: "/images/brands/microtek.jpg",
  },
  {
    name: "Tata Power Solar",
    products: ["Solar Modules", "Rooftops", "Pumps", "Solar Solutions"],
    logo: "/images/brands/tata.jpg",
  },
];

export const products = [
  {
    slug: "solar-panels",
    name: "Solar PV Modules",
    short: "Solar Panels",
    desc: "High-efficiency polycrystalline, monocrystalline and Mono PERC / TOPCon panels.",
    partners: ["Adani Solar", "Waaree Energies", "Microtek", "Tata Power Solar"],
    icon: "sun",
  },
  {
    slug: "solar-inverters",
    name: "Solar Inverters",
    short: "Inverters",
    desc: "On-grid, off-grid and hybrid inverters for conversion and backup applications.",
    partners: ["Luminous", "Microtek"],
    icon: "zap",
  },
  {
    slug: "solar-batteries",
    name: "Solar Batteries",
    short: "Batteries",
    desc: "Tubular and solar-specific batteries for dependable energy storage.",
    partners: ["Luminous", "Microtek"],
    icon: "battery",
  },
  {
    slug: "solar-water-pumps",
    name: "Solar Water Pumps",
    short: "Water Pumps",
    desc: "Submersible and surface pumps for irrigation, borewell and community water.",
    partners: ["Tata Power Solar"],
    icon: "droplet",
  },
  {
    slug: "solar-lighting",
    name: "Solar Lighting",
    short: "Lighting",
    desc: "Street-lighting systems and home lighting for limited or unreliable grid access.",
    partners: ["Luminous", "Waaree Energies"],
    icon: "lightbulb",
  },
  {
    slug: "bos-accessories",
    name: "BOS & Accessories",
    short: "BOS & Cables",
    desc: "Mounting structures, cables, MC4 connectors, charge controllers and junction boxes.",
    partners: [],
    icon: "plug",
  },
];

export const solutions = [
  {
    slug: "rooftop-solar",
    name: "Rooftop",
    desc: "Residential and commercial rooftop solar systems.",
    partners: ["Tata Power Solar", "Adani Solar", "Waaree Energies"],
  },
  {
    slug: "agriculture-irrigation",
    name: "Agriculture",
    desc: "Irrigation and borewell pumping with solar power.",
    partners: ["Tata Power Solar"],
  },
  {
    slug: "community-water-lighting",
    name: "Community",
    desc: "Community drinking-water and lighting schemes.",
    partners: ["Tata Power Solar", "Luminous"],
  },
  {
    slug: "utility-scale",
    name: "Utility Scale",
    desc: "Product supply for larger solar installations.",
    partners: ["Adani Solar", "Waaree Energies", "Tata Power Solar"],
  },
];

export const process = [
  {
    step: "01",
    title: "Source",
    desc: "Procure genuine products through established manufacturer and partner networks.",
  },
  {
    step: "02",
    title: "Receive",
    desc: "Coordinate receipt and organised handling of products for distribution.",
  },
  {
    step: "03",
    title: "Store",
    desc: "Maintain availability through a warehouse-based distribution model.",
  },
  {
    step: "04",
    title: "Supply",
    desc: "Dispatch to dealers, installers, retailers and institutional customers.",
  },
  {
    step: "05",
    title: "Support",
    desc: "Assist with warranty claims, technical queries and product servicing.",
  },
];

export const reasons = [
  {
    title: "7+ Years of Experience",
    desc: "Established track record in solar distribution and dealership across the region.",
  },
  {
    title: "Authorised Distributor",
    desc: "Genuine products from Adani Solar, Waaree Energies, Luminous, Microtek and Tata Power Solar, with manufacturer warranty support.",
  },
  {
    title: "Strong Local Network",
    desc: "Practical understanding of Guwahati and the Northeast Indian market, logistics and customer needs.",
  },
  {
    title: "Reliable CNF & Distribution",
    desc: "Carrying, forwarding and distribution focused on consistent stock availability.",
  },
  {
    title: "Competitive Pricing",
    desc: "Distributor-level commercial support for channel partners and customers.",
  },
  {
    title: "After-Sales Support",
    desc: "Coordination for warranty claims, technical queries and product servicing.",
  },
];

export const capabilities = [
  { title: "CNF Operations", desc: "Carrying and forwarding with emphasis on movement, availability and regional supply." },
  { title: "Authorised Distribution", desc: "Channel distribution of recognised solar and power brands." },
  { title: "Dealer Network Support", desc: "Commercial and supply coordination for dealers and installers." },
  { title: "Product Breadth", desc: "PV modules, inverters, batteries, pumps, lighting, BOS and accessories." },
  { title: "Regional Market Knowledge", desc: "Guwahati and Northeast logistics, channels and customer needs." },
  { title: "After-Sales Coordination", desc: "Warranty claims, technical queries and product servicing." },
  { title: "Competitive Channel Pricing", desc: "Distributor-level pricing support for partners and customers." },
  { title: "Institutional Supply", desc: "Product coordination for institutional and project-oriented requirements." },
];

export const segments = [
  { title: "Dealers", desc: "Channel partners" },
  { title: "Installers", desc: "Solar EPC / installation" },
  { title: "Retailers", desc: "Regional sales network" },
  { title: "End Users", desc: "Residential / commercial" },
];

export const gallery = [
  {
    src: "/images/gallery/rooftop-installation.jpg",
    alt: "Rooftop solar installation environment",
  },
  {
    src: "/images/gallery/elevated-rooftop.jpg",
    alt: "Elevated rooftop solar installation",
  },
  {
    src: "/images/gallery/residential-rooftop.webp",
    alt: "Solar PV array and mounting application",
  },
  {
    src: "/images/gallery/solar-water-pump.png",
    alt: "Solar-powered water pump for agricultural irrigation",
  },
];

export const values = [
  {
    title: "Vision",
    desc: "To be the Northeast's most trusted name in solar distribution, driving the region's transition to clean, affordable and reliable energy.",
  },
  {
    title: "Mission",
    desc: "To deliver genuine, high-performance solar products and dependable service to every dealer, installer and customer, at fair and competitive prices.",
  },
  {
    title: "Promise",
    desc: "Genuine products, dependable logistics, transparent channel support and responsive after-sales coordination.",
  },
];
