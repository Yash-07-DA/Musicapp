const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({ 
      headless: 'new',
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  
  await page.goto('http://localhost:8080/admin.html', { waitUntil: 'networkidle0' });
  
  const isHidden = await page.evaluate(() => document.getElementById('loadingState').classList.contains('hidden'));
  console.log('Is admin loadingState hidden?', isHidden);
  
  await browser.close();
})();
