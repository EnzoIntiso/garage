define([
	'jquery',
	'underscore',
	'backbone',
	'helper_validation',
	'models/vehicle/VehicleModel',
	'models/settings/SettingsModel',
	'collections/vehicles/VehiclesCollection',
	'text!templates/vehicles/vehicleAddTemplate.html'
], function($, _, Backbone, Helper_Validation, VehicleModel, SettingsModel, VehiclesCollection, vehicleAddTemplate){

	var VehicleAddView = Backbone.View.extend({
		el: $("#page"),
			
		initialize: function() {
			Backbone.pubSub.trigger("header:setTitle", "Register Vehicle");
			_.bindAll(this, "render", "save", "onDataHandler", "onErrorHandler");
			
			this.fullCollection = new VehiclesCollection();
			this.fullCollection.selectiveFetch.call(this);
		},
		
		events: { 
			"click button[name='button_save']": "save"
		},
		
		onDataHandler: function(data, textStatus, jqXHR) {
			this.settings = new SettingsModel({id: "data"});
			this.settings.fetchData();

			var formDataCfg = [];
			formDataCfg.max_level = this.settings.get("max_level");
			formDataCfg.max_slot = this.settings.get("max_slot");
			this.formDataCfg = formDataCfg;
			this.render();
		},
		
		onErrorHandler: function(jqXHR, response, errorThrown) {
			Backbone.pubSub.trigger("loading:end");
			
			var data = {
				"title": errorThrown.toString(),
				"message": "("+jqXHR.status+") " + response
			};
			Backbone.pubSub.trigger("modal:open", data);

			console.log(jqXHR);
			console.log(response);
			console.log(errorThrown);
		},
		
		render: function(){
			var data = {
				formDataCfg: this.formDataCfg
			};
			var template = _.template( vehicleAddTemplate );
			var compiledTemplate = template(data);
			this.$el.html(compiledTemplate);
			Backbone.pubSub.trigger("loading:end");
			if (!this.$form) { this.$form = $("form.vehicle-add__form"); }
			if (!this.$message) { this.$message = $("p.message"); }
			return this;
		},
		
		getFormData: function() {
			return $.getQueryParameters( this.$form.serialize() );
		},
		
		save: function(e) {
			e.preventDefault();
			e.stopPropagation();
			var formData = this.getFormData();
			if (this.validate(formData)) {
				this.fullCollection.addVehicle(formData);
				this.$form[0].reset();
				this.$message.text("The vehicle has been registered in the garage").addClass("success").fadeIn("fast");
			}
			window.scrollTo(0, 0);
		},
		
		validate: function(formData) {
			var i;
			this.$message.hide().text("").removeClass("success fail");
			for (var fieldName in formData) {
				this.$form.find("label[for='" + fieldName + "']").removeClass("error");
			}

			var mandatoryFields = [];
			if (formData.id === "") { mandatoryFields.push("id"); }
			if (formData.type === "") { mandatoryFields.push("type"); }
			if (formData.level === "") { mandatoryFields.push("level"); }
			if (formData.slot === "") { mandatoryFields.push("slot"); }
			if (mandatoryFields.length > 0) {
				for (i=0; i<mandatoryFields.length; i++) {
					this.$form.find("label[for='" + mandatoryFields[i] + "']").addClass("error");
				}
				this.$message.text("Please fill the highlighted fields").addClass("fail").fadeIn("fast");
				return false;
			}
			
			var invalidFields = [];
			if (!checkLicence(formData.id)) { invalidFields.push("id"); }
			if (!isNaturalNumber(formData.level)) { invalidFields.push("level"); }
			if (!isNaturalNumber(formData.slot)) { invalidFields.push("slot"); }
			if (invalidFields.length > 0) {
				for (i=0; i<invalidFields.length; i++) {
					this.$form.find("label[for='" + invalidFields[i] + "']").addClass("error");
				}
				this.$message.text("Highlighted fields contain values of forbidden format").addClass("fail").fadeIn("fast");
				return false;
			}		
			
			var outOfRangeFields = [];
			if (+formData.level < 1 || (this.formDataCfg.max_level && +formData.level > +this.formDataCfg.max_level)) { outOfRangeFields.push("level"); }
			if (+formData.slot < 1 || (this.formDataCfg.max_slot && +formData.slot > +this.formDataCfg.max_slot)) { outOfRangeFields.push("slot"); }
			if (outOfRangeFields.length > 0) {
				for (i=0; i<outOfRangeFields.length; i++) {
					console.log(this.$form, outOfRangeFields[i]);
					this.$form.find("label[for='" + outOfRangeFields[i] + "']").addClass("error");
				}
				this.$message.text("Values in highlighted fields are out of the allowed range").addClass("fail").fadeIn("fast");
				return false;
			}
			
			if (this.fullCollection.get(formData.id)) {
				this.$form.find("label[for='id']").addClass("error");
				this.$message.text("This vechicle is already registered").addClass("fail").fadeIn("fast");
				return false;
			}		
			
			if (this.fullCollection.find(function(model) { return model.get("level") == formData.level && model.get("slot") == formData.slot; })) {
				this.$form.find("label[for='level'], label[for='slot']").addClass("error");
				this.$message.text("This parking place is already occupied").addClass("fail").fadeIn("fast");
				return false;
			}
			
			return true;
		}
	});

	return VehicleAddView;
});
