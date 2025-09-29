import Book from './book.class.js';

export default class Books {
  constructor() {
    this.data = [];
    this.idLibros = 0;
  }

  populate(books) {
    this.idLibros = books.length;
    this.data = books.map(item => new Book(item));
  }

  addBook(bookData) {
    const newBook = new Book({ ...bookData, id: this.data.length});
    this.data.push(newBook);
    return newBook;
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
  }s

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

  bookExists(userId, moduleId) {
  return this.data.some(book => book.userId === userId && book.moduleId === moduleId);
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
    return this.data.filter(book => book.publisher === 'Apunts');

  }
  booksNotSold(){
    return this.data.filter(book => book.soldDate === '');
  }
  incrementPriceOfbooks(percentatge){
    return this.data.map(book => ({
        ...book, 
        price: book.price + book.price *  percentatge}));
  }
  toString() {
    return this.data.map(book => book.toString()).join('\n');
  }
  
}
