import https from 'https';

https.get('https://ui-ux-pro-max-skill.nextlevelbuilder.io/assets/index-2watakw6.css', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(data.match(/\.clay-card[^{]*\{[^}]*\}/g));
    console.log(data.match(/\.soft-clay[^{]*\{[^}]*\}/g));
    console.log(data.match(/\.edu-platform[^{]*\{[^}]*\}/g));
    
    // Find variables
    const varMatch = data.match(/--primary:[^;]+;/g);
    if (varMatch) console.log(varMatch.slice(0, 10));
  });
});
