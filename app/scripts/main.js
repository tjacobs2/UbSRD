 require.config({
 	paths: {
 		"text" : "vendor/requirejs-text/text",
 		"jquery": "vendor/jquery/dist/jquery",
 		"jquery.bootstrap": "vendor/bootstrap/dist/js/bootstrap",
 		"underscore": "vendor/underscore-amd/underscore",
 		"backbone": "vendor/backbone-amd/backbone",
 		"d3": "vendor/d3/d3",
 		//"ladda": "vendor/ladda-bootstrap/dist/ladda",
 		//"spin": "vendor/ladda-bootstrap/dist/spin",
 		//"d3": "vendor/ladda-bootstrap/js/ladda",
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
 		//"spin": {
        //    exports: "Spinner"
        //},
        //"ladda": {
        //    depends: "spin",
        //    exports: "Ladda"
        //},
 		'd3.phylogram': {
 			deps: ['d3']
 		}
 	}
 });


 require([
 	'jquery',
 	'jquery.bootstrap',
 	'backbone',
 	'views/app',
 	'views/home',
 	'views/examples',
 	'views/phylogony_browser',
 	'views/structure_browser',
 	'views/interaction_browser',
 	'views/structure'
 ], function(
 		jquery,
 		Bootstrap,
 		Backbone,
 		AppView,
 		HomeView,
 		ExamplesView,
 		PhylogonyBrowserView,
 		StructureBrowserView,
 		InteractionsBrowserView,
 		StructureView
 ) {
 	var AppRouter = Backbone.Router.extend({

	    routes: {
	        '':                               'home',
	        'home':                           'home',
	        'examples':                       'examples',
	        'browse':                         'browse',
	        'browse/phylogony':               'browse_phylogony',
	        'browse/structure':               'browse_structure',
	        'browse/interactions':            'browse_interactions',
	        'view/:struct_id': 			      'view'
	    },

	    initialize: function () {
			console.log('Router initialize');
			this.appView = new AppView();
	    },

	    home: function () {
	    	$('.nav li').removeClass('active');
	    	$('.nav .home').addClass('active');
	    	if(!this.homeView) {
	        	this.homeView = new HomeView();
	    	}
	    	this.appView.showView(this.homeView);
	    },

	    /*
	    	browse by interactions with UBQ residues
	    */
	    browse_interactions: function() {
	    	$('.nav li').removeClass('active');
	    	$('.nav .browse').addClass('active');
   			var interactionsBrowserView = new InteractionsBrowserView();
	    	this.appView.showView(interactionsBrowserView);
	    },

	    /*
	    	browse by structural features (e.g. interaction type, ubl type, etc)
	    */
	    browse_structure: function() {
	    	$('.nav li').removeClass('active');
	    	$('.nav .browse').addClass('active');
	    	var structureBrowserView = new StructureBrowserView();
	    	this.appView.showView(structureBrowserView);
	    },

	    /*
	    	View a list of structures by PDB codes
	    */
	    browse_phylogony: function(pdbs) {
	    	$('.nav li').removeClass('active');
	    	$('.nav .browse').addClass('active');
        	var phylogonyView = new PhylogonyBrowserView();
	    	this.appView.showView(phylogonyView);
	    },

	    /*
	    	View a single structure
	    */
	    view: function(struct_id) {
	    	$('.nav li').removeClass('active');
	    	$('.nav .browse').addClass('active');
	    	
	    	//Create a new structure model object, with the ID from the URL and populate it from the database
	    	var structureView = new StructureView({struct_id: struct_id});
	    	this.appView.showView(structureView);
	    },

	    /*
	    	View the examples page
	    */
	    examples: function() {
	    	$('.nav li').removeClass('active');
	    	$('.nav .examples').addClass('active');
	    	if(!this.examplesView) {
	        	this.examplesView = new ExamplesView();
	    	}
	    	this.appView.showView(this.examplesView);
	    },

	});

	var router = new AppRouter();
   	Backbone.history.start();

});
