/**
 * Centralized Analytics System for MDP Market
 *
 * Ready to connect to GA4, Meta Pixel, or any analytics provider.
 * Currently logs to console in development for debugging.
 */

type AnalyticsEvent =
  | "view_home"
  | "search_submitted"
  | "category_opened"
  | "product_viewed"
  | "product_added_to_cart"
  | "checkout_started"
  | "delivery_slot_selected"
  | "operation_created"
  | "service_viewed"
  | "service_booked"
  | "professional_viewed"
  | "seller_publish_started"
  | "seller_product_created"
  | "filter_applied"
  | "page_changed";

interface EventData {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Core tracking function
 */
function track(event: AnalyticsEvent, data?: EventData) {
  // In development, log to console
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${event}`, data || {});
  }

  // Ready for GA4 integration
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", event, data);
  }

  // Ready for Meta Pixel
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("trackCustom", event, data);
  }

  // Add other analytics providers here
}

/**
 * Homepage tracking
 */
export function trackViewHome() {
  track("view_home");
}

/**
 * Search tracking
 */
export function trackSearch(query: string, resultsCount: number) {
  track("search_submitted", {
    query,
    results_count: resultsCount,
  });
}

/**
 * Category navigation
 */
export function trackCategoryOpened(categoryName: string, categorySlug: string) {
  track("category_opened", {
    category_name: categoryName,
    category_slug: categorySlug,
  });
}

/**
 * Product tracking
 */
export function trackProductViewed(product: {
  id: string;
  title: string;
  price: number;
  category?: string;
  seller_type?: string;
}) {
  track("product_viewed", {
    product_id: product.id,
    product_name: product.title,
    price: product.price,
    category: product.category,
    seller_type: product.seller_type,
  });
}

export function trackProductAddedToCart(product: {
  id: string;
  title: string;
  price: number;
  quantity: number;
}) {
  track("product_added_to_cart", {
    product_id: product.id,
    product_name: product.title,
    price: product.price,
    quantity: product.quantity,
  });
}

/**
 * Checkout flow tracking
 */
export function trackCheckoutStarted(value: number, itemCount: number) {
  track("checkout_started", {
    value,
    item_count: itemCount,
  });
}

export function trackDeliverySlotSelected(slot: string) {
  track("delivery_slot_selected", {
    delivery_slot: slot,
  });
}

export function trackOperationCreated(operationId: string, value: number) {
  track("operation_created", {
    operation_id: operationId,
    value,
  });
}

/**
 * Service tracking
 */
export function trackServiceViewed(service: {
  id: string;
  title: string;
  category?: string;
  priceFrom: number;
}) {
  track("service_viewed", {
    service_id: service.id,
    service_name: service.title,
    category: service.category,
    price_from: service.priceFrom,
  });
}

export function trackServiceBooked(service: {
  id: string;
  title: string;
  price: number;
  date: string;
}) {
  track("service_booked", {
    service_id: service.id,
    service_name: service.title,
    price: service.price,
    booking_date: service.date,
  });
}

/**
 * Professional tracking
 */
export function trackProfessionalViewed(professional: {
  id: string;
  name: string;
  profession?: string;
  verified?: boolean;
}) {
  track("professional_viewed", {
    professional_id: professional.id,
    professional_name: professional.name,
    profession: professional.profession,
    verified: professional.verified,
  });
}

/**
 * Seller tracking
 */
export function trackSellerPublishStarted() {
  track("seller_publish_started");
}

export function trackSellerProductCreated(productId: string, category: string) {
  track("seller_product_created", {
    product_id: productId,
    category,
  });
}

/**
 * Filter tracking (para entender qué filtros usan más)
 */
export function trackFilterApplied(filterType: string, filterValue: string | number) {
  track("filter_applied", {
    filter_type: filterType,
    filter_value: filterValue,
  });
}

/**
 * Pagination tracking
 */
export function trackPageChanged(page: number, totalPages: number) {
  track("page_changed", {
    page,
    total_pages: totalPages,
  });
}

/**
 * Conversion funnel helper
 * Tracks user journey through purchase funnel
 */
export function trackConversionStep(step: string, data?: EventData) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Conversion Funnel] Step: ${step}`, data || {});
  }
  // This can be enhanced to send to analytics
}
