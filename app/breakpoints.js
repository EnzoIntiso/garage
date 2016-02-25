var Breakpoints = (function(){
	var breakHandhelds = 320;
	var breakMediumScreen = 640;
	var breakWideScreen = 1200;
	return {
		getBreakpointHandhelds: function() { return breakHandhelds; },
		getBreakpointMediumScreen: function() { return breakMediumScreen; },
		getBreakpointWideScreen: function() { return breakWideScreen; }
	};
})();

