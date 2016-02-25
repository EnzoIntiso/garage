define([
	'jquery',
	'underscore',
	'backbone',
	'views/pagination/PaginationView',
	'text!templates/vehicles/vehiclesListTemplate.html'		
], function($, _, Backbone, PaginationView, vehicleListTemplate){
  
	var VehiclesListView = Backbone.View.extend({

		initialize: function(options) {
			this.setElement("#vehicles-body");
			this.listenTo(Backbone.pubSub, "vehicles:listPaginatedRender", this.render);
			_.bindAll(this, "render", "onDataHandler", "onErrorHandler");

			this.fullCollection = options.fullCollection;
			this.filteredCollection = options.filteredCollection;
			this.fullCollection.selectiveFetch.call(this);
		},
		
		onDataHandler: function(data, textStatus, jqXHR) {
			this.fullCollection.sort();
			Backbone.pubSub.trigger("fullCollection:loaded");
			this.filteredCollection.reset(this.fullCollection.filterBy().models);
			this.paginationData = data.pagination;
			this.paginationView = new PaginationView( { "collection": this.filteredCollection, "paginationDefaults": this.paginationData } );
			this.render();			
		},
		
		onErrorHandler: function(jqXHR, response, errorThrown) {
			Backbone.pubSub.trigger("loading:end");
			
			var data = {
				"title": errorThrown.toString(),
				"message": "("+jqXHR.status+") " + response
			};
			Backbone.pubSub.trigger("modal:open", data);

			console.log(jqXHR);
			console.log(response);
			console.log(errorThrown);
		},

		render: function() {
			console.log();
			Backbone.pubSub.trigger("loading:start");
			var paginationData = this.paginationView.getPaginationData();
			var template = _.template(vehicleListTemplate);
			var compiledTemplate = template( { "vehicles": this.filteredCollection.paginate( paginationData ).models } );
			this.$el.html(compiledTemplate);
			window.scrollTo(0, 0);
			Backbone.pubSub.trigger("vehicleslistRender:end");
			Backbone.pubSub.trigger("loading:end");
			return this;
		},
		
		onClose: function(){
			this.paginationView.close();
		}

	});

	return VehiclesListView;

});
