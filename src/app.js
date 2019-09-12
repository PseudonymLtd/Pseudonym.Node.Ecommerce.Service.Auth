const Framework = require('pseudonym.node.ecommerce.library.framework');
const ${{servicename}}Controller = require('./controllers/${{servicename_lowercase}}');

const serviceRunner = new Framework.Service.Runner('${{servicename}} Service');

serviceRunner.RegisterController('/api', new ${{servicename}}Controller());

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

serviceRunner.Start(${{serviceport}});