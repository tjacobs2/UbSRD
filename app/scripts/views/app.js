define([], function() {
	var AppView = function() {
	 
		this.showView = function(view) {
			if (this.currentView){
				this.currentView.remove();
				this.currentView.unbind();
			}

			this.currentView = view;
			this.currentView.render();
			$("#main").append(this.currentView.el);
		}
	 
	}
	return AppView;
});
