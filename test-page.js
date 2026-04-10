import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', err => {
    errors.push(err.message);
  });
  
  try {
    await page.goto('https://92f629c9.college-selector.pages.dev', { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait a bit more for React to render
    await page.waitForTimeout(3000);
    
    const content = await page.content();
    const hasReactRoot = content.includes('id="root"');
    const hasBodyContent = await page.evaluate(() => document.body.innerText.length);
    
    console.log('Page loaded:', hasReactRoot);
    console.log('Body content length:', hasBodyContent);
    console.log('Errors:', errors.length > 0 ? errors.join('\n') : 'None');
    
    // Check if it's loading or stuck
    const loading = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root ? root.innerHTML.length : 0;
    });
    console.log('Root element content length:', loading);
    
  } catch (e) {
    console.log('Error:', e.message);
  }
  
  await browser.close();
})();