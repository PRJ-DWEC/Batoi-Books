/**
 * @vitest-environment jsdom
 */
import { describe, test, expect, vi, beforeEach } from "vitest";

import View from "../src/view/view.class";

describe("View", () => {
  beforeEach(() => {
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
  });

  test("View should have the properties asked", () => {
    const view = new View();
    expect(view).toBeInstanceOf(View);
    expect(view.messages).not.toBeNull();
    expect(view.bookList).not.toBeNull();
    expect(view.form).not.toBeNull();
    expect(view.bookForm).not.toBeNull();
    expect(view.remove).not.toBeNull();
    expect(view.about).not.toBeNull();
  });

  test("setBookSubmitHandler should call the callback with the form data", () => {
    const view = new View();
    expect(view.setBookSubmitHandler).toBeInstanceOf(Function);
    const callback = vi.fn();
    view.setBookSubmitHandler(callback);
    expect(callback).toHaveBeenCalledTimes(0);

    const form = document.getElementById("bookForm");
    form.dispatchEvent(new Event("submit"));

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith({
      moduleCode: "MOCK",
      publisher: "Apunts",
      price: "34",
      pages: "76",
      status: "bad",
      comments: "Muy buen estado",
    });
  });

  test("setBookRemoveHandler should call the callback", () => {
    const view = new View();
    expect(view.setBookRemoveHandler).toBeInstanceOf(Function);
    const callback = vi.fn();
    view.setBookRemoveHandler(callback);
    expect(callback).toHaveBeenCalledTimes(0);

    const remove = document.getElementById("removeBtn");
    remove.dispatchEvent(new Event("click"));

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("1");
  });
});
