const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://online.e-leclercandorra.com/', { waitUntil: 'networkidle2' });

  const productos = await page.evaluate(() => {
    const items = [];
    document.querySelectorAll('li .articulo').forEach(el => {
      const nombre = el.querySelector('.nombre a').innerText.trim();
      const imgSrc = el.querySelector('.logo-imagen img').src;
      const precio = el.querySelector('.precio span').innerText.trim();
      items.push({ nombre, imgSrc, precio });
    });
    return items;
  });

  console.log(productos);
  await browser.close();
})();
