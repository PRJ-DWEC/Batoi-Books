import { describe, test, expect, beforeEach, beforeAll, afterAll } from 'vitest'
import Users from '../src/model/users.class'
import User from '../src/model/user.class'
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import mockUsers from './fixtures/users.json'

const restHandlers = [
  http.get('http://localhost:3000/users', () => {
    return HttpResponse.json(mockUsers)
  }),
  http.get('http://localhost:3000/users/3', () => {
    return HttpResponse.json(mockUsers[1])
  }),
  http.get('http://localhost:3000/users/100', (req, res, ctx) => {
    return res(ctx.status(404))
  }),
  http.post('http://localhost:3000/users', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 8, ...body })
  }),
  http.delete('http://localhost:3000/users/:id', (req, res, ctx) => {
    const id = parseInt(req.params.id)
    const existentIds = mockUsers.map(user => user.id)
    return (existentIds.includes(id)) ? HttpResponse.json({}) : HttpResponse.notFound()
  }),
  http.put('http://localhost:3000/users/7', async ({request}) => {
    const body = await request.json()
    return HttpResponse.json(body)
  }),
  http.put('http://localhost:3000/users/100', (req, res, ctx) => {
    return res(ctx.status(404))
  }),
  http.patch('http://localhost:3000/users/3', async ({request}) => {
    const body = await request.json()
    const user = mockUsers.find(user => user.id === 3)
    return HttpResponse.json({ ...user, password: body.password })
  }),
  http.patch('http://localhost:3000/users/100', (req, res, ctx) => {
    return res(ctx.status(404))
  }),
]

const server = setupServer(...restHandlers);

describe('Clase Users', () => {
  let users
  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' })
  })
  beforeEach(async () => {
    server.resetHandlers()
    users = new Users()
    users.data = mockUsers.map(user => new User(user.id, user.nick, user.email, user.password))
  })
  afterAll(() => {
    server.close()
  })
  
  
  test('Existe la clase Users', () => {
    expect(Users).toBeDefined();
  });

  test('constructor crea el array en la propiedad data', () => {
    const users = new Users()
    expect(users).toBeInstanceOf(Users);
    expect(users.data).toEqual([]);
  });

  test('populate puebla la propiedad data', async () => {
    users.data = []
    await users.populate()
    expect(users.data.length).toBe(2)
    for (let i in users.data) {
      expect(users.data[i]).toBeInstanceOf(User)
      for (let prop in users.data[i]) {
        expect(users.data[i][prop]).toBe(mockUsers[i][prop])
      }
    }
  });

  test('addUser añade un nuevo usuario', async () => {
    const newMockedUser = { nick: 'user8', email: 'user8@example.com', password: 'pass8' };

    const newUser = await users.addUser(newMockedUser)
    expect(newUser).toBeInstanceOf(User)
    expect(users.data).toHaveLength(3)
    expect(newUser.id).toBe(8);
    expect(newUser.email).toBe(newMockedUser.email);
    expect(newUser.nick).toBe(newMockedUser.nick);
    expect(newUser.password).toBe(newMockedUser.password);
  });

  test('removeUser elimina un usuario si existe', async () => {
    await users.removeUser(7)
    expect(users.data).toHaveLength(1);
    expect(users.data[0].id).toBe(3);
    await users.removeUser(3)
    expect(users.data).toHaveLength(0);
  });

  test('removeUser lanza una excepción si un usuario no existe', async () => {
    await expect(users.removeUser(100)).rejects.toThrowError();
    expect(users.data).toHaveLength(2);
  });

  test('changeUser modifica un usuario', async () => {
    const user = users.data[0]
    user.nick = 'newNick'
    const modifiedUser = await users.changeUser(user)
    expect(modifiedUser).toBeInstanceOf(User)
    expect(modifiedUser.nick).toBe('newNick')
    expect(users.data[0]).toBe(modifiedUser)
    expect(users.data[0].nick).toBe('newNick')
  })

  test('changeUser lanza una excepción si un usuario no existe', async () => {
    const user = new User(100, 'nick', 'email', 'pass')
    await (expect(users.changeUser(user))).rejects.toThrowError()
  })

  test('changeUserPassword modifica un usuario', async () => {
    const user = {...users.data[1]}
    const modifiedUser = await users.changeUserPassword(user.id, 'newPassword')
    expect(modifiedUser).toBeInstanceOf(User)
    expect(modifiedUser.password).toBe('newPassword')
    expect(users.data[1]).toBe(modifiedUser)
    expect(users.data[1].password).toBe('newPassword')
    expect(users.data[1].nick).toBe(user.nick)
    expect(users.data[1].email).toBe(user.email)    
  })

  test('changeUserPassword lanza una excepción si un usuario no existe', async () => {
    const user = new User(100, 'nick', 'email', 'pass')
    expect(users.changeUserPassword).toBeDefined()
    await (expect(() => users.changeUserPassword(100, 'newPassword'))).rejects.toThrowError()
  })

  test('toString pinta correctamente los usuarios', async () => {
    const text = users.toString()
    expect(text).toContain(mockUsers[0].id);
    expect(text).toContain(mockUsers[mockUsers.length-1].id);
  })

  test('getUserById 3 devuelve el usuario con id 3', async () => {
    const response = await users.getUserById(3)
    expect(response).toBeInstanceOf(User)
    expect(response.id).toBe(3)
  });
  
  test('getUserById 100 devuelve un error', () => {
    expect(() => users.getUserById(100)).toThrowError()
  });

  test('getUserIndexById 7 devuelve la posición del usuario con id 7', () => {
    const index = users.getUserIndexById(7)
    expect(index).toBe(0)
  });
  
  test('getUserIndexById 9999 devuelve un error', () => {
    expect(() => users.getUserIndexById(9999)).toThrowError()
  });

  test('getUserByNickName rsu devuelve el usuario con nick rsu', async () => {
    const response = users.getUserByNickName('rsu')
    expect(response).toBeInstanceOf(User)
    expect(response.id).toBe(3)
  });
  
  test('getUserByNickName 9999 devuelve un error', () => {
    expect(() => users.getUserByNickName(9999)).toThrowError()
  })
})
