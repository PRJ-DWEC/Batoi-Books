import { describe, expect, test } from 'vitest'
import * as functions from '../src/functions'

import data from '../src/services/datos'
const books = data.books
const users = data.users
const modules = data.modules

describe('function getBookById', () => {
  test('getBookById 1 devuelve el libro con id 1', () => {
    const response = functions.getBookById(books, 1)
    expect(response.id).toBe(1)
  });
  
  test('getBookById 22 devuelve un error', () => {
    expect(() => functions.getBookById(books, 22)).toThrowError()
  });
})

describe('function getBookIndexById', () => {
  test('getBookIndexById 1 devuelve el índice 0', () => {
    const response = functions.getBookIndexById(books, 1)
    expect(response).toBe(0)
  });
  
  test('getBookIndexById 22 devuelve un error', () => {
    expect(() => functions.getBookIndexById(books, 22)).toThrowError()
  });
})

describe('function bookExists', () => {
  test('bookExists userId 3 moduleCode 5021 devuelve true', () => {
    const response = functions.bookExists(books, 3, '5021')
    expect(response).toBe(true)
  });
  
  test('bookExists userId 33 moduleCode 5021 devuelve false', () => {
    const response = functions.bookExists(books, 33, '5021')
    expect(response).toBe(false)
  });
  
  test('bookExists userId 3 moduleCode 9999 devuelve false', () => {
    const response = functions.bookExists(books, 3, '9999')
    expect(response).toBe(false)
  });
  
  test('bookExists userId 33 moduleCode 9999 devuelve false', () => {
    const response = functions.bookExists(books, 33, '9999')
    expect(response).toBe(false)
  });
})

describe('function booksFromUser', () => {
  test('booksFromUser 4 devuelve 3 libros', () => {
    const response = functions.booksFromUser(books, 4)
    expect(response.length).toBe(3)
  });
  
  test('booksFromUser 2 devuelve 1 libro', () => {
    const response = functions.booksFromUser(books, 2)
    expect(response.length).toBe(1)
  });
    
  test('booksFromUser 22 devuelve 0 libros', () => {
    const response = functions.booksFromUser(books, 22)
    expect(response.length).toBe(0)
  });
})

describe('function booksFromModule', () => {
  test('booksFromModule 5021 devuelve 3 libros', () => {
    const response = functions.booksFromModule(books, '5021')
    expect(response.length).toBe(3)
  });

  test('booksFromModule 9999 devuelve 0 libros', () => {
    const response = functions.booksFromModule(books, '9999')
    expect(response.length).toBe(0)
  });
})

describe('function booksCheeperThan', () => {
  test('booksCheeperThan 10 devuelve 4 libros', () => {
    const response = functions.booksCheeperThan(books, 30)
    expect(response.length).toBe(4)
  });
  
  test('booksCheeperThan 2 devuelve 0 libros', () => {
    const response = functions.booksCheeperThan(books, 2)
    expect(response.length).toBe(0)
  });
})

describe('function booksWithStatus', () => {
  test('booksWithStatus good devuelve 4 libros', () => {
    const response = functions.booksWithStatus(books, 'good')
    expect(response.length).toBe(4)
  });
  
  test('booksWithStatus puff devuelve 0 libros', () => {
    const response = functions.booksWithStatus(books, 'puff')
    expect(response.length).toBe(0)
  });
})

describe('function averagePriceOfBooks', () => {
  test('averagePriceOfBooks devuelve 26.17 €', () => {
    const response = functions.averagePriceOfBooks(books)
    expect(response).toBe('26.17 €')
  });
  
  test('averagePriceOfBooks devuelve 0.00 €', () => {
    const response = functions.averagePriceOfBooks([])
    expect(response).toBe('0.00 €')
  });
})

describe('function booksOfTypeNotes', () => {
  test('booksOfTypeNotes devuelve 3 libros', () => {
    const response = functions.booksOfTypeNotes(books)
    expect(response.length).toBe(3)
  });
  
  test('booksOfTypeNotes devuelve 0 libros', () => {
    const response = functions.booksOfTypeNotes([])
    expect(response.length).toBe(0)
  });
})

describe('function booksNotSold', () => {
  test('booksNotSold devuelve 5 libros', () => {
    const response = functions.booksNotSold(books)
    expect(response.length).toBe(5)
  });
  
  test('booksNotSold devuelve 0 libros', () => {
    const response = functions.booksNotSold([])
    expect(response.length).toBe(0)
  });
})

describe('function incrementPriceOfbooks', () => {
  test('incrementPriceOfbooks 0.1 funciona correctamente', () => {
    const response = functions.incrementPriceOfbooks(books, 0.1)
    expect(response[0].price).toBe(13.2)
    expect(response[3].price).toBe(16.5)
  });
  
  test('incrementPriceOfbooks 0.1 no hace nada si no se le pasan libros', () => {
    const response = functions.incrementPriceOfbooks([], 0.1)
    expect(response.length).toBe(0)
  });
})

describe('function getUserById', () => {
  test('getUserById 2 devuelve el usuario con id 2', () => {
    const response = functions.getUserById(users, 2)
    expect(response.id).toBe(2)
  });
  
  test('getUserById 22 devuelve un error', () => {
    expect(() => functions.getUserById(users, 22)).toThrowError()
  });
})


describe('function getUserIndexById', () => {
  test('getUserIndexById 3 devuelve el índice 1', () => {
    const response = functions.getUserIndexById(users, 3)
    expect(response).toBe(1)
  });
  
  test('getUserIndexById 22 devuelve un error', () => {
    expect(() => functions.getUserIndexById(users, 22)).toThrowError()
  });
})

describe('function getUserByNickName', () => {
  test('getUserByNickName "Juan" devuelve el usuario con nick "Juan"', () => {
    const response = functions.getUserByNickName(users, 'Juan')
    expect(response.nick).toBe('Juan')
  });
  
  test('getUserByNickName "pepe" devuelve un error', () => {
    expect(() => functions.getUserByNickName(users, 'pepe')).toThrowError()
  });
})

describe('function getModuleByCode', () => {
  test('getModuleByCode "5021" devuelve el módulo con code "5021"', () => {
    const response = functions.getModuleByCode(modules, '5021')
    expect(response.code).toBe('5021')
  });
  
  test('getModuleByCode "9999" devuelve un error', () => {
    expect(() => functions.getModuleByCode(modules, '9999')).toThrowError()
  });
})