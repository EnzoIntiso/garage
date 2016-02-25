define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/header/headerTemplate.html'
], function($, _, Backbone, headerTemplate){

	var HeaderView = Backbone.View.extend({
		el: $("#header"),

		initialize: function(options) {
			this.listenTo(Backbone.pubSub, "header:setTitle", this.setTitle);
			this.slideoutMenu = options.slideoutMenu;
			_.bindAll(this, "render", "toggleSlideoutMenu");
			this.render();
		},
		
		events: { 
			"click .icon.icon-hamburger": "toggleSlideoutMenu"
		},

		render: function() {
			var template = _.template( headerTemplate );
			var compiledTemplate = template();
			this.$el.html(compiledTemplate);
			this.$title = this.$el.find(".navbar__nav-title");
			return this;
		},
		
		setTitle: function(title) {
			this.$title.text(title);
			return this;
		},
		
		toggleSlideoutMenu: function(e) {
			e.preventDefault();
			e.stopPropagation();
			this.slideoutMenu.toggle();
		}

	});

	return HeaderView;
  
});
