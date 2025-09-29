import  data  from './services/datos.js';
import * as f from './functions.js';
const { booksFromUser, booksFromModule, booksWithStatus, incrementPriceOfbooks } = f;

import './style.css'
import javascriptLogo from '/logoBatoi.png'




document.querySelector('#app').innerHTML = `
  <header>
    <img src="${javascriptLogo}" class="logo" alt="JavaScript logo" />
    <h1>BatoiBooks</h1>
  </header>
  <p class="read-the-docs">
    Abre la Consola para ver su funcionamiento
  </p>
`



console.log(f.booksFromUser(data.books, 4));
console.log(f.booksWithStatus(booksFromModule(data.books, "5021"), "good"));
console.log(incrementPriceOfbooks(data.books, 0.1));

