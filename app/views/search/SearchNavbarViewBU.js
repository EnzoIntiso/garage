define([
	'jquery',
	'underscore',
	'backbone',
	'models/search/SearchModel',
	'text!templates/search/searchNavbarTemplate.html'
], function($, _, Backbone, SearchModel, searchTemplate){

	var SearchView = Backbone.View.extend({

		initialize: function(options) {
			this.setElement("#navbar-search");
			this.fullCollection = options.fullCollection;			
			this.filteredCollection = options.filteredCollection;			
			
			this.listenTo(Backbone.pubSub, "fullCollection:loaded", this.prepareFilters); 
			_.bindAll(this, "render", "search");
			
			this.model = new SearchModel();
		},
		
		events: { 
			"click input[name='button_search']": "search"
		},
		
		prepareFilters: function(){
			this.model.set("levels", this.fullCollection.getSortedLevels());
			this.model.set("types", this.fullCollection.getSortedTypes());
			this.render();
		},

		render: function() {
			var template = _.template( searchTemplate );
			var compiledTemplate = template( { "filters": this.model.attributes } );
			this.$el.html(compiledTemplate);
			if (!this.$form) { this.$form = $("form.mobile-search"); }
			return this;
		},		
		
		getFilterData: function() {
			return $.getQueryParameters( this.$form.serialize() );
		},
		
		search: function(e) {
			e.preventDefault();
			e.stopPropagation();
			this.filteredCollection.reset(this.fullCollection.filterBy( this.getFilterData() ).models);
			Backbone.pubSub.trigger("vehicles:listPaginatedRender");

		}

	});

	return SearchView;
  
});
