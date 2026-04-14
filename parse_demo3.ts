import fs from 'fs';

const data = fs.readFileSync('demo.js', 'utf8');
const worldIdx = data.indexOf('OpenWorldView');
if (worldIdx !== -1) {
  console.log("OpenWorldView found at", worldIdx);
  console.log(data.substring(Math.max(0, worldIdx - 500), worldIdx + 1500));
} else {
  console.log("OpenWorldView not found");
}
