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
		clickable: {},
		// Pages
		page: {},
		// Browse
		browse: {},
		// Player
		player: {}
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
		if (netflix.is)
		if (netflix.player.isPaused())
			netflix.clickable
	};

	netflix.player.pause = function() {

	};

	netflix.player.isPlaying = function() {

	};

	netflix.player.isPaused = function() {

	};

	netflix.player.seek = function(time) {

	};

	netflix.player.currentTime = function() {

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

	netflix.player.getLength = function() {

	};





	// find all elements
	if (netflix.isPlayer()) {
		netflix.clickable = {

		};
	}
	else {

	}

	return t;
}