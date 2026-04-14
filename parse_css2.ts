import fs from 'fs';

const data = fs.readFileSync('css.css', 'utf8');
const vars = ['--primary', '--secondary', '--bg-cream', '--accent-mint', '--accent-purple', '--text', '--text-muted', '--border', '--cta'];

for (const v of vars) {
  const regex = new RegExp(`${v}:[^;}]+`, 'g');
  const matches = data.match(regex);
  if (matches) {
    console.log([...new Set(matches)].join('\n'));
  }
}
