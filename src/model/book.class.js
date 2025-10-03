export default class Book {
    constructor(book) {
      this.id = book.id;
      this.userId = book.userId;
      this.moduleCode = book.moduleCode;
      this.publisher = book.publisher;
      this.price = book.price;
      this.pages = book.pages;
      this.status = book.status;
      this.photo = book.photo || '';
      this.comments = book.comments || '';
      this.soldDate = book.soldDate || '';
    }
  
    toString() {
        return `Book {id: ${this.id}, userID: ${this.userId},  moduleCode: ${this.moduleCode}, publisher: ${this.publisher}, price: ${this.price}, pages: ${this.pages}, status: ${this.status}, photo: ${this.photo}, comments: ${this.comments}, soldDate: ${this.soldDate}}`;
    }
  }
       