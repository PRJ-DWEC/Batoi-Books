export default class View {
  constructor() {
    this.messages = document.getElementById("messages");
    this.bookList = document.getElementById("list");      
    this.form = document.getElementById("form");          
    this.bookForm = document.getElementById("bookForm");    
    this.remove = document.getElementById("remove");        
    this.about = document.getElementById("about");         
    this.removeBtn = document.getElementById("removeBtn");    
    this.moduleSelect = document.getElementById("moduleCode"); 

    this.setupNavigation();
  }

  setupNavigation() {
    const mainSections = document.querySelectorAll("main > div");
    document.querySelectorAll("nav a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute("href").substring(1);
        mainSections.forEach((section) => {
          section.classList.toggle("active", section.id === targetId);
        });
      });
    });
    document.getElementById('list')?.classList.add('active');
    document.getElementById('form')?.classList.remove('active');
    document.getElementById('remove')?.classList.remove('active'); 
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

    // --- CORRECCIÓN EN LA LÍNEA DE VENTA ---
    bookCard.innerHTML = `
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
    `;

    if (this.bookList) {
        this.bookList.appendChild(bookCard);
    } else {
        console.error("Error: #list no encontrado para añadir libro.");
    }
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
    } else {
        console.warn(`Libro con ID ${bookId} no encontrado en el DOM para eliminar.`);
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
  _handleRemoveCallback = null;

  setBookSubmitHandler(callback) {
    if (!this.bookForm) return;
    if (this._handleSubmitCallback) {
        this.bookForm.removeEventListener('submit', this._handleSubmitCallback);
    }
    this._handleSubmitCallback = (event) => {
        event.preventDefault(); 
        const formData = new FormData(this.bookForm); 
        const payload = Object.fromEntries(formData.entries()); 
        callback(payload); 
    };
    this.bookForm.addEventListener("submit", this._handleSubmitCallback);
  }

  setBookRemoveHandler(callback) {
    if (!this.removeBtn) return;
    if (this._handleRemoveCallback) {
        this.removeBtn.removeEventListener('click', this._handleRemoveCallback);
    }
    this._handleRemoveCallback = () => {
        const idInput = document.getElementById("id-remove"); 
        const idToRemove = idInput ? idInput.value : null; 
        if (idToRemove) { 
           callback(idToRemove); 
        } else {
           this.showMessage('error', 'Por favor, introduce un ID para borrar.');
        }
    };
    this.removeBtn.addEventListener("click", this._handleRemoveCallback);
  }
}