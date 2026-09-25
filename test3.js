const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({ 
      headless: 'new',
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  
  await page.goto('http://localhost:8080/index.html', { waitUntil: 'networkidle0' });
  
  console.log('Page loaded.');
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
