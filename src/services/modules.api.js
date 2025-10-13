const URL = 'http://localhost:3000/modules';


export async function getDBModules() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error('Error al obtener los módulos');
  return await res.json();
}
