
// Structure Model
// ----------
// Our basic structure model

define(['backbone'], function(Backbone) {
	var ChainTypes = Backbone.Collection.extend({

		initialize: function(models, options) {
	   		this.url = '/ubsrd/api/chain_types';
			console.log(this.url);
    	}
	});
	return ChainTypes;

});

