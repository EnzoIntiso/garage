define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/footer/footerTemplate.html'
], function($, _, Backbone, footerTemplate){

	var FooterView = Backbone.View.extend({
		el: $("#footer"),

		initialize: function() {

			this.render();
			
		},

		render: function() {
			var data = {
				author: "Vincenzo Intiso"
			};
			var template = _.template( footerTemplate );
			var compiledTemplate = template(data);
			this.$el.html(compiledTemplate);
			return this;
		}

	});

	return FooterView;
  
});
