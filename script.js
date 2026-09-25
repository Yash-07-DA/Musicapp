// --- Supabase Configuration ---
// Note: In a real app, environment variables are preferred, but for this demo frontend, we use the provided keys.
const SUPABASE_URL = 'https://qjpcnddinfmqemnvemtb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_WoEBnddi51XtVXCJF4Y8Mg_spjkaMAF';

// Initialize Supabase Client
let supabaseClient;
try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
    console.error("Supabase init failed", e);
}

// --- App State ---
let songs = [];
let currentSongIndex = -1;
let isPlaying = false;

// --- DOM Elements ---
const songGrid = document.getElementById('songGrid');
const searchInput = document.getElementById('searchInput');
const loadingState = document.getElementById('loadingState');
const emptyState = document.getElementById('emptyState');

// Player Elements
const audioElement = document.getElementById('audioElement');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const volumeBar = document.getElementById('volumeBar');
const currentTimeDisplay = document.getElementById('currentTimeDisplay');
const durationDisplay = document.getElementById('durationDisplay');
const playerCover = document.getElementById('playerCover');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    fetchSongs();
    setupEventListeners();
});

// --- Fetch Data ---
async function fetchSongs() {
    if (!supabaseClient) {
        loadingState.classList.add('hidden');
        songGrid.innerHTML = '<div class=\"state-message\">Error: Database connection blocked. Please disable Adblockers and refresh.</div>';
        return;
    }
    // Check if we have cached songs
    if (songs.length > 0) {
        renderSongs(songs);
        return;
    }

    try {
        loadingState.classList.remove('hidden');
        songGrid.innerHTML = '';
        emptyState.classList.add('hidden');

        // Fetch only needed columns to reduce payload size
        const { data, error } = await supabaseClient
            .from('songs')
            .select('id, title, artist, album, cover_url, audio_url')
            .order('created_at', { ascending: false });

        if (error) throw error;

        songs = data;

        if (songs.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            renderSongs(songs);
        }
    } catch (error) {
        console.error('Error fetching songs:', error.message);
        songGrid.innerHTML = `<div class="state-message">Failed to load songs. Please try again later.</div>`;
    } finally {
        loadingState.classList.add('hidden');
    }
}

