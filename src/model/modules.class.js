import Module from './module.class.js';
import * as api from '../services/modules.api.js';

export default class Modules {
  constructor() {
    this.data = [];
  }

  // 🔹 Carga módulos desde API o desde un array local
  async populate(data) {
    if (data) {
      this.data = data.map(m => new Module(m.code, m.cliteral, m.vliteral, m.courseId));
    } else {
      const modules = await api.getDBModules();
      this.data = modules.map(m => new Module(m.code, m.cliteral, m.vliteral, m.courseId));
    }
  }

  // 🔹 Obtiene un módulo por su código
  getModuleByCode(code) {
    const module = this.data.find(m => m.code === code);
    if (!module) throw new Error(`No existe ese módulo ${code}`);
    return module;
  }

  // 🔹 Convierte los módulos a string
  toString() {
    return this.data.map(module => module.toString()).join('\n');
  }
}
