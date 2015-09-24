(function () {
	'use strict';

	// wait for document to load and then trigger the mousemovement
	document.addEventListener('DOMContentLoaded', function () {
		document.addEventListener("mousemove", mouseLogger.mouseMove);

		inactivityTime.init();
	});

	var mouseLogger = (function () {
		return {
			'mouseMove': mouseMove
		};
		//cached values for the browsers without movementX and Y
		var cmY = 0,
			cmX = 0;

		function mouseMove(e) {
			// catch if the mouse enters the trigger point
			var triggerArea = 100,
				minX = triggerArea,
				maxX = window.innerWidth - triggerArea,
				movement = getMovement(e);

			render(e.clientX + ' / ' + e.clientY + ' : ' + movement, 'mouseinfo');

			if (movement === 'NE' && e.clientX < minX) {
				render('MAC TOP LEFT');
			} else if (movement === 'NW' && e.clientX > maxX) {
				render('Windows TOP Right');
			} else if (movement === 'SE' && e.clientX < minX) {
				render(' Windows MENU bottom left');
			}
		}

		function render(message, messageDiv) {
			messageDiv = messageDiv || 'mymoves'; // default message div name
			var mHolder = document.getElementById(messageDiv);

			if (mHolder) {
				mHolder.innerHTML = message;
			}
		}

		function getMovement(e) {
			var movement = '';
			// TODO: can use something bigger than 0 to avoid slow movements
			// TODO: test movement on IE
			var mx = e.movementX || e.mozMovementX;
			var my = e.movementY || e.mozMovementY;

			// for the browsers with no support for movement. SAFARI
			if (typeof mx === 'undefined') {
				if (e.clientX > cmX) { // moving right
					if (e.clientY < cmY) {
						movement = 'NW';
					} else {
						movement = 'SW';
					}
				} else if (e.clientX < cmX) { // moving left
					if (e.clientY < cmY) {
						movement = 'NE';
					} else {
						movement = 'SE';
					}
				}
				// skip it if it is the same value
				cmX = (cmX === e.clinetX) ? cmX : e.clientX;
				cmY = (cmY === e.clientY) ? cmY : e.clientY;
			} else { // for the browser with movement. Chrome / FF
				if (mx > 0 && my < 0) {
					movement = 'NW';
				} else if (mx < 0 && my < 0) {
					movement = 'NE';
				} else if (mx > 0 && my > 0) {
					movement = 'SW';
				} else if (mx < 0 && my > 0) {
					movement = 'SE';
				}
				// stop the hor. or vert. movement if it is the same
				if (mx === my) {
					movement = '';
				}
			}
			return movement;
		}
	})();

	// idle checking
	var inactivityTime = (function () {
		return {
			'init': init
		};

		var t;

		function init() {
			resetTimer();
			document.onmousemove = resetTimer;
			document.onkeypress = resetTimer;
		};

		function render(msg) {
			msg = (msg) ? msg : 'Inactive';
			var inactiveDiv = document.getElementById('inactivediv');
			inactiveDiv.innerHTML = msg;
		}

		function resetTimer() {
			clearTimeout(t);
			t = setTimeout(render, 3000); //3 sec
			render('Active');
		}
	})();



})();