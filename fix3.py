import re
with open(r'd:\Musicapp\script.js', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'function renderHistory\(\) \{.*?\n\}', '''function renderHistory() {
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
        
        card.innerHTML = 
            <div class="card-image-container">
                <img src="" alt="" loading="lazy">
                <div class="card-play-btn"><i class="fa-solid fa-play"></i></div>
            </div>
            <div class="card-title"></div>
            <div class="card-artist"></div>
        ;
        historyGrid.appendChild(card);
    });
}''', content, flags=re.DOTALL)

with open(r'd:\Musicapp\script.js', 'w', encoding='utf-8') as f:
    f.write(content)
