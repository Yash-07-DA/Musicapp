const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({ 
      headless: 'new',
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  await page.goto('http://localhost:8080/index.html', { waitUntil: 'domcontentloaded' });
  
  await new Promise(r => setTimeout(r, 2000));
  
  const html = await page.content();
  const fs = require('fs');
  fs.writeFileSync('d:\\Musicapp\\dom.html', html);
  
  const isHidden = await page.evaluate(() => document.getElementById('loadingState').classList.contains('hidden'));
  console.log('Is loadingState hidden?', isHidden);
  
  const numSongs = await page.evaluate(() => document.querySelectorAll('.song-card').length);
  console.log('Number of songs rendered:', numSongs);
  
  await browser.close();
})();
