define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/vehicles/vehiclesDeleteFooterTemplate.html'
], function($, _, Backbone, vehiclesDeleteFooterTemplate){

    var VehiclesDeleteFooterView = Backbone.View.extend({
		
		initialize: function(options) {
			//this.setElement("#vehicles-container");

			_.bindAll(this, "render", "toggleVisibility", "uncheckAllItems", "deleteChekedItems");
			this.render();
		},
		
		events: {
			"click a.vehicles__button-uncheck-all": "uncheckAllItems",
			"click a.vehicles__button-delete": "deleteChekedItems"
		},
		
		render: function() {
			var template = _.template( vehiclesDeleteFooterTemplate );
			var compiledTemplate = template();
			$(compiledTemplate).appendTo($("#vehicles-container"));
			this.setElement("#vehicles-footer");
			return this;
		},
		
		isVisible: function() {
			return this.$el.hasClass("show");
		},
		
		toggleVisibility: function() {
			this.$el.toggleClass("show");
		},
		
		uncheckAllItems: function(e) {
			e.preventDefault();
			e.stopPropagation();
			Backbone.pubSub.trigger("vehicles:uncheckAll");
		},
		
		deleteChekedItems: function(e) {
			e.preventDefault();
			e.stopPropagation();
			Backbone.pubSub.trigger("vehicles:deleteChecked");
		}
		
		
    });

    return VehiclesDeleteFooterView;
});