import Module from './module.class.js';
import * as api from '../services/modules.api.js';

export default class Modules {
  constructor() {
    this.data = [];
  }


  async populate() {
    const modules = await api.getDBModules();
    this.data = modules.map(m => new Module(m.code, m.cliteral, m.vliteral, m.courseId));
  }


  getModuleByCode(code) {
    const module = this.data.find(m => m.code === code);
    if (!module) throw new Error(`No existe ese módulo ${code}`);
    return module;
  }


  toString() {
    return this.data.map(module => module.toString()).join('\n');
  }
}
