require.config({
	baseUrl: "app/",
	paths: {
		jquery: "libs/jquery/jquery.min",
		underscore: "libs/underscore/underscore-min",
		backbone: "libs/backbone/backbone-min",
		slideout: "libs/slideout/slideout.min",
		helper_validation: "libs/helpers/validation",
		breakpoints: "breakpoints",
		
		// Backbone Plugins/Extensions
		localstorage: "libs/backbone/extensions/backbone.localStorage-min", 
		view_enhancement: "libs/backbone/extensions/backbone.view.enhancement", 
		
		// jQuery Plugins/Extensions
		jquery_enhancement: "libs/jquery/extensions/jquery.enhancement",
		jquery_sumoselect: "libs/jquery/extensions/jquery.sumoselect",
		
		// Require.js Plugins/Extensions
		text: "libs/require/text",
		
		// templates
		templates: "../templates",
		
		// extended views
		view_vehicles: "views/vehicles/VehiclesView"
	},
	
	shim: {	
		underscore: {
			"exports": "_"
		},
		
		backbone: {
			"deps": ["underscore", "jquery"],
			"exports": "Backbone"
		},
		
		breakpoints: {
			"exports": "Breakpoints"
		},
		
		helper_validation: {
			"exports": "Helper_Validation"
		}, 
		
		view_enhancement: {
			"deps": ["backbone"],
			"exports": "View_Enhancement"
		}, 
		
		jquery_enhancement: {
			"deps": ["jquery"],
			"exports": "Jquery_Enhancement"
		}, 
		
		jquery_sumoselect: {
			"deps": ["jquery"],
			"exports": "Jquery_Sumoselect"
		},
		
		localstorage: {
			deps: ["backbone"],
			exports: "Backbone"
		}
	}

});

require([
	// load app module and pass it to the definition function
	"app",

], function(App){
	App.initialize();
});
