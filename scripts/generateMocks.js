const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, '../src/data/mockData.ts');

// Since we can't easily parse TS directly, we will do a regex-based read/write,
// OR since it's just exported arrays, it might be better to just generate a brand new mockData.ts file
// containing 50 of each, reusing the type definitions and structure.

// Wait, doing it via a JS script that outputs a TS file is easiest.
// Let's generate a full TS file with 50 items each.

const ZONES = [
  "Centro", "Macrocentro", "Güemes", "Playa Grande", "Punta Mogotes", 
  "Puerto", "Constitución", "La Perla", "Chauvín", "San Juan", "San José"
];

const CATEGORIES_PROD = [
  "Tecnología y celulares", "Electrodomésticos", "Hogar y muebles", 
  "Herramientas y construcción", "Indumentaria y accesorios", 
  "Bebés, niños y juguetes", "Bicicletas y movilidad"
];

const CATEGORIES_SERV = [
  "Mantenimiento y Reparación", "Servicios Profesionales", "Salud y Bienestar",
  "Clases y Capacitación", "Eventos y Fiestas"
];

const MOCK_PROFESSIONALS = [];
for(let i=1; i<=50; i++) {
  const isGasista = i % 3 === 0;
  const isElectricista = i % 3 === 1;
  const isPlomero = i % 3 === 2;
  
  let profession = isGasista ? "Gasista matriculado" : isElectricista ? "Electricista domiciliario" : "Plomero instalador";
  let cat = "Mantenimiento y Reparación";
  
  MOCK_PROFESSIONALS.push(`{
    id: "prof-${i}",
    slug: "profesional-${i}",
    name: "Profesional ${i}",
    profession: "${profession}",
    category: "${cat}",
    subcategories: ["Reparaciones"],
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prof${i}",
    headline: "Especialista con más de ${5 + (i % 15)} años de experiencia.",
    bio: "Brindo un servicio de calidad y garantizado en Mar del Plata. Presupuestos sin cargo.",
    verified: ${i % 2 === 0},
    featured: ${i % 5 === 0},
    rating: { average: ${(4 + (i % 10) / 10).toFixed(1)}, totalReviews: ${10 + i * 3} },
    stats: { completedJobs: ${50 + i * 5}, responseTime: "1h", onTimeRate: 98 },
    priceFrom: ${15000 + (i % 5) * 5000},
    zones: ["${ZONES[i % ZONES.length]}", "${ZONES[(i + 1) % ZONES.length]}"],
    services: ["Visita técnica", "Presupuesto"],
    credentials: [],
    experience: {
      totalYears: ${5 + (i % 15)},
      workHistory: []
    },
    availability: [],
    imagePrompts: {
      main: "Retrato profesional realista de ${profession} argentino de 40 años, ropa de trabajo limpia, fondo desenfocado, mirada amable, luz natural, estilo perfil premium, 4K, relación 1:1."
    }
  }`);
}

const MOCK_SERVICES = [];
for(let i=1; i<=50; i++) {
  MOCK_SERVICES.push(`{
    id: "serv-${i}",
    slug: "servicio-${i}",
    title: "Servicio de Reparación e Instalación ${i}",
    category: "Mantenimiento y Reparación",
    subcategory: "General",
    professionalId: "prof-${i}",
    professionalName: "Profesional ${i}",
    image: "https://images.unsplash.com/photo-${1581244277943 + i}-fe4a9c777189?q=80&w=600&auto=format&fit=crop",
    priceType: "Desde",
    priceFrom: ${10000 + (i % 10) * 2000},
    estimatedDuration: "2 horas",
    description: "Servicio profesional en Mar del Plata. Atención rápida y garantizada.",
    includes: ["Mano de obra", "Diagnóstico"],
    zones: ["${ZONES[i % ZONES.length]}"],
    availability: "${i % 3 === 0 ? 'Hoy' : 'Esta semana'}",
    verified: ${i % 2 === 0},
    protectedBooking: true,
    rating: ${(4 + (i % 10) / 10).toFixed(1)},
    responseTime: "1 hora",
    imagePrompts: {
      main: "Foto realista editorial para marketplace. Profesional realizando trabajo de mantenimiento, herramientas, luz natural, 4K, relación 4:3."
    }
  }`);
}

