 require.config({
 	paths: {
 		"text" : "vendor/requirejs-text/text",
 		"jquery": "vendor/jquery/dist/jquery",
 		"underscore": "vendor/underscore-amd/underscore",
 		"backbone": "vendor/backbone-amd/backbone",
 		"bootstrap": "vendor/bootstrap/dist/js/bootstrap.js",
 		"d3": "vendor/d3/d3",
 		"templates": "../templates",
 		"three": "vendor/glmol/js/Three49Custom",
 		"glmol": "vendor/glmol/js/GLmol",
 		"util": "util"
 	},
 	shim: {
 		'three': {
 			exports: 'Three'
 		},
 		'glmol': {
 			deps: ['three'],
 			exports: 'GLmol'
 		},
 		'phylogram': {
 			deps: ['d3'],
 			exports: 'd3'
 		}
 	}
 });

 require([
 	'backbone',
 	'models/structure',
 	'models/structure_collection',
 	'views/home',
 	'views/examples',
 	'views/browse',
 	'views/interactions',
 	'views/phylogony',
 	'views/ubls',
 	'views/structure_list',
 	'views/structure'
 ], function(
 		Backbone,
 		Structure,
 		StructureCollection,
 		HomeView,
 		ExamplesView,
 		BrowseView,
 		InteractionView,
 		PhylogonyView,
 		UblView,
 		StructureListView,
 		StructureView
 ) {
 	var AppRouter = Backbone.Router.extend({

	    routes: {
	        '':                               'home',
	        'home':                           'home',
	        'examples':                       'examples',
	        'browse':                         'browse',
	        'browse/phylogony':               'browse_phylogony',
	        'browse/phylogony/:pdbs':         'browse_phylogony',
	        'browse/ubls':                    'browse_ubls',
	        'browse/ubls/:ubl_id':            'browse_ubls',
	        'browse/interaction':             'browse_interactions',
	        'browse/interaction/:interaction_id':        'browse_interactions',
	        'view/:struct_id': 			      'view'
	    },

	    initialize: function () {
			console.log('Router initialize');
	    },

	    home: function () {
	    	$('.nav li').removeClass('active');
	    	$('.nav .home').addClass('active');
	    	if(!this.homeView) {
	        	this.homeView = new HomeView({ el: $("#main") });
	    	}
	    	this.homeView.render();
	    },

	    /*
	    	The main browse page. Decide to browse by phylogeny,
	    	conjugation type, or UBL type
	    */
	    browse: function() {
	    	$('.nav li').removeClass('active');
	    	$('.nav .browse').addClass('active');
	    	if(!this.browseView) {
	        	this.browseView = new BrowseView({ el: $("#main") });
	    	}
	    	this.browseView.render();
	    },

	    /*
	    	View a list of structures by PDB codes
	    */
	    browse_ubls: function(ubl_id) {
	    	$('.nav li').removeClass('active');
	    	$('.nav .browse').addClass('active');

	    	if(ubl_id) {
		    	//Create a new StructureView with the successfully populated structure
		    	var structure_collection = new StructureCollection([], {ubl_id: ubl_id});
		    	structure_collection.fetch({
		    		success: function(model) {
				    	//Create a new StructureView with the successfully populated structure
				    	console.log(structure_collection);
				    	var groupView = new StructureListView( { el: $("#main"), collection: structure_collection.models } );
				    	groupView.render();
		    		}
		    	});
		    }
	    	//Otherwise, go to the main browser view
	    	else {
	    		console.log("Browse view");
		    	if(!this.ublsView) {
		        	this.ublsView = new UblView({ el: $("#main") });
		    	}
		    	this.ublsView.render();
		    }
	    },


	    /*
	    	View a list of structures by PDB codes
	    */
	    browse_phylogony: function(pdbs) {
	    	$('.nav li').removeClass('active');
	    	$('.nav .browse').addClass('active');

	    	if(pdbs) {
		    	//Create a new StructureView with the successfully populated structure
		    	var structure_collection = new StructureCollection([], {pdbs: pdbs.split(',')});
		    	structure_collection.fetch({
		    		success: function(model) {
				    	//Create a new StructureView with the successfully populated structure
				    	console.log(structure_collection);
				    	var groupView = new StructureListView( { el: $("#main"), collection: structure_collection.models } );
				    	groupView.render();
		    		}
		    	});
		    }
	    	//Otherwise, go to the main browser view
	    	else {
	    		console.log("Browse view");
		    	if(!this.phylogonyView) {
		        	this.phylogonyView = new PhylogonyView({ el: $("#main") });
		    	}
		    	this.phylogonyView.render();
		    }
	    },

	    /*
	    	View a list of structures by conjugation type
	    */
	    browse_interactions: function(interaction_id) {
	    	$('.nav li').removeClass('active');
	    	$('.nav .browse').addClass('active');

	    	//If we have just have a group id go to the structures list page for that group
	    	if(interaction_id) {
		    	var structure_collection = new StructureCollection([], {interaction_id: interaction_id});
		    	structure_collection.fetch({
		    		success: function(model) {
				    	//Create a new StructureView with the successfully populated structure
				    	console.log(structure_collection);
				    	var groupView = new StructureListView( { el: $("#main"), collection: structure_collection.models } );
				    	groupView.render();
		    		}
		    	});
	    	}
	    	//Otherwise, go to the main browser view
	    	else {
	    		console.log("Browse view");
		    	if(!this.interactionView) {
		        	this.interactionView = new InteractionView({ el: $("#main") });
		    	}
		    	this.interactionView.render();
		    }
	    },

	    /*
	    	View a single structure
	    */
	    view: function(struct_id) {
	    	console.log("Structure page");
	    	//Create a new structure model object, with the ID from the URL and populate it from the database
	    	var structure = new Structure({struct_id: struct_id});
	    	structure.fetch({
	    		success: function(model) {
			    	//Create a new StructureView with the successfully populated structure
			    	var structureView = new StructureView( { el: $("#main"), model: structure.attributes } );
			    	structureView.render();
	    		}
	    	});
	    },

	    /*
	    	View the examples page
	    */
	    examples: function() {
	    	$('.nav li').removeClass('active');
	    	$('.nav .examples').addClass('active');
	    	if(!this.examplesView) {
	        	this.examplesView = new ExamplesView({ el: $("#main") });
	    	}
	    	this.examplesView.render();
	    },

	});

	var router = new AppRouter();
   	Backbone.history.start();

});