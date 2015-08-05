define([
	'backbone',
	'text!templates/interaction_list.html'
	],
	function(
		Backbone,
		Template
	) {

	var InteractionListView = Backbone.View.extend({

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
			var struct_id = $(ev.currentTarget).find('td').html();
			var structure = $.grep(this.collection.models, function(n, i) {
				return n.attributes.struct_id == struct_id
			})[0];
			console.log(structure);		
			console.log(structure.attributes.ubq_chain);		
			console.log(structure.attributes.real_ubq_num);		
			console.log(structure.attributes.partner_chain);		
			console.log(structure.attributes.real_partner_num);		
			url = '#view/?';
	   		url += $.param(structure.attributes); 
	   		document.location.href = url;
  		}

	});

	return InteractionListView;
});
