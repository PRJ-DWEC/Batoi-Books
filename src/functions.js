'use strict'
import '/src/services/datos.js'

function getBookById(books, bookId){
    const book = books.find(book => book.id === bookId);
    if (!book) throw new Error('No existe ese libro ${bookId}');
    
    return book;

    
}

function getBookIndexById(books, bookId){
    const index = books.findIndex(book => book.id === bookId);
    if (index === -1) throw new Error('No existe ese libro ${bookId}');
    
    return index;
}

function bookExists(books, userId, moduleCode){
    const book = books.some(book => book.userId === userId && book.moduleCode === moduleCode);
    return book;

}
function booksFromUser(books, userId){
    return books.filter(book => book.userId === userId); 
}
function booksFromModule(books, moduleCode){
    return books.filter(book => book.moduleCode === moduleCode);

}
function booksCheeperThan(books, price){
    return books.filter(book => book.price < price);

}
function booksWithStatus(books, status){
    return books.filter(book => book.status === status);
}
function averagePriceOfBooks(books){
    if (books.length == 0) return '0.00 €';
    const total = books.reduce((sum, book) => sum + book.price, 0);
    const average = total / books.length;
    return average.toFixed(2) + ' €';
}
function booksOfTypeNotes(books){
    return books.filter(book => book.publisher === 'Apunts');

}
function booksNotSold(books){
    return books.filter(book => book.soldDate === '');
}
function incrementPriceOfbooks(books, percentatge){
    return books.map(book => ({
        ...book, 
        price: book.price + book.price *  percentatge}));
}
function getUserById(users, userId){
    const user = users.find(user => user.id === userId);
    if (!user) throw new Error('No existe ese usuario ${userId}');
    
    return user;    
}
function getUserIndexById(users, userId){
    const index = users.findIndex(user => user.id === userId);
    if (index === -1) throw new Error('No existe ese usuario ${userId}');
    
    return index;
} 
function getUserByNickName(users, nick){
    const user = users.find(user => user.nick === nick);
    if (!user) throw new Error('No existe ese usuario ${nick}');
    
    return user;
}
function getModuleByCode(modules, moduleCode){
    const module = modules.find(module => module.code === moduleCode);
    if (!module) throw new Error('No existe ese modulo ${moduleCode}');
    
    return module;
}
export {
    getBookById,
    getBookIndexById,
    bookExists,
    booksFromUser,
    booksFromModule,
    booksCheeperThan,
    booksWithStatus,
    averagePriceOfBooks,
    booksOfTypeNotes,
    booksNotSold,
    incrementPriceOfbooks,
    getUserById,
    getUserIndexById,
    getUserByNickName,
    getModuleByCode
  }