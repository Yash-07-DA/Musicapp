import re
with open(r'd:\Musicapp\script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix updateProgress
content = re.sub(r'function updateProgress\(e\) \{.*?\n\}', '''function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    
    // Update progress bar value
    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;
        progressBar.style.background = linear-gradient(to right, var(--accent-color) %, var(--bg-hover) %);
    }
    
    // Update time display
    currentTimeDisplay.textContent = formatTime(currentTime);
}''', content, flags=re.DOTALL)

# Fix volumeBar interaction in setupEventListeners
content = re.sub(r"volumeBar\.addEventListener\('input', \(e\) => \{.*?\}\);", '''volumeBar.addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        audioElement.volume = volume;
        volumeBar.style.background = linear-gradient(to right, var(--text-primary) %, var(--bg-hover) %);
    });''', content, flags=re.DOTALL)

with open(r'd:\Musicapp\script.js', 'w', encoding='utf-8') as f:
    f.write(content)
