// Structure Model
// ----------
// Our basic structure model

define(['backbone'], function(Backbone) {
	var Structure = Backbone.Model.extend({

		urlRoot: "/api/structures/",

		idAttribute: "struct_id",

		// Default attributes ensure that each structure has some basic attributes.
		defaults: {
			struct_id: null,
			PDB: '',
			total_residue: 0,
			Inter_Type: '',
    		UBL_TYPE: '',
    		PDB_INFO: '',
		},
	});
	return Structure;
});