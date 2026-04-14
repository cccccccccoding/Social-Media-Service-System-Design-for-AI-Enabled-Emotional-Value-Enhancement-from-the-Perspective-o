import https from 'https';

https.get('https://ui-ux-pro-max-skill.nextlevelbuilder.io/assets/index-2watakw6.css', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const idx = data.indexOf('.edu-platform');
    if (idx !== -1) {
      console.log(data.substring(Math.max(0, idx - 500), idx + 2000));
    } else {
      console.log("Not found");
    }
  });
});
