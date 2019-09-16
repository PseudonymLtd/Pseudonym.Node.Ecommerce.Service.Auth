const Identity = require('./identity');

module.exports = class User extends Identity
{
    constructor(firstname, lastname, email, password, roles, id) {
        super(`${firstname} ${lastname}`, 'User', password, roles, id);
        this._firstname = firstname;
        this._lastname = lastname;
        this._email = email;
    }

    get Firstname() {
        return this._firstname;
    }

    set Firstname(value) {
        return this._firstname = value;
    }

    get Lastname() {
        return this._lastname;
    }

    set Lastname(value) {
        return this._lastname = value;
    }

    get Email() {
        return this._email;
    }

    set Email(value) {
        return this._email = value;
    }

    static Map(dataObj) {
        return new User(dataObj._firstname, dataObj._lastname, dataObj._email, dataObj._password, dataObj._roles, dataObj._id.toString());
    }
}