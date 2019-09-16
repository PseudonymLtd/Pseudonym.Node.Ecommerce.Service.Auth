const Framework = require('pseudonym.node.ecommerce.library.framework');

module.exports = class PasswordTools {
    constructor() {}

    static ExtractPassword(request, next, callback) {
        if (request.body.Password) {
            return Framework.Utils.EncryptionTools.Encrypt(request.Environment.AESManager.DecryptFromPublic(request.body.Password), (err, pwd) => {
                if (err) {
                    return next({
                        code: 'ERROR_ON_ENCRYPT',
                        message: 'An error occured whislt encrypting the password',
                        data: err
                    }); 
                }
                else {
                    return callback(pwd);
                }
            });
        }
        else {
            return next({
                code: 'NO_PASSWORD_ON_BODY',
                message: 'No pasword was found on the body of the message'
            });
        }
    }
}