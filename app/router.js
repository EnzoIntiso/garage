// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'slideout',
	'views/loading/LoadingView',
	'views/slideoutMenu/SlideoutMenuView',
	'views/header/HeaderView',
	'views/footer/FooterView',
	'views/modals/ModalView',
	'views/vehicles/VehiclesView',
	'views/vehicles/VehicleAddView',
	'views/vehicles/VehiclesDeleteView',
	'views/settings/SettingsView'	
], function($, _, Backbone, Slideout, LoadingView, SlideoutMenuView, HeaderView, FooterView, ModalView, VehiclesView, VehicleAddView, VehiclesDeleteView, SettingsView) {
  
	var AppRouter = Backbone.Router.extend({
		routes: {
			// Define some URL routes
			'vehicles': 'showVehicles',
			'vehicles/add': 'showVehicleAdd',
			'vehicles/delete': 'showVehicleDelete',
			'settings': 'showSettings',
			'vehicles/page/:page': 'showVehicles',
			'project': 'showProject',
			// Default
			'*actions': 'defaultAction'
		}
	});
  
	var initialize = function(){
		var loadingView = new LoadingView();
		var slideoutMenu = new Slideout({
			'panel': document.getElementById('panel'),
			'menu': document.getElementById('slideout-menu'),
			'padding': 256,
			'tolerance': 70
		});		
		var slideoutMenuView = new SlideoutMenuView( { "slideoutMenu": slideoutMenu } );
		var headerView = new HeaderView( { "slideoutMenu": slideoutMenu } );
		var footerView = new FooterView();
		var modalView = new ModalView();

		var app_router = new AppRouter();
		app_router.views = [];
		
		app_router.on('route:showVehicles', function (page) {
			if (this.currentView) this.currentView.close();
			Backbone.pubSub.trigger('loading:start');
			page = page || 1;
			var vehiclesView = new VehiclesView( { page: page } );
			this.currentView = vehiclesView;			
		});
		
		app_router.on('route:showVehicleAdd', function (page) {
			if (this.currentView) this.currentView.close();
			Backbone.pubSub.trigger('loading:start');
			var vehicleAddView = new VehicleAddView();
			this.currentView = vehicleAddView;			
		});
		
		app_router.on('route:showVehicleDelete', function (page) {
			if (this.currentView) this.currentView.close();
			Backbone.pubSub.trigger('loading:start');
			var vehiclesDeleteView = new VehiclesDeleteView();
			this.currentView = vehiclesDeleteView;			
		});
		
		app_router.on('route:showSettings', function(){
			if (this.currentView) this.currentView.close();
			Backbone.pubSub.trigger('loading:start');
			var settingsView = new SettingsView();
			this.currentView = settingsView;
		});

		app_router.on('route:defaultAction', function (actions) {
			Backbone.pubSub.trigger('loading:start');
			app_router.navigate("#/vehicles", true);
		});

		Backbone.history.start();
	};
	
	return { 
		initialize: initialize
	};
});
