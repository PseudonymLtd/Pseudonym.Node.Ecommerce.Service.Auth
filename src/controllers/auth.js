const Framework = require('pseudonym.node.ecommerce.library.framework');
const User = require('../models/user');
const Machine = require('../models/machine');
const Role = require('../models/role');

module.exports = class AuthController extends Framework.Service.Controller {
    constructor() {
        super('Authentication Controller');

        this.Post('/login', (request, response, next) => {

            const isUser = request.body.Type === 'User';
            const uniqueIndex = request.body.Index;

            if (uniqueIndex === null || uniqueIndex === undefined || uniqueIndex.toString().trim() === '') {
                return response.BadRequest('Invalid or Null Identity provided.');
            }
            
            const callback = (identity, err) => {
                if (err !== undefined) { 
                    return next(err); 
                }
                else if (identity === null) {
                    return response.Unauthorized(`A identity for '${uniqueIndex}' does not exist in the database.`);
                }
                else {
                    return Framework.Utils.EncryptionTools.IsHashMatch(
                        request.Environment.AESManager.DecryptFromPublic(request.body.Password),
                        identity.Password,
                        (err) => {
                            if (err !== undefined) { 
                                return response.Unauthorized(identity, err);
                            }
                            else if (identity.Roles.length > 0) {
                                Role.FetchByIds(identity.Roles, (roles, err) => {
                                    if (err !== undefined) { 
                                        return next(err); 
                                    }
                                    else {
                                        identity.Roles = roles;
                                        return response.Ok(identity);
                                    }
                                });
                            }
                            else {
                                return response.Ok(identity);
                            }
                        });
                }
            }

            if (isUser) {
                return User.QuerySingle({ _email: uniqueIndex }, callback);
            }
            else {
                return Machine.QuerySingle({ _name: uniqueIndex }, callback);
            }
        });
    }
}