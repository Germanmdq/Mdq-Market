-- Agregar columna de imagen si no existe
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS image_url text;

-- Asignar la ruta por defecto basándose en el slug
UPDATE public.categories SET image_url = '/category-art/' || slug || '.svg';