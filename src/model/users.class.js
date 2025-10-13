import User from './user.class.js';
import * as api from '../services/users.api.js';

export default class Users {
  constructor() {
    this.data = [];
  }


  async populate() {
    const users = await api.getDBUsers();
    this.data = users.map(u => new User(u.id, u.nick, u.email, u.password));
  }


  async addUser(user) {
    const newUserData = await api.addDBUser(user);
    const newUser = new User(newUserData.id, newUserData.nick, newUserData.email, newUserData.password);
    this.data.push(newUser);
    return newUser;
  }


  async removeUser(id) {
    const user = this.getUserById(id); // Lanza error si no existe
    await api.removeDBUser(id);
    this.data = this.data.filter(u => u.id !== id);
    return user;
  }


  async changeUser(user) {
    const index = this.getUserIndexById(user.id);
    if (index === -1) throw new Error(`No existe ese usuario ${user.id}`);

    const updatedData = await api.changeDBUser(user);
    const updatedUser = new User(updatedData.id, updatedData.nick, updatedData.email, updatedData.password);
    this.data[index] = updatedUser;
    return updatedUser;
  }


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
