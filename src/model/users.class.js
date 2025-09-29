import User from './user.class.js';

export default class Users {
  constructor() {
    this.data = [];
  }

  populate(array) {
    this.data = array.map(user => new User(user));
  }

  addUser(userData) {
    const id = this.data.length ? Math.max(...this.data.map(u => u.id)) + 1 : 1;
    const newUser = new User({ id, ...userData });
    this.data.push(newUser);
    return newUser;
  }

  removeUser(id) {
    const index = this.data.findIndex(user => user.id === id);
    if (index === -1) throw new Error(`No existe ese usuario ${id}`);
    this.data.splice(index, 1);
  }

  changeUser(newUserData) {
    const index = this.data.findIndex(user => user.id === newUserData.id);
    if (index === -1) throw new Error(`No existe ese usuario ${newUserData.id}`);
    this.data[index] = new User(newUserData);
  }

  getUserByNickName(nick){
    const user = this.data.find(user => user.nick === nick);
    if (!user) throw new Error('No existe ese usuario ${nick}');
    
    return user;
  }

  getUserById(userId){
    const user = this.data.find(user => user.id === userId);
    if (!user) throw new Error('No existe ese usuario ${userId}');
    
    return user;    
  }
  getUserIndexById(userId){
    const index = this.data.findIndex(user => user.id === userId);
    if (index === -1) throw new Error('No existe ese usuario ${userId}');
    
    return index;
  } 

  toString() {
    return this.data.map(user => user.toString()).join('\n');
  }
  populate(array) {
  this.data = array.map(item => new User(item));
}
}
