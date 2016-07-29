function Netflix(jq) {

  if (typeof jq !== 'undefined') {
    var $ = jq;
  }
  else if (typeof jQuery !== 'undefined') {
    var $ = jQuery;
  }
  else {
    throw new Error("jQuery is required for netflix.js");
  }

  var netflix = {
    // Constants
    version: '0.1',
    // Pages
    page: {},
    // Util functions
    util: {},
    // Elements
    _elements: {},
    // Browse
    browse: {},
    // Player
    player: {}
  };

  // Setup
  netflix.setup = function() {
    // set up the elements
    if (netflix.page.isPlayer()) {
      netflix.player.setup();
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

  // Until functions
  /**
   * Simulate mouse on element
   */
  netflix.util.jiggleMouse = function(el) {
    var event = new MouseEvent("mousemove", {
        bubbles: true,
        cancelable: true,
        currentTarget: el[0]
    });
    return el.length > 0 && el[0].dispatchEvent(event);
  };

  /**
   * Simulate mouse on element
   */
  netflix.util.triggerHover = function(el) {
    var event = new MouseEvent("mouseover", {
        bubbles: true,
        cancelable: true,
        currentTarget: el[0]
    });
    return el.length > 0 && el[0].dispatchEvent(event);
  };

  /**
   * Simulate clicking on element at given points and then moving mouse out
   */
  netflix.util.triggerClick = function(el, internalOffset) {
    var offset = el.offset();
    console.log(el.offset());

    // Set defaults
    internalOffset   = $.isPlainObject(internalOffset) ? internalOffset   : {};
    internalOffset.x = internalOffset.x != null        ? internalOffset.x : 0;
    internalOffset.y = internalOffset.y != null        ? internalOffset.y : el.height()/2;

    // Set the clicking position        
    var clientX = offset.left + internalOffset.x;
    var clientY = offset.top + internalOffset.y;

    var mousedown = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: clientX,
      clientY: clientY
    });

    el[0].dispatchEvent(mousedown);

    setTimeout(function() {
      var mouseup = new MouseEvent("mouseup", {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: clientX,
        clientY: clientY
      });

      el[0].dispatchEvent(mouseup);

      setTimeout(function() {
        var click = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: clientX,
          clientY: clientY
        });

        el[0].dispatchEvent(click);

        setTimeout(function() {
          var mouseout = new MouseEvent("mouseout", {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: 0,
            clientY: 0
          });
          
          el[0].dispatchEvent(mouseout);
        }, 0);
      }, 0);
    }, 0);
  };

  // Player Setup
  netflix.player.setup = function() {
    netflix._elements = {
      video: $('#netflix-player video')[0],
      playPauseButton: $('.player-control-button.player-play-pause'),
      slider: {
        timeLeft: $('section.player-slider > label'),
        progressCompleted: $('.player-scrubber-progress-completed'),
        bar: $('#scrubber-component'),
      },
      fullscreenButton: $('.player-control-button.player-fill-screen'),
      volume: {
        bar: $('#player-menu-volume > div > div'),
        button: $('.player-control-button.volume'),
      },
      navigation: {
        backToBrowseButton: $('#netflix-player > a.player-back-to-browsing'),
        nextEpisodeButton: $('.player-control-button.player-next-episode'),
      }
    };
  };

  // Player Controls
  netflix.player.play = function() {
      if (netflix.player.isPaused()) {
        netflix._elements.playPauseButton.click();
        return true;
      }
      return false;
  };

  netflix.player.pause = function() {
    if (netflix.player.isPlaying()) {
      netflix._elements.playPauseButton.click();
      return true;
    }
    return false;
  };

  netflix.player.isPlaying = function() {
    if (netflix.page.isPlayer()) {
      return netflix._elements.playPauseButton.attr('aria-label') == 'Pause';
    }
    return false;
  };

  netflix.player.isPaused = function() {
    if (netflix.page.isPlayer()) {
      return !netflix.player.isPlaying();
    }
    return false;
  };

  netflix.player.isBuffering = function() {
    return $("#player-playback-buffering").hasClass('player-active');
  };

  netflix.player.seek = function(seconds) {
    if (netflix.page.isPlayer()) {
      netflix.util.jiggleMouse(netflix._elements.slider.bar);
      var pixelsPerSeconds = netflix._elements.slider.bar.width()/netflix.player.duration();
      var pixels = seconds * pixelsPerSeconds;
      setTimeout(function() {
        netflix.util.triggerClick(netflix._elements.slider.bar, {x: pixels});
      }, 0);

      return netflix.player.currentTime();
    }
  };

  netflix.player.currentTime = function(seconds) {
    if (typeof seconds !== "undefined")
      return netflix.player.seek(seconds);
    else
      return netflix._elements.video.currentTime;
  };

  netflix.player.duration = function() {
    return netflix._elements.video.duration;
  };

  netflix.player.isMuted = function() {
    return netflix.player.volume() == 0;
  };

  netflix.player.mute = function() {
    if (!netflix.player.isMuted()) {
      netflix.util.triggerClick(netflix._elements.volume.button);
      return true;
    }
    return false;
  };

  netflix.player.unmute = function() {
    if (netflix.player.isMuted()) {
      netflix.util.triggerClick(netflix._elements.volume.button);
      return true;
    }
    return false;
  };

  netflix.player.volume = function(volume) {
    if (typeof volume !== "undefined") {
      // add a ceil of 1 and a floor of 0
      volume = (volume < 0) ? 0 : ((volume > 1) ? 1 : volume);

      netflix.util.jiggleMouse(netflix._elements.volume.button);
      setTimeout(function() {
        netflix.util.triggerHover(netflix._elements.volume.button);
      
        setTimeout(function() {
          var pixelsInBar = netflix._elements.volume.bar.height();
          var pixels = pixelsInBar - volume * pixelsInBar;
          netflix.util.triggerClick(netflix._elements.volume.bar, {y: pixels});
        }, 0);
      }, 0);

      return volume;
    }
        
    return netflix._elements.video.volume;
  };

  // TODO
  netflix.player.previousEpisode = function() {

  };

  netflix.player.nextEpisode = function() {
    if (!netflix._elements.navigation.nextEpisodeButton.hasClass('player-hidden')) {
      netflix._elements.navigation.nextEpisodeButton.click();
      return true;
    }
    return false;
  };

  netflix.player.backToBrowse = function() {
    netflix._elements.navigation.backToBrowseButton.click();
  };

  netflix.player.isFullscreen = function() {
    return netflix._elements.fullscreenButton.attr('aria-label') == "Exit Fullscreen";
  };

  netflix.player.toggleFullscreen = function() {
    netflix._elements.fullscreenButton.click();
    return netflix.player.isFullscreen();
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

  netflix.setup();

  return netflix;
}
var test = 1;
setTimeout(function() {
plug = Netflix();
plug.player.duration();
}, 2000);