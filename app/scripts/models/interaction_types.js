// Structure Model
// ----------
// Our basic structure model

define(['backbone'], function(Backbone) {
	var InteractionTypes = Backbone.Collection.extend({

		initialize: function(models, options) {
	   		this.url = '/api/interaction_types';
    	}
	});
	return InteractionTypes;
});