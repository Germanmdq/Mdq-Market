import { createClient } from "@supabase/supabase-js";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

function countProducts(products, categoryId) {
  return products.reduce((total, product) => {
    const matchesCategory = product.category_id === categoryId;
    const matchesSubcategory = product.subcategory_id === categoryId;
    return total + (matchesCategory || matchesSubcategory ? 1 : 0);
  }, 0);
}

function buildProductTree(categories, products) {
  const map = new Map();
  const roots = [];
  const productCategories = categories.filter((category) => !["servicios", "profesionales"].includes(category.slug));

  for (const category of productCategories) {
    map.set(category.id, {
      name: category.name,
      slug: category.slug,
      type: "products",
      href: `/productos?${category.is_root ? "category" : "subcategory"}=${category.slug}`,
      productCount: countProducts(products, category.id),
      showInMenu: Boolean(category.show_in_menu),
      isActive: Boolean(category.is_active),
      isRoot: Boolean(category.is_root),
      children: [],
    });
  }

  for (const category of productCategories) {
    const node = map.get(category.id);
    const parent = category.parent_id ? map.get(category.parent_id) : null;
    if (parent) parent.children.push(node);
    else if (category.is_root) roots.push(node);
  }

  const addDescendantCounts = (node) => {
    const childTotal = node.children.reduce((total, child) => total + addDescendantCounts(child), 0);
    node.productCount += childTotal;
    node.children.sort((a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name));
    return node.productCount;
  };

  roots.forEach(addDescendantCounts);
  roots.sort((a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name));
  return roots;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "y")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildServiceRoutes(services) {
  const counts = new Map();
  for (const service of services) {
    if (service.category) counts.set(service.category, (counts.get(service.category) ?? 0) + 1);
    if (service.subcategory) counts.set(service.subcategory, (counts.get(service.subcategory) ?? 0) + 1);
  }

  return {
    name: "Servicios",
    slug: "servicios",
    type: "services",
    href: "/servicios",
    productCount: services.length,
    showInMenu: true,
    children: Array.from(counts.entries())
      .map(([name, count]) => ({
        name,
        slug: slugify(name),
        type: "services",
        href: `/servicios?category=${slugify(name)}`,
        productCount: count,
        showInMenu: count > 0,
        children: [],
      }))
      .sort((a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name)),
  };
}

function buildProfessionalRoutes(professionals) {
  const counts = new Map();
  for (const professional of professionals) {
    if (professional.category) counts.set(professional.category, (counts.get(professional.category) ?? 0) + 1);
    for (const subcategory of professional.subcategories ?? []) {
      counts.set(subcategory, (counts.get(subcategory) ?? 0) + 1);
    }
  }

  return {
    name: "Profesionales",
    slug: "profesionales",
    type: "professionals",
    href: "/profesionales",
    productCount: professionals.length,
    showInMenu: true,
    children: Array.from(counts.entries())
      .map(([name, count]) => ({
        name,
        slug: slugify(name),
        type: "professionals",
        href: `/profesionales?category=${slugify(name)}`,
        productCount: count,
        showInMenu: count > 0,
        children: [],
      }))
      .sort((a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name)),
  };
}

function toMarkdown(routes) {
  const lines = [
    "# MDP Market - Mapa de categorias",
    "",
    "Reglas de rutas:",
    "- Categoria raiz productos: `/productos?category=[rootSlug]`",
    "- Subcategoria productos: `/productos?subcategory=[childSlug]`",
    "- Servicios: `/servicios`",
    "- Categoria servicios: `/servicios?category=[childSlug]`",
    "- Profesionales: `/profesionales`",
    "- Categoria profesionales: `/profesionales?category=[childSlug]`",
    "",
    "## Productos",
    "",
  ];

  for (const root of routes.filter((route) => route.type === "products")) {
    lines.push(`## ${root.name}`);
    lines.push(`Ruta: ${root.href}`);
    lines.push(`Slug: ${root.slug}`);
    lines.push(`Productos: ${root.productCount}`);
    lines.push(`show_in_menu: ${root.showInMenu}`);
    lines.push("");

    for (const child of root.children) {
      lines.push(`### ${child.name}`);
      lines.push(`Ruta: ${child.href}`);
      lines.push(`Slug: ${child.slug}`);
      lines.push(`Productos: ${child.productCount}`);
      lines.push(`show_in_menu: ${child.showInMenu}`);
      lines.push("");
    }

    lines.push("---");
    lines.push("");
  }

  const services = routes.find((route) => route.type === "services");
  lines.push("## Servicios");
  lines.push("Ruta: /servicios");
  lines.push(`Publicaciones: ${services?.productCount ?? 0}`);
  lines.push("");
  for (const child of services?.children ?? []) {
    lines.push(`### ${child.name}`);
    lines.push(`Ruta: ${child.href}`);
    lines.push(`Publicaciones: ${child.productCount}`);
    lines.push("");
  }
  lines.push("");

  const professionals = routes.find((route) => route.type === "professionals");
  lines.push("## Profesionales");
  lines.push("Ruta: /profesionales");
  lines.push(`Publicaciones: ${professionals?.productCount ?? 0}`);
  lines.push("");
  for (const child of professionals?.children ?? []) {
    lines.push(`### ${child.name}`);
    lines.push(`Ruta: ${child.href}`);
    lines.push(`Publicaciones: ${child.productCount}`);
    lines.push("");
  }
  lines.push("");

  return `${lines.join("\n")}\n`;
}

const [
  { data: categories, error: categoriesError },
  { data: products, error: productsError },
  { data: services, error: servicesError },
  { data: professionals, error: professionalsError },
] = await Promise.all([
  supabase
    .from("categories")
    .select("id, name, slug, parent_id, is_root, is_active, show_in_menu")
    .eq("is_active", true)
    .order("level", { ascending: true })
    .order("name", { ascending: true }),
  supabase
    .from("products")
    .select("id, category_id, subcategory_id")
    .eq("status", "published")
    .limit(5000),
  supabase
    .from("services")
    .select("id, category, subcategory")
    .eq("status", "published")
    .limit(5000),
  supabase
    .from("professionals")
    .select("id, category, subcategories")
    .limit(5000),
]);

if (categoriesError) {
  console.error("Error reading categories:", categoriesError.message);
  process.exit(1);
}

if (productsError) {
  console.error("Error reading products:", productsError.message);
  process.exit(1);
}

if (servicesError) {
  console.error("Error reading services:", servicesError.message);
  process.exit(1);
}

if (professionalsError) {
  console.error("Error reading professionals:", professionalsError.message);
  process.exit(1);
}

const routes = [
  ...buildProductTree(categories ?? [], products ?? []),
  buildServiceRoutes(services ?? []),
  buildProfessionalRoutes(professionals ?? []),
];
const artifactDir = path.join(process.cwd(), "artifacts");

await mkdir(artifactDir, { recursive: true });
await writeFile(path.join(artifactDir, "category-routes.json"), `${JSON.stringify(routes, null, 2)}\n`, "utf8");
await writeFile(path.join(artifactDir, "category-routes.md"), toMarkdown(routes), "utf8");

console.log(`Exported ${routes.length} root categories to artifacts/category-routes.json and artifacts/category-routes.md`);
