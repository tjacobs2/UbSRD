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
			if(this.collection.length > 0) {
				console.log(this.collection.models[0].attributes);
			}
  		},

  		select_structure: function(ev){
  			console.log('CLICK');
			var params = { struct_id: $(ev.currentTarget).find('td').html() }
			url = '#view/?';
	   		url += $.param(params); 
	   		document.location.href = url;
  		}

	});

	return StructureListView;
});
