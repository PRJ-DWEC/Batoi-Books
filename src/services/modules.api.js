const URL = import.meta.env.VITE_SERVER + "/modules"; 


export async function getDBModules() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error('Error al obtener los módulos');
  return await res.json();
}
