-- ==============================================================================
-- DIGITICK: SMART HOUSEHOLD SHOPPING MANAGEMENT PLATFORM
-- Supabase PostgreSQL Database Schema & Row Level Security (RLS) Setup
-- ==============================================================================

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Shopping Lists Table
CREATE TABLE IF NOT EXISTS public.shopping_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' NOT NULL, -- 'active', 'completed', 'archived'
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Shopping Items Table
CREATE TABLE IF NOT EXISTS public.shopping_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID NOT NULL REFERENCES public.shopping_lists(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    quantity NUMERIC(10, 2) DEFAULT 1.0 NOT NULL,
    unit VARCHAR(50) DEFAULT 'item' NOT NULL,
    category VARCHAR(100) DEFAULT 'Other' NOT NULL,
    notes TEXT,
    is_purchased BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Scanned Documents Table
CREATE TABLE IF NOT EXISTS public.scanned_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    extracted_text TEXT,
    processing_status VARCHAR(50) DEFAULT 'completed' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Shopping Activity Log Table
CREATE TABLE IF NOT EXISTS public.shopping_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    list_id UUID REFERENCES public.shopping_lists(id) ON DELETE SET NULL,
    activity_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for optimal lookup performance
CREATE INDEX IF NOT EXISTS idx_shopping_lists_user_status ON public.shopping_lists(user_id, status);
CREATE INDEX IF NOT EXISTS idx_shopping_items_list ON public.shopping_items(list_id);
CREATE INDEX IF NOT EXISTS idx_shopping_items_purchased ON public.shopping_items(list_id, is_purchased);
CREATE INDEX IF NOT EXISTS idx_shopping_activity_user ON public.shopping_activity(user_id, created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scanned_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_activity ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only view and update their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Shopping Lists: users can only manage their own shopping lists
CREATE POLICY "Users can view own shopping lists"
    ON public.shopping_lists FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shopping lists"
    ON public.shopping_lists FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shopping lists"
    ON public.shopping_lists FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own shopping lists"
    ON public.shopping_lists FOR DELETE
    USING (auth.uid() = user_id);

-- Shopping Items: access verified via parent shopping list ownership
CREATE POLICY "Users can view items in own lists"
    ON public.shopping_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.shopping_lists
            WHERE public.shopping_lists.id = public.shopping_items.list_id
            AND public.shopping_lists.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert items in own lists"
    ON public.shopping_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.shopping_lists
            WHERE public.shopping_lists.id = public.shopping_items.list_id
            AND public.shopping_lists.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update items in own lists"
    ON public.shopping_items FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.shopping_lists
            WHERE public.shopping_lists.id = public.shopping_items.list_id
            AND public.shopping_lists.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete items in own lists"
    ON public.shopping_items FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.shopping_lists
            WHERE public.shopping_lists.id = public.shopping_items.list_id
            AND public.shopping_lists.user_id = auth.uid()
        )
    );

-- Scanned Documents & Activity Policies
CREATE POLICY "Users can view and insert own scanned docs"
    ON public.scanned_documents FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own shopping activities"
    ON public.shopping_activity FOR SELECT
    USING (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION & DEFAULT SHOPPING LIST TRIGGER
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    new_list_id UUID;
BEGIN
    -- Insert user profile
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url'
    );

    -- Automatically create a default empty shopping list for the new user
    INSERT INTO public.shopping_lists (user_id, title, status)
    VALUES (new.id, 'Weekly Essentials', 'active')
    RETURNING id INTO new_list_id;

    -- Record initial activity
    INSERT INTO public.shopping_activity (user_id, list_id, activity_type, description)
    VALUES (new.id, new_list_id, 'created', 'Default shopping list "Weekly Essentials" created');

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

