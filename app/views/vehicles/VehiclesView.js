define([
	'jquery',
	'underscore',
	'backbone',
	'collections/vehicles/VehiclesCollection',
	'views/vehicles/VehiclesListView',
	'views/search/SearchView',
	'text!templates/vehicles/vehiclesTemplate.html'	
], function($, _, Backbone, VehiclesCollection, VehiclesListView, SearchView, vehiclesTemplate){

	var VehiclesView = Backbone.View.extend({
    
		el: $("#page"),

		initialize: function(options) {
			this.$el.addClass("double-header");
			Backbone.pubSub.trigger("header:setTitle", "Parked Vehicles");
			this.render();
		},

		render: function() {
			// main view 
			var template = _.template( vehiclesTemplate );
			var compiledTemplate = template();
			this.$el.html(compiledTemplate);

			// sub views
			this.fullCollection = new VehiclesCollection();
			this.filteredCollection = this.fullCollection.filterBy(); // create a separate copy
			var data = { 
				"fullCollection": this.fullCollection,
				"filteredCollection": this.filteredCollection
			}; 

			this.childViews = [];
			this.childViews.searchView = new SearchView( data );
			this.childViews.vehiclesListView = new VehiclesListView( data );
			return this;
		},
		
		onClose: function() {
			this.$el.removeClass("double-header");
			for (var childView in this.childViews) {
				this.childViews[childView].close();
			}
		}
		
	});
	return VehiclesView;
});