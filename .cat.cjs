const fs = require('fs');
const row = "| `careers` | Careers | Jobs and opportunities in tech, placement prep, interview and freelancing advice |\n";

// BLOGWRITER.md categories table
let b = fs.readFileSync('BLOGWRITER.md', 'utf8');
const anchor = "| `tools` | Tools | What we actually use, what we dropped, and why |\n";
if (!b.includes(anchor)) { console.error('BLOGWRITER anchor missing'); process.exit(1); }
if (!b.includes('`careers`')) b = b.replace(anchor, anchor + row);
fs.writeFileSync('BLOGWRITER.md', b);

// CLAUDE.md, if it lists them too
let c = fs.readFileSync('CLAUDE.md', 'utf8');
if (c.includes('`tools` | Tools') && !c.includes('`careers`')) {
  c = c.replace(/\| `tools` \| Tools \|[^\n]*\n/, (m) => m + row);
  fs.writeFileSync('CLAUDE.md', c);
  console.log('CLAUDE.md updated');
}
console.log('BLOGWRITER.md updated');
