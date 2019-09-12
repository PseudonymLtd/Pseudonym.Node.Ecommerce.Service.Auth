const Framework = require('pseudonym.node.ecommerce.library.framework');
const ${{servicename_nonplural}} = require('../models/${{servicename_nonplural_lowercase}}');

module.exports = class ${{servicename}}Controller extends Framework.Service.Controller {
    constructor() {
        super('${{servicename}} Controller');

        this.Get('/${{servicename_lowercase}}', (request, response, next) => {
            ${{servicename_nonplural}}.FetchAll((data, err) => {
                if (err !== undefined) { return next(err); }
                response.Ok(data);
            });
        });

        this.Get('/${{servicename_nonplural_lowercase}}/:id', (request, response, next) => {
            var id = parseInt(request.params.id);
        
            ${{servicename_nonplural}}.Fetch(id, (data, err) => {
                if (err !== undefined) { return next(err); }
                response.Ok(data);
            });
        });

        this.Post('/${{servicename_lowercase}}', (request, response, next) => {
            const ${{servicename_nonplural_lowercase}}Ids = request.body;
        
            if (${{servicename_nonplural_lowercase}}Ids.length === 0) { 
                return response.BadRequest('Body did not contain an ${{servicename_nonplural_lowercase}} Ids.');
            }
            
            ${{servicename_nonplural}}.FetchAll((data, err) => {
                if (err !== undefined) { return next(err); }
        
                const filtered${{servicename_lowercase}} = data.filter(p => ${{servicename_nonplural_lowercase}}Ids.includes(p.Id));
                const unfoundIds = ${{servicename_nonplural_lowercase}}Ids.filter(id => !filtered${{servicename_lowercase}}.map(p => p.Id).includes(id));
        
                if (unfoundIds.length > 0) {
                    response.Partial(filtered${{servicename_lowercase}}, unfoundIds.map(id => `No ${{servicename_nonplural_lowercase}} was found for supplied Id '${id}'`));
                }
                else {
                    response.Ok(filtered${{servicename_lowercase}});
                }
            });
        });

        this.Post('/${{servicename_nonplural_lowercase}}', (request, response, next) => {

            const new${{servicename_nonplural}} = new ${{servicename_nonplural}}(
                request.body.name);
        
            new${{servicename_nonplural}}.Save((data, err) => {
                if (err !== undefined) { return next(err); }
        
                this.Logger.Info(`Added new ${{servicename_nonplural_lowercase}}:`);
                console.info(new${{servicename_nonplural}});
        
                return response.Ok(new${{servicename_nonplural}}, {
                    itemName: data.Name,
                    identifier: data.Id
                });
            });
        });

        this.Put('/${{servicename_nonplural_lowercase}}/:id', (request, response, next) => {
            var id = parseInt(request.params.id);
        
            ${{servicename_nonplural}}.Fetch(id, (${{servicename_nonplural_lowercase}}, err) => {
                if (err !== undefined) { return next(err); }
                
                ${{servicename_nonplural_lowercase}}.Name = request.body.name;
        
                ${{servicename_nonplural_lowercase}}.Save((data, err) => {
                    if (err !== undefined) { 
                        return next(err); 
                    }
                    else {
                        this.Logger.Info('updated ${{servicename_nonplural_lowercase}}:');
                        console.info(data);
        
                        return response.Ok(data);
                    }
                });
            });
        });

        this.Delete('/${{servicename_nonplural_lowercase}}/:id', (request, response, next) => {
            var id = parseInt(request.params.id);
        
            ${{servicename_nonplural}}.Fetch(id, (${{servicename_nonplural_lowercase}}, err) => {
                if (err !== undefined) { return next(err); }
                
                ${{servicename_nonplural_lowercase}}.Delete((existed, err) => {
                    if (err !== undefined && existed) { 
                        return next(err); 
                    }
                    else if (!existed) {
                        return response.Partial(${{servicename_nonplural_lowercase}}, {
                            UnexpectedBehaviour: `Record with Id ${request.params.id} has already been deleted, or never existed.`
                        });
                    }
                    else {
                        this.Logger.Info(`removed ${{servicename_nonplural_lowercase}}:`);
                        console.info(${{servicename_nonplural_lowercase}});
        
                        return response.Ok(${{servicename_nonplural_lowercase}});
                    }
                });
            });
        });
    }
}