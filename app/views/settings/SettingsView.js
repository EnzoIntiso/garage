define([
	'jquery',
	'underscore',
	'backbone',
	'helper_validation',
	'models/settings/SettingsModel',
	'collections/vehicles/VehiclesCollection',
	'text!templates/settings/settingsTemplate.html'
], function($, _, Backbone, Helper_Validation, SettingsModel, VehiclesCollection, settingsTemplate){

	var SettingsView = Backbone.View.extend({
		el: $("#page"),
			
		initialize: function() {
			Backbone.pubSub.trigger("header:setTitle", "Settings");
			_.bindAll(this, "render", "save", "onDataHandler", "onErrorHandler");
			this.fullCollection = new VehiclesCollection();
			this.fullCollection.selectiveFetch.call(this);
		},
		
		events: { 
			"click button[name='button_save']": "save"
		},
		
		onDataHandler: function(data, textStatus, jqXHR) {
			var formDataCfg = [];
			formDataCfg.min_level = this.fullCollection.getMaxProperty("level");
			formDataCfg.min_slot = this.fullCollection.getMaxProperty("slot");
			this.formDataCfg = formDataCfg;

			this.model = new SettingsModel({id: "data"});
			this.model.fetchData();

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
				settings: this.model,
				formDataCfg: this.formDataCfg
			};
			var template = _.template( settingsTemplate );
			var compiledTemplate = template(data);
			this.$el.html(compiledTemplate);
			Backbone.pubSub.trigger("loading:end");
			if (!this.$form) { this.$form = $("form.settings__form"); }
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
				this.model.setData(formData);
				this.$message.text("Settings were correctly saved").addClass("success").fadeIn("fast");
			}
			window.scrollTo(0, 0);
		},
		
		validate: function(formData) {
			this.$message.hide().text("").removeClass("success fail");
			for (var fieldName in formData) {
				this.$form.find("label[for='" + fieldName + "']").removeClass("error");
			}
			var invalidFields = [];
			var i;
			if (formData.max_level !== "" && !isNaturalNumber(formData.max_level)) { invalidFields.push("max_level"); }
			if (formData.max_slot !== "" && !isNaturalNumber(formData.max_slot)) { invalidFields.push("max_slot"); }
			if (!isNaturalNumber(formData.per_page)) { invalidFields.push("per_page"); }
			if (invalidFields.length > 0) {
				for (i=0; i<invalidFields.length; i++) {
					this.$form.find("label[for='" + invalidFields[i] + "']").addClass("error");
				}
				this.$message.text("Please insert only numeric data in the highlighted fields").addClass("fail").fadeIn("fast");
				return false;
			}
			
			var outOfRangeFields = [];
			if (formData.max_level !== "" && +formData.max_level < +this.formDataCfg.min_level) { outOfRangeFields.push("max_level"); }
			if (formData.max_slot !== "" && +formData.max_slot < +this.formDataCfg.min_slot) { outOfRangeFields.push("max_slot"); }
			if (+formData.per_page < 1) { outOfRangeFields.push("per_page"); }
			if (outOfRangeFields.length > 0) {
				for (i=0; i<outOfRangeFields.length; i++) {
					this.$form.find("label[for='" + outOfRangeFields[i] + "']").addClass("error");
				}
				this.$message.text("Values in highlighted fields are out of the allowed range").addClass("fail").fadeIn("fast");
				return false;
			}
			
			return true;
		}
	});

	return SettingsView;
});
