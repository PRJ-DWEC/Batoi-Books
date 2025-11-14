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
    this.currentUserId = 2; 
  }

  async init() {
    try {
      await Promise.all([
          this.modules.populate(), 
          this.books.populate(),
          this.cart.populate() // (MODIFICADO) Carga el carrito desde LocalStorage
      ]);
      this.view.renderModules(this.modules.data);
      this.view.renderBooks(this.books.data, this.modules);

      // --- MANEJADORES DE EVENTOS ACTUALIZADOS ---
      // 1. Asigna el manejador para el submit del formulario (Añadir/Editar)
      this.view.setBookSubmitHandler(this.handleSubmitForm.bind(this));
      
      // 2. Asigna el manejador para el cambio en el select de módulo
      this.view.bindModuleSelectChange(this.handleModuleChange.bind(this));
      
      // 3. Asigna los manejadores para los botones de las tarjetas (#list)
      this.view.bindBookListEvents(
          this.handleAddToCart.bind(this), 
          this.handleEditBook.bind(this), 
          this.handleRemoveBook.bind(this)
      );
      
      // 4. (NUEVO) Asigna los manejadores para los botones de la vista (#cart)
      this.view.bindCartEvents(
          this.handleRemoveFromCart.bind(this),
          this.handlePurchase.bind(this),
          this.handleEmptyCart.bind(this)
      );


      // --- INICIALIZAR EL ROUTER (SPA) ---
      window.addEventListener('hashchange', this._handleHashChange.bind(this));
      this._handleHashChange(); 

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
        userId: this.currentUserId,
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
      
      this.view.resetForm(); 

    } catch (error) {
      this.view.showMessage("error", `Error al guardar libro: ${error.message}`);
    }
  }

  /**
   * Maneja el clic en el icono de eliminar (borrar) libro de #list.
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
   * (MODIFICADO) Maneja el clic en el icono de añadir al carrito.
   */
  handleAddToCart(id) {
    try {
        const book = this.books.getBookById(id);
        this.cart.addItem(book); // Esto ya guarda en LocalStorage
        const moduleName = this.modules.getModuleByCode(book.moduleCode)?.cliteral || book.moduleCode;
        this.view.showMessage("info", `Libro "${moduleName}" (ID: ${id}) añadido al carrito.`);

        // (NUEVO) Re-renderizar el carrito si está visible
        if (window.location.hash === '#cart') {
            this.view.renderCart(this.cart.data, this.modules);
        }
    } catch (error) {
        this.view.showMessage("error", `${error.message}`);
    }
  }

  /**
   * Maneja el clic en el icono de editar libro.
   */
  handleEditBook(id) {
    try {
        const book = this.books.getBookById(id);
        this.view.populateFormForEdit(book);

    } catch (error) {
        this.view.showMessage("error", `Error al preparar edición: ${error.message}`);
    }
  }
  
  /**
   * Maneja el cambio en el select de módulos para validar duplicados
   */
  async handleModuleChange(moduleCode) {
    this.view.setModuleSelectValidity("");
  
    if (!moduleCode) {
      this.view.validateModuleField(); 
      return;
    }
  
    const isEditing = this.view.idInput && this.view.idInput.value;
    if (isEditing) {
      this.view.validateModuleField(); 
      return;
    }
  
    try {
      const exists = await this.books.bookExists(this.currentUserId, moduleCode);
      if (exists) {
        this.view.setModuleSelectValidity("Ya tienes un libro a la venta para este módulo.");
      }
    } catch (error) {
      this.view.showMessage("error", `Error al comprobar el módulo: ${error.message}`);
      this.view.setModuleSelectValidity(""); 
    }
  
    this.view.validateModuleField();
  }

  // --- (NUEVOS) MANEJADORES PARA EL CARRITO ---

  /**
   * (NUEVO) Maneja el clic en el botón "Eliminar del carrito" en la vista #cart
   */
  async handleRemoveFromCart(id) {
    try {
        this.cart.removeItem(id); // Esto ya guarda en LocalStorage
        this.view.removeCartItem(id); // Elimina solo la tarjeta de la vista
        this.view.showMessage("info", "Libro eliminado del carrito.");
    } catch (error) {
        this.view.showMessage("error", `Error al eliminar del carrito: ${error.message}`);
    }
  }

  /**
   * (NUEVO) Maneja el clic en "Realizar la compra"
   */
  async handlePurchase() {
    // Simulación: Mostrar mensaje y vaciar carrito
    this.cart.emptyCart(); // Vacía el modelo y guarda en LocalStorage
    this.view.renderCart(this.cart.data, this.modules); // Re-renderiza (ahora vacío)
    this.view.showMessage("info", "Compra realizada con éxito. (Simulación)");
  }

  /**
   * (NUEVO) Maneja el clic en "Vaciar carrito"
   */
  async handleEmptyCart() {
    // Pedir confirmación
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        this.cart.emptyCart(); // Vacía el modelo y guarda en LocalStorage
        this.view.renderCart(this.cart.data, this.modules); // Re-renderiza (vacío)
        this.view.showMessage("info", "Carrito vaciado.");
    }
  }


  /**
   * (MODIFICADO) Maneja el cambio de hash para la navegación SPA
   * @private
   */
  _handleHashChange() {
    const targetId = window.location.hash.substring(1) || 'list';
  
    // 1. Usa la función de la Vista para mostrar la pestaña correcta
    if (this.view && typeof this.view.showTab === 'function') {
      this.view.showTab(targetId);
    }
  
    // 2. Si vamos al formulario, lo reseteamos
    if (targetId === 'form' && this.view && typeof this.view.resetForm === 'function') {
      this.view.resetForm();
    }
    
    // 3. (NUEVO) Si vamos al carrito, lo (re)renderizamos
    if (targetId === 'cart' && this.view && typeof this.view.renderCart === 'function') {
        this.view.renderCart(this.cart.data, this.modules);
    }
  }
}