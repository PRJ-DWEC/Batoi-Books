import { describe, test, expect, beforeEach, vi } from 'vitest'
import Books from '../src/model/books.class'
import Book from '../src/model/book.class'
import data from './fixtures/books.json'

const payloadSold = {
  userId: 2,
  moduleCode: 'ABCD',
  publisher: "Apunts",
  price: 34,
  pages: 76,
  status: "bad",
  soldDate: "2023-03-25",
  photo: "https://via.placeholder.com/150",
  comments: "Muy buen estado"
}

const payloadNotSold = {
  userId: 2,
  moduleCode: 'ABCD',
  publisher: "Apunts",
  price: 34,
  pages: 76,
  status: "bad",
}

describe('Clase Books: constructor y populate', () => {
	test('Existe la clase Books', () => {
		expect(Books).toBeDefined();
	});
  
  test('constructor crea el array en la propiedad data', () => {
    const books = new Books()
    expect(books).toBeInstanceOf(Books);
    expect(books.data).toEqual([]);
  });
  
  test('populate añade un array de libros', () => {
    const books = new Books()
    books.populate(data)
    expect(books.data.length).toBe(3)
    for (let i in data) {
      expect(books.data[i]).toBeInstanceOf(Book)
      for (let prop in data[i]) {
        expect(books.data[i][prop]).toBe(data[i][prop])
      }
    }
  })
})

describe('Clase Books', () => {
  let books
  beforeEach(() => {
    books = new Books()
    books.populate(data)
  })

  test('addBook añade un nuevo libro', async () => {
    const newBook = books.addBook(payloadSold)
    expect(books.data.length).toBe(4)
    expect(newBook).toBeInstanceOf(Book)
    expect(newBook.id).toBeGreaterThan(7);
    for (let prop in payloadSold) {
      expect(newBook[prop]).toBe(payloadSold[prop])
    }
  });

  test('addBook asigna id consecutivas sin repetir', async () => {
    const books = new Books()
    let newBook = books.addBook(payloadSold)
    expect(books.data.length).toBe(1)
    const bookId1 = newBook.id
    newBook = books.addBook(payloadNotSold)
    expect(books.data.length).toBe(2)
    expect(newBook.id).toBe(bookId1 + 1)
    expect(books.data.pop()).toBe(newBook)
  });

  test('removeBook elimina un libro si existe', async () => {
    const bookToRemove = books.removeBook(data[1].id)
    expect(books.data.length).toBe(2);
    books.removeBook(data[0].id)
    expect(books.data.length).toBe(1);
    books.removeBook(data[2].id)
    expect(books.data.length).toBe(0);
  });

  test('removeBook lanza una excepción si un libro no existe', () => {
    expect(books.removeBook).toBeDefined()
    expect(() => books.removeBook(100)).toThrowError();
    expect(books.data.length).toBe(3);
  });

  test('changeBook modifica un libro si existe', () => {
    const book = {...books.data[1]}
    book.price = 100
    const modifiedBook = books.changeBook(book)
    expect(modifiedBook).toBeInstanceOf(Book)
    expect(modifiedBook.price).toBe(100)
    expect(books.data[1]).toBe(modifiedBook)
  });

  test('changeBook lanza una excepción si un libro no existe', () => {
    const book = new Book({id: 100, ...payloadSold})
    expect(books.changeBook).toBeDefined()
    expect(() => books.changeBook(book)).toThrowError();
    expect(books.data.length).toBe(3);
  });

  test('toString pinta correctamente los libros', () => {
    const text = books.toString()
    expect(text).toContain(data[0].id);
    expect(text).toContain(data[data.length-1].id);
  });

  test('getBookById 7 devuelve el libro con id 7', () => {
    const response = books.getBookById(7)
    expect(response).toBeInstanceOf(Book)
    expect(response.id).toBe(7)
  });

  test('getBookById 100 lanza una excepción', () => {
    expect(books.getBookById).toBeDefined()
    expect(() => books.getBookById(100)).toThrowError()
  });

  test('getBookIndexById 7 devuelve 0', () => {
    const response = books.getBookIndexById(7)
    expect(response).toBe(0)
  });

  test('getBookIndexById 100 lanza una excepción', () => {
    expect(books.getBookIndexById).toBeDefined()
    expect(() => books.getBookIndexById(100)).toThrowError()
  });

  test('bookExists devuelve true si existe el libro', () => {
    const response = books.bookExists(2, 'ABCD')
    expect(response).toBe(true)
  });

  test('bookExists devuelve false si no existe el libro', () => {
    const response = books.bookExists(2, 'ZZZZ')
    expect(response).toBe(false)
  });

  test('booksFromUser devuelve un array con los 2 libros del usuario 2', () => {
    const response = books.booksFromUser(2)
    expect(response.length).toBe(2)
    response.every((item) => {
      expect(item).toBeInstanceOf(Book)
      expect(item.userId).toBe(2)
    })
  })

  test('booksFromUser devuelve un array vacío para el usuario 12', () => {
    const response = books.booksFromUser(12)
    expect(response).toEqual([])
  })

  test('booksFromModule devuelve un array con los 2 libros del módulo ABCD', () => {
    const response = books.booksFromModule('ABCD')
    expect(response.length).toBe(2)
    for (let item of response) {
      expect(item.moduleCode).toBe('ABCD')
    }
  })

  test('booksFromModule devuelve un array vacío para el módulo ZZZZ', () => {
    const response = books.booksFromModule('ZZZZ')
    expect(response).toEqual([])
  })

  test('booksCheeperThan devuelve un array con los 2 libros de 50 € o menos', () => {
    const response = books.booksCheeperThan(50)
    expect(response.length).toBe(2)
    for (let item of response) {
      expect(item.price).not.toBeGreaterThan(50)
    }
  })

  test('booksCheeperThan devuelve un array vacío para menos de 1 €', () => {
    const response = books.booksCheeperThan(1)
    expect(response).toEqual([])
  })

  test('booksWithStatus devuelve un array con los 2 libros del estado bad', () => {
    const response = books.booksWithStatus('bad')
    expect(response.length).toBe(2)
    for (let item of response) {
      expect(item.status).toBe('bad')
    }
  })

  test('booksWithStatus devuelve un array vacío para el estado new', () => {
    const response = books.booksWithStatus('new')
    expect(response).toEqual([])
  })

  test('averagePriceOfBooks devuelve 32.33 €', () => {
    const response = books.averagePriceOfBooks()
    expect(response).toBe('32.36 €')
  })

  test('averagePriceOfBooks devuelve 0 € para un array vacío', () => {
    const books = new Books()
    const response = books.averagePriceOfBooks()
    expect(response).toBe('0.00 €')
  })

  test('booksOfTypeNotes devuelve un array con los apuntes', () => {
    const response = books.booksOfTypeNotes()
    expect(response.length).toBe(1)
    expect(response[0].publisher).toBe('Apunts')
  })

  test('booksNotSold devuelve un array con los 2 libros no vendidos', () => {
    const response = books.booksNotSold()
    expect(response.length).toBe(2)
    for (let item of response) {
      expect(item.soldDate).toBe('')
    }
  })

  test('incrementPriceOfbooks incrementa el precio un 10% y lo guarda con 2 decimales', async () => {
    const oldPrices = books.data.map(book => book.price)
    books.incrementPriceOfbooks(0.1)
    books.data.every((book, index) => book.price === Math.round(oldPrices[index]*100)/100 )
  });



})
