define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/modals/modalTemplate.html'
], function($, _, Backbone, footerTemplate){

	var ModalView = Backbone.View.extend({
		el: $("#modal"),

		initialize: function() {
			_.bindAll(this, "render", "open", "close");
			this.listenTo(Backbone.pubSub, "modal:open", this.open);	
		},
		
		events: { 
			"click a.modal-popup__button, a.modal-popup__btn-close": "close"
		},

		render: function(data) {
			data = data || {};
			var template = _.template( footerTemplate );
			var compiledTemplate = template( { "modal": data } );
			this.$el.html(compiledTemplate);
			return this;
		},
		
		open: function(data) {
			this.render(data);
			this.$el.addClass("show");
		},
		
		close: function(e) {
			e.preventDefault();
			e.stopPropagation();
			this.$el.removeClass("show");
			this.undelegateEvents();
			this.remove();			
		}

	});

	return ModalView;
  
});
