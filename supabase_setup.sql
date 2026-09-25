-- supabase_setup.sql

-- 1. Create the `songs` table
CREATE TABLE IF NOT EXISTS public.songs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT,
    cover_url TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies

-- For this simple beginner-friendly project, we are not implementing full authentication.
-- Therefore, we will create policies that allow public access (anon key) for both READ and WRITE.
-- WARNING: In a production environment, you MUST restrict WRITE access to authenticated admin users only.

-- Policy: Allow public read access to everyone
CREATE POLICY "Allow public read access on songs" 
ON public.songs 
FOR SELECT 
USING (true);

-- Policy: Allow public insert access (FOR DEMO PURPOSES ONLY)
CREATE POLICY "Allow public insert on songs" 
ON public.songs 
FOR INSERT 
WITH CHECK (true);

-- Policy: Allow public update access (FOR DEMO PURPOSES ONLY)
CREATE POLICY "Allow public update on songs" 
ON public.songs 
FOR UPDATE 
USING (true);

-- Policy: Allow public delete access (FOR DEMO PURPOSES ONLY)
CREATE POLICY "Allow public delete on songs" 
ON public.songs 
FOR DELETE 
USING (true);

/*
HOW TO SECURE ADMIN ACTIONS (Future implementation):
If you want to secure the admin page:
1. Setup Supabase Auth (e.g., Email/Password).
2. Create an admin user.
3. Change the Insert, Update, and Delete policies to:

CREATE POLICY "Allow authenticated users to insert"
ON public.songs FOR INSERT
TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update"
ON public.songs FOR UPDATE
TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to delete"
ON public.songs FOR DELETE
TO authenticated USING (true);
*/
