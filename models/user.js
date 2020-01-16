const DbModel = require('./dbmodel');

class User extends DbModel{
    constructor(id){
        super(id);
    }

    get accountType() {
        return this._accountType;
        }
    set accountType(value) {
        this._accountType = value;
    }

    get username() {
        return this._username;
    }
    set username(value) {
        this._username = value;
    }

    get password() {
        return this._password;
    }
    set password(value) {
        this._password = value;
    }

    get email() {
        return this._email;
    }
    set email(value) {
        this._email = value;
    }
} 
module.exports = User;