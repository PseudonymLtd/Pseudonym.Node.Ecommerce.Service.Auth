const Identity = require('./identity');

module.exports = class Machine extends Identity
{
    constructor(name, address, password, roles, id) {
        super(name, 'Machine', password, roles, id);
        this._address = address;
    }

    get Address() {
        return this._address;
    }

    set Address(value) {
        return this._address = value;
    }

    static Map(dataObj) {
        return new Machine(dataObj._name, dataObj._address, dataObj._password, dataObj._roles, dataObj._id.toString());
    }
}