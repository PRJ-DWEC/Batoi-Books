import Book from './book.class.js';

export default class Books {
  constructor() {
    this.data = [];
    this.idLibros = 0;
  }
 
  populate(books) {
    this.data = books.map(item => new Book(item));
    this.idLibros = this.data.length ? Math.max(...this.data.map(b => b.id)) : 0;
  }
  

  addBook(bookData) {
  const id = this.data.length ? Math.max(...this.data.map(b => b.id)) + 1 : 1;
  const newBook = new Book({ id, ...bookData });
  this.data.push(newBook);
  return newBook; // devuelve el objeto Book añadido
}
  
  removeBook(bookId) {
    const index = this.data.findIndex(book => book.id === bookId);
    if (index === -1) throw new Error(`No existe ese libro ${bookId}`);
    this.data.splice(index, 1);
  }

  changeBook(newBookData) {
    const index = this.data.findIndex(book => book.id === newBookData.id);
    if (index === -1) throw new Error(`No existe ese libro ${newBookData.id}`);
    
    const updatedBook = new Book(newBookData);
    this.data[index] = updatedBook;
  
    return updatedBook; 
  }

  getBookById(bookId){
    const book = this.data.find(book => book.id === bookId);
    if (!book) throw new Error('No existe ese libro ${bookId}');
    
    return book;

    
  }

  getBookIndexById(bookId){
    const index = this.data.findIndex(book => book.id === bookId);
    if (index === -1) throw new Error('No existe ese libro ${bookId}');
    
    return index;
  }

  bookExists(userId, moduleCode) {
    return this.data.some(book => book.userId === userId && book.moduleCode === moduleCode);
  }
  

  booksFromUser(userId){
    return this.data.filter(book => book.userId === userId); 
  }

  booksCheeperThan(price){
    return this.data.filter(book => book.price < price);

  }

  booksWithStatus(status){
    return this.data.filter(book => book.status === status);
  }
  booksFromModule(moduleCode){
    return this.data.filter(book => book.moduleCode === moduleCode);

  }
  averagePriceOfBooks() {
    if (this.data.length === 0) return '0.00 €';
    const total = this.data.reduce((sum, book) => sum + book.price, 0);
    const average = total / this.data.length;
    return average.toFixed(2) + ' €';
  }
  booksOfTypeNotes(){
    const NOTE_TYPE = 'Apunts';
    return this.data.filter(book => book.publisher === NOTE_TYPE);

  }
  booksNotSold(){
    return this.data.filter(book => book.soldDate === '');
  }
  incrementPriceOfbooks(percentatge) {
    this.data = this.data.map(book => {
      book.price = +(book.price * (1 + percentatge)).toFixed(2);
      return book;
    });
  }
    
  toString() {
    return this.data.map(book => book.toString()).join('\n');
  }
  
}
 