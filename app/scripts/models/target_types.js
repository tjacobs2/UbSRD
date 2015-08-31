
// Structure Model
// ----------
// Our basic structure model

define(['backbone'], function(Backbone) {
	var TargetTypes = Backbone.Collection.extend({

		initialize: function(models, options) {
	   		this.url = '/ubsrd/api/target_types';
			console.log(this.url);
    	}
	});
	return TargetTypes;
});
