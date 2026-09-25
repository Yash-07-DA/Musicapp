'
import sys
with open(r"d:\Musicapp\script.js", "r", encoding="utf-8") as f:
    lines = f.readlines()
with open(r"d:\Musicapp\script.js", "w", encoding="utf-8") as f:
    for line in lines:
        if "card.innerHTML = \\" in line:
            f.write("        card.innerHTML = `\n")
        elif "img src=" in line and "loading="lazy"" in line and "\\\"" in line:
            f.write("                <img src=\"${song.cover_url}\" alt=\"${song.title}\" loading=\"lazy\">\n")
        elif "<div class=\"card-title\">\\" in line:
            f.write("            <div class=\"card-title\">${song.title}</div>\n")
        elif "<div class=\"card-artist\">\\" in line:
            f.write("            <div class=\"card-artist\">${song.artist}</div>\n")
        elif "        \\" in line and "historyGrid.appendChild" not in line:
            f.write("        `;\n")
        else:
            f.write(line)
'
