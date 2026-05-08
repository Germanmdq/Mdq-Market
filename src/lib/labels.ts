const CONDITION_LABELS: Record<string, string> = {
  new: "Nuevo",
  used_like_new: "Usado como nuevo",
  used_good: "Usado en buen estado",
  used_with_details: "Usado con detalles",
  refurbished: "Reacondicionado",
};

export function toTitleLabel(value?: string | null) {
  if (!value) return "";
  const mapped = CONDITION_LABELS[value];
  if (mapped) return mapped;

  return value
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function tagHref(tag: string) {
  return `/productos?q=${encodeURIComponent(tag)}`;
}
