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

    this.setupNavigation();
    
    // Listener para el botón reset (ESTO ESTÁ BIEN)
    this.bookForm?.addEventListener('reset', (e) => {
        e.preventDefault();
        this.resetForm();
    });
  }

  setupNavigation() {
    const mainSections = document.querySelectorAll("main > div");
    
    // Función para cambiar de pestaña
    this.showTab = (targetId) => {
       mainSections.forEach((section) => {
          section.classList.toggle("active", section.id === targetId);
       });
    }
    
    document.querySelectorAll("nav a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute("href").substring(1);
        this.showTab(targetId);
      });
    });
    
    document.getElementById('list')?.classList.add('active');
    document.getElementById('form')?.classList.remove('active');
    // document.getElementById('remove')?.classList.remove('active'); // Ya no existe
    document.getElementById('about')?.classList.remove('active');
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
  
  /**
   * (NUEVO) Generador de HTML para la tarjeta
   */
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

  /**
   * (MODIFICADO) Renderiza un libro usando el generador de HTML
   */
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
    bookCard.dataset.id = book.id; // Clave para los eventos

    bookCard.innerHTML = this._createBookCardHTML(book, moduleCliteral);

    if (this.bookList) {
        this.bookList.appendChild(bookCard);
    } else {
        console.error("Error: #list no encontrado para añadir libro.");
    }
  }

  /**
   * (NUEVO) Actualiza una tarjeta de libro existente en el DOM tras editar
   */
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
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close" onclick="this.parentElement.remove()">x</button>
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

  setBookSubmitHandler(callback) {
    if (!this.bookForm) return;
    if (this._handleSubmitCallback) {
        this.bookForm.removeEventListener('submit', this._handleSubmitCallback);
    }
    this._handleSubmitCallback = (event) => {
        event.preventDefault(); 
        
        // Habilitamos el ID temporalmente para que FormData lo recoja
        if (this.idInput) this.idInput.disabled = false;
        
        const formData = new FormData(this.bookForm); 
        const payload = Object.fromEntries(formData.entries()); 
        
        // Si estábamos editando, lo volvemos a deshabilitar
        if (payload.id && this.idInput) this.idInput.disabled = true;

        callback(payload); 
        
        // ¡¡ESTA LÍNEA ES LA QUE DABA EL PROBLEMA!!
        // this.resetForm(); // ¡¡ELIMINADA!!
    };
    
    // (Tu código del botón reset está en el constructor, lo cual es correcto)
    
    this.bookForm.addEventListener("submit", this._handleSubmitCallback);
  }
  
  /**
   * (NUEVO) Resetea el formulario al estado "Añadir libro"
   */
  resetForm() {
    if (!this.bookForm) return;

    // 1. Borra TODOS los campos
    this.bookForm.reset(); 

    // 2. Restaura el título
    if (this.formTitle) this.formTitle.textContent = 'Añadir libro';

    // 3. Oculta el campo ID
    if (this.idInputDiv) this.idInputDiv.style.display = 'none'; 
    
    // 4. Limpia y habilita el ID
    if (this.idInput) {
      this.idInput.value = ''; 
      this.idInput.disabled = false; 
    }
  }
  
  /**
   * (NUEVO) Rellena el formulario para editar un libro
   */
  populateFormForEdit(book) {
    if (!this.bookForm) return;
    
    // 1. Cambia el título
    if (this.formTitle) this.formTitle.textContent = 'Editar libro';
    
    // 2. Muestra el DIV de la ID y pone el valor
    if (this.idInputDiv) this.idInputDiv.style.display = 'block';
    if (this.idInput) {
      this.idInput.value = book.id;
      // 3. Deshabilita el INPUT
      this.idInput.disabled = true; 
    }

    // 4. Completa todos los INPUTS
    this.bookForm.moduleCode.value = book.moduleCode;
    this.bookForm.publisher.value = book.publisher;
    this.bookForm.price.value = book.price;
    this.bookForm.pages.value = book.pages;
    this.bookForm.comments.value = book.comments;
    this.bookForm.soldDate.value = book.soldDate ? book.soldDate.split('T')[0] : '';
    
    const statusRadio = this.bookForm.querySelector(`input[name="status"][value="${book.status}"]`);
    if (statusRadio) statusRadio.checked = true;

    // Cambia a la pestaña del formulario
    this.showTab('form');
    // Hacemos scroll para ver el formulario
    this.form.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * (NUEVO) Manejador de clics para la lista (Delegación de eventos)
   */
  _handleBookListClick = (event) => {
    const target = event.target;
    const button = target.closest('button'); // Busca el botón clicado
    if (!button) return;

    const card = target.closest('.card'); // Busca la tarjeta padre
    if (!card) return;

    const id = card.dataset.id; // Obtiene el ID de la tarjeta
    if (!id) return;

    // Llama al callback correspondiente según la clase del botón
    if (button.classList.contains('btn-cart') && this._handleCartClick) {
      this._handleCartClick(id);
    } else if (button.classList.contains('btn-edit') && this._handleEditClick) {
      this._handleEditClick(id);
    } else if (button.classList.contains('btn-delete') && this._handleDeleteClick) {
      this._handleDeleteClick(id);
    }
  };
  
  /**
   * (NUEVO) Asigna los callbacks del controlador a los eventos
   */
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