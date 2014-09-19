define(['backbone', 'text!templates/home.html'], function(Backbone, Template) {

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