import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan variables de entorno de Supabase. Asegúrate de configurar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

// Cliente para uso general en el frontend (Browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Cliente Admin para uso exclusivo en el servidor (Server Actions / API Routes).
 * Posee privilegios de bypass de RLS.
 */
export const supabaseAdmin = () => {
  if (typeof window !== "undefined") {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY solo puede usarse en el servidor. No intentes usar supabaseAdmin en el cliente."
    );
  }

  if (!supabaseServiceRoleKey) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY. Configúrala en las variables de entorno del servidor."
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
