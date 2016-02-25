define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/project/projectTemplate.html'
], function($, _, Backbone, projectTemplate){

	var ProjectView = Backbone.View.extend({
		el: $("#page"),
			
		initialize: function() {
			$(".navbar .navbar-nav li").removeClass("active");
			$(".navbar #nav_project").addClass("active");
			this.render();
		},
		
		render: function(){
			var template = _.template( projectTemplate );
			var compiledTemplate = template();
			this.$el.html(compiledTemplate);
			Backbone.pubSub.trigger("loading:end");
			return this;
		}
	});

	return ProjectView;
});
