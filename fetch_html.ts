import https from 'https';

https.get('https://ui-ux-pro-max-skill.nextlevelbuilder.io/demo/educational-platform', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const styleMatch = data.match(/<style[^>]*>([\s\S]*?)<\/style>/g);
    if (styleMatch) {
      console.log(styleMatch.join('\n'));
    } else {
      console.log("No style tags found");
    }
  });
});
