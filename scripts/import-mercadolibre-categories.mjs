import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import dotenv from "dotenv";
import slugify from "slugify";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const MLA_CATEGORIES_URL = "https://api.mercadolibre.com/sites/MLA/categories";
const MLA_CATEGORY_DETAIL_URL = "https://api.mercadolibre.com/categories/";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  return res.json();
}

function generateSlug(name) {
  return slugify(name, { lower: true, strict: true });
}

async function importCategory(mlCategory, parent = null, level = 1) {
  console.log(`Processing: ${mlCategory.name} (Level ${level})`);

  const slug = generateSlug(mlCategory.name);
  const path = parent ? [...parent.path, mlCategory.name] : [mlCategory.name];
  const path_slugs = parent ? [...parent.path_slugs, slug] : [slug];

  const categoryData = {
    external_id: mlCategory.id,
    source: "mercadolibre_mla",
    name: mlCategory.name,
    slug: level === 1 ? slug : `${parent.slug}-${slug}`, // Ensure unique slugs for subcategories
    parent_external_id: parent?.external_id || null,
    level: level,
    path: path,
    path_slugs: path_slugs,
    is_root: level === 1,
    is_active: true,
    show_in_menu: true,
    sort_order: 0,
    metadata: {
      total_items_in_ml: mlCategory.total_items_in_this_category
    }
  };

  const { data, error } = await supabase
    .from("categories")
    .upsert(categoryData, { onConflict: "external_id" })
    .select()
    .single();

  if (error) {
    console.error(`Error upserting ${mlCategory.name}:`, error.message);
    return null;
  }

  // If it has children and we are below level 3, fetch children
  if (level < 3) {
    const detail = await fetchJson(`${MLA_CATEGORY_DETAIL_URL}${mlCategory.id}`);
    if (detail.children_categories && detail.children_categories.length > 0) {
      // Update children_count
      await supabase
        .from("categories")
        .update({ children_count: detail.children_categories.length })
        .eq("id", data.id);

      for (const child of detail.children_categories) {
        await importCategory(child, data, level + 1);
      }
    }
  }

  return data;
}

async function run() {
  console.log("Starting Mercado Libre Categories Import...");

  try {
    const rootCategories = await fetchJson(MLA_CATEGORIES_URL);
    console.log(`Found ${rootCategories.length} root categories.`);

    for (const root of rootCategories) {
      await importCategory(root);
    }

    // Second pass to link parent_id correctly
    console.log("Linking parent IDs...");
    const { data: allCategories } = await supabase.from("categories").select("id, external_id, parent_external_id");
    
    const idMap = new Map(allCategories.map(c => [c.external_id, c.id]));

    for (const cat of allCategories) {
      if (cat.parent_external_id) {
        const parentId = idMap.get(cat.parent_external_id);
        if (parentId) {
          await supabase
            .from("categories")
            .update({ parent_id: parentId })
            .eq("id", cat.id);
        }
      }
    }

    console.log("Import completed successfully!");
  } catch (error) {
    console.error("Import failed:", error);
  }
}

run();
