export default class View {
  constructor() {
    this.messages = document.getElementById("messages");
    this.bookList = document.getElementById("list");
    this.form = document.getElementById("form");
    this.bookForm = document.getElementById("bookForm");
    this.about = document.getElementById("about");
    this.moduleSelect = document.getElementById("moduleCode");

    // Elementos del formulario para Editar/Añadir
    this.formTitle = document.getElementById("formTitle");
    this.idInputDiv = document.getElementById("id-div");
    this.idInput = document.getElementById("id");

    // (NUEVO) Referencias a los spans de error
    this.errors = {
      moduleCode: document.getElementById("moduleCode-error"),
      publisher: document.getElementById("publisher-error"),
      price: document.getElementById("price-error"),
      pages: document.getElementById("pages-error"),
      status: document.getElementById("status-error")
    };

    this.setupNavigation();
    
    // Listener para el botón reset
    this.bookForm?.addEventListener('reset', (e) => {
        e.preventDefault();
        this.resetForm();
    });
  }

  /**
   * (MODIFICADO) Prepara la función showTab para que el controlador
   * la use cuando cambie el hash.
   */
  setupNavigation() {
    const mainSections = document.querySelectorAll("main > div");
    
    // Función para cambiar de pestaña.
    // El controlador la llamará cuando cambie el hash.
    this.showTab = (targetId) => {
       mainSections.forEach((section) => {
          section.classList.toggle("active", section.id === targetId);
       });
    }
    
    // Ya no añadimos listeners de clic a la navegación aquí.
    // El evento 'hashchange' global lo gestionará el controlador.
  }

  renderModules(modules) {
    if (!this.moduleSelect) return;
    this.moduleSelect.innerHTML = '<option value="">Selecciona un módulo</option>';
    modules.forEach((module) => {
      const option = document.createElement("option");
      option.value = module.code;
      option.textContent = module.cliteral;
      this.moduleSelect.appendChild(option);
    });
  }
  
  _createBookCardHTML(book, moduleCliteral) {
     return `
      <img src="${book.photo || "https://via.placeholder.com/100x150?text=IMG"}" alt="Libro: ${book.id}">
      <div>
        <h3>${moduleCliteral} (${book.id})</h3>
        <h4>${book.publisher}</h4>
        <p>${book.pages} páginas</p>
        <p>Estado: ${book.status}</p>
        <p>${book.soldDate ? `Vendido el ${new Date(book.soldDate).toLocaleDateString()}` : "En venta"}</p> 
        <p>${book.comments || "Sin comentarios."}</p> 
        <h4>${parseFloat(book.price).toFixed(2)} €</h4>
      </div>
      <div class="card-buttons">
        <button class="btn-cart" title="Añadir al carrito"><span class="material-icons">add_shopping_cart</span></button>
        <button class="btn-edit" title="Editar"><span class="material-icons">edit</span></button>
        <button class="btn-delete" title="Eliminar"><span class="material-icons">delete</span></button>
      </div>
    `;
  }

  renderBook(book, modules) {
    let moduleCliteral = book.moduleCode;
    try {
      const module = modules.getModuleByCode(book.moduleCode);
      moduleCliteral = module.cliteral;
    } catch (e) {
      console.warn(`Módulo ${book.moduleCode} no encontrado para libro ${book.id}`);
    }

    const bookCard = document.createElement("div");
    bookCard.className = "card";
    bookCard.dataset.id = book.id; 

    bookCard.innerHTML = this._createBookCardHTML(book, moduleCliteral);

    if (this.bookList) {
        this.bookList.appendChild(bookCard);
    } else {
        console.error("Error: #list no encontrado para añadir libro.");
    }
  }

  updateBook(book, modules) {
    const bookCard = this.bookList?.querySelector(`div.card[data-id="${book.id}"]`);
    if (!bookCard) return;
    
    let moduleCliteral = book.moduleCode;
    try {
      const module = modules.getModuleByCode(book.moduleCode);
      moduleCliteral = module.cliteral;
    } catch (e) {
       console.warn(`Módulo ${book.moduleCode} no encontrado para libro ${book.id}`);
    }
    
    bookCard.innerHTML = this._createBookCardHTML(book, moduleCliteral);
  }