const MOCK_PRODUCTS = [];
for(let i=1; i<=50; i++) {
  const cat = CATEGORIES_PROD[i % CATEGORIES_PROD.length];
  MOCK_PRODUCTS.push(`{
    id: "prod-${i}",
    slug: "producto-${i}",
    title: "Producto Premium de ${cat} ${i}",
    description: "Excelente producto disponible en Mar del Plata. Nuevo en caja sellada con garantía.",
    price: ${25000 + (i % 20) * 5000},
    oldPrice: ${i % 4 === 0 ? 35000 + (i % 20) * 5000 : 'undefined'},
    discount: ${i % 4 === 0 ? 15 : 'undefined'},
    category: "${cat}",
    subcategory: "General",
    condition: "${i % 5 === 0 ? 'Usado como nuevo' : 'Nuevo'}",
    brand: "Marca ${i}",
    model: "Modelo ${i}",
    images: ["https://picsum.photos/seed/prod${i}/800/600"],
    zone: "${ZONES[i % ZONES.length]}",
    sellerId: "seller-${i}",
    sellerName: "Vendedor ${i}",
    sellerType: "${i % 3 === 0 ? 'Comercio' : 'Particular'}",
    sellerVerified: ${i % 2 === 0},
    sellerRating: ${(4.0 + (i % 10) / 10).toFixed(1)},
    sellerSales: ${10 + i * 2},
    featured: ${i % 8 === 0},
    mdpDelivery: { available: true, cost: 1500, timeFrame: "Hoy" },
    protectedPayment: true,
    stock: 5,
    attributes: {},
    imagePrompts: {
      main: "Foto realista de producto de ${cat} en ambiente moderno, luz suave, 4K, estilo ecommerce, relación 4:3.",
      side: "Foto lateral realista del producto.",
      detail: "Detalle macro realista del producto.",
      context: "Producto en uso cotidiano."
    }
  }`);
}

const output = \`
import { Category, Product, Service, Professional } from "@/types";

export const ZONES = [
  "Centro", "Macrocentro", "Güemes", "Playa Grande", "Punta Mogotes", 
  "Puerto", "Constitución", "La Perla", "Chauvín", "San Juan", "San José",
  "Punta Iglesia", "Varese", "Plaza Colón", "Terminal", "Stella Maris"
];

export const CATEGORIES = [
  { id: "c1", name: "Tecnología y celulares", slug: "tecnologia", icon: "Laptop", type: "producto" },
  { id: "c2", name: "Electrodomésticos", slug: "electrodomesticos", icon: "Tv", type: "producto" },
  { id: "c3", name: "Hogar y muebles", slug: "hogar", icon: "Sofa", type: "producto" },
  { id: "c4", name: "Herramientas y construcción", slug: "herramientas", icon: "Hammer", type: "producto" },
  { id: "c5", name: "Indumentaria y accesorios", slug: "indumentaria", icon: "Shirt", type: "producto" },
  { id: "c6", name: "Bebés, niños y juguetes", slug: "bebes", icon: "Baby", type: "producto" },
  { id: "c7", name: "Bicicletas y movilidad", slug: "movilidad", icon: "Bike", type: "producto" },
  { id: "s1", name: "Mantenimiento y Reparación", slug: "mantenimiento", icon: "Wrench", type: "servicio" },
  { id: "s2", name: "Servicios Profesionales", slug: "profesionales", icon: "Briefcase", type: "servicio" },
  { id: "s3", name: "Salud y Bienestar", slug: "salud", icon: "Heart", type: "servicio" }
];

export const MOCK_PROFESSIONALS: Professional[] = [
  ${MOCK_PROFESSIONALS.join(',\n  ')}
];

export const MOCK_SERVICES: Service[] = [
  ${MOCK_SERVICES.join(',\n  ')}
];

export const MOCK_PRODUCTS: Product[] = [
  ${MOCK_PRODUCTS.join(',\n  ')}
];
\`;

fs.writeFileSync(mockDataPath, output);
console.log("Mock data generated with 50 items each!");
