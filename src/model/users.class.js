import User from './user.class.js';
import * as api from '../services/users.api.js';

export default class Users {
  constructor() {
    this.data = [];
  }

  // 🔹 Carga los usuarios desde la API o desde un array inicial
  async populate(data) {
    if (data) {
      this.data = data.map(d => new User(d.id, d.nick, d.email, d.password));
    } else {
      const users = await api.getDBUsers();
      this.data = users.map(u => new User(u.id, u.nick, u.email, u.password));
    }
  }

  // 🔹 Añade un usuario (tanto en la API como en memoria)
  async addUser(user) {
    const newUserData = await api.addDBUser(user);
    const newUser = new User(newUserData.id, newUserData.nick, newUserData.email, newUserData.password);
    this.data.push(newUser);
    return newUser;
  }

  // 🔹 Elimina un usuario (tanto en la API como en memoria)
  async removeUser(id) {
    const index = this.getUserIndexById(id);
    if (index === -1) throw new Error(`No existe ese usuario ${id}`);

    await api.removeDBUser(id);
    const [removedUser] = this.data.splice(index, 1);
    return removedUser;
  }

  // 🔹 Modifica un usuario (PUT en API)
  async changeUser(user) {
    const index = this.getUserIndexById(user.id);
    if (index === -1) throw new Error(`No existe ese usuario ${user.id}`);

    const updatedData = await api.changeDBUser(user);
    const updatedUser = new User(updatedData.id, updatedData.nick, updatedData.email, updatedData.password);
    this.data[index] = updatedUser;
    return updatedUser;
  }

  // 🔹 Cambia solo la contraseña de un usuario (PATCH en API)
  async changeUserPassword(id, newPassword) {
    const index = this.getUserIndexById(id);
    if (index === -1) throw new Error(`No existe ese usuario ${id}`);

    const updatedData = await api.changeDBUserPassword(id, newPassword);
    this.data[index].password = updatedData.password;
    return this.data[index];
  }

  // 🔹 Métodos locales de consulta
  getUserById(id) {
    const user = this.data.find(u => u.id === id);
    if (!user) throw new Error(`No existe ese usuario ${id}`);
    return user;
  }

  getUserIndexById(id) {
    const index = this.data.findIndex(u => u.id === id);
    if (index === -1) throw new Error(`No existe ese usuario ${id}`);
    return index;
  }

  getUserByNickName(nick) {
    const user = this.data.find(u => u.nick === nick);
    if (!user) throw new Error(`No existe ese usuario ${nick}`);
    return user;
  }

  // 🔹 Convierte los usuarios a string
  toString() {
    return this.data.map(user => user.toString()).join('\n');
  }
}
