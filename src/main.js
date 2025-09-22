import './style.css'
import javascriptLogo from '/logoBatoi.png'

document.querySelector('#app').innerHTML = `
  <header>
    <img src="${javascriptLogo}" class="logo" alt="JavaScript logo" />
    <h1>BatoiBooks</h1>
  </header>
  <p class="read-the-docs">
    Abre la Consola para ver su funcionamiento
  </p>
`

