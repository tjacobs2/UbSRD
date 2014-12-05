define([
	'backbone',
	'text!templates/structure_list.html'
	],
	function(
		Backbone,
		Template
	) {

	var StructureListView = Backbone.View.extend({

		template: _.template(Template),

		initialize: function() {
			this.listenTo(this.collection, 'reset', this.render);
		},

  		events: {
   			'click .structure_row' : 'select_structure'
  		},

		render: function(){
			this.$el.html( this.template( { structures: this.collection.models } ) );
  		},

  		select_structure: function(ev){
  			console.log('CLICK');
			var struct_id = $(ev.currentTarget).find('td').html();
			document.location.href = '#view/' + struct_id;
  		}

	});

	return StructureListView;
});