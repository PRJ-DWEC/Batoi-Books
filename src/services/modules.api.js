const URL = 'http://localhost:3000/modules';


export async function getDBModules() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error('Error al obtener los módulos');
  return await res.json();
}


export async function getDBModule(code) {
  const res = await fetch(`${URL}/${code}`);
  if (!res.ok) throw new Error(`No se pudo obtener el módulo con código ${code}`);
  return await res.json();
}
