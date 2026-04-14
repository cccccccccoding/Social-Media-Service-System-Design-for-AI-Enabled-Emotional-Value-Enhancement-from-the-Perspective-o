import fs from 'fs';

const data = fs.readFileSync('css.css', 'utf8');
const idx = data.indexOf('--primary');
if (idx !== -1) {
  console.log(data.substring(Math.max(0, idx - 100), idx + 200));
} else {
  console.log("Not found");
}
