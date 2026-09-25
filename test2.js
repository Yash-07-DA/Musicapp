const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  
  await page.goto('http://localhost:8080/admin.html', { waitUntil: 'networkidle0' });
  
  console.log('Page loaded. Current title:', await page.title());
  
  // Fill the form
  await page.type('#title', 'Puppeteer Test');
  await page.type('#artist', 'Test Artist');
  await page.type('#cover_url', 'http://example.com/cover.jpg');
  await page.type('#audio_url', 'http://example.com/audio.mp3');
  
  console.log('Clicking submit...');
  await page.click('#submitBtn');
  
  // Wait for 5 seconds to see what happens
  await new Promise(r => setTimeout(r, 5000));
  
  console.log('Test finished.');
  await browser.close();
})();
