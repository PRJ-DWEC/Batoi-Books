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
    // Cargamos los datos desde la API
    await users.populate();
    await modules.populate();
    await books.populate();

    // Mostrar todos los libros
    console.log('--- Todos los libros ---');
    console.log(books.toString());

    // Mostrar todos los usuarios
    console.log('--- Todos los usuarios ---');
    console.log(users.toString());

    // Mostrar todos los módulos
    console.log('--- Todos los módulos ---');
    console.log(modules.toString());

    // Ejemplos de consultas
    console.log('--- Libros del módulo 5021 ---');
    const books5021 = books.booksFromModule('5021');
    books5021.forEach(book => console.log(book.toString()));

    console.log('--- Libros nuevos ---');
    const newBooks = books.booksWithStatus('new');
    newBooks.forEach(book => console.log(book.toString()));

    // Ya no usamos incrementPriceOfbooks, método eliminado

  } catch (error) {
    console.error('Error:', error.message);
  }
}

init();
