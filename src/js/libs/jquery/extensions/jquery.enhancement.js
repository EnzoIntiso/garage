jQuery.extend({
	/*
	getQueryParameters: function(str) {
		return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
	},
	*/
	getQueryParameters: function(str, options) {
		options = options || {};
		return (str || document.location.search).replace(/(^\?)/,'').split("&").map(
			function(n){
				n = n.split("=");
				if (n[0]) {
					if (options.toLowerCase == true && n[1]) { n[1] = n[1].toLowerCase(); }
					if (!this[n[0]]) {
						this[n[0]] = n[1];
					} else {
						if (!$.isArray(this[n[0]])) { this[n[0]] = [this[n[0]]]; }
						this[n[0]].push(n[1]);
					}
				}
				return this;
			}.bind({})
		)[0];
	}
});

$.fn.getOptionIndexByValue = function(str) {
	return $(this).children("option[value='" + str + "']").index();
};