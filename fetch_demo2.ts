import https from 'https';

https.get('https://ui-ux-pro-max-skill.nextlevelbuilder.io/assets/index-CSLC56tG.js', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log(data);
  });
});
