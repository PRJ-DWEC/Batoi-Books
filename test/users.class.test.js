import { describe, test, expect, beforeEach, vi } from 'vitest'
import Users from '../src/model/users.class'
import User from '../src/model/user.class'
import data from './fixtures/users.json'

let id = 1

describe('Clase Users: constructor y populate', () => {
  test('Existe la clase Users', () => {
    expect(Users).toBeDefined();
  });

  test('constructor crea el array en la propiedad data', () => {
    const users = new Users()
    expect(users).toBeInstanceOf(Users);
    expect(users.data).toEqual([]);
  });

  test('populate puebla la propiedad data', () => {
    const users = new Users()
    users.populate(data)
    expect(users.data.length).toBe(2)
    for (let i in users.data) {
      expect(users.data[i]).toBeInstanceOf(User)
      for (let prop in users.data[i]) {
        expect(users.data[i][prop]).toBe(data[i][prop])
      }
    }
  });
})

describe('Clase Users: resto de métodos', () => {
  let users
  beforeEach(() => {
    users = new Users()
    users.populate(data)
  })

  test('addUser añade un nuevo usuario', () => {
    const newUser = users.addUser({ email: 'asd@asd.es', nick: 'dsa', password: '4321' })
    expect(newUser).toBeInstanceOf(User)
    expect(users.data.length).toBe(3)
    expect(newUser.id).toBeGreaterThan(7);
    expect(newUser.email).toBe('asd@asd.es');
    expect(newUser.nick).toBe('dsa');
    expect(newUser.password).toBe('4321');
    expect(users.data.pop()).toBe(newUser)
  });

  test('addUser asigna id consecutivas sin repetir', () => {
    const users = new Users()
    let newUser = users.addUser({ email: 'asd@asd.es', nick: 'dsa', password: '4321' })
    expect(users.data.length).toBe(1)
    const id1 = newUser.id
    newUser = users.addUser({ email: 'usr@usr.es', nick: 'rsu', password: '4321' })
    expect(users.data.length).toBe(2)
    expect(newUser.id).toBe(id1 + 1);
  });

  test('removeUser elimina un usuario si existe', () => {
    const userToRemove = users.removeUser(data[1].id)
    expect(users.data.length).toBe(1);
    users.removeUser(data[0].id)
    expect(users.data.length).toBe(0);
  });

  test('removeUser lanza una excepción si un usuario no existe', () => {
    expect(users.removeUser).toBeDefined()
    expect(() => users.removeUser(100)).toThrowError();
    expect(users.data.length).toBe(2);
  });

  test('changeUser modifica un usuario', () => {
    const user = {...users.data[1]}
    user.nick = 'newNick'
    const modifiedUser = users.changeUser(user)
    expect(modifiedUser).toBeInstanceOf(User)
    expect(modifiedUser.nick).toBe('newNick')
    expect(users.data[1]).toBe(modifiedUser)
  })

  test('changeUser lanza una excepción si un usuario no existe', () => {
    const user = new User(100, 'nick', 'email', 'pass')
    expect(users.changeUser).toBeDefined()
    expect(() => users.changeUser(user)).toThrowError()
  })

  test('toString pinta correctamente los usuarios', () => {
    const text = users.toString()
    expect(text).toContain(data[0].id);
    expect(text).toContain(data[data.length-1].id);
  })

  test('getUserById 7 devuelve el usuario con id 7', () => {
    const response = users.getUserById(7)
    expect(response).toBeInstanceOf(User)
    expect(response.id).toBe(7)
  });
  
  test('getUserById 9999 devuelve un error', () => {
    expect(users.getUserById).toBeDefined()
    expect(() => users.getUserById(9999)).toThrowError()
  });

  test('getUserIndexById 7 devuelve la posición del usuario con id 7', () => {
    const index = users.getUserIndexById(7)
    expect(index).toBe(0)
  });
  
  test('getUserIndexById 9999 devuelve un error', () => {
    expect(users.getUserIndexById).toBeDefined()
    expect(() => users.getUserIndexById(9999)).toThrowError()
  });

  test('getUserByNickName rsu devuelve el usuario con nick rsu', () => {
    const response = users.getUserByNickName('rsu')
    expect(response).toBeInstanceOf(User)
    expect(response.id).toBe(3)
  });
  
  test('getUserByNickName 9999 devuelve un error', () => {
    expect(users.getUserByNickName).toBeDefined()
    expect(() => users.getUserByNickName(9999)).toThrowError()
  });
})