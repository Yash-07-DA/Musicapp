import re
with open(r'd:\Musicapp\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# I will find all <div class="content-wrapper hidden" id="profileSection"> and remove duplicates
parts = content.split('<div class="content-wrapper hidden" id="profileSection">')
if len(parts) > 2:
    # Meaning there are duplicates
    # Reconstruct with only the first occurrence
    # Wait, the best way is to just find the first </main> and replace everything between </main> and the first profileSection.
    pass

# Let's just do text replacement
start_str = '<div class="content-wrapper hidden" id="profileSection">'
first_idx = content.find(start_str)
second_idx = content.find(start_str, first_idx + 1)
if second_idx != -1:
    content = content[:second_idx] + "\n        </main>\n    </div>\n\n    <!-- Sticky Bottom Player -->"

# Change Rockstar to Yaswanth
content = content.replace("ROCKSTAR", "YASWANTH")
content = content.replace("text=Rockstar", "text=Yaswanth")

with open(r'd:\Musicapp\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
