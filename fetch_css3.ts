import https from 'https';

https.get('https://ui-ux-pro-max-skill.nextlevelbuilder.io/assets/index-2watakw6.css', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const lines = data.split(';');
    for (const line of lines) {
      if (line.includes('--primary:') || line.includes('--secondary:') || line.includes('--bg-cream:') || line.includes('--accent-mint:') || line.includes('--accent-purple:') || line.includes('--text:') || line.includes('--text-muted:') || line.includes('--border:') || line.includes('--cta:')) {
        console.log(line);
      }
    }
    
    const clayMatch = data.match(/\.clay-card[^{]*\{[^}]*\}/g);
    if (clayMatch) console.log(clayMatch[0]);
    
    const softMatch = data.match(/\.soft-clay[^{]*\{[^}]*\}/g);
    if (softMatch) console.log(softMatch[0]);
  });
});
