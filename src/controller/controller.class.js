import View from "../view/view.class.js";
import Books from "../model/books.class.js";
import Modules from "../model/modules.class.js";

export default class Controller {
  constructor() {
    this.view = new View();
    this.books = new Books();
    this.modules = new Modules();
  }

  async init() {
    try {
      await Promise.all([this.modules.populate(), this.books.populate()]);
      this.view.renderModules(this.modules.data);
      this.view.renderBooks(this.books.data, this.modules);
      this.view.setBookSubmitHandler(this.handleSubmitBook.bind(this));
      this.view.setBookRemoveHandler(this.handleRemoveBook.bind(this));
    } catch (error) {
       this.view.showMessage("error", `Error al inicializar: ${error?.message || error}`);
    }
  }

  async handleSubmitBook(payload) { // Payload ahora incluye soldDate (vacío o con valor)
    try {
      const processedPayload = {
        ...payload,
        price: parseFloat(payload.price) || 0,
        pages: parseInt(payload.pages, 10) || 0,
        userId: 1, 
        // Aseguramos que soldDate sea una cadena vacía si no se proporciona
        soldDate: payload.soldDate || "", 
      };
      const newBook = await this.books.addBook(processedPayload);
      this.view.renderBook(newBook, this.modules);
      this.view.showMessage("info", "Libro añadido con éxito");
    } catch (error) {
      this.view.showMessage("error", `Error al añadir libro: ${error.message}`);
    }
  }

  async handleRemoveBook(id) {
    try {
       if (!id || String(id).trim() === '') {
           this.view.showMessage("error", "Por favor, introduce un ID válido.");
           return;
       }
      await this.books.removeBook(id); 
      this.view.removeBook(id);
      this.view.showMessage("info", "Libro eliminado con éxito");
    } catch (error) {
      this.view.showMessage("error", `Error al eliminar libro: ${error.message}`);
    }
  }
}