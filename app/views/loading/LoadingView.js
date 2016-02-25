define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/loading/loadingTemplate.html'
], function($, _, Backbone, loadingTemplate){

	var LoadingView = Backbone.View.extend({
		el: $("#loading"),

		initialize: function() {
			this.listenTo(Backbone.pubSub, "loading:start", this.startLoading);   
			this.listenTo(Backbone.pubSub, "loading:end", this.endLoading);   
			this.render();
			
		},

		render: function() {
			var template = _.template( loadingTemplate );
			var compiledTemplate = template();
			this.$el.html(compiledTemplate);
			return this;
		},
		
		startLoading: function(data) {
			//console.log("start loading");
			this.$el.show();
			this.$el.children().addClass("loading-overlay");
		},
		
		endLoading: function(data) {
			//console.log("end loading");
			this.$el.hide();
			this.$el.children().removeClass("loading-overlay");
		}

	});

	return LoadingView;
  
});
