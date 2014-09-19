define(['backbone', 'text!templates/structure.html'], function(Backbone, Template) {

	var Structure = Backbone.View.extend({

		template: _.template(Template),

		initialize: function() {
		},

		render: function(){
			this.$el.html( this.template( this.model ) );
  		}

	});

	return Structure;
});