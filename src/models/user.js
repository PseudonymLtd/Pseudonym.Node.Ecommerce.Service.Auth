const Framework = require('pseudonym.node.ecommerce.library.framework');
const dataStore = new Framework.Data.FileDataStore('users');

module.exports = class User extends Framework.Models.DataModel
{
    constructor(name) {
        super();
        this.name = name;
    }
    get Name() {
        return this.name;
    }

    set Name(value) {
        return this.name = value;
    }

    Delete(callback) {
        return dataStore.Delete(this.Id, callback);
    }

    Save(callback) {
        return dataStore.Save(this.Id, this, callback);
    }

    static FetchAll(callback) {
        return dataStore.FetchAll(User.Mapper, callback);
    }

    static Fetch(id, callback) {
        return dataStore.Fetch(id, User.Mapper, callback);
    }

    static Mapper(rawJson) {
        const dataObj = JSON.parse(rawJson);
        const obj = new User(dataObj.name);
        obj.Id = dataObj.id;
        return obj;
    }
}