define([
	'jquery',
	'underscore',
	'backbone',
	'breakpoints',
	'jquery_sumoselect', 
	'models/search/SearchModel',
	'text!templates/search/searchInpageTemplate.html',
	'text!templates/search/searchNavbarTemplate.html'
], function($, _, Backbone, Breakpoints, Jquery_Sumoselect, SearchModel, searchInpageTemplate, searchNavbarTemplate){

	var SearchView = Backbone.View.extend({

		initialize: function(options) {			
			$(window).on('resize', this.arrangeSearchForm.bind(this));
			this.arrangeSearchForm();
			
			this.fullCollection = options.fullCollection;			
			this.filteredCollection = options.filteredCollection;			
			
			this.listenTo(Backbone.pubSub, "fullCollection:loaded", this.prepareFilters); 
			_.bindAll(this, "arrangeSearchForm", "render", "search");
			
			this.model = new SearchModel();
		},
		
		events: { 
			"click a.button-submit": "search"
		},
		
		arrangeSearchForm: function(e) {
			var callRender = false;
			var $currentEl = this.$el;
			this.multiSelectOptions = { 
				"placeholder": "ALL", 
				"selectAll": true,
				"csvDispCount": 2
			};
			this.formSelector = "form.search";
			
			var searchId;
			if (window.matchMedia("(min-width: "+Breakpoints.getBreakpointMediumScreen()+"px)").matches) {
				searchId = "inpage-search";
				this.template = searchInpageTemplate;
				this.multiSelectOptions.captionFormat = "{0} Selected";
			} else {
				searchId = "navbar-search";
				this.template = searchNavbarTemplate;
				this.multiSelectOptions.captionFormat = "multi";
			}
			
			if (this.$el.prop("id") !== searchId) {
				if (this.$el.prop("id") && this.$el.prop("id") !== "") { callRender = true; }
				this.setElement("#" + searchId);
			}
			this.$form = $(this.formSelector);
			
			if (callRender === true) { 
				$currentEl.children().remove(); 
				this.render();
				this.$optWrapper = $(".SumoSelect .optWrapper"); // necessary to SumoSelectPluginHack
			}
			
			this.SumoSelectPluginHack(); // see comment at function declaration
		},
		
		prepareFilters: function(){
			this.model.set("levels", this.fullCollection.getSortedLevels());
			this.model.set("types", this.fullCollection.getSortedTypes());
			this.render();
			this.$optWrapper = $(".SumoSelect .optWrapper"); // necessary to SumoSelectPluginHack
		},

		render: function() {
			var filterData = this.getFilterData();
			var template = _.template( this.template );
			var compiledTemplate = template( { "filters": this.model.attributes } );
			this.$el.html(compiledTemplate);
			
			this.$form = $(this.formSelector);			
			
			this.$formMultiCheckboxes = [];		
			this.$formMultiCheckboxes.level = this.$form.find("select[name='level']");
			this.$formMultiCheckboxes.type = this.$form.find("select[name='type']");	
			this.$formMultiCheckboxes.level.SumoSelect(this.multiSelectOptions);
			this.$formMultiCheckboxes.type.SumoSelect(this.multiSelectOptions);
			this.setSelectOptions(filterData);
			return this;
		},	
		
		getFilterData: function() {
			return $.getQueryParameters( this.$form.serialize(), { "toLowerCase": true }  );
		},
		
		setSelectOptions: function(filterData) {
			if (!_.isEmpty(filterData)) {
				var index;
				var filterValue;
				for (var filterName in filterData) {
					filterValue = filterData[filterName];
					if (filterValue !== "") {
						if ($.isArray(filterValue)) {
							for (var k=0; k<filterValue.length; k++) {
								index = this.$formMultiCheckboxes[filterName].getOptionIndexByValue(filterValue[k]);
								this.$formMultiCheckboxes[filterName][0].sumo.selectItem(index);
							}
						} else {
							index = this.$formMultiCheckboxes[filterName].getOptionIndexByValue(filterValue);
							this.$formMultiCheckboxes[filterName][0].sumo.selectItem(index);
						}
					}
				}
			}
		},
		
		search: function(e) {
			e.preventDefault();
			e.stopPropagation();
			this.filteredCollection.reset(this.fullCollection.filterBy( this.getFilterData() ).models);
			Backbone.pubSub.trigger("vehicles:listPaginatedRender");

		},
		
		// a quick hack for patching the menu responsiveness (but a good practice should be to work directly on the plugin code )
		SumoSelectPluginHack: function() { 
			if (this.$optWrapper && this.$optWrapper.hasClass("isFloating")) {
				var $openedOptWrapper = this.$optWrapper.filter(".open");
				if ($openedOptWrapper.length > 0) {
                    var H = $openedOptWrapper.children('ul').outerHeight() + 2;  // +2 is clear fix
					H = H + parseInt($openedOptWrapper.css('padding-bottom'));
					$openedOptWrapper.css('height', H);
				}
			}
		},
		
		onClose: function(){
			$(window).off('resize');
		}

	});

	return SearchView;
  
});
