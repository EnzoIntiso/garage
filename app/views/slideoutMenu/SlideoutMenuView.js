define([
  'jquery',
  'underscore',
  'backbone',
  'collections/vehicles/VehiclesCollection',
  'text!templates/slideoutMenu/slideoutMenuTemplate.html'
], function($, _, Backbone, VehiclesCollection, slideoutMenuTemplate){

	var SlideoutMenuView = Backbone.View.extend({
		el: $("#slideout-menu"),

		initialize: function(options) {
			this.slideoutMenu = options.slideoutMenu;
			_.bindAll(this, "render", "selectMenuOption", "disablePage", "clearFading");
			this.slideoutMenu.on("beforeopen", this.disablePage);
			this.slideoutMenu.on("close", this.clearFading);
			this.$containerOverlay = $(".container__overlay");
			this.render();
		},
		
		events: { 
			"click a.slideout-menu__button": "selectMenuOption",
			"click a.slideout-menu__button-clear_cache": "clearCache"
		},

		render: function() {
			var data = {};
			var template = _.template( slideoutMenuTemplate );
			var compiledTemplate = template(data);
			this.$el.html(compiledTemplate);
			this.$containerOverlay.on("click", this.closeMenu.bind(this));
			this.$menuButtons = $("a.slideout-menu__button");
			return this;
		},
		
		selectMenuOption: function(e) {
			if (!$(e.currentTarget).hasClass("ignore")) {
				this.$menuButtons.removeClass("active");
				$(e.currentTarget).addClass("active");
			}
			this.closeMenu();
		},
		
		closeMenu: function(e) {
			this.slideoutMenu.close();
			this.$containerOverlay.addClass("fadeout");
		},
		
		/* this method, if ever needed, should not be placed here.
		It is here just for the convenience of this project */
		clearCache: function(e) {
			e.preventDefault();
			e.stopPropagation();
			localStorage.clear();
			Backbone.history.loadUrl(Backbone.history.fragment);
		},
		
		disablePage: function() {
			this.$containerOverlay.addClass("fadein");
		},
		
		clearFading: function() {
			this.$containerOverlay.removeClass("fadein fadeout");
		}

	});

	return SlideoutMenuView;
  
});
