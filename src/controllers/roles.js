const Framework = require('pseudonym.node.ecommerce.library.framework');
const Role = require('../models/role');

module.exports = class RolesController extends Framework.Service.Controller {
    constructor() {
        super('Roles Controller');

        this.Get('/roles', (request, response, next) => {
            Role.FetchAll((roles, err) => {
                if (err !== undefined) { 
                    return next(err); 
                }
                else {
                    return response.Ok(roles);
                }
            });
        });

        this.Get('/role/:id', (request, response, next) => {
            Role.FetchById(request.params.id, (role, err) => {
                if (err !== undefined) { 
                    return next(err); 
                }
                else if (role === null) {
                    return response.BadRequest(`A Role with an id of '${request.params.id}' does not exist in the database.`, {
                        suppliedId: request.params.id
                    });
                }
                else {
                    return response.Ok(role);
                }
            });
        });

        this.Post('/roles', (request, response, next) => {
            const roleIds = request.body;
        
            if (roleIds.length === 0) { 
                return response.BadRequest('Body did not contain any role Ids.');
            }

            Role.FetchByIds(roleIds, (roles, err) => {
                if (err !== undefined) { return next(err); }
        
                const unfoundIds = roleIds.filter(id => !roles.map(p => p.Id).includes(id));

                if (unfoundIds.length > 0) {
                    response.Partial(roles, unfoundIds.map(id => `No role was found for supplied Id '${id}'`));
                }
                else {
                    response.Ok(roles);
                }
            });
        });

        this.Post('/role', (request, response, next) => {
            const newRole = new Role(request.body.Name);
            newRole.Save((data, err) => {
                if (err !== undefined) { return next(err); }
        
                this.Logger.Info(`Added new role:`);
                console.info(newRole);
        
                return response.Ok(newRole, {
                    itemName: data.Name,
                    identifier: data.Id
                });
            });
        });

        this.Put('/role/:id', (request, response, next) => {
            Role.FetchById(request.params.id, (role, err) => {
                if (err !== undefined) { return next(err); }
                
                role.Name = request.body.Name;
        
                role.Save((role, err) => {
                    if (err !== undefined) { 
                        return next(err); 
                    }
                    else {
                        this.Logger.Info('updated role:');
                        console.info(role);
        
                        return response.Ok(role);
                    }
                });
            });
        });

        this.Delete('/role/:id', (request, response, next) => {
            Role.FetchById(request.params.id, (role, err) => {
                if (err !== undefined) { return next(err); }
                
                role.Delete((existed, err) => {
                    if (err !== undefined && existed) { 
                        return next(err); 
                    }
                    else if (!existed) {
                        return response.Partial(role, {
                            UnexpectedBehaviour: `Record with Id ${request.params.id} has already been deleted, or never existed.`
                        });
                    }
                    else {
                        this.Logger.Info(`removed role:`);
                        console.info(role);
        
                        return response.Ok(role);
                    }
                });
            });
        });
    }
}