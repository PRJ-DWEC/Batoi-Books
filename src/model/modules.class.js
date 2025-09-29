import Module from './module.class.js';

export default class Modules {
  constructor() {
    this.data = [];
  }

  populate(array) {
    this.data = array.map(m => new Module(m));
  }

  addModule(moduleData) {
    const newModule = new Module(moduleData);
    this.data.push(newModule);
    return newModule;
  }

  removeModule(code) {
    const index = this.data.findIndex(m => m.code === code);
    if (index === -1) throw new Error(`No existe ese módulo ${code}`);
    this.data.splice(index, 1);
  }

  changeModule(newModuleData) {
    const index = this.data.findIndex(m => m.code === newModuleData.code);
    if (index === -1) throw new Error(`No existe ese módulo ${newModuleData.code}`);
    this.data[index] = new Module(newModuleData);
  }

  getModuleByCode(modules, moduleCode){
    const module = modules.find(module => module.code === moduleCode);
    if (!module) throw new Error('No existe ese modulo ${moduleCode}');
    
    return module;
}

  toString() {
    return this.data.map(module => module.toString()).join('\n');
  }
}
