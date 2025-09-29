import { describe, test, expect } from 'vitest'
import Book from '../src/model/book.class'

const payloadSold = {
  id: 31,
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
  id: 35,
  userId: 2,
  moduleCode: 'ABCD',
  publisher: "Apunts",
  price: 34,
  pages: 76,
  status: "bad",
}

describe('Clase Book', () => {
  test('constructor crea un libro vendido', () => {
    const newBook = new Book(payloadSold)
    expect(newBook).toBeInstanceOf(Book)
    for (let prop in payloadSold) {
      expect(newBook[prop]).toBe(payloadSold[prop])
    }
  });

  test('constructor crea un libro no vendido', () => {
    const newBook = new Book(payloadNotSold)
    for (let prop in payloadNotSold) {
      expect(newBook[prop]).toBe(payloadNotSold[prop])
    }
    expect(newBook.soldDate).toBe('');
  });

  test('toString pinta correctamente el libro', () => {
    const newBook = new Book(payloadSold)
    expect(newBook.toString()).toContain(payloadSold.id);
  });

})