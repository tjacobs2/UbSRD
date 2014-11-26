define([
	'bootstrap',
	'backbone',
	'ladda',
	'spin',
	'models/structure_collection',
	'text!templates/structure_browser.html',
	'text!templates/structure_list.html'
], function(Bootstrap, Backbone, Ladda, Spin, StructureCollection, Template, ListTemplate) {

	var StructureBrowser = Backbone.View.extend({

		template: _.template(Template),
		list_template: _.template(ListTemplate),
		initialized: false,

		initialize: function() {
			this.listenTo(this.collection, 'reset', this.render);
			_.bindAll(this, 'filter_click', 'reset_collection');
		},

		render: function(){
			if(!this.initialized) {
				this.$el.html( this.template( { structures: this.collection.models } ) );
				$('#filter').click(this.filter_click);
			}
			$('#structure_list').html( this.list_template( { structures: this.collection.models } ));
			$('.structure_row').click(function() {
				var struct_id = $(this).find('td').html();
				document.location.href = '#view/' + struct_id;
			});

			this.initialized = true;	
  		},

  		filter_click: function() {

		    // $('html, body').animate({
		    //     scrollTop: $("#structure_table").offset().top
		    // }, 1000);
		 	//console.log(this);
		 	//var foo = $('#filter');
		 	//console.log(foo);
		    //var l = Ladda.create(foo);
		 	//l.start();

  			var options = {};
			options.interaction_types = [];
			$('#interaction_types :checked').each(function() {
       			options.interaction_types.push($(this).val());
     		});

			options.ubl_types = [];
			$('#ubl_types :checked').each(function() {
       			options.ubl_types.push($(this).val());
     		});

	    	var new_structures = new StructureCollection([], options);
			new_structures.fetch({
				success: this.reset_collection
			});
  		},

		reset_collection: function(collection, response) {
			this.collection.reset(collection.models);
		}

	});

	return StructureBrowser;
});
