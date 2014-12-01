 require.config({
 	paths: {
 		"text" : "vendor/requirejs-text/text",
 		"jquery": "vendor/jquery/dist/jquery",
 		"jquery.bootstrap": "vendor/bootstrap/dist/js/bootstrap",
 		"underscore": "vendor/underscore-amd/underscore",
 		"backbone": "vendor/backbone-amd/backbone",
 		"d3": "vendor/d3/d3",
 		"templates": "../templates",
 		"three": "vendor/glmol/js/Three49custom",
 		"glmol": "vendor/glmol/js/GLmol",
 		"phylogram": "d3.phylogram"
 	},
 	shim: {
        "jquery.bootstrap": {
            deps: ["jquery"]
        },
 		'three': {
 			exports: 'THREE'
 		},
 		'glmol': {
 			deps: ['three'],
 			exports: 'GLmol'
 		},
 		'd3.phylogram': {
 			deps: ['d3']
 		}
 	}
 });

 require([
 	'jquery',
 	'jquery.bootstrap',
 	'backbone',
 	'models/structure',
 	'models/structure_collection',
 	'views/home',
 	'views/examples',
 	'views/browse',
 	'views/phylogony',
 	'views/structure_list',
 	'views/structure',
 	'views/structure_browser'
 ], function(
 		jquery,
 		Bootstrap,
 		Backbone,
 		Structure,
 		StructureCollection,
 		HomeView,
 		ExamplesView,
 		BrowseView,
 		PhylogonyView,
 		StructureListView,
 		StructureView,
 		StructureBrowserView
 ) {
 	var AppRouter = Backbone.Router.extend({

	    routes: {
	        '':                               'home',
	        'home':                           'home',
	        'examples':                       'examples',
	        'browse':                         'browse',
	        'browse/phylogony':               'browse_phylogony',
	        'browse/structure':               'browse_structure',
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
	    	structure features, or residue features
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
	    	browse by structural features (e.g. interaction type, ubl type, etc)
	    */
	    browse_structure: function() {
	    	$('.nav li').removeClass('active');
	    	$('.nav .browse').addClass('active');
	    	var structure_collection = new StructureCollection([], {});
	    	var structureBrowserView = new StructureBrowserView( { el: $("#main"), collection: structure_collection } );
	    	structureBrowserView.render();
	    },

	    /*
	    	View a list of structures by PDB codes
	    */
	    browse_phylogony: function(pdbs) {
	    	$('.nav li').removeClass('active');
	    	$('.nav .browse').addClass('active');
	    	var structure_collection = new StructureCollection([], {});
        	var phylogonyView = new PhylogonyView({ el: $("#main"), collection: structure_collection });
	    	phylogonyView.render();
	    },

	    /*
	    	View a single structure
	    */
	    view: function(struct_id) {
	    	$('.nav li').removeClass('active');
	    	$('.nav .browse').addClass('active');
	    	
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
