# Implementation Plan: Music Streaming Web App

## Phase 1: Setup and Architecture
1. **Create Project Structure**:
   - `index.html`: Main music player interface.
   - `admin.html`: Admin dashboard for managing songs.
   - `style.css`: Global styles, layout, and UI components.
   - `script.js`: Core player logic, Supabase fetching, and UI updates.
   - `admin.js`: CRUD operations logic for the admin panel.
   - `supabase.js`: Supabase initialization and shared configuration.
2. **Supabase Setup**:
   - Create the `songs` table SQL script.
   - Define Row Level Security (RLS) policies allowing public read access, and explaining admin write requirements.

## Phase 2: User Interface (UI) Design
1. **Main Layout (`index.html` & `style.css`)**:
   - Sidebar/Navigation for desktop, bottom navigation for mobile.
   - Main content area: Search bar, Song library grid/list.
   - Sticky bottom music player with controls (Play/Pause, Prev, Next, Progress, Volume).
   - Implement dark mode theme with subtle accent colors (e.g., a green or blue accent).
2. **Admin Layout (`admin.html` & `style.css`)**:
   - Form for adding/editing songs (Title, Artist, Album, Cover URL, Audio URL).
   - Table displaying all songs with Edit and Delete actions.

## Phase 3: Core Functionality (JavaScript)
1. **Supabase Integration**:
   - Initialize Supabase client using the provided URL and anon key.
2. **Main App Logic (`script.js`)**:
   - Fetch songs from Supabase `songs` table on load.
   - Render songs dynamically in the UI.
   - Implement search functionality filtering the local array of fetched songs.
   - Implement HTML5 Audio API for playback.
   - Manage playback state (play, pause, next, previous).
   - Update progress bar and handle seeking.
   - Volume control.
3. **Admin Logic (`admin.js`)**:
   - Fetch and display songs in the admin table.
   - Implement Create (insert to Supabase).
   - Implement Update (update existing record).
   - Implement Delete (remove record).
   - Refresh table automatically after CRUD operations.

## Phase 4: Refinement and Testing
1. **Responsive Design**: Ensure mobile layout works seamlessly (e.g., hiding sidebar, adjusting player layout).
2. **Error Handling & Edge Cases**: Empty library state, loading states, audio playback errors.
3. **Security Note**: Add clear documentation on RLS policies since the frontend uses an anon key. Write operations should ideally be protected by auth, but for this demo, we will use RLS policies to allow anonymous writes (or clearly explain how to restrict it).

## Deliverables
- `index.html`
- `admin.html`
- `style.css`
- `script.js`
- `admin.js`
- `supabase.js`
- `supabase_setup.sql`
- `README.md` (Setup instructions and RLS policy instructions)
