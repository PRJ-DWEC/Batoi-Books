import View from "../view/view.class.js";
import Books from "../model/books.class.js";
import Modules from "../model/modules.class.js";
import Cart from "../model/cart.class.js"; 

export default class Controller {
  constructor() {
    this.view = new View();
    this.books = new Books();
    this.modules = new Modules();
    this.cart = new Cart(); 
  }

  async init() {
    try {
      await Promise.all([
          this.modules.populate(), 
          this.books.populate(),
          this.cart.populate() 
      ]);
      this.view.renderModules(this.modules.data);
      this.view.renderBooks(this.books.data, this.modules);

      // --- MANEJADORES DE EVENTOS ACTUALIZADOS ---
      // 1. Asigna el manejador para el submit del formulario (Añadir/Editar)
      this.view.setBookSubmitHandler(this.handleSubmitForm.bind(this));
      
      // 2. Asigna los manejadores para los botones de las tarjetas
      this.view.bindBookListEvents(
          this.handleAddToCart.bind(this), 
          this.handleEditBook.bind(this), 
          this.handleRemoveBook.bind(this) // Este es tu "borrar"
      );

    } catch (error) {
       this.view.showMessage("error", `Error al inicializar: ${error?.message || error}`);
    }
  }

  /**
   * Maneja el envío del formulario, tanto para añadir como para editar.
   */
  async handleSubmitForm(payload) {
    const bookId = payload.id; 

    try {
      const processedPayload = {
        ...payload,
        price: parseFloat(payload.price) || 0,
        pages: parseInt(payload.pages, 10) || 0,
        userId: 2, // userId '2' 
        soldDate: payload.soldDate || "", 
      };
      
      if (bookId) {
        // --- MODO EDICIÓN ---
        processedPayload.id = bookId; 
        const updatedBook = await this.books.changeBook(processedPayload);
        this.view.updateBook(updatedBook, this.modules); 
        this.view.showMessage("info", "Libro modificado con éxito");
      } else {
        // --- MODO AÑADIR ---
        delete processedPayload.id; 
        const newBook = await this.books.addBook(processedPayload);
        this.view.renderBook(newBook, this.modules);
        this.view.showMessage("info", "Libro añadido con éxito");
      }
      
      // ¡¡AQUÍ ESTÁ LA LÍNEA QUE HACE EL RESET!!
      // Se llama después de Añadir y después de Editar.
      this.view.resetForm(); 

    } catch (error) {
      this.view.showMessage("error", `Error al guardar libro: ${error.message}`);
    }
  }

  /**
   * Maneja el clic en el icono de eliminar (borrar) libro.
   */
  async handleRemoveBook(id) {
    try {
       if (!id || String(id).trim() === '') {
           this.view.showMessage("error", "ID de libro no válido.");
           return;
       }
       
       const book = this.books.getBookById(id); 
       const moduleName = this.modules.getModuleByCode(book.moduleCode)?.cliteral || book.moduleCode;

       if (confirm(`¿Estás seguro de que quieres eliminar el libro "${moduleName}" (ID: ${id})?`)) {
          await this.books.removeBook(id); 
          this.view.removeBook(id); 
          this.view.showMessage("info", "Libro eliminado con éxito");
       }
    } catch (error) {
      this.view.showMessage("error", `Error al eliminar libro: ${error.message}`);
    }
  }

  /**
   * AÑADIDO: Maneja el clic en el icono de añadir al carrito.
   */
  handleAddToCart(id) {
    try {
        const book = this.books.getBookById(id);
        this.cart.addItem(book); 
        const moduleName = this.modules.getModuleByCode(book.moduleCode)?.cliteral || book.moduleCode;
        this.view.showMessage("info", `Libro "${moduleName}" (ID: ${id}) añadido al carrito.`);
    } catch (error) {
        this.view.showMessage("error", `${error.message}`);
    }
  }

  /**
   * AÑADIDO: Maneja el clic en el icono de editar libro.
   */
  handleEditBook(id) {
    try {
        const book = this.books.getBookById(id);
        this.view.populateFormForEdit(book);

    } catch (error) {
        this.view.showMessage("error", `Error al preparar edición: ${error.message}`);
    }
  }
}