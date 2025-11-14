export default class View {
  constructor() {
    this.messages = document.getElementById("messages");
    this.bookList = document.getElementById("list");
    this.form = document.getElementById("form");
    this.bookForm = document.getElementById("bookForm");
    this.about = document.getElementById("about");
    this.moduleSelect = document.getElementById("moduleCode");
    
    // (NUEVO) Referencia a la sección del carrito
    this.cartSection = document.getElementById("cart");

    // Elementos del formulario para Editar/Añadir
    this.formTitle = document.getElementById("formTitle");
    this.idInputDiv = document.getElementById("id-div");
    this.idInput = document.getElementById("id");

    // Referencias a los spans de error
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
    
    this._handleModuleChangeCallback = null;
  }

  /**
   * Prepara la función showTab para que el controlador
   * la use cuando cambie el hash.
   */
  setupNavigation() {
    const mainSections = document.querySelectorAll("main > div");
    
    // Función para cambiar de pestaña.
    this.showTab = (targetId) => {
       mainSections.forEach((section) => {
          section.classList.toggle("active", section.id === targetId);
       });
    }
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
  
  // (NUEVO) Plantilla para la tarjeta del carrito (solo botón eliminar)
  _createCartCardHTML(book, moduleCliteral) {
     return `
      <img src="${book.photo || "https://via.placeholder.com/100x150?text=IMG"}" alt="Libro: ${book.id}">
      <div>
        <h3>${moduleCliteral} (${book.id})</h3>
        <h4>${book.publisher}</h4>
        <p>${book.pages} páginas</p>
        <p>Estado: ${book.status}</p>
        <h4>${parseFloat(book.price).toFixed(2)} €</h4>
      </div>
      <div class="card-buttons">
        <button class="btn-delete-cart" title="Eliminar del carrito"><span class="material-icons">remove_shopping_cart</span></button>
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
  
  // (NUEVO) Renderiza la vista completa del carrito
  renderCart(cartData, modules) {
    if (!this.cartSection) return;

    // 1. Limpiar vista anterior
    this.cartSection.innerHTML = "";
    
    // 2. Crear el contenedor de la lista (para que se parezca al #list)
    const cartList = document.createElement('div');
    cartList.className = 'cart-list-container'; // Estilo similar a #list

    if (cartData.length === 0) {
        cartList.innerHTML = '<p>El carrito está vacío.</p>';
    } else {
        cartData.forEach(book => {
            let moduleCliteral = book.moduleCode;
            try {
                const module = modules.getModuleByCode(book.moduleCode);
                moduleCliteral = module.cliteral;
            } catch (e) {
                console.warn(`Módulo ${book.moduleCode} no encontrado para libro ${book.id}`);
            }
            
            const bookCard = document.createElement("div");
            bookCard.className = "card"; // Reutilizamos el estilo de tarjeta
            bookCard.dataset.id = book.id; 
            bookCard.innerHTML = this._createCartCardHTML(book, moduleCliteral);
            cartList.appendChild(bookCard);
        });
    }
    this.cartSection.appendChild(cartList);

    // 3. Añadir botones de acción del carrito
    const cartActions = document.createElement('div');
    cartActions.className = 'cart-actions';
    cartActions.innerHTML = `
        <button id="btn-purchase" class="btn-action-primary">Realizar la compra</button>
        <button id="btn-empty-cart" class="btn-action-secondary">Vaciar carrito</button>
    `;
    // Deshabilitar botones si el carrito está vacío
    if (cartData.length === 0) {
        cartActions.querySelector('#btn-purchase').disabled = true;
        cartActions.querySelector('#btn-empty-cart').disabled = true;
    }
    this.cartSection.appendChild(cartActions);
  }


  removeBook(bookId) {
    const bookElement = this.bookList?.querySelector(`div.card[data-id="${bookId}"]`);
    if (bookElement) {
      bookElement.remove();
    }
  }

  // (NUEVO) Elimina un item de la vista del carrito
  removeCartItem(bookId) {
    const bookElement = this.cartSection?.querySelector(`div.card[data-id="${bookId}"]`);
    if (bookElement) {
      bookElement.remove();
    }
    // Actualizar estado de botones si el carrito queda vacío
    const remainingItems = this.cartSection.querySelectorAll('div.card').length;
    if (remainingItems === 0) {
        const btnPurchase = this.cartSection.querySelector('#btn-purchase');
        const btnEmpty = this.cartSection.querySelector('#btn-empty-cart');
        const listContainer = this.cartSection.querySelector('.cart-list-container');
        
        if(btnPurchase) btnPurchase.disabled = true;
        if(btnEmpty) btnEmpty.disabled = true;
        if(listContainer) listContainer.innerHTML = '<p>El carrito está vacío.</p>';
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

  _clearMessages() {
    if (this.messages) {
      const errorMessages = this.messages.querySelectorAll('._error');
      errorMessages.forEach(msg => msg.remove());
    }
    if (this.errors) {
      Object.values(this.errors).forEach(span => {
        if (span) span.textContent = '';
      });
    }
  }

  _validateForm() {
    this._clearMessages();
    let isValid = true;
    
    const moduleCode = this.bookForm.moduleCode;
    const publisher = this.bookForm.publisher;
    const price = this.bookForm.price;
    const pages = this.bookForm.pages;
    const status = this.bookForm.querySelector('input[name="status"]');

    if (!moduleCode.validity.valid) {
      isValid = false;
      if(this.errors.moduleCode) this.errors.moduleCode.textContent = moduleCode.validationMessage;
    }
    if (!publisher.validity.valid) {
      isValid = false;
      if(this.errors.publisher) this.errors.publisher.textContent = publisher.validationMessage;
    }
    if (!price.validity.valid) {
      isValid = false;
      if(this.errors.price) this.errors.price.textContent = price.validationMessage;
    }
    if (!pages.validity.valid) {
      isValid = false;
      if(this.errors.pages) this.errors.pages.textContent = pages.validationMessage;
    }
    if (status && !status.validity.valid) {
      isValid = false;
      if(this.errors.status) this.errors.status.textContent = status.validationMessage;
    }

    if (!isValid) {
      this.showMessage('error', 'Por favor, corrige los errores indicados en el formulario.');
    }

    return isValid;
  }

  setBookSubmitHandler(callback) {
    if (!this.bookForm) return;
    if (this._handleSubmitCallback) {
        this.bookForm.removeEventListener('submit', this._handleSubmitCallback);
    }
    
    this._handleSubmitCallback = (event) => {
        event.preventDefault(); 
        
        if (!this._validateForm()) {
          return;
        }
        
        if (this.idInput) this.idInput.disabled = false;
        
        const formData = new FormData(this.bookForm); 
        const payload = Object.fromEntries(formData.entries()); 
        
        if (payload.id && this.idInput) this.idInput.disabled = true;

        callback(payload); 
    };
    
    this.bookForm.addEventListener("submit", this._handleSubmitCallback);
  }
  
  resetForm() {
    this.bookForm.publisher.value = '';
    this.bookForm.price.value = '';
    this.bookForm.pages.value = '';
    this.bookForm.comments.value = '';
    this.bookForm.soldDate.value = '';
    this.bookForm.moduleCode.value = ''; 
    
    this.setModuleSelectValidity("");
    
    const defaultRadio = this.bookForm.querySelector('input[name="status"][value="good"]');
    if (defaultRadio) {
        defaultRadio.checked = true;
    }
    
    if (this.formTitle) this.formTitle.textContent = 'Añadir libro';
    if (this.idInputDiv) this.idInputDiv.style.display = 'none'; 
    if (this.idInput) {
      this.idInput.value = ''; 
      this.idInput.disabled = false; 
    }
    this._clearMessages();
  }
  
  populateFormForEdit(book) {
    if (!this.bookForm) return;
    
    this.setModuleSelectValidity("");
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

  setModuleSelectValidity(message) {
    if (this.moduleSelect) {
      this.moduleSelect.setCustomValidity(message);
    }
  }

  validateModuleField() {
    if (!this.moduleSelect || !this.errors.moduleCode) return;
    this.errors.moduleCode.textContent = '';
    if (!this.moduleSelect.validity.valid) {
      this.errors.moduleCode.textContent = this.moduleSelect.validationMessage;
    }
  }

  bindModuleSelectChange(callback) {
    if (!this.moduleSelect) return;
    if (this._handleModuleChangeCallback) {
      this.moduleSelect.removeEventListener('change', this._handleModuleChangeCallback);
    }
    this._handleModuleChangeCallback = (event) => {
      callback(event.target.value);
    };
    this.moduleSelect.addEventListener('change', this._handleModuleChangeCallback);
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

  // --- (NUEVOS) MANEJADORES PARA EVENTOS DEL CARRITO ---

  _handleRemoveCartItemClick = null;
  _handlePurchaseClick = null;
  _handleEmptyCartClick = null;

  // (NUEVO) Listener centralizado para la sección #cart
  _handleCartActionsClick = (event) => {
    const target = event.target;
    
    // Botón "Eliminar" de una tarjeta
    const removeButton = target.closest('.btn-delete-cart');
    if (removeButton && this._handleRemoveCartItemClick) {
        const card = target.closest('.card');
        if (card && card.dataset.id) {
            this._handleRemoveCartItemClick(card.dataset.id);
        }
        return;
    }

    // Botón "Realizar Compra"
    if (target.id === 'btn-purchase' && this._handlePurchaseClick) {
        this._handlePurchaseClick();
        return;
    }

    // Botón "Vaciar Carrito"
    if (target.id === 'btn-empty-cart' && this._handleEmptyCartClick) {
        this._handleEmptyCartClick();
    }
  }
  
  // (NUEVO) Asigna los listeners para la vista del carrito
  bindCartEvents(removeItemHandler, purchaseHandler, emptyCartHandler) {
      this._handleRemoveCartItemClick = removeItemHandler;
      this._handlePurchaseClick = purchaseHandler;
      this._handleEmptyCartClick = emptyCartHandler;

      if (this.cartSection) {
          this.cartSection.removeEventListener('click', this._handleCartActionsClick);
          this.cartSection.addEventListener('click', this._handleCartActionsClick);
      }
  }
}