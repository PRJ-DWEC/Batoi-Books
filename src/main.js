import  data  from './services/datos.js';
/* import * as f from './functions.js';
const { booksFromUser, booksFromModule, booksWithStatus, incrementPriceOfbooks } = f; */

import Modules from './model/modules.class.js';
import Users from './model/users.class.js';
import Books from './model/books.class.js';

const users = new Users();
const modules = new Modules();
const books = new Books();

users.populate(data.users);
modules.populate(data.modules);
books.populate(data.books);

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



/* console.log(f.booksFromUser(data.books, 4)); */
/* console.log(f.booksWithStatus(booksFromModule(data.books, "5021"), "good")); */
/* console.log(incrementPriceOfbooks(data.books, 0.1)); */

try {
  console.log('--- Libros del módulo 5021 ---')
  const books5021 = books.booksFromModule('5021') // usar moduleId o code según tus clases
  books5021.forEach(book => console.log(book.toString()))

  console.log('--- Libros nuevos ---')
  const newBooks = books.booksWithStatus('new')
  newBooks.forEach(book => console.log(book.toString()))


  console.log('--- Libros con precio incrementado 10% ---')
  books.incrementPriceOfbooks(0.10) // el método debe actualizar this.data
  books.data.forEach(book => console.log(book.toString()))
}catch (error) {
  console.error('Error:', error.message);
}
