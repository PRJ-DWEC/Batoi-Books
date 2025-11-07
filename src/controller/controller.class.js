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
    // Hardcodeado según el ejercicio (usado en handleSubmit y ahora en validación)
    this.currentUserId = 2; 
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
      
      // 2. (NUEVO) Asigna el manejador para el cambio en el select de módulo
      this.view.bindModuleSelectChange(this.handleModuleChange.bind(this));
      
      // 3. Asigna los manejadores para los botones de las tarjetas
      this.view.bindBookListEvents(
          this.handleAddToCart.bind(this), 
          this.handleEditBook.bind(this), 
          this.handleRemoveBook.bind(this) // Este es tu "borrar"
      );

      // --- INICIALIZAR EL ROUTER (SPA) ---
      // Escucha futuros cambios de hash (clics en navegación)
      window.addEventListener('hashchange', this._handleHashChange.bind(this));
      // Llama una vez al inicio para establecer la pestaña correcta al cargar
      this._handleHashChange(); 

    } catch (error) {
       this.view.showMessage("error", `Error al inicializar: ${error?.message || error}`);
    }
  }

  /**
   * Maneja el envío del formulario, tanto para añadir como para editar.
   */
  async handleSubmitForm(payload) {
    
    // --- VALIDACIÓN AÑADIDA ---
    // La validación de campos vacíos y la de módulo duplicado
    // ahora se gestionan en la vista (`_validateForm`),
    // que se llama ANTES de que el controlador reciba el payload.
    // Así que aquí ya no es necesaria la comprobación manual.
    // --- FIN DE LA VALIDACIÓN ---

    const bookId = payload.id; 

    try {
      const processedPayload = {
        ...payload,
        price: parseFloat(payload.price) || 0,
        pages: parseInt(payload.pages, 10) || 0,
        userId: this.currentUserId, // Usamos el ID de usuario hardcodeado
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
  
  /**
   * (NUEVO) Maneja el cambio en el select de módulos para validar duplicados
   */
  async handleModuleChange(moduleCode) {
    // 1. Limpiamos siempre la validación custom anterior
    this.view.setModuleSelectValidity("");
  
    // 2. Si eligen "Selecciona..." (valor vacío), no hay nada que validar.
    if (!moduleCode) {
      this.view.validateModuleField(); // Esto limpiará el span de error
      return;
    }
  
    // 3. Esta validación SÓLO se aplica al AÑADIR, no al EDITAR.
    // Si el campo ID tiene un valor, estamos editando.
    const isEditing = this.view.idInput && this.view.idInput.value;
    if (isEditing) {
      this.view.validateModuleField(); // Limpia por si acaso
      return;
    }
  
    // 4. Estamos AÑADIENDO. Comprobamos si ya existe.
    try {
      const exists = await this.books.bookExists(this.currentUserId, moduleCode);
      
      if (exists) {
        // Si existe, ponemos el error personalizado
        this.view.setModuleSelectValidity("Ya tienes un libro a la venta para este módulo.");
      }
      // Si no existe, la validez (vacía) ya está puesta desde el paso 1.
    
    } catch (error) {
      // Si la API falla, no bloqueamos al usuario, pero mostramos un error.
      this.view.showMessage("error", `Error al comprobar el módulo: ${error.message}`);
      // Dejamos la validez custom vacía para que pueda continuar
      this.view.setModuleSelectValidity(""); 
    }
  
    // 5. Le decimos a la vista que actualice el estado visual de ESE campo
    this.view.validateModuleField();
  }
  
  /**
   * (NUEVO) Maneja el cambio de hash para la navegación SPA
   * @private
   */
  _handleHashChange() {
    // Obtiene el hash (ej. "#form"), quita el '#'
    // Si está vacío (ej. "index.html"), usa 'list' por defecto.
    const targetId = window.location.hash.substring(1) || 'list';
  
    // 1. Usa la función de la Vista para mostrar la pestaña correcta
    if (this.view && typeof this.view.showTab === 'function') {
      this.view.showTab(targetId);
    }
  
    // 2. Si vamos al formulario, lo reseteamos (requisito del ejercicio)
    if (targetId === 'form' && this.view && typeof this.view.resetForm === 'function') {
      this.view.resetForm();
    }
  }
}