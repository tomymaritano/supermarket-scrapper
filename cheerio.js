const axios = require('axios');
const cheerio = require('cheerio');

(async () => {
  // Realizar una solicitud HTTP a la página
  const { data } = await axios.get('https://example.com');
  
  // Cargar el HTML en Cheerio
  const $ = cheerio.load(data);
  
  // Extraer el título de la página
  const title = $('h1').text();
  
  console.log(title); // Mostrar el título
})();
