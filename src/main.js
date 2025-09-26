

import './style.css'
import javascriptLogo from '/logoBatoi.png'

import '../src/functions.js'
import data from '../src/services/datos.js' 
import * as f from '../src/functions.js'
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
console.log(f.booksFromModule(data.books, 5021).filter(book => book.status === 'good'));
  