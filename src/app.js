const Framework = require('pseudonym.node.ecommerce.library.framework');
const UsersController = require('./controllers/users');
const MachinesController = require('./controllers/machines');
const RolesController = require('./controllers/roles');
const AuthController = require('./controllers/auth');

const serviceRunner = new Framework.Service.Runner('Auth Service');

serviceRunner.RegisterController('/api', new UsersController());
serviceRunner.RegisterController('/api', new MachinesController());
serviceRunner.RegisterController('/api', new RolesController());
serviceRunner.RegisterController('/auth', new AuthController());

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

return serviceRunner.Start(3100);