import Book from './book.class.js';
import * as api from '../services/books.api.js';

export default class Books {
  constructor() {
    this.data = [];
  }

  async populate() {
    const books = await api.getDBBooks();
    this.data = books.map(b => new Book(b));
  }


  async addBook(bookData) {
    const newBookData = await api.addDBBook(bookData);
    const newBook = new Book(newBookData);
    this.data.push(newBook);
    return newBook;
  }

  async removeBook(bookId) {
    const book = this.getBookById(bookId); // lanza error si no existe
    await api.removeDBBook(bookId);
    this.data = this.data.filter(b => b.id !== bookId);
    return book;
  }


  async changeBook(newBookData) {
    const _ = this.getBookById(newBookData.id); // lanza error si no existe
    const updatedData = await api.changeDBBook(newBookData);
    const updatedBook = new Book(updatedData);
    const index = this.getBookIndexById(newBookData.id);
    this.data[index] = updatedBook;
    return updatedBook;
  }


  getBookById(bookId) {
    const book = this.data.find(b => b.id === bookId);
    if (!book) throw new Error(`No existe ese libro ${bookId}`);
    return book;
  }

  getBookIndexById(bookId) {
    const index = this.data.findIndex(b => b.id === bookId);
    if (index === -1) throw new Error(`No existe ese libro ${bookId}`);
    return index;
  }

  bookExists(userId, moduleCode) {
    return this.data.some(b => b.userId === userId && b.moduleCode === moduleCode);
  }

  booksFromUser(userId) {
    return this.data.filter(b => b.userId === userId);
  }

  booksFromModule(moduleCode) {
    return this.data.filter(b => b.moduleCode === moduleCode);
  }

  booksCheeperThan(price) {
    return this.data.filter(b => b.price < price);
  }

  booksWithStatus(status) {
    return this.data.filter(b => b.status === status);
  }

  averagePriceOfBooks() {
    if (this.data.length === 0) return '0.00 €';
    const total = this.data.reduce((sum, b) => sum + b.price, 0);
    return `${(total / this.data.length).toFixed(2)} €`;
  }

  booksOfTypeNotes() {
    return this.data.filter(b => b.publisher === 'Apunts');
  }

  booksNotSold() {
    return this.data.filter(b => !b.soldDate || b.soldDate === '');
  }



  toString() {
    return this.data.map(b => b.toString()).join('\n');
  }
}
