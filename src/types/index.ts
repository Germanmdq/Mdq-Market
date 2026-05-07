export type Category = {
  id: string;
  name: string;
  slug: string;
  type: "producto" | "servicio" | "mixto";
  description?: string;
  icon: string;
  image?: string;
  featured?: boolean;
  subcategories?: Subcategory[];
};

export type Subcategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentCategoryId: string;
};

export type Question = {
  id: string;
  userId: string;
  userName: string;
  question: string;
  answer?: string;
  createdAt: string;
};

export type Review = {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Product = {
  id: string;
  title: string;
  slug: string;
  category: string;
  subcategory: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  sku?: string;
  gtin?: string;
  description: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerVerified: boolean;
  sellerType?: "Particular" | "Emprendedor" | "Comercio";
  sellerSales?: number;
  sellerResponseTime?: string;
  sellerActiveProducts?: number;
  sellerMemberSince?: string;
  zone: string;
  condition: "Nuevo" | "Usado como nuevo" | "Usado bueno" | "Usado con detalles" | "Reacondicionado";
  conditionDescription?: string;
  status: "Disponible" | "Reservado" | "Vendido" | "Pausado" | "En revisión";
  stock: number;
  featured: boolean;
  protectedPayment: true;
  mdpDelivery: {
    available: true;
    fee: number;
    estimatedTime: string;
  };
  attributes?: { label: string; value: string }[];
  includedItems?: string[];
  notIncludedItems?: string[];
  warranty?: string;
  views: number;
  favorites: number;
  questions?: Question[];
  sellerReviews?: Review[];
  createdAt: string;
  imagePrompts?: {
    main: string;
    side: string;
    detail: string;
    context: string;
  };
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  category: string;
  subcategory: string;
  professionalId: string;
  professionalName: string;
  businessName?: string;
  specialty: string;
  priceType?: "Fijo" | "Desde" | "Por hora" | "A presupuestar";
  priceFrom: number;
  estimatedDuration?: string;
  diagnosisFee?: number;
  hourlyRate?: number;
  paymentMethods?: string[];
  advancePaymentPercentage?: number;
  description: string;
  image: string;
  gallery: string[];
  includes?: string[];
  notIncludes?: string[];
  checklist?: string[];
  exclusions?: string[];
  rating: number;
  reviews: number;
  verified: boolean;
  license?: string;
  licenseAuthority?: string;
  zones: string[];
  availability: "Hoy" | "Esta semana" | "Próxima semana" | "Alta demanda" | "No disponible";
  schedule?: string;
  featured: boolean;
  protectedBooking: true;
  directBooking?: boolean;
  requiresQuote?: boolean;
  urgentAvailable?: boolean;
  responseTime: string;
  completedJobs: number;
  imagePrompts?: {
    main: string;
  };
};

export type Professional = {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  avatarPrompt?: string;
  profession: string;
  category: string;
  subcategories: string[];
  headline: string;
  bio: string;
  coverImage?: string;
  verified: boolean;
  featured: boolean;
  license?: {
    type: string;
    number: string;
    status: "Activa" | "Pendiente" | "Vencida" | "No aplica";
  };
  rating: {
    average: number;
    totalReviews: number;
    punctuality: number;
    quality: number;
    communication: number;
    value: number;
  };
  stats: {
    completedJobs: number;
    repeatClients: number;
    responseTime: string;
    memberSince: string;
  };
  zones: string[];
  services: string[]; // IDs or titles of services
  priceFrom: number;
  availability: string;
  faq: string[];
  imagePrompts?: {
    main: string;
  };
};

export type Seller = {
  id: string;
  name: string;
  slug: string;
  avatar: string;
  type: "Particular" | "Emprendedor" | "Comercio";
  verified: boolean;
  rating: number;
  reviews: number;
  zone: string;
  totalSales: number;
  activeProducts: number;
  memberSince: string;
  featured: boolean;
};

// ═══════════════════════════════════════════════════════
// ENTREGA MDP — Modelo de datos único de entrega
// ═══════════════════════════════════════════════════════
export type Delivery = {
  id: string;
  operationId: string;
  productId: string;
  sellerId: string;
  buyerId: string;
  sellerZone: string;
  buyerAddress: string;
  buyerZone: string;
  deliveryFee: number;
  status:
    | "Pendiente"
    | "Coordinada"
    | "Producto preparado"
    | "En camino"
    | "Entregada"
    | "Confirmada"
    | "Con problema"
    | "Cancelada";
  confirmationCode: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
};

export type ServiceRequest = {
  id: string;
  clientId: string;
  problemDescription: string;
  urgency: "Presupuesto" | "En la semana" | "Emergencia 24hs";
  location: string;
  multimedia: string[];
  status: "Pendiente" | "Presupuestado" | "En curso" | "Finalizado";
  createdAt: string;
};

export type OperationTimelineItem = {
  status: string;
  timestamp: string;
  description: string;
};

export type Operation = {
  id: string;
  type: "Producto" | "Servicio";
  itemId: string;
  itemName: string;
  itemImage: string;
  buyerId: string;
  sellerOrProfessionalId: string;
  sellerOrProfessionalName: string;
  amount: number;
  deliveryFee: number;
  platformFee: number;
  status:
    | "Pago pendiente"
    | "Pago aprobado"
    | "Pago protegido"
    | "Vendedor notificado"
    | "Producto en preparación"
    | "Entrega coordinada"
    | "En camino"
    | "Entregado"
    | "Recepción confirmada"
    | "Pago liberado"
    | "En disputa"
    | "Reembolsado"
    | "Cancelado";
  timeline: OperationTimelineItem[];
  delivery?: Delivery;
  createdAt: string;
};

export type Dispute = {
  id: string;
  operationId: string;
  reason:
    | "No recibí el producto"
    | "Producto dañado"
    | "Producto no coincide con la publicación"
    | "Faltan accesorios"
    | "El vendedor canceló"
    | "Profesional no asistió"
    | "Servicio incompleto"
    | "Otro";
  status:
    | "Abierto"
    | "Esperando evidencia"
    | "En revisión"
    | "En mediación"
    | "Resuelto"
    | "Reembolso aprobado"
    | "Cerrado";
  description: string;
  evidenceImages: string[];
  createdAt: string;
};

export type UserRole = "comprador" | "vendedor" | "profesional" | "admin";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  memberSince: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type PortfolioItem = {
  id: string;
  image: string;
  title: string;
  description: string;
  zone: string;
  date: string;
  category: string;
  verified: boolean;
};

export type ProfessionalService = {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  priceType: "Fijo" | "Desde" | "Por hora" | "A presupuestar";
  priceFrom: number;
  estimatedDuration: string;
  directBooking: boolean;
  requiresQuote: boolean;
  urgentAvailable: boolean;
  protectedBooking: true;
};

export type ProfessionalReview = {
  id: string;
  userName: string;
  rating: number;
  date: string;
  serviceName: string;
  comment: string;
  professionalResponse?: string;
  verified: boolean;
};

export type AvailabilitySlot = {
  day: string;
  slots: string[];
};

export type ProfessionalDetail = {
  id: string;
  slug: string;
  name: string;
  avatar: string;
  avatarPrompt?: string;
  coverImage?: string;
  profession: string;
  category?: string;
  subcategories?: string[];
  headline: string;
  bio: string;
  verified: boolean;
  featured: boolean;
  license?: {
    type: string;
    number: string;
    status: "Activa" | "Pendiente" | "Vencida" | "No aplica";
    verifiedAt?: string;
  };
  rating: {
    average: number;
    totalReviews: number;
    punctuality: number;
    quality: number;
    communication: number;
    value: number;
  };
  stats: {
    completedJobs: number;
    repeatClients: number;
    responseTime: string;
    memberSince: string;
  };
  zones: string[];
  availability: string | {
    nextAvailable: string;
    schedule: AvailabilitySlot[];
  };
  services: string[] | ProfessionalService[];
  priceFrom?: number;
  portfolio: PortfolioItem[];
  reviews: ProfessionalReview[];
  faq: string[] | FAQItem[];
  verification: {
    identity: boolean;
    phone: boolean;
    email: boolean;
    documents: boolean;
    license: boolean;
  };
};

export type Booking = {
  id: string;
  professionalId: string;
  clientId: string;
  serviceId: string;
  date: string;
  time: string;
  address: string;
  zone: string;
  description: string;
  images?: string[];
  amount: number;
  platformFee: number;
  status:
    | "Reserva creada"
    | "Pago protegido"
    | "Esperando confirmación del profesional"
    | "Turno confirmado"
    | "Profesional en camino"
    | "Servicio en curso"
    | "Servicio realizado"
    | "Confirmación pendiente"
    | "Finalizado"
    | "Pago liberado"
    | "En reclamo"
    | "Reembolsado"
    | "Cancelado";
  createdAt: string;
};

export type QuoteRequest = {
  id: string;
  professionalId: string;
  clientId: string;
  category: string;
  description: string;
  images?: string[];
  zone: string;
  preferredDate?: string;
  urgency: "Hoy" | "Esta semana" | "Flexible";
  status:
    | "Solicitud enviada"
    | "Profesional revisando"
    | "Presupuesto enviado"
    | "Presupuesto aceptado"
    | "Presupuesto rechazado"
    | "Reserva pendiente"
    | "Reserva pagada";
  quotedAmount?: number;
  createdAt: string;
};