// --- Render UI ---
function renderSongs(songsToRender) {
    songGrid.innerHTML = '';
    
    songsToRender.forEach((song, index) => {
        // Find the actual index in the main 'songs' array
        const actualIndex = songs.findIndex(s => s.id === song.id);
        const isCurrentlyPlaying = (actualIndex === currentSongIndex);

        const card = document.createElement('div');
        card.className = `song-card ${isCurrentlyPlaying ? 'playing-active' : ''}`;
        card.dataset.index = actualIndex;
        // Stagger animation based on index (cap at 15 to avoid long delays on large lists)
        card.style.animationDelay = `${Math.min(index * 0.05, 0.75)}s`;
        card.onclick = () => loadAndPlaySong(actualIndex);
        
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${song.cover_url}" alt="${song.title} Cover" loading="lazy" width="400" height="400" onerror="this.onerror=null; this.src='https://placehold.co/400x400/1a1a1a/444444?text=Music'">
                <div class="card-play-btn">
                    <i class="fa-solid fa-play"></i>
                </div>
            </div>
            <div class="card-title">${song.title}</div>
            <div class="card-artist">${song.artist}</div>
        `;
        songGrid.appendChild(card);
    });
}

// --- Player Logic ---
function loadAndPlaySong(index) {
    if (index < 0 || index >= songs.length) return;
    
    // Only load audio if the song changed
    const isNewSong = currentSongIndex !== index;
    currentSongIndex = index;
    const song = songs[currentSongIndex];

    // Update UI
    playerCover.src = song.cover_url;
    playerTitle.textContent = song.title;
    playerArtist.textContent = song.artist;
    // Update Full Screen Overlay
    if (typeof fullCover !== 'undefined') {
        fullCover.src = song.cover_url;
        fullCoverBg.src = song.cover_url;
        fullTitle.textContent = song.title;
        fullArtist.textContent = song.artist;
    }
    
    if (typeof addToHistory === 'function') {
        addToHistory(song);
    }

    if (isNewSong) {
        audioElement.src = song.audio_url;
    }
    
    if (isNewSong && typeof resetVisualizer !== 'undefined') {
        resetVisualizer();
    }
    
    // Update active state indicator without re-rendering
    updateActiveSongIndicator();
    
    playSong();
}

function playSong() {
    if (currentSongIndex === -1) return;
    
    audioElement.play().catch(e => console.log('Autoplay prevented:', e));
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    playerCover.classList.add('spinning');
    if (typeof startVisualizer !== 'undefined') startVisualizer();
}

function pauseSong() {
    audioElement.pause();
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    playerCover.classList.remove('spinning');
    if (typeof pauseVisualizer !== 'undefined') pauseVisualizer();
}

function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function playNextSong() {
    if (songs.length === 0) return;
    let nextIndex = currentSongIndex + 1;
    if (nextIndex >= songs.length) nextIndex = 0; // Loop back
    loadAndPlaySong(nextIndex);
}

function playPrevSong() {
    if (songs.length === 0) return;
    let prevIndex = currentSongIndex - 1;
    if (prevIndex < 0) prevIndex = songs.length - 1; // Loop to end
    loadAndPlaySong(prevIndex);
}

// --- Event Listeners ---
function setupEventListeners() {
    // Controls
    playPauseBtn.addEventListener('click', togglePlayPause);
    nextBtn.addEventListener('click', playNextSong);
    prevBtn.addEventListener('click', playPrevSong);

    // Audio Element Events
    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('ended', playNextSong);
    audioElement.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(audioElement.duration);
    });

    audioElement.addEventListener('error', (e) => {
        pauseSong();
        console.error('Audio load error', e);
        playerTitle.textContent = "Error loading song";
    });

    // Progress Bar Interaction
    progressBar.addEventListener('input', (e) => {
        const seekTime = (audioElement.duration / 100) * e.target.value;
        audioElement.currentTime = seekTime;
    });

    volumeBar.style.background = 'linear-gradient(to right, var(--text-primary) 100%, var(--bg-hover) 100%)';
    progressBar.style.background = 'linear-gradient(to right, var(--accent-color) 0%, var(--bg-hover) 0%)';
    
    // Volume Interaction
    volumeBar.addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        audioElement.volume = volume;
        volumeBar.style.background = `linear-gradient(to right, var(--text-primary) ${e.target.value}%, var(--bg-hover) ${e.target.value}%)`;
    });

    // Search functionality with Debounce
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredSongs = songs.filter(song => 
                song.title.toLowerCase().includes(searchTerm) ||
                song.artist.toLowerCase().includes(searchTerm) ||
                (song.album && song.album.toLowerCase().includes(searchTerm))
            );
            renderSongs(filteredSongs);
        }, 300); // 300ms delay
    });
}

// --- Utilities ---
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    
    // Update progress bar value
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
        progressBar.style.background = `linear-gradient(to right, var(--accent-color) ${progressPercent}%, var(--bg-hover) ${progressPercent}%)`;
    }
    
    // Update time display
    currentTimeDisplay.textContent = formatTime(currentTime);
}

function formatTime(timeInSeconds) {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function updateActiveSongIndicator() {
    const cards = document.querySelectorAll('.song-card');
    cards.forEach(card => {
        if (parseInt(card.dataset.index) === currentSongIndex) {
            card.classList.add('playing-active');
        } else {
            card.classList.remove('playing-active');
        }
    });
}



// --- Navigation & Overlays ---
const navHome = document.getElementById('navHome');
const navHistory = document.getElementById('navHistory');
const profileBtn = document.getElementById('profileBtn');

const homeSection = document.getElementById('homeSection');
const historySection = document.getElementById('historySection');
const profileSection = document.getElementById('profileSection');
const historyGrid = document.getElementById('historyGrid');

const songPageOverlay = document.getElementById('songPageOverlay');
const closeSongPage = document.getElementById('closeSongPage');
const musicPlayer = document.querySelector('.music-player');
const fullCover = document.getElementById('fullCover');
const fullCoverBg = document.getElementById('fullCoverBg');
const fullTitle = document.getElementById('fullTitle');
const fullArtist = document.getElementById('fullArtist');

let playHistory = [];

function switchTab(tabId) {
    homeSection.classList.add('hidden');
    historySection.classList.add('hidden');
    profileSection.classList.add('hidden');
    
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    if (tabId === 'home') {
        homeSection.classList.remove('hidden');
        if(navHome) navHome.classList.add('active');
    } else if (tabId === 'history') {
        historySection.classList.remove('hidden');
        if(navHistory) navHistory.classList.add('active');
        renderHistory();
    } else if (tabId === 'profile') {
        profileSection.classList.remove('hidden');
    }
}

if(navHome) navHome.addEventListener('click', () => switchTab('home'));
if(navHistory) navHistory.addEventListener('click', () => switchTab('history'));
if(profileBtn) profileBtn.addEventListener('click', () => switchTab('profile'));

function addToHistory(song) {
    // Remove if already in history to move it to top
    playHistory = playHistory.filter(s => s.id !== song.id);
    playHistory.unshift(song);
    if(playHistory.length > 20) playHistory.pop();
}

function renderHistory() {
    historyGrid.innerHTML = '';
    if(playHistory.length === 0) {
        historyGrid.innerHTML = '<div class="state-message">No songs played yet.</div>';
        return;
    }
    
    playHistory.forEach((song, index) => {
        const actualIndex = songs.findIndex(s => s.id === song.id);
        const card = document.createElement('div');
        card.className = 'song-card';
        card.dataset.index = actualIndex;
        card.onclick = () => loadAndPlaySong(actualIndex);
        
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${song.cover_url}" alt="${song.title}" loading="lazy">
                <div class="card-play-btn"><i class="fa-solid fa-play"></i></div>
            </div>
            <div class="card-title">${song.title}</div>
            <div class="card-artist">${song.artist}</div>
        `;
        historyGrid.appendChild(card);
    });
}

