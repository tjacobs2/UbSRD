define(['backbone', 'util', 'text!templates/home.html'], function(Backbone, d3, Template) {

	var Home = Backbone.View.extend({

		template: _.template(Template),

		initialize: function() {
		},

		render: function(){
			this.$el.html( this.template() );
 		}


	});

	return Home;
});