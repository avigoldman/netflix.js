function Netflix(jq) {

	if (typeof jq !== 'undefined') {
		$ = jq;
	}
	else if (typeof jQuery !== 'undefined') {
		$ =jQuery;
	}
	else {
		throw new Error("jQuery is required for netflix.js");
	}


	var netflix = {
		// Constants
		version: '0.1',
		// Variables
		elements: {},
		// Pages
		page: {},
		// Browse
		browse: {},
		// Player
		player: {
			_length: -1
		}
	};

	// Location
	var url = window.location.href;

	netflix.page.isBrowse = function() {
		return url.indexOf('/browse/') > 0;
	};
	
	netflix.page.isPlayer = function() {
		return url.indexOf('/watch/') > 0;
	};

	netflix.page.isTitle = function() {
		return url.indexOf('/title/') > 0;
	}

	netflix.page.isSearch = function() {
		return url.indexOf('/search/') > 0;
	};

	netflix.page.isSettings = function() {
		var settingPages = ['ManageProfiles', 'YourAccount', 'email', 'password', 'phonenumber', 'YourAccountPayment', 'BillingActivity', 'ChangePlan', 'Subscribe', 'EmailPreferences', 'pin', 'DoNotTest', 'Activate', 'ManageDevices', 'EditProfiles', 'LanguagePreferences', 'HdToggle', 'SubtitlePreferences', 'MyListOrder', 'viewingactivity', 'MoviesYouveSeen', 'Reviews'];
		for (var i = 0; i < settingPages.length; i++) {
			if (url.indexOf('/'+settingPages[i]+'/') > 0)
				return true;
		}

		return false;
	};




	// Player Controls
	netflix.player.play = function() {
		if (netflix.page.isPlayer()) {
			if (netflix.player.isPaused()) {
				netflix.elements.playPauseButton.click();
				return true;
			}
			else {
				return false;
			}
		}
	};

	netflix.player.pause = function() {
		if (netflix.page.isPlayer()) {
			if (netflix.player.isPlaying()) {
				alert('pause');
				netflix.elements.playPauseButton.click();
				return true;
			}
			else {
				return false;
			}
		}
	};

	netflix.player.isPlaying = function() {
		if (netflix.page.isPlayer()) {
			return netflix.elements.playPauseButton.attr('aria-label') == 'Pause';
		}
	};

	netflix.player.isPaused = function() {
		return !netflix.player.isPlaying();
	};

	netflix.player.seek = function(time) {
		if (netflix.page.isPlayer()) {
			var x = 369;
			var y = 587;
			var eventDetails = {
				clientX: x,
				clientY: y,
				layerX: x,
				layerY: y,
				pageX: x,
				pageY: y,
				offsetX: x,
				offsetY: y,
				x: x,
				y: y
			};
			// var mousedown = new $.Event('mousedown', eventDetails);
			// var mouseup = new $.Event('mouseup', eventDetails);
			// var click = new $.Event('click', eventDetails);
			var mousedown = new MouseEvent('mousedown', eventDetails);
			var mouseup = new MouseEvent('mouseup', eventDetails);
			var click = new MouseEvent('click', eventDetails);
			console.log(mousedown);
			console.log(mouseup);
			console.log(click);

			netflix.elements.slider.bar[0].dispatchEvent(mousedown);
			netflix.elements.slider.bar[0].dispatchEvent(mouseup);
			netflix.elements.slider.bar[0].dispatchEvent(click);
			// netflix.elements.slider.bar[0].trigger(mouseup);
			// netflix.elements.slider.bar[0].trigger(click);
		}
	};

	netflix.player.currentTime = function() {
		var progressCompleted = parseFloat(netflix.elements.slider.progressCompleted.width());
		var length = netflix.player.getLength();

		return length * progressCompleted/100;
	};

	netflix.player.getLength = function() {
		if (netflix.player._length == -1) {
			var progressCompleted = parseFloat(netflix.elements.slider.progressCompleted.width());
			var timeLeft = netflix.elements.slider.timeLeft.text();

			           // minute                                                   second
			timeLeft = parseInt(timeLeft.substring(0, timeLeft.indexOf(':')))*60 + parseInt(timeLeft.substring(timeLeft.indexOf(':')+1));

			netflix.player._length = 1/(((100 - progressCompleted)/100)/timeLeft);
		}
		
		return netflix.player._length;
	};

	netflix.player.stabilize = function() {

	};

	netflix.player.getVolume = function() {

	};

	netflix.player.setVolume = function(volume) {

	};

	netflix.player.previousEpisode = function() {

	};

	netflix.player.nextEpisode = function() {

	};

	netflix.player.backToBrowse = function() {

	};

	netflix.player.isFullscreen = function() {

	};

	netflix.player.toggleFullscreen = function() {
		netflix.elements.fullscreenButton.click();
	};





	// Player Information
	netflix.player.getId = function() {

	};

	netflix.player.getTitle = function() {

	};

	netflix.player.getDescription = function() {

	};

	netflix.player.getType = function() {

	};

	netflix.player.getSeason = function() {

	};

	netflix.player.getEpisode = function() {

	};

	netflix.player.getEpisodeTitle = function() {

	};

	netflix.player.getEpisodeDescription = function() {

	};




	// set up the elements
	if (netflix.page.isPlayer()) {
		netflix.elements = {
			playPauseButton: $('.player-control-button.player-play-pause'),
			slider: {
				timeLeft: $('section.player-slider > label'),
				progressCompleted: $('.player-scrubber-progress-completed'),
				bar: $('#scrubber-component'),
			},
			fullscreenButton: $('.player-control-button.player-fill-screen')
		};
	}
	else {

	}

	return netflix;
}

n = Netflix();
n.player.seek(100);