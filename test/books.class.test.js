import { describe, test, expect, beforeEach, beforeAll, afterAll } from 'vitest'
import Books from '../src/model/books.class'
import Book from '../src/model/book.class'
import mockBooks from './fixtures/books.json'
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const restHandlers = [
  http.get('http://localhost:3000/books', () => {
    return HttpResponse.json(mockBooks)
  }),
  http.get('http://localhost:3000/books/3', () => {
    return HttpResponse.json(mockBooks[1])
  }),
  http.get('http://localhost:3000/books/100', (req, res, ctx) => {
    return res(ctx.status(404))
  }),
  http.post('http://localhost:3000/books', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 8, ...body })
  }),
  http.delete('http://localhost:3000/books/:id', (req, res, ctx) => {
    const id = parseInt(req.params.id)
    const existentIds = mockBooks.map(book => book.id)
    return (existentIds.includes(id)) ? HttpResponse.json({}) : HttpResponse.notFound()
  }),
  http.put('http://localhost:3000/books/7', async ({request}) => {
    const body = await request.json()
    return HttpResponse.json(body)
  }),
  http.put('http://localhost:3000/books/100', (req, res, ctx) => {
    return res(ctx.status(404))
  }),
]

const server = setupServer(...restHandlers);

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

describe('Clase Books', () => {
  let books
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })
  beforeEach(async () => {
    server.resetHandlers()
    books = new Books()
    books.data = mockBooks.map(book => new Book(book))
  })
  afterAll(() => {
    server.close()
  })

	test('Existe la clase Books', () => {
		expect(Books).toBeDefined();
	});
  
  test('constructor crea el array en la propiedad data', () => {
    const books = new Books()
    expect(books).toBeInstanceOf(Books);
    expect(books.data).toEqual([]);
  });
  
  test('populate añade un array de libros', async () => {
    books.data = []
    await books.populate()
    expect(books.data.length).toBe(3)
    for (let i in mockBooks) {
      expect(books.data[i]).toBeInstanceOf(Book)
      for (let prop in mockBooks[i]) {
        expect(books.data[i][prop]).toBe(mockBooks[i][prop])
      }
    }
  })

  test('addBook añade un nuevo libro', async () => {
    const newBook = await books.addBook(payloadSold)
    expect(books.data.length).toBe(4)
    expect(newBook).toBeInstanceOf(Book)
    expect(newBook.id).toBeGreaterThan(7);
    for (let prop in payloadSold) {
      expect(newBook[prop]).toBe(payloadSold[prop])
    }
  });

  test('removeBook elimina un libro si existe', async () => {
    const bookToRemove = await books.removeBook(mockBooks[1].id)
    expect(books.data.length).toBe(2);
    await books.removeBook(mockBooks[0].id)
    expect(books.data.length).toBe(1);
    await books.removeBook(mockBooks[2].id)
    expect(books.data.length).toBe(0);
  });

  test('removeBook lanza una excepción si un libro no existe', async () => {
    await expect(books.removeBook(100)).rejects.toThrowError();
    expect(books.data.length).toBe(3);
  });

  test('changeBook modifica un libro si existe', async () => {
    const book = books.data[0]
    book.price = 100
    const modifiedBook = await books.changeBook(book)
    expect(modifiedBook).toBeInstanceOf(Book)
    expect(modifiedBook.price).toBe(100)
    expect(books.data[0]).toBe(modifiedBook)
    expect(modifiedBook.price).toBe(100)
  });

  test('changeBook lanza una excepción si un libro no existe', async () => {
    const book = new Book({id: 100, ...payloadSold})
    await expect(books.changeBook(book)).rejects.toThrowError();
    expect(books.data.length).toBe(3);
  });

  test('toString pinta correctamente los libros', () => {
    const text = books.toString()
    expect(text).toContain(mockBooks[0].id);
    expect(text).toContain(mockBooks[mockBooks.length-1].id);
  });

  test('getBookById 7 devuelve el libro con id 7', () => {
    const response = books.getBookById(7)
    expect(response).toBeInstanceOf(Book)
    expect(response.id).toBe(7)
  });

  test('getBookById 100 lanza una excepción', () => {
    expect(() => books.getBookById(100)).toThrowError()
  });

  test('getBookIndexById 7 devuelve 0', () => {
    const response = books.getBookIndexById(7)
    expect(response).toBe(0)
  });

  test('getBookIndexById 100 lanza una excepción', () => {
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
