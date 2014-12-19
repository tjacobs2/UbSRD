// Structure Model
// ----------
// Our basic structure model

define(['backbone', 'models/structure'], function(Backbone, Structure) {
	var ResidueInteractions = Backbone.Collection.extend({

		//model: Structure,

		initialize: function(models, options) {
	   		this.url = '/ubsrd/api/residue_interactions?';
	   		this.url += $.param(options); 
 			console.log(this.url);
    	}
	});
	return ResidueInteractions;
});
