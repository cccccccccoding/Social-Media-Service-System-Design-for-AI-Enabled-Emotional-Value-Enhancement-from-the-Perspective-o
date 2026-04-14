import https from 'https';

https.get('https://ui-ux-pro-max-skill.nextlevelbuilder.io/assets/index-DybJ-FQd.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const idx = data.indexOf('--primary');
    if (idx !== -1) {
      console.log(data.substring(Math.max(0, idx - 100), idx + 200));
    } else {
      console.log("Not found");
    }
  });
});
