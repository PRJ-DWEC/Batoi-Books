import Controller from "./controller/controller.class.js";
import "./style.css"; // Asegúrate de tener tu archivo CSS
import logoBatoi from "/logoBatoi.png"; // Verifica la ruta a tu logo

// Renderiza la estructura HTML base según el enunciado
document.querySelector("#app").innerHTML = `
  <header>
    <img src="${logoBatoi}" class="logo" alt="Logo de Batoi" />
    <h1>BatoiBooks</h1>
  </header>
  
  <nav>
    <ul>
      <li><a href="#list">Ver Libros</a></li>
      <li><a href="#form">Añadir Libro</a></li>
      <li><a href="#about">Acerca de...</a></li>
    </ul>
  </nav>

  <div id="messages"></div>

  <main>
   
    <div id="list" class="active"></div> 

    <div id="remove">
      <label for="id-remove">ID del libro a borrar:</label> 
      <input type="text" id="id-remove" placeholder="Introduce el ID del libro" /> 
      <button id="removeBtn">Borrar</button>
    </div>

   
    <div id="form">
      <form id="bookForm" novalidate> 
       
        <div>
          <label for="moduleCode">Módulo:</label>
          <select id="moduleCode" name="moduleCode" required></select>
        </div>
        <div>
          <label for="publisher">Editorial:</label>
          <input type="text" id="publisher" name="publisher" required minlength="2" />
        </div>
        <div>
          <label for="price">Precio (€):</label>
          <input type="number" id="price" name="price" required min="0" step="0.01" />
        </div>
        <div>
          <label for="pages">Páginas:</label>
          <input type="number" id="pages" name="pages" required min="1" />
        </div>
        <div class="radio-group">
          <label>Estado:</label>
          <div> 
            <input type="radio" id="status-new" name="status" value="new" required /> <label for="status-new">Nuevo</label>
            <input type="radio" id="status-good" name="status" value="good" checked/> <label for="status-good">Bueno</label>
            <input type="radio" id="status-bad" name="status" value="bad" /> <label for="status-bad">Malo</label>
          </div>
        </div>

       
        <div>
          <label for="soldDate">Fecha Venta (opcional):</label>
          <input type="date" id="soldDate" name="soldDate" /> 
        </div>
        

        <div>
          <label for="comments">Comentarios:</label>
          <textarea id="comments" name="comments" rows="3"></textarea>
        </div>
        <div class="form-buttons"> 
          <button type="submit">Guardar</button>
          <button type="reset">Reset</button>
        </div>
      </form>
    </div>

    
    <div id="about">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.</p>
    </div>
  </main>

  <footer>
    <p>Joan Brotons</p> 
  </footer>
`;

// Instancia e inicializa el controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const myController = new Controller();
  myController.init();
});