// Open song page when clicking player
musicPlayer.addEventListener('click', (e) => {
    // Don't open if clicking controls
    if(e.target.closest('.player-controls-container') || e.target.closest('.volume-container')) return;
    if(currentSongIndex === -1) return;
    
    songPageOverlay.classList.remove('hidden');
});

closeSongPage.addEventListener('click', (e) => {
    e.stopPropagation();
    songPageOverlay.classList.add('hidden');
});

// Update loadAndPlaySong to sync with overlay and history


// --- Sequential Visualizer Logic ---
const visualizerContainer = document.getElementById('playerVisualizer');
let visualizerBars = [];
const NUM_BARS = 20;

function initVisualizer() {
    const containers = document.querySelectorAll('.visualizer-container, #visualizer');
    visualizerBars = [];
    
    containers.forEach(container => {
        container.innerHTML = '';
        container.style.display = 'flex';
        container.style.alignItems = 'flex-end';
        container.style.gap = '4px';
        container.style.height = container.id === 'visualizer' ? '60px' : '36px';
        container.style.justifyContent = 'center';
        
        const numBars = container.id === 'visualizer' ? 40 : 20;
        
        for (let i = 0; i < numBars; i++) {
            const bar = document.createElement('div');
            bar.className = 'vis-bar';
            
            const maxPeak = container.id === 'visualizer' ? 60 : 36;
            const minPeak = container.id === 'visualizer' ? 20 : 15;
            const peak = Math.floor(Math.random() * (maxPeak - minPeak + 1)) + minPeak;
            
            bar.style.setProperty('--peak-height', peak + 'px');
            bar.style.animationDelay = (i * 0.1) + 's';
            
            container.appendChild(bar);
            visualizerBars.push(bar);
        }
    });
}

function startVisualizer() {
    visualizerBars.forEach(bar => {
        bar.classList.add('playing');
        bar.classList.remove('paused');
    });
}

function pauseVisualizer() {
    visualizerBars.forEach(bar => {
        bar.classList.add('paused');
    });
}

function resetVisualizer() {
    // Force DOM reflow to restart animation sequence from left
    visualizerBars.forEach(bar => {
        bar.classList.remove('playing');
        bar.classList.remove('paused');
        
        // Randomize peaks again for new song
        const peak = Math.floor(Math.random() * 21) + 15;
        bar.style.setProperty('--peak-height', peak + 'px');
    });
    
    // Trigger reflow
    void visualizerContainer.offsetWidth;
    
    if (isPlaying) {
        startVisualizer();
    }
}

// Hook into existing events
initVisualizer();