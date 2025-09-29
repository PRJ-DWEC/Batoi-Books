export default class User {
    constructor (id, nick, email, password){
        this.id = id;
        this.nick = nick;
        this.email = email;
        this.password = password;
    }

    toString(){
        return `User {id: ${this.id}, nick: ${this.nick}, email: ${this.email}, password: ${this.password}}`;
    }
}