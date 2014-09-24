define(['backbone'], function(Backbone) {
	activate_navbar = function() {
		$('.nav li').click(function() {
			$('.nav li').removeClass('active');
			$(this).addClass('active');
		})
	}
});
