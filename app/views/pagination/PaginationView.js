define([
	'jquery',
	'underscore',
	'backbone',
	'models/settings/SettingsModel',
	'models/pagination/PaginationModel',
	'text!templates/pagination/paginationTemplate.html'
], function($, _, Backbone, SettingsModel, PaginationModel, paginationTemplate){

	var PaginationView = Backbone.View.extend({
	
		initialize: function(options) {
			var self = this;
			self.setElement("#vehicles-pagination");
			_.bindAll(self, "render", "goPage");
			
			this.settings = new SettingsModel({id: "data"});
			this.settings.fetchData();

			self.model = new PaginationModel({id: "data"});
			self.model.fetchData(options.paginationDefaults);
			
			this.model.set("per_page", this.settings.get("per_page"));
			this.model.save();

			self.collection = options.collection;
			self.collection.bind("add remove update reset", function(){
				self.resetPageAndRender();
			});
			self.resetPageAndRender();
		},
		
		events: {
			"click div.vehicles__pagination-gopage": "goPage"
		},

		render: function(){
			this.preparePagination();
			var data = {
				"pagination": this.model.toJSON()
			};
			var template = _.template( paginationTemplate );
			var compiledTemplate = template(data);
			this.$el.html(compiledTemplate);
			return this;
		},
		
		preparePagination: function(){
			// "page", "sort", "per_page", "total_pages", "total_results"
			var total_results = this.collection.length; 
			this.model.set("total_results", total_results);
			var total_pages = Math.ceil(total_results / this.model.get("per_page"));
			this.model.set("total_pages", total_pages);
			this.model.save();
		},
		
		resetPageAndRender: function(){
			this.model.set("page", 1);
			this.model.save();
			this.render();
		},
		
		getPaginationData: function(){
			return this.model.toJSON();
		},		
		
		goPage: function(e) {
			e.preventDefault();
			e.stopPropagation();
			if ($(e.target).hasClass("active")) {
				this.model.set("page", (+this.model.get("page")) + (+$(e.target).attr("data-gopage")));
				this.model.save();
				this.render();
				Backbone.pubSub.trigger("vehicles:listPaginatedRender");
			}
		},
		

	});

	return PaginationView;
  
});
