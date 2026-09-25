# StreamVibe - Music Player

A dynamic, beginner-friendly music streaming application built with HTML, CSS, JavaScript, and Supabase.

## Features
- **Dynamic Data**: All songs are fetched in real-time from a Supabase PostgreSQL database.
- **Audio Playback**: Uses HTML5 Audio API for playing songs stored in Cloudinary.
- **Custom Player Controls**: Play/Pause, Next, Previous, Progress Seeking, and Volume Control.
- **Search**: Filter songs instantly by title, artist, or album.
- **Admin Dashboard**: A built-in CRUD interface to add, edit, and delete songs without writing SQL.
- **Responsive Design**: Dark mode UI inspired by modern music players, fully responsive for desktop and mobile devices.

## Project Structure
- `index.html`: Main music player interface.
- `admin.html`: Admin dashboard for managing songs.
- `style.css`: Global styles, dark theme variables, and UI layouts.
- `script.js`: Core player logic, playback controls, and main page data fetching.
- `admin.js`: Logic for the admin panel, handling Supabase CRUD operations.
- `supabase_setup.sql`: SQL queries required to set up the Supabase database.
- `implementation_plan.md`: The development plan for this project.

## Setup Instructions

### 1. Database Setup (Supabase)
1. Go to your Supabase project dashboard (https://qjpcnddinfmqemnvemtb.supabase.co).
2. Navigate to the **SQL Editor** in the left sidebar.
3. Open the `supabase_setup.sql` file included in this repository.
4. Copy its contents, paste it into the Supabase SQL Editor, and click **Run**.
   - This will create the `songs` table and apply the necessary Row Level Security (RLS) policies.

### 2. Running Locally
Because this project uses vanilla HTML, CSS, and JS, you can run it easily:
1. Open the folder in VS Code or your preferred editor.
2. Use an extension like **Live Server** to run `index.html`.
3. Alternatively, you can just double-click `index.html` to open it in your browser (though using a local server is recommended to prevent CORS issues if you add external assets later).

### 3. Adding Songs
1. Open the app in your browser.
2. Click on the **Admin Panel** link (in the sidebar on desktop, or bottom navigation on mobile).
3. Use the form to add a song. 
   - **Cover Image URL**: Provide a valid image URL.
   - **Cloudinary Audio URL**: Provide a valid `.mp3` or `.wav` URL. Example: `https://res.cloudinary.com/yttor7j5/video/upload/v1787637315/jayjen-let-me-go.mp3`
4. Go back to the **Player** to see your newly added song.

---

## Important Security Note: Row Level Security (RLS)

This project is built for **beginner/demonstration purposes**, meaning **authentication is not implemented**. 

Because of this, the provided SQL setup creates policies that allow **public access (anon key)** for both READ and WRITE operations. 

**This means anyone with the URL can add, edit, or delete songs.**

### How to Secure the App for Production:
If you plan to launch this app publicly:
1. **Enable Authentication**: Set up Email/Password or OAuth login in Supabase.
2. **Require Auth for Admin Page**: Add code in `admin.html`/`admin.js` to redirect users who are not logged in.
3. **Update RLS Policies**: Change the Insert, Update, and Delete policies in Supabase so that only authenticated users can modify the database.

Example of a secure policy:
```sql
-- Only authenticated users can insert new songs
CREATE POLICY "Allow authenticated users to insert"
ON public.songs FOR INSERT
TO authenticated WITH CHECK (true);
```
