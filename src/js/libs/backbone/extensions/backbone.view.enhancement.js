Backbone.View.prototype.close = function() {
	if (this.onClose) {
		this.onClose();
	}
	// unbind events
	this.undelegateEvents();
	this.off();
	this.$el.removeData().unbind(); 
	this.stopListening();		

	// remove all models bindings
	if (this.model) this.model.off( null, null, this );

	//remove #page children
	this.$el.children().remove();
};