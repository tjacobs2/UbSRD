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
			pdb_code: '',
			inter_type: '',
    		ubl_type: '',
    		pdb_info: '',
		},
	});
	return Structure;
});