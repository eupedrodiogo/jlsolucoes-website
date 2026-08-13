const fs = require('fs');
const https = require('https');

https.get('https://jlsolucoesemanutencoes.com.br/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Regex to match Elementor image boxes or similar structures
    // Let's try to find blocks with <img src="..."> and <h...>TITLE</h...>
    const regex = /<img[^>]+src="([^"]+)"[^>]*>.*?<h[1-6][^>]*>(.*?)<\/h[1-6]>/gs;
    let match;
    const results = [];
    while ((match = regex.exec(data)) !== null) {
      const src = match[1];
      const title = match[2].replace(/(<([^>]+)>)/gi, "").trim();
      if (title.length > 5 && src.includes('uploads')) {
        results.push(`${src} | ${title}`);
      }
    }
    console.log(Array.from(new Set(results)).join('\n'));
  });
});
