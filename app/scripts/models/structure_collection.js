// Structure Model
// ----------
// Our basic structure model

define(['backbone', 'models/structure'], function(Backbone, Structure) {
	var StructureCollection = Backbone.Collection.extend({

		model: Structure,

		initialize: function(models, options) {
			pdbs = options.pdbs || [];
			console.log(pdbs);
			if(pdbs.length > 0) {
	    		this.url = '/api/pdbs/' + pdbs.join(',');
			}
			else if(options.interaction_id) {
    			this.url = '/api/interactions/' + options.interaction_id;
			}
			else if(options.ubl_id) {
    			this.url = '/api/ubls/' + options.ubl_id;
			}
    	}
	});
	return StructureCollection;
});