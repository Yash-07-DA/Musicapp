import re
with open(r'd:\Musicapp\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix duplicated standard hero
dup_hero = '''<div class="hero-section">
                    <div class="hero-content">
                        <h1 class="hero-title">Welcome to Just Vibes</h1>
                        <p class="hero-subtitle">Listen to the latest hits and discover new music, perfectly curated for you.</p>
                        <button class="btn btn-primary" onclick="if(songs.length > 0) loadAndPlaySong(0)"><i class="fa-solid fa-play"></i> Play Top Track</button>
                    </div>
                </div>'''
content = re.sub(r'(\s*<div class="hero-section">.*?</div>\s*</div>){2,}', r'\n' + dup_hero + '\n', content, flags=re.DOTALL)

with open(r'd:\Musicapp\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
