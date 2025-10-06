const URL = 'http://localhost:3000/modules';

// 🔹 Obtener todos los módulos
export async function getDBModules() {
  const res = await fetch(URL);
  if (!res.ok) throw new Error('Error al obtener los módulos');
  return await res.json();
}

// 🔹 Obtener un módulo por su código
export async function getDBModule(code) {
  const res = await fetch(`${URL}/${code}`);
  if (!res.ok) throw new Error(`No se pudo obtener el módulo con código ${code}`);
  return await res.json();
}
