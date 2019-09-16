const Framework = require('pseudonym.node.ecommerce.library.framework');
const collectionName = 'Roles';

module.exports = class Role extends Framework.Models.DataModel
{
    constructor(name, id) {
        super(id);
        this._name = name;
    }

    get Name() {
        return this._name;
    }

    set Name(value) {
        return this._name = value;
    }

    static Map(dataObj) {
        return new Role(dataObj._name, dataObj._id.toString());
    }

    static get CollectionName() {
        return collectionName;
    }

    get CollectionName() {
        return collectionName;
    }
}