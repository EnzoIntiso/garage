define([
	'underscore',
	'backbone',
	'localstorage'
], function(_, Backbone, Localstorage) {

	var SettingsModel = Backbone.Model.extend({
		
		defaults: {
			"per_page": "", 
			"max_level": "",
			"max_slot": ""
		},
	
		localStorage: new Backbone.LocalStorage("settings"),

		initialize: function() {
		},

		parse: function(data) {
			return data;
		},
		
		fetchData: function() {
			var self = this;
			self.fetch()
			.done(function (data) { 
				return data;
			})
			.fail(function (err) {
				self.save();
			});
		},
		
		initData: function(data) {
			var self = this;
			_.each(data, function(value, key) {
				if (!self.get(key)) {
					self.set(key, value);
				}
			});
			self.save();
		},
		
		setData: function (data) {
			var self = this;
			_.each(data, function(value, key){
				self.set(key, value);
			});
			self.save();
		}

    });

  	return SettingsModel;

});