  renderBooks(books, modules) {
    if (!this.bookList) return;
    this.bookList.innerHTML = ""; 
    books.forEach((book) => this.renderBook(book, modules));
  }

  removeBook(bookId) {
    const bookElement = this.bookList?.querySelector(`div.card[data-id="${bookId}"]`);
    if (bookElement) {
      bookElement.remove();
    }
  }

  showMessage(type, message) {
    if (!this.messages) return;
    const messageElement = document.createElement("div");
    messageElement.className = `_${type} alert ${type === 'error' ? 'alert-danger' : 'alert-info'} alert-dismissible`;
    messageElement.setAttribute("role", "alert");
    messageElement.innerHTML = `
        ${message}
        <button type"button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onclick="this.parentElement.remove()">x</button>
    `;
    this.messages.appendChild(messageElement);

    if (type !== "error") {
      setTimeout(() => {
        if (messageElement.parentElement) { 
            messageElement.remove();
        }
      }, 3000);
    }
  }

  _handleSubmitCallback = null;
  _handleCartClick = null;
  _handleEditClick = null;
  _handleDeleteClick = null;

  // --- MÉTODOS DE VALIDACIÓN PERSONALIZADOS ---

  /**
   * (MODIFICADO) Limpia los mensajes de error globales Y los spans
   */
  _clearMessages() {
    if (this.messages) {
      // Limpia solo los mensajes de error globales
      const errorMessages = this.messages.querySelectorAll('._error');
      errorMessages.forEach(msg => msg.remove());
    }
    // (NUEVO) Limpiar también los spans de error de cada campo
    if (this.errors) {
      Object.values(this.errors).forEach(span => {
        if (span) span.textContent = '';
      });
    }
  }

  /**
   * (MODIFICADO) Valida el formulario manualmente y muestra errores en los spans.
   * @returns {boolean} - True si el formulario es válido, false si no.
   */
  _validateForm() {
    this._clearMessages();
    let isValid = true;
    
    // Accedemos a los campos del formulario
    const moduleCode = this.bookForm.moduleCode;
    const publisher = this.bookForm.publisher;
    const price = this.bookForm.price;
    const pages = this.bookForm.pages;
    const status = this.bookForm.querySelector('input[name="status"]');

    // 1. Validar Módulo (requerido)
    if (!moduleCode.validity.valid) {
      isValid = false;
      if(this.errors.moduleCode) this.errors.moduleCode.textContent = moduleCode.validationMessage;
    }

    // 2. Validar Editorial (requerido, minlength)
    if (!publisher.validity.valid) {
      isValid = false;
      if(this.errors.publisher) this.errors.publisher.textContent = publisher.validationMessage;
    }

    // 3. Validar Precio (requerido, numérico, min: 0)
    if (!price.validity.valid) {
      isValid = false;
      if(this.errors.price) this.errors.price.textContent = price.validationMessage;
    }

    // 4. Validar Páginas (requerido, numérico, min: 0, entero)
    if (!pages.validity.valid) {
      isValid = false;
      if(this.errors.pages) this.errors.pages.textContent = pages.validationMessage;
    }

    // 5. Validar Estado (requerido)
    if (status && !status.validity.valid) {
      isValid = false;
      // Usamos el validationMessage del primer radio (todos tienen 'required')
      if(this.errors.status) this.errors.status.textContent = status.validationMessage;
    }

    // (Opcional) Mostrar un mensaje genérico arriba si hay errores
    if (!isValid) {
      this.showMessage('error', 'Por favor, corrige los errores indicados en el formulario.');
    }

    return isValid;
  }

  // --- FIN DE MÉTODOS DE VALIDACIÓN ---

