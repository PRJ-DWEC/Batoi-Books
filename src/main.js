import Modules from './model/modules.class.js';
import Users from './model/users.class.js';
import Books from './model/books.class.js';

import './style.css';
import javascriptLogo from '/logoBatoi.png';

const users = new Users();
const modules = new Modules();
const books = new Books();

document.querySelector('#app').innerHTML = `
  <header>
    <img src="${javascriptLogo}" class="logo" alt="JavaScript logo" />
    <h1>BatoiBooks</h1>
  </header>
  <p class="read-the-docs">
    Abre la Consola para ver su funcionamiento
  </p>
`;

async function init() {
  try {

    await Promise.all([users.populate(), modules.populate(), books.populate()]);
    


    console.log('--- Todos los libros ---');
    console.log(books.toString());


    console.log('--- Todos los usuarios ---');
    console.log(users.toString());


    console.log('--- Todos los módulos ---');
    console.log(modules.toString());


    console.log('--- Libros del módulo 5021 ---');
    const books5021 = books.booksFromModule('5021');
    console.log(books5021.toString());
  

    console.log('--- Libros nuevos ---');
    const newBooks = books.booksWithStatus('new');
    console.log(newBooks.toString());


  } catch (error) {
    console.error('Error:', error.message);
  }
}

init();
