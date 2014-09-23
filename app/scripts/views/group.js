define(['backbone', 'text!templates/group.html'], function(Backbone, Template) {

	var Group = Backbone.View.extend({

		template: _.template(Template),

		initialize: function() {
		},

		render: function(){
			console.log(this.collection);
			this.$el.html( this.template( { structures: this.collection } ) );

			$('.structure_row').click(function() {
				var struct_id = $(this).find('td').html();
				var url = window.location.hash;
				document.location.href = url + '/' + struct_id;
			});
  		}

	});

	return Group;
});