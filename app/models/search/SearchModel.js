define([
	'underscore',
	'backbone',
	'localstorage'
], function(_, Backbone, Localstorage) {

	var SearchModel = Backbone.Model.extend({ 

		initialize: function( options ) {
		},
		
		//localStorage: new Backbone.LocalStorage("search"),
		
		parse: function(data) {
			return data;
		}

    });

  	return SearchModel;

});
