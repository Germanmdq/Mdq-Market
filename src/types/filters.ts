export type ProductFilterState = {
  categories: string[];
  subcategories: string[];
  zones: string[];
  conditions: string[];
  sellerTypes: string[];
  minPrice?: number;
  maxPrice?: number;
  verifiedOnly: boolean;
  deliveryOnly: boolean;
  protectedPaymentOnly: boolean;
  offersOnly: boolean;
  featuredOnly: boolean;
  query?: string;
};
