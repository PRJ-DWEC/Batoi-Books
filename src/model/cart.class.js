import Book from './book.class.js';

const STORAGE_KEY = 'batoiBooksCart'; // Clave para LocalStorage

export default class Cart {
  constructor() {
    this.data = [];
    // La carga se hace en populate() que es llamado por controller.init()
  }

  /**
   * (MODIFICADO) Carga el carrito desde LocalStorage
   */
  populate() {
    const dataFromStorage = localStorage.getItem(STORAGE_KEY);
    if (dataFromStorage) {
      try {
        const parsedData = JSON.parse(dataFromStorage);
        // Re-hidratamos los objetos como instancias de Book
        this.data = parsedData.map(item => new Book(item));
      } catch (e) {
        console.error("Error al cargar el carrito desde LocalStorage:", e);
        this.data = [];
      }
    } else {
      this.data = [];
    }
  }

  /**
   * (NUEVO) Método privado para guardar en LocalStorage
   */
  _save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  /**
   * Devuelve el libro del carrito con esa id o {} si no existe
   * @param {number} id - ID del libro a buscar
   * @returns {Book | {}}
   */
  getBookById(id) {
    // Convertimos id a string si es número, o viceversa, para asegurar la comparación
    // ya que los IDs pueden venir como string de data-attributes
    const normalizedId = String(id);
    return this.data.find((b) => String(b.id) === normalizedId) || {};
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
    this._save(); // (MODIFICACIÓN) Guardar al añadir
  }

  /**
   * Elimina un libro del carrito por su ID.
   * Lanza un error si el libro no se encuentra.
   * @param {number | string} id - ID del libro a eliminar
   */
  removeItem(id) {
    // Normalizamos el ID para la comparación
    const normalizedId = String(id);
    const index = this.data.findIndex((b) => String(b.id) === normalizedId);
    
    if (index === -1) {
      throw new Error(`El libro con ID ${id} no se encontró en el carrito.`);
    }
    this.data.splice(index, 1);
    this._save(); // (MODIFICACIÓN) Guardar al eliminar
  }

  /**
   * (NUEVO) Vacía el carrito
   */
  emptyCart() {
    this.data = [];
    this._save();
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