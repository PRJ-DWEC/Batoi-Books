const URL = import.meta.env.VITE_SERVER + "/books"; 


export async function getDBBooks() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error('Error al obtener los libros');
  return await res.json();
}


export async function getDBBook(id) {
  const res = await fetch(`${URL}/${id}`);
  if (!res.ok) throw new Error(`No se pudo obtener el libro con id ${id}`);
  return await res.json();
}


export async function addDBBook(book) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error('Error al añadir el libro');
  return await res.json();
}


export async function changeDBBook(book) {
  const res = await fetch(`${URL}/${book.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error('Error al modificar el libro');
  return await res.json();
}


export async function removeDBBook(id) {
  const res = await fetch(`${URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar el libro');
  
}

/**
 * (NUEVO) Comprueba si ya existe un libro para un usuario y módulo.
 * Una petición a /books?userId=X&moduleCode=Y devuelve:
 * - Un array con el libro (longitud > 0) si SÍ existe.
 * - Un array vacío (longitud === 0) si NO existe.
 */
export async function checkDBBookExists(userId, moduleCode) {
  const res = await fetch(`${URL}?userId=${userId}&moduleCode=${moduleCode}`);
  if (!res.ok) throw new Error('Error al comprobar la existencia del libro');
  const data = await res.json();
  // Si la API devuelve un array, su longitud indica si existe
  return data.length > 0;
}