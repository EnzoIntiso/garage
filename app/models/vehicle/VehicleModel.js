define([
	'underscore',
	'backbone',
], function(_, Backbone) {

	var VehicleModel = Backbone.Model.extend({

		initialize : function() {},
		  
		url : function() {
			return 'api/vehicles.json.php';
		},

		parse : function(data) {
			return data;
		}

	});

	return VehicleModel;

});
