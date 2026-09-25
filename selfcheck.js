const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({ 
      headless: 'new',
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  
  await page.goto('http://localhost:8080/admin.html', { waitUntil: 'networkidle0' });
  
  // Fill the form
  await page.type('#title', 'Self Check Test');
  await page.type('#artist', 'Test Artist');
  await page.type('#cover_url', 'http://example.com/cover.jpg');
  await page.type('#audio_url', 'http://example.com/audio.mp3');
  
  console.log('Submitting...');
  await page.click('#submitBtn');
  
  // Wait to see if any errors are logged
  await new Promise(r => setTimeout(r, 4000));
  
  await browser.close();
  console.log('Self check complete.');
})();
