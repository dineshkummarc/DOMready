[Integralist](http://www.integralist.co.uk/) - DOMready
================================

Description
-----------

A cross browser 'DOM ready' function.

If you don't know already, (usually) the best time to trigger your JavaScript functions is when the DOM (Document Object Model) is ready to be interacted with.

If you try and call a function which modifies an element in the DOM, but yet you're not waiting for the `window.onload` event then the function may fire before the DOM element is available to be interacted with and your script will generate an error.

So to avoid this, developers would write code that looked like this...

`window.onload = function() { // do something here };`

...but the problem was that it was just too slow for most developers to put up with. You want to be interacting with your DOM as soon as possible, but if you use the `window.onload` event then you're not just waiting for the DOM but all its content (such as images, stylesheets, iframes etc) to load as well.

Developers needed something quicker, and so here comes the `DOMContentLoaded` event which fires when the browser has finished parsing the document but before the rest of the assets in the page (e.g. images, stylesheets, iframes etc) have finished loading.

Problem is this event isn't supported cross-browser so developers have come up with a multitude of ways of mimicking this.

This script is one such way.


Disclaimer
----------

This DOMready function was originally a modified version of @ded's "Smallest DOMReady code, ever' - but it quickly became apparent (thanks to @jdalton) that this version was sorely lacking and that although the work-around did 'work' it was very slow and in some browsers only marginally quicker than a simple window.onload.

So I reverted the code back to a previous version I had from a few years back.

But since then I've had feedback from both @jdalton and @diegoperini and implemented some essential updates to make this script as effective as possible.

My previous iterations (not on Github) have included at some point or another used...

* For versions of Safari older than 525 (which didn't support DOMContentLoaded) use the `document.readyState` method.
* For Internet Explorer: using Conditional Compilation `@cc_on @` along with `setInterval` to check the `doScroll` response
* For Internet Explorer: `document.write` of deferred script
* For Internet Explorer: checking for both `document.body && document.body.lastChild`
* Checking for `document && document.getElementsByTagName && document.getElementById && document.body`


Miscellaneous notes
-------------

Dean Edwards `document.write` of the deferred script has given problems on some pages (causing a consistent > 60 sec delay).

Dean also suggests that `document.readyState` is unreliable and that he has seen cases where `document.readyState` was "complete" while `document.body` was still `null`.
As well as other cases where `document.readyState` was not complete until after all images on the page were loaded.

The `doScroll` method has been seen to succeed while `document.body` is still `null`.
And `document.body` can be non-null prior to the DOM being available.

One solution that so far has tested 100% OK is to combine a test for both `document.body` and success of `doScroll`.
Sometimes the `doScroll` is not available and Internet Explorer falls back to `window.onload` so some developers tried using a timer to counter this.
