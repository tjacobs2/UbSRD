// Structure Model
// ----------
// Our basic structure model

define(['backbone', 'models/structure'], function(Backbone, Structure) {
	var StructureCollection = Backbone.Collection.extend({

		model: Structure,

		initialize: function(models, options) {
	   		this.url = '/ubsrd/api/structures?';
	   		this.url += $.param(options); 
 			console.log(this.url);
    	}
	});
	return StructureCollection;
});
