import User from './user.class.js';

export default class Users {
  constructor(data = []) {
    this.populate(data);
  }

  populate(data) {
    this.data = data.map(d => new User(d.id , d.nick, d.email, d.password));
  }
 
  addUser(user) {
    const id = this.data.length ? Math.max(...this.data.map(u => u.id)) + 1 : 1;
    const newUser = new User(id, user.nick, user.email, user.password);
    this.data.push(newUser);
    return newUser;
  }

  removeUser(id) {
    const index = this.getUserIndexById(id);
    return this.data.splice(index, 1)[0];
  }

  changeUser(user) {
    const index = this.getUserIndexById(user.id);
    this.data[index] = new User(user.id, user.nick, user.email, user.password);
    return this.data[index];
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
  getUserByNickName(nick){
    const user = this.data.find(user => user.nick === nick);
    if (!user) throw new Error('No existe ese usuario ${nick}');
    
    return user;
  }

  toString() {
    return this.data.map(user => user.toString()).join('\n');
  }
  
}
   