import { describe, test, expect } from 'vitest'
import Module from '../src/model/module.class.js'

describe('Clase Module', () => {
  test('constructor crea un módulo', () => {
    const newModule = new Module('ABCD', 'Nuevo módulo', 'Nou mòdul', '12')
    expect(newModule).toBeInstanceOf(Module);
    expect(newModule).toEqual({
      code: 'ABCD',
      cliteral: 'Nuevo módulo',
      vliteral: 'Nou mòdul',
      courseId: '12'
    });
  });

  test('toString pinta el módulo', () => {
    const newModule = new Module('ABCD', 'Nuevo módulo', 'Nou mòdul', '12')
    expect(newModule.toString()).toContain('ABCD');
  });

})