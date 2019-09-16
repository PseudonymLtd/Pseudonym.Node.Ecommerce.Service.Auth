const Framework = require('pseudonym.node.ecommerce.library.framework');
const Machine = require('../models/machine');
const PasswordTools = require('../utils/passwordTools');
const Role = require('../models/role');

module.exports = class MachinesController extends Framework.Service.Controller {
    constructor() {
        super('Machines Controller');

        this.Get('/machines', (request, response, next) => {
            Role.FetchAll((roles, err) => {
                if (err !== undefined) { 
                    return next(err); 
                }
                else {
                    Machine.FetchAll((machines, err) => {
                        if (err !== undefined) { 
                            return next(err); 
                        }
                        else {
                            machines.forEach(machine => {
                                for (let index in machine.Roles) {
                                    const role = roles.find(r => r._id === machine.Roles[index].toString());
                                    if (role) {
                                        machine.Roles[index] = role ? role : {
                                            _id: machine.Roles[index],
                                            _name: 'MISSING_ROLE'
                                        }
                                    }
                                }
                            });
                            return response.Ok(machines);
                        }
                    });
                }
            });
        });

        this.Get('/machine/:id', (request, response, next) => {
            Machine.FetchById(request.params.id, (machine, err) => {
                if (err !== undefined) { 
                    return next(err); 
                }
                else if (machine === null) {
                    return response.BadRequest(`A machine with an id of '${request.params.id}' does not exist in the database.`, {
                        suppliedId: request.params.id
                    });
                }
                else if (machine.Roles.length > 0) {
                    Role.FetchByIds(machine.Roles, (roles, err) => {
                        if (err !== undefined) { 
                            return next(err); 
                        }
                        else {
                            machine.Roles = roles;
                            return response.Ok(machine);
                        }
                    });
                }
                else {
                    return response.Ok(machine);
                }
            });
        });

        this.Post('/machines', (request, response, next) => {
            const machineIds = request.body;
        
            if (machineIds.length === 0) { 
                return response.BadRequest('Body did not contain any machine Ids.');
            }

            Role.FetchAll((roles, err) => {
                if (err !== undefined) { 
                    return next(err); 
                }
                else {
                    Machine.FetchByIds(machineIds, (machines, err) => {
                        if (err !== undefined) { return next(err); }
                
                        const unfoundIds = machineIds.filter(id => !machines.map(p => p.Id).includes(id));
            
                        machines.forEach(machine => {
                            for (let index in machine.Roles) {
                                const role = roles.find(r => r._id === machine.Roles[index].toString());
                                if (role) {
                                    machine.Roles[index] = role ? role : {
                                        _id: machine.Roles[index],
                                        _name: 'MISSING_ROLE'
                                    }
                                }
                            }
                        });

                        if (unfoundIds.length > 0) {
                            response.Partial(machines, unfoundIds.map(id => `No machine was found for supplied Id '${id}'`));
                        }
                        else {
                            response.Ok(machines);
                        }
                    });
                }
            });
        });

        this.Post('/machine', (request, response, next) => {
            const name = request.body.Name.toString().toLowerCase().trim();

            Machine.QuerySingle({ _name: name }, (machine, err) => {
                if (err !== undefined) { 
                    return next(err); 
                }
                else if (machine === null) {
                    return PasswordTools.ExtractPassword(request, next, (encryptedPassword) => {
                        const newMachine = new Machine(
                            name,
                            request.body.Address,
                            encryptedPassword);
                    
                            newMachine.Save((data, err) => {
                            if (err !== undefined) { return next(err); }
                    
                            this.Logger.Info(`Added new machine:`);
                            console.info(newMachine);
                    
                            return response.Ok(newMachine, {
                                itemName: data.Name,
                                identifier: data.Id,
                                created: true
                            });
                        });
                    });
                }
                else {
                    return response.Ok(machine, {
                        itemName: machine.Name,
                        identifier: machine.Id,
                        created: false
                    });
                }
            });
        });

        this.Put('/machine/:id', (request, response, next) => {
            Machine.FetchById(request.params.id, (machine, err) => {
                if (err !== undefined) { return next(err); }
                
                PasswordTools.ExtractPassword(request, next, (encryptedPassword) => {
                    machine.Name = request.body.Name.toString().toLowerCase().trim();
                    machine.Address = request.body.Address;
                    machine.Password = encryptedPassword;
                    machine.Roles = request.body.Roles;
            
                    machine.Save((data, err) => {
                        if (err !== undefined) { 
                            return next(err); 
                        }
                        else {
                            this.Logger.Info('updated machine:');
                            console.info(data);
            
                            return response.Ok(data);
                        }
                    });
                });
            });
        });

        this.Delete('/machine/:id', (request, response, next) => {
            Machine.FetchById(request.params.id, (machine, err) => {
                if (err !== undefined) { return next(err); }
                
                machine.Delete((existed, err) => {
                    if (err !== undefined && existed) { 
                        return next(err); 
                    }
                    else if (!existed) {
                        return response.Partial(machine, {
                            UnexpectedBehaviour: `Record with Id ${request.params.id} has already been deleted, or never existed.`
                        });
                    }
                    else {
                        this.Logger.Info(`removed machine:`);
                        console.info(machine);
        
                        return response.Ok(machine);
                    }
                });
            });
        });
    }
}