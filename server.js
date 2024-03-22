// En tu archivo server.js

const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;


app.use(express.static('.'));


async function obtenerProductos() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://online.e-leclercandorra.com/', { waitUntil: 'networkidle2' });

  let productos = [];

  try {
    let haySiguiente = true;
    while (haySiguiente) {
      const nuevosProductos = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('li .articulo').forEach(el => {
          const nombre = el.querySelector('.nombre a').innerText.trim();
          const imgSrc = el.querySelector('.logo-imagen img').src;
          const precio = el.querySelector('.precio span').innerText.trim();
          items.push({ nombre, imgSrc, precio });
        });
        return items;
      });

      productos = productos.concat(nuevosProductos);

      // Intenta hacer clic en el botón de "Siguiente página"
      const selectorSiguiente = '.paginacion .activo[title="Siguiente"]'; // Ajusta este selector al botón de "Siguiente"
      const existeSiguiente = await page.$(selectorSiguiente) !== null;
      if (existeSiguiente) {
        await Promise.all([
          page.click(selectorSiguiente),
          page.waitForNavigation({ waitUntil: 'networkidle2' })
        ]);
      } else {
        haySiguiente = false;
      }
    }
  } catch (error) {
    console.error('Error navegando y extrayendo datos:', error);
  }

  await browser.close();
  return productos;
}

(async () => {
  const productos = await obtenerProductos();
  console.log(productos);
})();

app.get('/productos', async (req, res) => {
  const productos = await obtenerProductos();
  res.json(productos);
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
