-- Agregar columna para animaciones dotLottie en las categorías destacadas
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS animation_url text;