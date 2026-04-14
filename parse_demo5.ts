import fs from 'fs';

const data = fs.readFileSync('demo.js', 'utf8');
const worldIdx = data.indexOf('world');
if (worldIdx !== -1) {
  console.log("world found at", worldIdx);
  console.log(data.substring(Math.max(0, worldIdx - 500), worldIdx + 1500));
} else {
  console.log("world not found");
}
