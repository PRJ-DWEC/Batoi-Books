import Module from './module.class.js';

export default class Modules {
  constructor() {
    this.data = [];
  }

  populate(data) {
    this.data = data.map(m => new Module(m.code, m.cliteral, m.vliteral, m.courseId));
  }

  getModuleByCode(code){
    const module = this.data.find(module => module.code === code);
    if (!module) throw new Error('No existe ese modulo ${code}');
    
    return module;
}

  toString() {
    return this.data.map(module => module.toString()).join('\n');
  }
}
