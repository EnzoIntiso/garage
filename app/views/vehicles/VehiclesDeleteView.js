define([
	'views/vehicles/VehiclesView',
	'views/vehicles/VehiclesDeleteFooterView',
	'text!templates/vehicles/vehiclesDeleteTemplate.html'
], function(VehiclesView, VehiclesDeleteFooterView, vehiclesDeleteTemplate) {
	
    var VehiclesDeleteView = VehiclesView.extend({
		
		initialize: function(options) {
			VehiclesView.prototype.initialize.apply(this, arguments);
			Backbone.pubSub.trigger("header:setTitle", "Deregister Vehicles");
			this.listenTo(Backbone.pubSub, "vehicleslistRender:end", this.extraRender);
			this.listenTo(Backbone.pubSub, "vehicles:uncheckAll", this.uncheckAll);
			this.listenTo(Backbone.pubSub, "vehicles:deleteChecked", this.deleteChecked);
			_.bindAll(this, "extraRender", "setId", "uncheckAll", "deleteChecked", "toggleCheck");
			this.childViews.vehiclesDeleteFooterView = new VehiclesDeleteFooterView();
			this.extraRender();
		},
		
		events: {
			//"click div.vehicles-list__delete > input": "setId",
			"click li.vehicles-list__item": "toggleCheck"
		},
		
		toggleCheck: function(e) {
			var selector = "input[name='toDelete']";
			var $checkBox = $(e.target);
			if ($(e.target).prop("name") !== "toDelete") {
				$checkBox = $checkBox.find(selector);
				e.target = $checkBox;
				$checkBox.prop("checked", !$checkBox.prop("checked"));
			}
			this.setId(e);
		},
		
		extraRender: function() {
			this.$listedItem = this.$el.find(".vehicles-list__item");
			this.$listedItem.addClass("pointer");
			var template = _.template( vehiclesDeleteTemplate );
			var compiledTemplate = template();

			$(compiledTemplate).insertBefore(this.$listedItem.children("div:last-child"));
			var $checkboxBlocks = this.$listedItem.find(".vehicles-list__delete");
			this.$checkBoxes = $checkboxBlocks.find("input[type='checkbox']");
			
			var speed = this.checkedItems ? 0 : 200;
			if (this.checkedItems) {
				$checkboxBlocks.animate( {width:'toggle', left: null} , speed );
			} else {
				$checkboxBlocks.delay( 400 ).animate( {width:'toggle', left: null} , 200 );
			}

			this.setupChecks();
			
			return this;
		},
		
		setupChecks: function() {
			var that = this;
			if (!that.checkedItems) { that.checkedItems = []; }
			this.$checkBoxes.each(function( index, el ) {
				var licenceId = $(el).closest(".vehicles-list__item").find(".licenceId").text();
				$(el).val(licenceId);
				if (that.checkedItems.indexOf(licenceId) > -1) { $(el).prop("checked", true); }
			});
		},
		
		setId: function(e) {
			var licenceId = $(e.target).val();
			if ($(e.target).is(":checked")) {
				this.checkedItems.push(licenceId);
			} else {
				this.checkedItems = _.without(this.checkedItems, licenceId);
			}
			if ((this.checkedItems.length === 1 && !this.childViews.vehiclesDeleteFooterView.isVisible()) ||
				(this.checkedItems.length === 0 && this.childViews.vehiclesDeleteFooterView.isVisible())) {
				this.childViews.vehiclesDeleteFooterView.toggleVisibility();
			}
		},
		
		uncheckAll: function() {
			this.$checkBoxes.prop("checked", false);
			this.checkedItems = [];
			this.childViews.vehiclesDeleteFooterView.toggleVisibility();
		},
		
		deleteChecked: function() {
			this.fullCollection.removeItems(this.checkedItems);
			this.checkedItems = [];
			Backbone.pubSub.trigger("vehicles:listPaginatedRender");
			this.childViews.vehiclesDeleteFooterView.toggleVisibility();
		}
		
		
    });

    return VehiclesDeleteView;
});