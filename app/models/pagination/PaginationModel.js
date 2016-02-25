define([
	'underscore',
	'backbone',
	'localstorage'
], function(_, Backbone, Localstorage) {

	var PaginationModel = Backbone.Model.extend({

		defaults: {
			"page": 1, 
			"sort": "asc", 
			"per_page": 7, 
			"total_pages": 1,
			"total_results": 4
		},  
	
		localStorage: new Backbone.LocalStorage("pagination"),

		initialize: function(options) {
		},

		parse: function(data) {
			return data;
		},
		
		fetchData: function(defaultOptions) {
			var self = this;
			self.fetch()
			.done(function (data) { 
				return data;
			})
			.fail(function (err) {
				self.setData(defaultOptions);
			});
		},
		
		setData: function(data){
			var self = this;
			_.each(data, function(value, key){
				self.set(key, value);
			});
			self.save();
		}

    });

  	return PaginationModel;

});
