const URL = 'http://localhost:3000/users';


export async function getDBUsers() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error('Error al obtener los usuarios');
  return await res.json();
}


export async function getDBUser(id) {
  const res = await fetch(`${URL}/${id}`);
  if (!res.ok) throw new Error(`No se pudo obtener el usuario con id ${id}`);
  return await res.json();
}


export async function addDBUser(user) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Error al añadir el usuario');
  return await res.json();
}


export async function changeDBUser(user) {
  const res = await fetch(`${URL}/${user.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Error al modificar el usuario');
  return await res.json();
}


export async function changeDBUserPassword(id, newPassword) {
  const res = await fetch(`${URL}/${id}`, {
    method: 'PATCH', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: newPassword }),
  });

  if (!res.ok) throw new Error('Error al cambiar la contraseña');
  return await res.json();
}

export async function removeDBUser(id) {
  const res = await fetch(`${URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar el usuario');
}
