define([
	'underscore',
	'backbone',
	'localstorage',
	'models/vehicle/VehicleModel',
	'models/pagination/PaginationModel',
	'models/settings/SettingsModel'
], function(_, Backbone, Localstorage, VehicleModel, PaginationModel, SettingsModel){

	var VehiclesCollection = Backbone.Collection.extend({
		
		model: VehicleModel,

		initialize: function() {
		},

		url: function() {
			return 'api/garage.json';
		},

		parse: function(data) {
			return data.garage;
		},
		
		localStorage: new Backbone.LocalStorage("garage"),
		
		comparator: function(a, b) {
			var aLvl = a.get("level");
			var bLvl = b.get("level");	
			if (aLvl-bLvl < 0) return -1;
			if (aLvl-bLvl > 0) return 1;
			
			var aSlt = a.get("slot");
			var bSlt = b.get("slot");	
			if (aSlt-bSlt < 0) return -1;
			if (aSlt-bSlt > 0) return 1;
			
			return 0;
		},
		
		selectiveFetch: function() {
			var that = this;
			if (!localStorage.getItem("garage")) {
				localStorage.clear();
				Backbone.ajaxSync("read", that.fullCollection)
				.done(function (data, textStatus, jqXHR) {
					$.each(data.garage, function(i, vehicle) {
						that.fullCollection.create(vehicle);
					});
					var settings = new SettingsModel({id: "data"});
					settings.fetchData();
					if (isPositiveInteger(data.pagination.per_page)) {
						settings.set("per_page", data.pagination.per_page);
					} else {
						var pagination = new PaginationModel({id: "data"});
						settings.set("per_page", pagination.get("per_page"));
						
					}
					settings.save();
					that.onDataHandler.apply(null, arguments);
				})
				.fail(that.onErrorHandler);
			} else {
				that.fullCollection.fetch( { parse: false } )
				.done(function (data) {
					that.onDataHandler.apply(null, arguments);
				})
				.fail(that.onErrorHandler);
			}
		},
		
		addVehicle: function(vehicle){
			if (!vehicle) return false;
			this.create(vehicle);
		},
		
		filterBy: function(filterList) {
			if (_.isEmpty(filterList)) { return this; }
			var filtered = this.filter(function (vehicle) {
				var check = true;
				for (var filterName in filterList) {
					// all filter values come already in lowercase
					if (filterList[filterName] !== "") {
						if (
							(filterName === "id" && vehicle.get(filterName).toLowerCase().indexOf(filterList[filterName] === -1)) || 
							(filterName !== "id" && !$.isArray(filterList[filterName]) && vehicle.get(filterName).toLowerCase() !== filterList[filterName]) || 
							(filterName !== "id" && $.isArray(filterList[filterName]) && filterList[filterName].indexOf(vehicle.get(filterName).toLowerCase()) === -1)
						) {
							check = false;
							break;
						} 
					}
				}
				return check;
			});
			return new VehiclesCollection(filtered);
		},
		
		getMaxProperty: function(property) {
			return Math.max.apply(Math, this.map(function(o){ return o.get(property); }));
		},
		
		getMaxSlotPerLevel: function() {
			var arrSlotPerLevel = [];
			_.map( this.models, function(model) {
				if (!arrSlotPerLevel[model.get("level")] || +model.get("slot") > +arrSlotPerLevel[model.get("level")]) {
					arrSlotPerLevel[model.get("level")] = model.get("slot");
				}
			});
			return arrSlotPerLevel;
		},
		
		paginate: function (paginationData) {
			if (!paginationData) { return; }
			var startIndex = (paginationData.page-1) * paginationData.per_page;
			var filtered = this.slice(startIndex, startIndex+paginationData.per_page);
			return new VehiclesCollection(filtered);
		},
		
		getSortedLevels: function() {
			return _.uniq(this.pluck("level")).sort(function(a, b){return a-b;});
		},
		
		getSortedTypes: function() {
			return _.uniq(this.pluck("type")).sort(function(a, b){
				a = a.toLowerCase();
				b = b.toLowerCase();
				if (a < b) return -1;
				if (a > b) return 1;
				return 0;
			});
		},
		
		removeItems: function(arrId) {
			for (var i in arrId) {
				this.removeItem(arrId[i]);
			}
		},
		
		removeItem: function(id) {
			var model = this.get(id);
			model.destroy();
		}
  });

  return VehiclesCollection;

});