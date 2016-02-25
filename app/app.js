define([
	'jquery', 
	'underscore', 
	'backbone',
	'router', // Request router.js
	'view_enhancement',
	'jquery_enhancement',
	'models/settings/SettingsModel'
], function($, _, Backbone, Router, View_Enhancement, Jquery_Enhancement, SettingsModel){
	var initialize = function(){
		Backbone.pubSub = _.extend({}, Backbone.Events);

		// Pass in our Router module and call it's initialize function
		Router.initialize();
	};

	return { 
		initialize: initialize
	};
});
