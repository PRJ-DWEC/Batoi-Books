import { describe, test, expect } from 'vitest'
import User from '../src/model/user.class'

describe('Clase User', () => {
  test('constructor crea un usuario', () => {
    const newUser = new User(5, 'dsa', 'asd@asd.es', '4321');
    expect(newUser).toBeInstanceOf(User);
    expect(newUser).toEqual({
      id: 5,
      email: 'asd@asd.es',
      nick: 'dsa',
      password: '4321',
    });
  });

  test('toString pinta correctamente el usuario', () => {
    const newUser = new User(5, 'dsa', 'asd@asd.es', '4321');
    expect(newUser.toString()).toContain('5');
  });

})
