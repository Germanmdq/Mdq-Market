export type CategoryLike = {
  slug: string;
  level?: number | null;
  parent_id?: string | null;
  path_slugs?: string[] | null;
  is_root?: boolean | null;
  name?: string | null;
};

export function getCategoryHref(category: CategoryLike) {
  const rootSlug =
    Array.isArray(category.path_slugs) && category.path_slugs.length > 0
      ? category.path_slugs[0]
      : category.slug;

  if (rootSlug === "servicios") {
    return category.level === 1 || category.is_root === true
      ? "/servicios"
      : `/servicios?category=${encodeURIComponent(category.slug)}`;
  }

  if (rootSlug === "profesionales") {
    return category.level === 1 || category.is_root === true
      ? "/profesionales"
      : `/profesionales?category=${encodeURIComponent(category.slug)}`;
  }

  return category.level === 1 || category.is_root === true
    ? `/productos?category=${encodeURIComponent(category.slug)}`
    : `/productos?subcategory=${encodeURIComponent(category.slug)}`;
}

