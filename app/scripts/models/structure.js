// Structure Model
// ----------
// Our basic structure model

define(['backbone'], function(Backbone) {
	var Structure = Backbone.Model.extend({

		urlRoot: "/api/structures/",

		idAttribute: "struct_id",

		// Default attributes ensure that each	 todo created has `title` and `completed` keys.
		defaults: {
			struct_id: null,
			PDB: '',
			total_residue: 0 
		},
	});
	return Structure;
});