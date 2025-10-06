import { describe, test, expect, beforeEach, vi } from 'vitest'
import Modules from '../src/model/modules.class'
import Module from '../src/model/module.class'
import mockModules from './fixtures/modules.json'
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const restHandlers = [
  http.get('http://localhost:3000/modules', () => {
    return HttpResponse.json(mockModules)
  }),
]

const server = setupServer(...restHandlers);

describe('Clase Modules', () => {
	test('Existe la clase Modules', () => {
		expect(Modules).toBeDefined();
	});
  
  test('constructor crea el array en la propiedad data', () => {
    const modules = new Modules()
    expect(modules).toBeInstanceOf(Modules);
    expect(modules.data).toEqual([]);
  });

  test('populate puebla la propiedad data', async () => {
    server.listen({ onUnhandledRequest: 'error' })
    const modules = new Modules()
    await modules.populate()
    server.close()
    expect(modules.data).toHaveLength(2)
    for (let i in modules.data) {
      expect(modules.data[i]).toBeInstanceOf(Module)
      for (let prop in modules.data[i]) {
        expect(modules.data[i][prop]).toBe(mockModules[i][prop])
      }
    }
  });
})

describe('Clase Modules: resto de métodos', () => {
  let modules
  beforeEach(() => {
    modules = new Modules()
    modules.data = mockModules.map(module => new Module(module.code, module.cliteral, module.vliteral, module.courseId))
  })

  test('toString pinta correctamente los módulos', () => {
    const text = modules.toString()
    expect(text).toContain(mockModules[0].code);
    expect(text).toContain(mockModules[mockModules.length-1].code);
  })

  test('getModuleByCode "AAAA" devuelve el módulo con code "AAAA"', () => {
    const response = modules.getModuleByCode('AAAA')
    expect(response).toBeInstanceOf(Module)
    expect(response.code).toBe('AAAA')
  });
  
  test('getModuleByCode "9999" devuelve un error', () => {
    expect(() => modules.getModuleByCode('9999')).toThrowError()
  });
})
