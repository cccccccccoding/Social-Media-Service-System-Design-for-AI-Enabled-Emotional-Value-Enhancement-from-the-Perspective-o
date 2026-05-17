import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MIME = {
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function toDataUri(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const data = fs.readFileSync(filePath);
  const mime = MIME[ext] || 'application/octet-stream';
  return `data:${mime};base64,${data.toString('base64')}`;
}

// Read built files
const distDir = path.join(__dirname, 'dist-single');
let html = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Inline CSS
html = html.replace(
  /<link rel="stylesheet"[^>]+href="([^"]+)"[^>]*>/g,
  (_, href) => {
    const file = path.join(distDir, href.replace(/^\//, ''));
    if (!fs.existsSync(file)) return '';
    const css = fs.readFileSync(file, 'utf-8');
    return `<style>${css}</style>`;
  }
);

// Inline JS
html = html.replace(
  /<script type="module"[^>]+src="([^"]+)"[^>]*><\/script>/g,
  (_, src) => {
    const file = path.join(distDir, src.replace(/^\//, ''));
    if (!fs.existsSync(file)) return '';
    const js = fs.readFileSync(file, 'utf-8');
    return `<script type="module">${js}</script>`;
  }
);

// Also remove modulepreload links (not needed when inlined)
html = html.replace(/<link rel="modulepreload"[^>]*>/g, '');

// Build asset map: /gifs/* and /cluster-assets/*
const assetMap = {};

// GIFs and PNGs
const gifsDir = path.join(__dirname, 'public/gifs');
for (const f of fs.readdirSync(gifsDir)) {
  if (!f.match(/\.(png|gif|jpg|jpeg|webp|svg)$/i)) continue;
  const src = `/gifs/${f}`;
  console.log(`  Encoding ${src} ...`);
  assetMap[src] = toDataUri(path.join(gifsDir, f));
}

// Cluster assets
const clusterDir = path.join(__dirname, 'public/cluster-assets');
for (const f of fs.readdirSync(clusterDir)) {
  if (!f.match(/\.(png|gif|jpg|jpeg|webp|svg)$/i)) continue;
  const src = `/cluster-assets/${f}`;
  console.log(`  Encoding ${src} ...`);
  assetMap[src] = toDataUri(path.join(clusterDir, f));
}

// Read config.json for the fetch mock
const configData = JSON.parse(fs.readFileSync(path.join(gifsDir, 'config.json'), 'utf-8'));

// Build the injected script
const assetMapJson = JSON.stringify(assetMap);
const configJson = JSON.stringify(configData);

const injectedScript = `<script>
(function(){
  var AM = ${assetMapJson};

  // Mock fetch for config.json
  var _fetch = window.fetch.bind(window);
  window.fetch = function(url, opts) {
    if (typeof url === 'string' && url.indexOf('/gifs/config.json') !== -1) {
      return Promise.resolve({ ok: true, json: function(){ return Promise.resolve(${configJson}); } });
    }
    return _fetch(url, opts);
  };

  // Intercept Image src setter so data URIs are used
  var desc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  Object.defineProperty(HTMLImageElement.prototype, 'src', {
    set: function(val) {
      desc.set.call(this, AM[val] || val);
    },
    get: desc.get,
    configurable: true,
  });

  // Also intercept setAttribute for completeness
  var _setAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name, val) {
    if (name === 'src' && this instanceof HTMLImageElement) {
      _setAttribute.call(this, name, AM[val] || val);
    } else {
      _setAttribute.call(this, name, val);
    }
  };
})();
</script>`;

// Inject before </head>
html = html.replace('</head>', injectedScript + '\n</head>');

// Write output
const outPath = path.join(__dirname, 'app.html');
fs.writeFileSync(outPath, html, 'utf-8');
const sizeMB = (fs.statSync(outPath).size / 1024 / 1024).toFixed(1);
console.log(`\n✅ Created app.html (${sizeMB} MB)`);
