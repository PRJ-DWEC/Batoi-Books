import { describe, test, expect, beforeEach, vi } from 'vitest'
import Modules from '../src/model/modules.class'
import Module from '../src/model/module.class'
import data from './fixtures/modules.json'

describe('Clase Modules: constructor y populate', () => {
	test('Existe la clase Modules', () => {
		expect(Modules).toBeDefined();
	});
  
  test('constructor crea el array en la propiedad data', () => {
    const modules = new Modules()
    expect(modules).toBeInstanceOf(Modules);
    expect(modules.data).toEqual([]);
  });

  test('populate puebla la propiedad data', () => {
    const modules = new Modules()
    modules.populate(data)
    expect(modules.data.length).toBe(2)
    for (let i in modules.data) {
      expect(modules.data[i]).toBeInstanceOf(Module)
      for (let prop in modules.data[i]) {
        expect(modules.data[i][prop]).toBe(data[i][prop])
      }
    }
  });
})

describe('Clase Modules: resto de métodos', () => {
  let modules
  beforeEach(() => {
    modules = new Modules()
    modules.populate(data)
  })

  test('toString pinta correctamente los módulos', () => {
    const text = modules.toString()
    expect(text).toContain(data[0].code);
    expect(text).toContain(data[data.length-1].code);
  })

  test('getModuleByCode "AAAA" devuelve el módulo con code "AAAA"', () => {
    const response = modules.getModuleByCode('AAAA')
    expect(response).toBeInstanceOf(Module)
    expect(response.code).toBe('AAAA')
  });
  
  test('getModuleByCode "9999" devuelve un error', () => {
    expect(modules.getModuleByCode).toBeDefined()
    expect(() => modules.getModuleByCode('9999')).toThrowError()
  });
})
