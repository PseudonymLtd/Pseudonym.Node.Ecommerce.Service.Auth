const Framework = require('pseudonym.node.ecommerce.library.framework');
const collectionName = 'Identities';

module.exports = class Identity extends Framework.Models.DataModel
{
    constructor(name, type, password, roles, id) {
        super(id);
        this._name = name;
        this._type = type;
        this._password = password;
        this._roles = roles ? roles : [];
    }

    get Roles() {
        return this._roles;
    }

    set Roles(value) {
        return this._roles = value;
    }

    get Type() {
        return this._type;
    }

    get Password() {
        return this._password;
    }

    set Password(value) {
        return this._password = value;
    }

    get Name() {
        return this._name;
    }

    set Name(value) {
        return this._name = value;
    }

    static get CollectionName() {
        return collectionName;
    }

    get CollectionName() {
        return collectionName;
    }
}