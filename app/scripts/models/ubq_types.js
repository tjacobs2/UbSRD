// Structure Model
// ----------
// Our basic structure model

define(['backbone'], function(Backbone) {
	var UbqTypes = Backbone.Collection.extend({

		//model: Structure,

		initialize: function(models, options) {
	   		this.url = '/ubsrd/api/ubq_types';
 			console.log(this.url);
    	}
	});
	return UbqTypes;
});
