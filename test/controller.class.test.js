/**
 * @vitest-environment jsdom
 */
import {
  describe,
  test,
  expect,
  vi,
  beforeAll,
  beforeEach,
  afterAll,
} from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import mockBooks from "./fixtures/books.json";
import mockUsers from "./fixtures/users.json";
import mockModules from "./fixtures/modules.json";
import { nextTick } from "process"; // Si necesitas esperar al siguiente tick del event loop

import Controller from "../src/controller/controller.class";
import View from "../src/view/view.class";
import exp from "constants";

const newBook = {
  moduleCode: "MOCK",
  publisher: "Apunts",
  price: 34,
  pages: 76,
  status: "bad",
  comments: "Muy buen estado",
};
const restHandlers = [
  http.get("http://localhost:3000/books", () => {
    return HttpResponse.json(mockBooks);
  }),
  http.get("http://localhost:3000/users", () => {
    return HttpResponse.json(mockUsers);
  }),
  http.get("http://localhost:3000/modules", () => {
    return HttpResponse.json(mockModules);
  }),
  http.post('http://localhost:3000/books', async ({ request }) => {
    const body = await request.json()
    if (body.id) return HttpResponse.error()
    if (!body.moduleCode) return HttpResponse.error()
    if (!body.publisher) return HttpResponse.error()
    // Haremos que falle si el moduleCode es 'ERROR'
    if (body.moduleCode === 'ERROR') return HttpResponse.error()
    return HttpResponse.json({ id: 8, ...body })
  }),
  http.delete('http://localhost:3000/books/:id', (req, res, ctx) => {
    const id = parseInt(req.params.id)
    // Haremos que falle si el id es 1
    if (id === 1) return HttpResponse.error()
    const existentIds = mockBooks.map(book => book.id)
    return (existentIds.includes(id)) ? HttpResponse.json({}) : HttpResponse.notFound()
  }),
  http.put('http://localhost:3000/books/:id', async ({request}) => {
    const id = parseInt(req.params.id)
    const body = await request.json()
    if (!body.id) return HttpResponse.error()
    if (!body.moduleCode) return HttpResponse.error()
    if (!body.publisher) return HttpResponse.error()
    // Haremos que falle si el id es 1
    if (id === 1) return HttpResponse.error()
    return HttpResponse.json(body)
  }),
];

describe("Controller", () => {
  let controller;
  const server = setupServer(...restHandlers);
  beforeAll(() => {
  });
  beforeEach(async () => {
    server.listen({ onUnhandledRequest: "error" });

    document.body.innerHTML = `
    <div id="messages"></div>
    <div id="list"></div>
    <div id="form">
      <div>
        <label for="id-remove">Precio:</label>
        <input id="id-remove" value="1">
        <button id="removeBtn">Borrar libro</button>
      </div>
      <form id="bookForm">
        <input id="id-module" value="MOCK" />
        <input id="publisher" value="Apunts" />
        <input id="price" value="34" />
        <input id="pages" value="76" />
        <input id="comments" value="Muy buen estado" />
        <input type="radio" name="status" value="bad" checked />
        <button type="submit">Añadir</button>
      </form>
      <select id="id-module"></select>
    </div>
    <div id="about"></div>
  `;
   controller = new Controller();
  await controller.init();
  });
  afterAll(() => {
    server.close();
  });

  test("init should display the modules in the select", async () => {
    expect(
      document.querySelectorAll("#id-module option").length
    ).toBeGreaterThanOrEqual(3);
  });
  test("init should display the books in the list", async () => {
    const books = document.querySelectorAll("#list>div");
    expect(books.length).toBe(3);
    expect(books[1].textContent).toContain("McGraw-Hill");
  });
  test("each book should be a div with the class card", async () => {
    const cards = document.querySelectorAll("#list>div.card");
    expect(cards.length).toBe(3);
  });
  test("handleSubmitBook should be called when the form is submitted", async () => {
    const handleSubmitBookSpy = vi.spyOn(controller, "handleSubmitBook");
    await controller.init();
    expect(handleSubmitBookSpy).toHaveBeenCalledTimes(0);
    const form = document.getElementById("bookForm");
    form.dispatchEvent(new Event("submit"));
    expect(handleSubmitBookSpy).toHaveBeenCalledTimes(1);
    expect(handleSubmitBookSpy).toHaveBeenCalledWith({
      moduleCode: "MOCK",
      publisher: "Apunts",
      price: 34 || "34",
      pages: 76 || "76",
      status: "bad",
      comments: "Muy buen estado",
    });
  });
  test("handleSubmitBook should display a book when called", async () => {
    await controller.handleSubmitBook(newBook);
    const cards = document.querySelectorAll("#list>div");
    expect(cards.length).toBe(4);
    expect(cards[3].textContent).toContain(newBook.moduleCode);
  });
  test("handleSubmitBook should NOT display the book when the server fails", async () => {
    server.use(
      http.post("http://localhost:3000/books", () => {
        return HttpResponse.error();
      })
    );
    await controller.handleSubmitBook(newBook);
    const cards = document.querySelectorAll("#list>div");
    expect(cards.length).toBe(3);
  });
  test("handleSubmitBook should display an error message when the server fails", async () => {
    server.use(
      http.post("http://localhost:3000/books", () => {
        return HttpResponse.error();
      })
    );
    await controller.handleSubmitBook(newBook);
    expect(document.getElementById("messages").textContent).toContain("Error");
  });

  test("handleRemoveBook should be called when the button is clicked", async () => {
    const handleRemoveBookSpy = vi.spyOn(controller, "handleRemoveBook");
    await controller.init();
    expect(handleRemoveBookSpy).toHaveBeenCalledTimes(0);
    const button = document.getElementById("removeBtn");
    button.dispatchEvent(new Event("click"));
    expect(handleRemoveBookSpy).toHaveBeenCalledTimes(1);
    expect(handleRemoveBookSpy).toHaveBeenCalledWith("1");
  });
  test("handleRemoveBook should remove a book when called", async () => {
    await controller.handleRemoveBook(3);
    const cards = document.querySelectorAll("#list>div");
    expect(cards.length).toBe(2);
    cards.forEach((card) => {
      expect(card.textContent).not.toContain("good");
    });
  });
  test("handleRemoveBook should NOT remove a book when the server fails", async () => {
    server.use(
      http.delete("http://localhost:3000/books/3", () => {
        return HttpResponse.error();
      })
    );
    await controller.handleRemoveBook(3);
    const cards = document.querySelectorAll("#list>div");
    expect(cards.length).toBe(3);
  });
  test("handleRemoveBook should display an error message when the server fails", async () => {
    server.use(
      http.delete("http://localhost:3000/books/3", () => {
        return HttpResponse.error();
      })
    );
    await controller.handleRemoveBook(3);
    expect(document.getElementById("messages").textContent).toContain("Error");
  });
  test("handleRemoveBook should NOT remove a book when the id does not exist", async () => {
    await controller.handleRemoveBook(100);
    const cards = document.querySelectorAll("#list>div");
    expect(cards.length).toBe(3);
    expect(document.getElementById("messages").textContent).toContain("Error");
  });
  test("init should display an error message when the server fails", async () => {
    server.use(
      http.get("http://localhost:3000/books", () => {
        return HttpResponse.error();
      })
    );
    await controller.init();
    expect(document.getElementById("messages").textContent).toContain("Error");
  });
});
