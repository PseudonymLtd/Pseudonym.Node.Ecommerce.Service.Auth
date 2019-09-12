const Framework = require('pseudonym.node.ecommerce.library.framework');
const UsersController = require('./controllers/users');

const serviceRunner = new Framework.Service.Runner('Auth Service');

serviceRunner.RegisterController('/api', new UsersController());

serviceRunner.RegisterPostProcessor((request, response, complete) => {
    return request.Environment.Authenticator.Logout(request, err => {
        if (err) {
            request.Environment.Logger.Warn(`Error destroying session: ${err.toString()}`);
            return complete(err);
        }
        else {
            request.Environment.Logger.Info('Session Destroyed');
            return complete();
        }
    })
});

serviceRunner.Start(3100);