  setBookSubmitHandler(callback) {
    if (!this.bookForm) return;
    if (this._handleSubmitCallback) {
        this.bookForm.removeEventListener('submit', this._handleSubmitCallback);
    }
    
    this._handleSubmitCallback = (event) => {
        event.preventDefault(); 
        
        // 1. (MODIFICADO) Llamamos a nuestra validación manual
        if (!this._validateForm()) {
          // Si no es válido, detenemos la ejecución.
          // Los errores ya se han mostrado.
          return;
        }
        
        // --- El formulario es válido, continuamos ---
        
        if (this.idInput) this.idInput.disabled = false;
        
        const formData = new FormData(this.bookForm); 
        const payload = Object.fromEntries(formData.entries()); 
        
        if (payload.id && this.idInput) this.idInput.disabled = true;

        callback(payload); 
    };
    
    this.bookForm.addEventListener("submit", this._handleSubmitCallback);
  }
  
  /**
   * (MODIFICADO) Resetea el formulario manualmente y limpia errores
   */
  resetForm() {
    // 1. Borra los campos manualmente
    this.bookForm.publisher.value = '';
    this.bookForm.price.value = '';
    this.bookForm.pages.value = '';
    this.bookForm.comments.value = '';
    this.bookForm.soldDate.value = '';
    this.bookForm.moduleCode.value = ''; // Resetea el select
    
    // 2. Resetea el radio button al valor por defecto ('good')
    const defaultRadio = this.bookForm.querySelector('input[name="status"][value="good"]');
    if (defaultRadio) {
        defaultRadio.checked = true;
    }
    
    // 3. Restaura el título
    if (this.formTitle) this.formTitle.textContent = 'Añadir libro';
    
    // 4. Oculta el campo ID
    if (this.idInputDiv) this.idInputDiv.style.display = 'none'; 
    
    // 5. Limpia y habilita el ID
    if (this.idInput) {
      this.idInput.value = ''; 
      this.idInput.disabled = false; 
    }

    // 6. (MODIFICADO) Limpia los mensajes de error globales Y los spans
    this._clearMessages();
  }
  
  /**
   * (NUEVO) Rellena el formulario para editar un libro
   */
  populateFormForEdit(book) {
    if (!this.bookForm) return;
    
    // Limpiamos errores anteriores
    this._clearMessages();

    if (this.formTitle) this.formTitle.textContent = 'Editar libro';
    if (this.idInputDiv) this.idInputDiv.style.display = 'block';
    if (this.idInput) {
      this.idInput.value = book.id;
      this.idInput.disabled = true; 
    }

    this.bookForm.moduleCode.value = book.moduleCode;
    this.bookForm.publisher.value = book.publisher;
    this.bookForm.price.value = book.price;
    this.bookForm.pages.value = book.pages;
    this.bookForm.comments.value = book.comments;
    this.bookForm.soldDate.value = book.soldDate ? book.soldDate.split('T')[0] : '';
    
    const statusRadio = this.bookForm.querySelector(`input[name="status"][value="${book.status}"]`);
    if (statusRadio) statusRadio.checked = true;

    this.showTab('form');
    this.form.scrollIntoView({ behavior: 'smooth' });
  }

  _handleBookListClick = (event) => {
    const target = event.target;
    const button = target.closest('button'); 
    if (!button) return;

    const card = target.closest('.card'); 
    if (!card) return;

    const id = card.dataset.id; 
    if (!id) return;

    if (button.classList.contains('btn-cart') && this._handleCartClick) {
      this._handleCartClick(id);
    } else if (button.classList.contains('btn-edit') && this._handleEditClick) {
      this._handleEditClick(id);
    } else if (button.classList.contains('btn-delete') && this._handleDeleteClick) {
      this._handleDeleteClick(id);
    }
  };
  
  bindBookListEvents(cartHandler, editHandler, deleteHandler) {
      this._handleCartClick = cartHandler;
      this._handleEditClick = editHandler;
      this._handleDeleteClick = deleteHandler;

      if (this.bookList) {
        this.bookList.removeEventListener('click', this._handleBookListClick);
        this.bookList.addEventListener('click', this._handleBookListClick);
      }
  }
}