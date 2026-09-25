// --- Supabase Configuration ---
const SUPABASE_URL = 'https://qjpcnddinfmqemnvemtb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_WoEBnddi51XtVXCJF4Y8Mg_spjkaMAF';
let supabaseClient;
try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
    console.error("Supabase init failed", e);
}

// --- DOM Elements ---
const songForm = document.getElementById('songForm');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const songsTable = document.getElementById('songsTable');
const songsTableBody = document.getElementById('songsTableBody');
const loadingState = document.getElementById('loadingState');

// Form Inputs
const inputId = document.getElementById('songId');
const inputTitle = document.getElementById('title');
const inputArtist = document.getElementById('artist');
const inputAlbum = document.getElementById('album');
const inputCoverUrl = document.getElementById('cover_url');
const inputAudioUrl = document.getElementById('audio_url');

// --- State ---
let isEditing = false;

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    fetchSongsForAdmin();
    
    songForm.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', resetForm);
});

// --- Fetch & Render Table ---
async function fetchSongsForAdmin() {
    if (!supabaseClient) {
        loadingState.classList.add('hidden');
        alert("Database connection blocked. Please disable Adblockers.");
        return;
    }
    try {
        loadingState.classList.remove('hidden');
        songsTable.classList.add('hidden');
        songsTableBody.innerHTML = '';

        const { data: songs, error } = await supabaseClient
            .from('songs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        renderTable(songs);
    } catch (error) {
        console.error('Error fetching songs for admin:', error.message);
        alert('Failed to load songs.');
    } finally {
        loadingState.classList.add('hidden');
        songsTable.classList.remove('hidden');
    }
}

function renderTable(songs) {
    songsTableBody.innerHTML = '';
    
    if (songs.length === 0) {
        songsTableBody.innerHTML = `<tr><td colspan="5" style="text-align: center;">No songs found.</td></tr>`;
        return;
    }

    songs.forEach(song => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
            <td class="td-cover">
                <img src="${song.cover_url}" alt="${song.title} Cover" onerror="this.onerror=null; this.src='https://placehold.co/40x40/1a1a1a/444444?text=+'">
            </td>
            <td><strong>${song.title}</strong></td>
            <td>${song.artist}</td>
            <td>${song.album || '-'}</td>
            <td class="action-buttons">
                <button class="btn btn-edit" onclick="editSong('${song.id}')"><i class="fa-solid fa-pen"></i> Edit</button>
                <button class="btn btn-danger" onclick="deleteSong('${song.id}')"><i class="fa-solid fa-trash"></i> Delete</button>
            </td>
        `;
        
        songsTableBody.appendChild(tr);
    });
}

// --- Create & Update ---
async function handleFormSubmit(e) {
    e.preventDefault();

    const songData = {
        title: inputTitle.value.trim(),
        artist: inputArtist.value.trim(),
        album: inputAlbum.value.trim(),
        cover_url: inputCoverUrl.value.trim(),
        audio_url: inputAudioUrl.value.trim()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = isEditing ? 'Updating...' : 'Adding...';

    try {
        if (isEditing) {
            // Update existing record
            const { error } = await supabaseClient
                .from('songs')
                .update(songData)
                .eq('id', inputId.value);
            
            if (error) throw error;
            alert('Song updated successfully!');
        } else {
            // Create new record
            const { error } = await supabaseClient
                .from('songs')
                .insert([songData]);
            
            if (error) throw error;
            alert('Song added successfully!');
        }

        resetForm();
        fetchSongsForAdmin(); // Refresh table
    } catch (error) {
        console.error('Error saving song:', error.message);
        alert('Failed to save song: ' + error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = isEditing ? 'Update Song' : 'Add Song';
    }
}

// --- Setup Edit State ---
async function editSong(id) {
    try {
        const { data, error } = await supabaseClient
            .from('songs')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        // Populate form
        inputId.value = data.id;
        inputTitle.value = data.title;
        inputArtist.value = data.artist;
        inputAlbum.value = data.album || '';
        inputCoverUrl.value = data.cover_url;
        inputAudioUrl.value = data.audio_url;

        // Change UI state to editing
        isEditing = true;
        formTitle.textContent = 'Edit Song';
        submitBtn.textContent = 'Update Song';
        cancelBtn.classList.remove('hidden');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Error fetching song details:', error.message);
        alert('Failed to load song details for editing.');
    }
}

// --- Delete ---
async function deleteSong(id) {
    if (!confirm('Are you sure you want to delete this song? This action cannot be undone.')) {
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('songs')
            .delete()
            .eq('id', id);

        if (error) throw error;
        
        fetchSongsForAdmin(); // Refresh table
    } catch (error) {
        console.error('Error deleting song:', error.message);
        alert('Failed to delete song.');
    }
}

// --- Reset Form ---
function resetForm() {
    songForm.reset();
    inputId.value = '';
    isEditing = false;
    formTitle.textContent = 'Add New Song';
    submitBtn.textContent = 'Add Song';
    cancelBtn.classList.add('hidden');
}
