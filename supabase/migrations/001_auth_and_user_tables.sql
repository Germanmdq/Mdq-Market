-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  bio TEXT,
  location TEXT,
  verified BOOLEAN DEFAULT FALSE,
  seller_type TEXT CHECK (seller_type IN ('individual', 'entrepreneur', 'commerce')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
  professional_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT favorite_type CHECK (
    (product_id IS NOT NULL AND service_id IS NULL AND professional_id IS NULL) OR
    (product_id IS NULL AND service_id IS NOT NULL AND professional_id IS NULL) OR
    (product_id IS NULL AND service_id IS NULL AND professional_id IS NOT NULL)
  )
);

-- Enable RLS on favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Favorites policies
CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Create orders table (compras)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  buyer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  seller_id UUID,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT,
  delivery_address TEXT,
  delivery_zone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can insert own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update own orders"
  ON public.orders FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Create service_bookings table (reservas de servicios)
CREATE TABLE IF NOT EXISTS public.service_bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  professional_id UUID,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  booking_date DATE NOT NULL,
  booking_time TIME,
  total_amount DECIMAL(10, 2) NOT NULL,
  client_notes TEXT,
  professional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on service_bookings
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;

-- Service bookings policies
CREATE POLICY "Users can view own bookings"
  ON public.service_bookings FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = professional_id);

CREATE POLICY "Users can insert own bookings"
  ON public.service_bookings FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update own bookings"
  ON public.service_bookings FOR UPDATE
  USING (auth.uid() = client_id OR auth.uid() = professional_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER service_bookings_updated_at
  BEFORE UPDATE ON public.service_bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
