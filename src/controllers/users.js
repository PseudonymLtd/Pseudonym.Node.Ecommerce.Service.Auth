const Framework = require('pseudonym.node.ecommerce.library.framework');
const User = require('../models/user');

module.exports = class UsersController extends Framework.Service.Controller {
    constructor() {
        super('Users Controller');

        this.Get('/users', (request, response, next) => {
            User.FetchAll((data, err) => {
                if (err !== undefined) { return next(err); }
                response.Ok(data);
            });
        });

        this.Get('/user/:id', (request, response, next) => {
            var id = parseInt(request.params.id);
        
            User.Fetch(id, (data, err) => {
                if (err !== undefined) { return next(err); }
                response.Ok(data);
            });
        });

        this.Post('/users', (request, response, next) => {
            const userIds = request.body;
        
            if (userIds.length === 0) { 
                return response.BadRequest('Body did not contain an user Ids.');
            }
            
            User.FetchAll((data, err) => {
                if (err !== undefined) { return next(err); }
        
                const filteredusers = data.filter(p => userIds.includes(p.Id));
                const unfoundIds = userIds.filter(id => !filteredusers.map(p => p.Id).includes(id));
        
                if (unfoundIds.length > 0) {
                    response.Partial(filteredusers, unfoundIds.map(id => `No user was found for supplied Id '${id}'`));
                }
                else {
                    response.Ok(filteredusers);
                }
            });
        });

        this.Post('/user', (request, response, next) => {

            const newUser = new User(
                request.body.name);
        
            newUser.Save((data, err) => {
                if (err !== undefined) { return next(err); }
        
                this.Logger.Info(`Added new user:`);
                console.info(newUser);
        
                return response.Ok(newUser, {
                    itemName: data.Name,
                    identifier: data.Id
                });
            });
        });

        this.Put('/user/:id', (request, response, next) => {
            var id = parseInt(request.params.id);
        
            User.Fetch(id, (user, err) => {
                if (err !== undefined) { return next(err); }
                
                user.Name = request.body.name;
        
                user.Save((data, err) => {
                    if (err !== undefined) { 
                        return next(err); 
                    }
                    else {
                        this.Logger.Info('updated user:');
                        console.info(data);
        
                        return response.Ok(data);
                    }
                });
            });
        });

        this.Delete('/user/:id', (request, response, next) => {
            var id = parseInt(request.params.id);
        
            User.Fetch(id, (user, err) => {
                if (err !== undefined) { return next(err); }
                
                user.Delete((existed, err) => {
                    if (err !== undefined && existed) { 
                        return next(err); 
                    }
                    else if (!existed) {
                        return response.Partial(user, {
                            UnexpectedBehaviour: `Record with Id ${request.params.id} has already been deleted, or never existed.`
                        });
                    }
                    else {
                        this.Logger.Info(`removed user:`);
                        console.info(user);
        
                        return response.Ok(user);
                    }
                });
            });
        });
    }
}