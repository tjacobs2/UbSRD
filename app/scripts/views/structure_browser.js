define(['backbone', 'models/structure_collection', 'text!templates/structure_browser.html', 'text!templates/structure_list.html'], function(Backbone, StructureCollection, Template, ListTemplate) {

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
				$('.structure_row').click(function() {
					var struct_id = $(this).find('td').html();
					document.location.href = '#view/' + struct_id;
				});
			}
			$('#structure_list').html( this.list_template( { structures: this.collection.models } ));

			this.initialized = true;	
  		},

  		filter_click: function() {

  			console.log(this.initialized);

		    // $('html, body').animate({
		    //     scrollTop: $("#structure_table").offset().top
		    // }, 1000);

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