import fs from 'fs';

const data = fs.readFileSync('demo.js', 'utf8');
const clayIdx = data.indexOf('clay-card');
if (clayIdx !== -1) {
  console.log("clay-card found at", clayIdx);
  console.log(data.substring(Math.max(0, clayIdx - 100), clayIdx + 200));
} else {
  console.log("clay-card not found");
}

const softIdx = data.indexOf('soft-clay');
if (softIdx !== -1) {
  console.log("soft-clay found at", softIdx);
  console.log(data.substring(Math.max(0, softIdx - 100), softIdx + 200));
} else {
  console.log("soft-clay not found");
}
