const Framework = require('pseudonym.node.ecommerce.library.framework');
const User = require('../models/user');
const PasswordTools = require('../utils/passwordTools');
const Role = require('../models/role');

module.exports = class UsersController extends Framework.Service.Controller {
    constructor() {
        super('Users Controller');

        this.Get('/users', (request, response, next) => {
            Role.FetchAll((roles, err) => {
                if (err !== undefined) { 
                    return next(err); 
                }
                else {
                    User.FetchAll((users, err) => {
                        if (err !== undefined) { 
                            return next(err); 
                        }
                        else {
                            users.forEach(user => {
                                for (let index in user.Roles) {
                                    const role = roles.find(r => r._id === user.Roles[index].toString());
                                    if (role) {
                                        user.Roles[index] = role ? role : {
                                            _id: user.Roles[index],
                                            _name: 'MISSING_ROLE'
                                        }
                                    }
                                }
                            });
                            return response.Ok(users);
                        }
                    });
                }
            });
        });

        this.Get('/user/:id', (request, response, next) => {
            User.FetchById(request.params.id, (user, err) => {
                if (err !== undefined) { 
                    return next(err); 
                }
                else if (user === null) {
                    return response.BadRequest(`A User with an id of '${request.params.id}' does not exist in the database.`, {
                        suppliedId: request.params.id
                    });
                }
                else if (user.Roles.length > 0) {
                    Role.FetchByIds(user.Roles, (roles, err) => {
                        if (err !== undefined) { 
                            return next(err); 
                        }
                        else {
                            user.Roles = roles;
                            return response.Ok(user);
                        }
                    });
                }
                else {
                    return response.Ok(user);
                }
            });
        });

        this.Post('/users', (request, response, next) => {
            const userIds = request.body;
        
            if (userIds.length === 0) { 
                return response.BadRequest('Body did not contain any user Ids.');
            }

            Role.FetchAll((roles, err) => {
                if (err !== undefined) { 
                    return next(err); 
                }
                else {
                    User.FetchByIds(userIds, (users, err) => {
                        if (err !== undefined) { return next(err); }
                
                        const unfoundIds = userIds.filter(id => !users.map(p => p.Id).includes(id));
            
                        users.forEach(user => {
                            for (let index in user.Roles) {
                                const role = roles.find(r => r._id === user.Roles[index].toString());
                                if (role) {
                                    user.Roles[index] = role ? role : {
                                        _id: user.Roles[index],
                                        _name: 'MISSING_ROLE'
                                    }
                                }
                            }
                        });

                        if (unfoundIds.length > 0) {
                            response.Partial(users, unfoundIds.map(id => `No user was found for supplied Id '${id}'`));
                        }
                        else {
                            response.Ok(users);
                        }
                    });
                }
            });
        });

        this.Post('/user', (request, response, next) => {
            const email = request.body.Email.toString().toLowerCase().trim();

            User.QuerySingle({ _email: email }, (user, err) => {
                if (err !== undefined) { 
                    return next(err); 
                }
                else if (user === null) {
                    return PasswordTools.ExtractPassword(request, next, (encryptedPassword) => {
                        const newUser = new User(
                            request.body.Firstname,
                            request.body.Lastname,
                            email,
                            encryptedPassword);
                    
                        newUser.Save((data, err) => {
                            if (err !== undefined) { return next(err); }
                    
                            this.Logger.Info(`Added new user:`);
                            console.info(newUser);
                    
                            return response.Ok(newUser, {
                                itemName: data.Name,
                                identifier: data.Id,
                                created: true
                            });
                        });
                    });
                }
                else {
                    return response.Ok(user, {
                        itemName: user.Name,
                        identifier: user.Id,
                        created: false
                    });
                }
            });
        });

        this.Put('/user/:id', (request, response, next) => {
            User.FetchById(request.params.id, (user, err) => {
                if (err !== undefined) { return next(err); }
                
                PasswordTools.ExtractPassword(request, next, (encryptedPassword) => {
                    user.Firstname = request.body.Firstname;
                    user.Lastname = request.body.Lastname;
                    user.Email = request.body.Email.toString().toLowerCase().trim();
                    user.Password = encryptedPassword;
                    user.Roles = request.body.Roles;
            
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
        });

        this.Delete('/user/:id', (request, response, next) => {
            User.FetchById(request.params.id, (user, err) => {
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