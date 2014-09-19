// Structure Model
// ----------
// Our basic structure model

define(['backbone', 'models/structure'], function(Backbone, Structure) {
	var StructureCollection = Backbone.Collection.extend({

		model: Structure,

		initialize: function(models, options) {
    		this.id = options.id;
    	},
    	url: function() {

    		return '/api/groups/' + this.id;
    	}
	});
	return StructureCollection;
});