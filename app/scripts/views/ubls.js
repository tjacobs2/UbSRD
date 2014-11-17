define(['backbone', 'text!templates/ubls.html'], function(Backbone, Template) {

	var Ubls = Backbone.View.extend({

		template: _.template(Template),

		initialize: function() {
		},

		render: function(){
			this.$el.html( this.template( { structures: this.collection } ) );
  		}

	});

	return Ubls;
});