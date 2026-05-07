import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadAndUpdate() {
  const [slug, type, filePath] = process.argv.slice(2);

  if (!slug || !type || !filePath) {
    console.error("Usage: node scripts/upload-and-update.mjs <slug> <type> <filePath>");
    process.exit(1);
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `products/${slug}/${type}.webp`;

    // 1. Upload to Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, fileBuffer, {
        contentType: "image/webp",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${fileName}`;
    console.log(`Uploaded: ${publicUrl}`);

    // 2. Fetch current images
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("id, images")
      .eq("slug", slug)
      .single();

    if (fetchError) throw fetchError;

    const newImages = { 
      ...(typeof product.images === 'object' ? product.images : {}),
      [type]: publicUrl 
    };
    
    // Ensure gallery is updated too
    if (!newImages.gallery) newImages.gallery = [];
    if (!newImages.gallery.includes(publicUrl)) {
        newImages.gallery.push(publicUrl);
    }

    // 3. Update Product
    const { error: updateError } = await supabase
      .from("products")
      .update({
        images: newImages,
        metadata: { imagesMode: "realistic_generated" }
      })
      .eq("id", product.id);

    if (updateError) throw updateError;

    console.log(`Updated product ${slug} with ${type} image.`);
  } catch (err) {
    console.error("Operation failed:", err);
    process.exit(1);
  }
}

uploadAndUpdate();
