import Book from './book.class.js';

export default class Cart {
  constructor() {
    this.data = [];
  }

  /**
   * (Por ahora no hace nada)
   */
  populate() {
    // En un futuro podría cargar el carrito desde localStorage, por ejemplo
  }

  /**
   * Devuelve el libro del carrito con esa id o {} si no existe
   * @param {number} id - ID del libro a buscar
   * @returns {Book | {}}
   */
  getBookById(id) {
    return this.data.find((b) => b.id === id) || {};
  }

  /**
   * Añade una copia de un libro al carrito.
   * Lanza un error si el libro ya existe.
   * @param {Book} book - Objeto libro a añadir
   */
  addItem(book) {
    const existing = this.data.find((b) => b.id === book.id);
    if (existing) {
      throw new Error(`El libro ${book.id} ya está en el carrito.`);
    }

    // Creamos una copia para desacoplarlo del listado principal
    const bookCopy = new Book(book);
    this.data.push(bookCopy);
  }

  /**
   * Elimina un libro del carrito por su ID.
   * Lanza un error si el libro no se encuentra.
   * @param {number} id - ID del libro a eliminar
   */
  removeItem(id) {
    const index = this.data.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error(`El libro con ID ${id} no se encontró en el carrito.`);
    }
    this.data.splice(index, 1);
  }

  /**
   * Muestra información de los libros del carrito
   * @returns {string}
   */
  toString() {
    if (this.data.length === 0) {
      return "El carrito está vacío.";
    }
    return `Carrito:\n${this.data.map((b) => b.toString()).join('\n')}`;
  }
}