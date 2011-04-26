var DOMready = (function() {

	// Variables used throughout this script
	var win = window,
		 doc = win.document,
		 dce = doc.createElement,
		 queue = [],
		 exec,
		 loaded,
		 original_onload,
		 explorerTimer,
		 readyStateTimer,
		 isIE = (function() {
			var undef,
				 v = 3,
				 div = document.createElement('div'),
				 all = div.getElementsByTagName('i');
		
			while (
				div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
				all[0]
			);
		
			return v > 4 ? v : undef;
		}());
	
	// Private inner function which is called once DOM is loaded.
	function process() {
		// Let the script know the DOM is loaded
		loaded = true;
		
		// Cleanup
		if (document.addEventListener) {
			document.removeEventListener("DOMContentLoaded", process, false);
		}
	
		// Move the zero index item from the queue and set 'exec' equal to it
		while ((exec = queue.shift())) {
			// Now execute the current function
			exec();
		}
	}

	return function(fn) {
		// if DOM is already loaded then just execute the specified function
		if (loaded) { 
			return fn();
		}
		
		if (document.addEventListener) {
			// Any number of listeners can be set for when this event fires,
			// but just know that this event only ever fires once
			document.addEventListener("DOMContentLoaded", process, false);
		}
		
		// Internet Explorer versions less than 9 don't support DOMContentLoaded.
		// The doScroll('left') method  by Diego Perini (http://javascript.nwbox.com/IEContentLoaded/) appears to be the most reliable solution.
		// Microsoft documentation explains the reasoning behind this http://msdn.microsoft.com/en-us/library/ms531426.aspx#Component_Initialization
		else if (isIE < 9) {
			explorerTimer = win.setInterval(function() {
				if (document.body) {
					try {
						dce.('div').doScroll('left');
						win.clearInterval(explorerTimer);
						return process();
					} catch(e) {}
				}
			}, 10);
			
			// Inner function to check readyState
			function checkReadyState() {
				if (doc.readyState == 'complete') {
					// Clean-up
					doc.detachEvent('onreadystatechange', checkReadyState);
					win.clearInterval(explorerTimer);
					win.clearInterval(readyStateTimer);
					
					// Process function stack
					process();
				}
			}

			// If our page is placed inside an <iframe> by another user then the above doScroll method wont work.
			// As a secondary fallback for Internet Explorer we'll check the readyState property.
			// Be aware that this will fire *just* before the window.onload event so isn't ideal.
			// Also notice that we use IE specific event model (attachEvent) to avoid being overwritten by 3rd party code.
			doc.attachEvent('onreadystatechange', checkReadyState);
			
			// According to @jdalton: some browsers don't fire an onreadystatechange event, but do update the document.readyState
			// So to workaround the above snippet we'll also poll via setInterval.
			readyStateTimer = win.setInterval(function() {
				checkReadyState();
			}, 10);
		}
		
		// Fall back to standard window.onload event
		// But make sure to store the original window.onload in case it was already set by another script
		original_onload = win.onload;
		
		win.onload = function() {
		
			// Note: calling process() now wont cause any problem for modern browsers.
			// Because the function would have already been called when the DOM was loaded.
			// Meaning the queue of functions have already been executed
			process();
			
			// Check for original window.onload and execute it
			if (original_onload) {
				original_onload();
			}
			
		};
		
		// As the DOM hasn't loaded yet we'll store this function and execute it later
		queue.push(fn);
	};
	
}());