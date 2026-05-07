import { Product, Service, Professional } from "@/types";

export function uniqueById<T extends { id: string }>(items: T[]): T[] {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

// Keep a global or scoped registry to ensure uniqueness across sections
export class DataShuffler {
  private usedProductIds = new Set<string>();
  private usedServiceIds = new Set<string>();
  private usedProfessionalIds = new Set<string>();

  getDailyDeals(products: Product[], count: number = 10): Product[] {
    const deals = products.filter(p => p.discount || (p.oldPrice && p.oldPrice > p.price));
    return this.takeUniqueProducts(deals, count);
  }

  getFeaturedProducts(products: Product[], count: number = 10): Product[] {
    const featured = products.filter(p => p.featured);
    return this.takeUniqueProducts(featured, count);
  }

  getLastViewedProducts(products: Product[], count: number = 10): Product[] {
    // Mock random selection for "last viewed"
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return this.takeUniqueProducts(shuffled, count);
  }

  getProductsByCategory(products: Product[], category: string, count: number = 10): Product[] {
    const matches = products.filter(p => p.category === category);
    return this.takeUniqueProducts(matches, count);
  }

  getProductsBySellerType(products: Product[], sellerType: string, count: number = 10): Product[] {
    const matches = products.filter(p => p.sellerType === sellerType);
    return this.takeUniqueProducts(matches, count);
  }

  getServicesAvailableToday(services: Service[], count: number = 10): Service[] {
    const matches = services.filter(s => s.availability === "Hoy");
    return this.takeUniqueServices(matches, count);
  }

  getVerifiedProfessionals(professionals: Professional[], count: number = 10): Professional[] {
    const matches = professionals.filter(p => p.verified);
    return this.takeUniqueProfessionals(matches, count);
  }

  getRemainingProducts(products: Product[], count: number = 10): Product[] {
    return this.takeUniqueProducts(products, count);
  }

  private takeUniqueProducts(pool: Product[], count: number): Product[] {
    const result: Product[] = [];
    for (const p of pool) {
      if (!this.usedProductIds.has(p.id)) {
        result.push(p);
        this.usedProductIds.add(p.id);
        if (result.length >= count) break;
      }
    }
    return result;
  }

  private takeUniqueServices(pool: Service[], count: number): Service[] {
    const result: Service[] = [];
    for (const s of pool) {
      if (!this.usedServiceIds.has(s.id)) {
        result.push(s);
        this.usedServiceIds.add(s.id);
        if (result.length >= count) break;
      }
    }
    return result;
  }

  private takeUniqueProfessionals(pool: Professional[], count: number): Professional[] {
    const result: Professional[] = [];
    for (const p of pool) {
      if (!this.usedProfessionalIds.has(p.id)) {
        result.push(p);
        this.usedProfessionalIds.add(p.id);
        if (result.length >= count) break;
      }
    }
    return result;
  }
}
