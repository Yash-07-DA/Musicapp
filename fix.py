with open(r'd:\Musicapp\script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix volumeBar init
content = content.replace("volumeBar.style.background = linear-gradient(to right, var(--text-primary) 100%, var(--bg-hover) 100%);", "volumeBar.style.background = 'linear-gradient(to right, var(--text-primary) 100%, var(--bg-hover) 100%)';")

# Fix progressBar init
content = content.replace("progressBar.style.background = linear-gradient(to right, var(--accent-color) 0%, var(--bg-hover) 0%);", "progressBar.style.background = 'linear-gradient(to right, var(--accent-color) 0%, var(--bg-hover) 0%)';")

# Fix volumeBar update
content = content.replace(r"volumeBar.style.background = \linear-gradient(to right, var(--text-primary) %, var(--bg-hover) %)\;", "volumeBar.style.background = linear-gradient(to right, var(--text-primary) %, var(--bg-hover) %);")

# Fix progressBar update
content = content.replace(r"progressBar.style.background = \linear-gradient(to right, var(--accent-color) %, var(--bg-hover) %)\;", "progressBar.style.background = linear-gradient(to right, var(--accent-color) %, var(--bg-hover) %);")
content = content.replace(r"progressBar.style.background = `linear-gradient(to right, var(--accent-color) ${progressPercent}%, var(--bg-hover) ${progressPercent}%)`;", "progressBar.style.background = linear-gradient(to right, var(--accent-color) %, var(--bg-hover) %);")

with open(r'd:\Musicapp\script.js', 'w', encoding='utf-8') as f:
    f.write(content)
