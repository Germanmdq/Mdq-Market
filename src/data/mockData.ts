import { Category, Product, Service, Professional, UserProfile, ProfessionalDetail } from "@/types";

export const ZONES = [
  "Centro", "Güemes", "La Perla", "Constitución", "Puerto", 
  "Punta Mogotes", "Playa Grande", "Parque Luro", "San José", 
  "Los Troncos", "Colinas de Peralta Ramos", "Batán", 
  "Sierra de los Padres", "Faro Norte", "Playa Serena", 
  "Mogotes Sur", "Chauvín", "Alfar", "Regional", "Perla Norte"
];

export const CATEGORIES: Category[] = [
  { id: "cat-1", name: "Tecnología y celulares", slug: "tecnologia-y-celulares", type: "producto", description: "Smartphones, tablets y accesorios.", icon: "Smartphone", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9", featured: true, subcategories: [] },
  { id: "cat-2", name: "Electrodomésticos", slug: "electrodomesticos", type: "producto", description: "Línea blanca y pequeños electrodomésticos.", icon: "Tv", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a", featured: true, subcategories: [] },
  { id: "cat-3", name: "Hogar y muebles", slug: "hogar-y-muebles", type: "producto", description: "Muebles y equipamiento para el hogar.", icon: "Armchair", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc", featured: true, subcategories: [] },
  { id: "cat-4", name: "Herramientas y construcción", slug: "herramientas-y-construccion", type: "producto", description: "Herramientas eléctricas y manuales.", icon: "Hammer", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd", featured: true, subcategories: [] },
  { id: "cat-5", name: "Indumentaria y accesorios", slug: "indumentaria-y-accesorios", type: "producto", description: "Moda y complementos.", icon: "Shirt", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8", featured: true, subcategories: [] },
  { id: "cat-6", name: "Bebés, niños y juguetes", slug: "bebes-ninos-y-juguetes", type: "producto", description: "Todo para los más chicos.", icon: "Baby", image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6", featured: false, subcategories: [] },
  { id: "cat-7", name: "Bicicletas y movilidad", slug: "bicicletas-y-movilidad", type: "producto", description: "Bicis, monopatines y movilidad eléctrica.", icon: "Bike", image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e", featured: false, subcategories: [] },
  { id: "cat-8", name: "Emprendedores locales", slug: "emprendedores-locales", type: "producto", description: "Productos artesanales de MDP.", icon: "Sparkles", image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca", featured: true, subcategories: [] },
  { id: "cat-9", name: "Comercios locales", slug: "comercios-locales", type: "producto", description: "Locales de cercanía.", icon: "Store", image: "https://images.unsplash.com/photo-1534723452862-4c874e70d6f3", featured: false, subcategories: [] },
  { id: "cat-10", name: "Decoración y jardín", slug: "decoracion-y-jardin", type: "producto", description: "Ambientación y exteriores.", icon: "Flower2", image: "https://images.unsplash.com/photo-1459156212016-c812468e2115", featured: false, subcategories: [] },
  { id: "cat-11", name: "Plomería y gas", slug: "plomeria-y-gas", type: "servicio", description: "Gasistas y plomeros matriculados.", icon: "Droplets", image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189", featured: true, subcategories: [] },
  { id: "cat-12", name: "Electricidad y seguridad", slug: "electricidad-y-security", type: "servicio", description: "Instalaciones y alarmas.", icon: "Zap", image: "https://images.unsplash.com/photo-1621905252507-b354bcadcabc", featured: true, subcategories: [] },
  { id: "cat-13", name: "Climatización y refrigeración", slug: "climatizacion-y-refrigeracion", type: "servicio", description: "Aires acondicionados y heladeras.", icon: "Snowflake", image: "https://images.unsplash.com/photo-1563453392212-326f5e854473", featured: false, subcategories: [] },
  { id: "cat-14", name: "Reparaciones y service", slug: "reparaciones-y-service", type: "servicio", description: "Mantenimiento de equipos.", icon: "Wrench", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837", featured: false, subcategories: [] },
  { id: "cat-15", name: "Construcción y mantenimiento", slug: "construccion-y-mantenimiento", type: "servicio", description: "Albañilería y pintura.", icon: "Construction", image: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5", featured: true, subcategories: [] },
  { id: "cat-16", name: "Legales, contables y gestión", slug: "legales-contables-y-gestion", type: "servicio", description: "Asesoramiento profesional.", icon: "Scale", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f", featured: false, subcategories: [] },
  { id: "cat-17", name: "Salud y bienestar", slug: "salud-y-bienestar", type: "servicio", description: "Psicología, nutrición y más.", icon: "HeartPulse", image: "https://images.unsplash.com/photo-1505751172107-573220a96500", featured: false, subcategories: [] },
  { id: "cat-18", name: "Educación y clases particulares", slug: "educacion-y-clases", type: "servicio", description: "Apoyo escolar e idiomas.", icon: "GraduationCap", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6", featured: false, subcategories: [] },
  { id: "cat-19", name: "Eventos, belleza y lifestyle", slug: "eventos-belleza-y-lifestyle", type: "servicio", description: "Estética y organización.", icon: "Scissors", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9", featured: false, subcategories: [] },
  { id: "cat-20", name: "Mascotas", slug: "mascotas", type: "servicio", description: "Cuidado y veterinaria.", icon: "Dog", image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7", featured: false, subcategories: [] },
];


// IMPORTS FROM NEW FILES
import { MOCK_PRODUCTS as IMPORTED_PRODUCTS } from "./mockProducts";
import { MOCK_SERVICES as IMPORTED_SERVICES } from "./mockServices";
import { MOCK_PROFESSIONALS_LIST } from "./mockProfessionals";

export const CURRENT_USER: UserProfile = {
  id: "user-1",
  name: "Martín Gómez",
  email: "martin.gomez@gmail.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Martin",
  role: "comprador",
  memberSince: "2024-01-15",
};

export const MOCK_PRODUCTS = IMPORTED_PRODUCTS;
export const MOCK_SERVICES = IMPORTED_SERVICES;
export const MOCK_PROFESSIONAL_DETAILS = MOCK_PROFESSIONALS_LIST;

// We construct MOCK_PROFESSIONALS to match the Professional type
export const MOCK_PROFESSIONALS: Professional[] = MOCK_PROFESSIONAL_DETAILS.map(p => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  avatar: p.avatar,
  avatarPrompt: p.avatarPrompt,
  profession: p.profession,
  category: p.category || "cat-11",
  subcategories: p.subcategories || [],
  headline: p.headline,
  bio: p.bio,
  verified: p.verified,
  featured: p.featured,
  license: p.license,
  rating: p.rating,
  stats: p.stats,
  zones: p.zones,
  services: p.services.map(s => typeof s === 'string' ? s : s.id),
  priceFrom: p.priceFrom || 0,
  availability: typeof p.availability === 'string' ? p.availability : p.availability.nextAvailable,
  faq: p.faq.map(f => typeof f === 'string' ? f : f.question)
}));
