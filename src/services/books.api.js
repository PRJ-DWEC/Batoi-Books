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
