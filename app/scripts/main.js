 require.config({
 	paths: {
 		"text" : "vendor/requirejs-text/text",
 		"jquery": "vendor/jquery/dist/jquery",
 		"underscore": "vendor/underscore-amd/underscore",
 		"backbone": "vendor/backbone-amd/backbone",
 		"bootstrap": "vendor/bootstrap/dist/js/bootstrap.js",
 		"templates": "../templates"
 	}
 });

 require([
 	'backbone',
 	'models/structure',
 	'models/structure_collection',
 	'views/home',
 	'views/browse',
 	'views/group',
 	'views/structure'
 ], function(Backbone, Structure, StructureCollection, HomeView, BrowseView, GroupView, StructureView) {
 	var AppRouter = Backbone.Router.extend({

	    routes: {
	        '':                               'home',
	        'home':                           'home',
	        'examples':                       'examples',
	        'browse':                         'browse',
	        'browse/:group_id':               'browse',
	        'browse/:group_id/:struct_id':    'browse'
	    },

	    initialize: function () {
			console.log('Router initialize');
	    },

	    home: function () {
	    	if(!this.homeView) {
	        	this.homeView = new HomeView({ el: $("#main") });
	    	}
	    	this.homeView.render();
	    },

	    overview: function() {
	    	console.log("Overview page");
	    },

	    examples: function() {
	    	console.log("Example page");
	    },

	    browse: function(group_id, struct_id) {
	    	//If we have a group id and structure id, just go to the structures page for that structure
	    	if(group_id && struct_id) {
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
	    	}
	    	//If we have just have a group id go to the structures list page for that group
	    	else if(group_id) {
	    		console.log("Get a new group: " + group_id);
		    	var structure_collection = new StructureCollection([], {id: group_id});
		    	structure_collection.fetch({
		    		success: function(model) {
				    	//Create a new StructureView with the successfully populated structure
				    	console.log(structure_collection);
				    	var groupView = new GroupView( { el: $("#main"), collection: structure_collection.models } );
				    	groupView.render();
		    		}
		    	});
	    	}
	    	//Otherwise, go to the main browser view
	    	else {
	    		console.log("Browse view");
		    	if(!this.browseView) {
		        	this.browseView = new BrowseView({ el: $("#main") });
		    	}
		    	this.browseView.render();
		    }
	    }

	});

	var router = new AppRouter();
   	Backbone.history.start();

});