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
			else if(options.id) {
    			this.url = '/api/groups/' + options.id;
			}
    	}
	});
	return StructureCollection;
});