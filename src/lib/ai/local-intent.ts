export type IntentResult = {
  intent:
    | "search_product"
    | "search_service"
    | "search_professional"
    | "publish_product"
    | "offers"
    | "unknown";
  query: string;
  category?: string;
  subcategory?: string;
  maxPrice?: number;
  availableToday?: boolean;
  zone?: string;
  href: string;
};

const ZONES = ["Centro", "Güemes", "Guemes", "La Perla", "Puerto", "Constitución", "Constitucion", "Playa Grande"];

const SERVICE_TERMS = ["gasista", "plomero", "electricista", "limpieza", "cerrajero", "pintor", "jardinero", "albañil", "albanil", "pérdida", "perdida"];
const PROFESSIONAL_TERMS = ["abogado", "contador", "psicólogo", "psicologo", "arquitecto", "nutricionista", "kinesiólogo", "kinesiologo"];
const PRODUCT_TERMS = ["iphone", "notebook", "celular", "bici", "bicicleta", "heladera", "mueble", "sillon", "sillón", "mesa", "hidrolavadora"];

const CATEGORY_BY_TERM: Record<string, string> = {
  bici: "bicicletas-y-movilidad",
  bicicleta: "bicicletas-y-movilidad",
  notebook: "tecnologia-y-celulares",
  iphone: "tecnologia-y-celulares",
  celular: "tecnologia-y-celulares",
};

function normalize(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function extractMaxPrice(text: string) {
  const normalized = normalize(text).replace(/\./g, "");
  const match = normalized.match(/(?:hasta|max(?:imo)?|menos de)\s*\$?\s*([\d\s]+)(?:k|mil|m)?/);
  if (!match?.[1]) return undefined;

  const raw = Number(match[1].replace(/\s/g, ""));
  if (!Number.isFinite(raw)) return undefined;
  if (normalized.includes("mil") || normalized.includes(" k") || /\d+k/.test(normalized)) return raw * 1000;
  return raw;
}

function extractZone(text: string) {
  const normalized = normalize(text);
  const found = ZONES.find((zone) => normalized.includes(normalize(zone)));
  if (!found) return undefined;
  return found === "Guemes" ? "Güemes" : found === "Constitucion" ? "Constitución" : found;
}

function bestTerm(text: string, terms: string[]) {
  const normalized = normalize(text);
  return terms.find((term) => normalized.includes(normalize(term)));
}

function cleanQuery(text: string, term?: string) {
  if (term) return term === "bici" ? "bicicleta" : term;
  return text
    .replace(/quiero|necesito|busco|buscar|comprar|contratar|publicar|vender|vendo|para hoy|hoy|hasta|menos de|\$|[0-9.]+/gi, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .join(" ");
}

function buildHref(path: string, params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== false) search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}

export function interpretLocalIntent(input: string): IntentResult {
  const text = input.trim();
  const normalized = normalize(text);
  const maxPrice = extractMaxPrice(text);
  const availableToday = normalized.includes("hoy") || normalized.includes("urgente");
  const zone = extractZone(text);

  if (normalized.includes("oferta") || normalized.includes("descuento")) {
    return { intent: "offers", query: cleanQuery(text), zone, href: buildHref("/productos", { ofertas: true, zone }) };
  }

  const publishTerm = bestTerm(text, PRODUCT_TERMS);
  if (/(quiero\s+vender|publicar|vendo|vender)/i.test(normalized)) {
    const query = cleanQuery(text, publishTerm);
    return {
      intent: "publish_product",
      query,
      category: publishTerm ? CATEGORY_BY_TERM[publishTerm] : undefined,
      href: buildHref("/publicar", { intent: "vender", q: query, category: publishTerm ? CATEGORY_BY_TERM[publishTerm] : undefined }),
    };
  }

  const serviceTerm = bestTerm(text, SERVICE_TERMS);
  if (serviceTerm) {
    const query = cleanQuery(text, serviceTerm);
    return {
      intent: "search_service",
      query,
      availableToday,
      zone,
      href: buildHref("/servicios", { q: query, availableToday, zone }),
    };
  }

  const professionalTerm = bestTerm(text, PROFESSIONAL_TERMS);
  if (professionalTerm) {
    const query = cleanQuery(text, professionalTerm);
    return {
      intent: "search_professional",
      query,
      zone,
      href: buildHref("/profesionales", { q: query, zone }),
    };
  }

  const productTerm = bestTerm(text, PRODUCT_TERMS);
  if (productTerm || maxPrice) {
    const query = cleanQuery(text, productTerm);
    return {
      intent: "search_product",
      query,
      category: productTerm ? CATEGORY_BY_TERM[productTerm] : undefined,
      maxPrice,
      zone,
      href: buildHref("/productos", { q: query, maxPrice, zone }),
    };
  }

  const query = cleanQuery(text);
  return {
    intent: "unknown",
    query,
    href: buildHref("/buscar", { q: query || text }),
  };
}
