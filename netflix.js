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
    page: {
      BROWSE: 'browse',
      PLAYER: 'player',
      TITLE: 'title',
      SEARCH: 'search',
      SETTINGS: 'settings',
      UNKNOWN: 'unknown'
    },
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
      alert('is player');
      // netflix.player.setup();
    }
  };

  // Location
  netflix.page._path = window.location.pathname;

  netflix.page.getPage = function() {
    if(netflix.page._url.indexOf('/browse/') > 0)
  };

  netflix.page.isBrowse = function() {
    return netflix.page._url.indexOf('/browse/') > 0;
  };
  
  netflix.page.isPlayer = function() {
    return netflix.page._url.indexOf('/watch/') > 0;
  };

  netflix.page.isTitle = function() {
    return netflix.page._url.indexOf('/title/') > 0;
  }

  netflix.page.isSearch = function() {
    return netflix.page._url.indexOf('/search/') > 0;
  };

  netflix.page.isSettings = function() {
    var settingPages = ['ManageProfiles', 'YourAccount', 'email', 'password', 'phonenumber', 'YourAccountPayment', 'BillingActivity', 'ChangePlan', 'Subscribe', 'EmailPreferences', 'pin', 'DoNotTest', 'Activate', 'ManageDevices', 'EditProfiles', 'LanguagePreferences', 'HdToggle', 'SubtitlePreferences', 'MyListOrder', 'viewingactivity', 'MoviesYouveSeen', 'Reviews'];
    for (var i = 0; i < settingPages.length; i++) {
      if (netflix.page._url.indexOf('/'+settingPages[i]+'/') > 0)
        return true;
    }

    return false;
  };

  // Location events
  Eventable(netflix.page);
  netflix.page.registerEvent('change', function() {
    var changed = netflix.page._path != window.location.pathname;
    
    if (changed)
      netflix.page._path = window.location.pathname;

    return changed;
  }).listen();
  netflix.page.registerEvent('load', {element: window, event: 'load'}).listen();

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

    // Setup player events' condition
    netflix.player.setCondition('play', {element: netflix._elements.video, event: 'playing'}).listen();
    netflix.player.setCondition('pause', {element: netflix._elements.video, event: 'pause'}).listen();
    netflix.player.setCondition('volumechange', {element: netflix._elements.video, event: 'volumechange'}).listen();
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

  // Player Events
  Eventable(netflix.player);
  // Player Event conditions are defined in player.setup()
  netflix.player.registerEvent('ready');
  netflix.player.registerEvent('play');
  netflix.player.registerEvent('pause');
  netflix.player.registerEvent('volumechange');

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

  netflix.page.on('load', function(event) {
    console.log('load page');
    netflix.setup();
  });
  netflix.page.on('change', function(event) {
    console.log('change page');
    netflix.setup();
  });


  return netflix;
}

function Eventable(element) {

  /**
   * registers a blank event if the given event does not exist
   */
  var defaultTheEvent = function(event) {
    if (!eventExists(event))
      element.registerEvent(event);
  }

  var eventExists = function(event) {
    return element._events.hasOwnProperty(event);
  }

  element._events = {};

  element.registerEvent = function(event, condition) {
    if (eventExists(event))
      element._events[event].setCondition(condition);
    else
      element._events[event] = CustomEvent(event, condition);

    return element._events[event];
  };

  element.setCondition = function(event, condition) {
    defaultTheEvent(event);

    return element._events[event].setCondition(condition);
  }

  element.on = function(event, fn) {
    defaultTheEvent(event);

    return element._events[event].on(fn);
  };

  element.one = function(event, fn) {
    defaultTheEvent(event);

    return element._events[event].one(fn);
  };

  element.off = function(event, fn) {
    if (eventExists(event))
      return element._events[event].off(fn);
    else
      return false;
  };

  element.trigger = function(event, e) {
    defaultTheEvent(event);
    
    return element._events[event].trigger(e);
  };

  element.listen = function(event) {
    if (eventExists(event))
      return element._events[event].listen();
    else
      return false;
  };

  element.kill = function(event) {
    if (eventExists(event))
      return element._events[event].kill();
    else
      return false;
  };



  /**
   * Returns an object for handling custom made, locally managed events
   *
   */
  function CustomEvent(name, condition) {
    // set default condition
    var defaultCondition = function() {return false;};
    condition = condition ? condition : defaultCondition;

    var event = {
      name: name,
      _condition: condition,
      _intervalRate: 250,
      _interval: false,
      _handlers: [],
    };

    event.setCondition = function(condition) {
      condition = condition ? condition : defaultCondition;
      var listening = event.isListening();
      
      if (listening)
        event.kill();
      event._condition = condition;
      if (listening)
        event.listen();

      return event;
    };

    /**
     * Add a function to be fired when the event happens
     *
     * @param fn Function - the function to be fired
     */
    event.on = function(fn) {
      
      event._handlers.push(fn);

      return fn;
    };

    /**
     * Add a function to be fired once when the event happens
     *
     * @param fn Function - the function to be fired
     */
    event.one = function(fn) {
      var removableFn = function(e) {
        fn(e);
        event.off(removableFn);
      };

      return event.on(removableFn);
    };

    /**
     * Remove a function
     *
     * @param fn Function - the function to be removed
     */
    event.off = function(fn) {
      // if no function is given remove all the event handlers
      if (typeof fn == 'undefined') {
        event._handlers = [];

        return true;
      }

      // if its a function get the index of it and remove it
      if($.isFunction(fn)) {
        var index = event._handlers.indexOf(fn);
        event._handlers.splice(index, 1);
        return true;
      }
      
      return false;
    };

    /**
     * Fire the event 
     *
     * loop through the handlers and fire them with the event data passed in
     * @param e - data to be passed to the handler
     */
    event.trigger = function(e) {
      for (var index = 0; index < event._handlers.length; index++) {
        event._handlers[index](e);
      }

      return true;
    };

    /**
     * Listen for the event condition to be met
     *
     */
    event.listen = function() {
      // if its already listening return true
      if (event.isListening())
        return true;

      // if the condition is a function for a custom event
      if($.isFunction(event._condition)) {
        event._interval = setInterval(function() {
          var condition = event._condition();
          if (condition != false)
            event.trigger(condition);
        }, event._intervalRate);

        return true;
      }
      
      // if the condition is an object for just wrapping an element's event
      if($.isPlainObject(event._condition) 
          && event._condition.hasOwnProperty('element') 
          && event._condition.hasOwnProperty('event')) {

        event._condition.method = function(e) {
          event.trigger(e);
        };

        event._condition.element.addEventListener(event._condition.event, event._condition.method);
        event._interval = true;

        return true;
      }

      return false;
    };

    event.isListening = function() {
      return event._interval != false;
    }

    /**
     * Stop listening for the event condition
     *
     */
    event.kill = function() {
      // if the condition is a function for a custom event
      if($.isFunction(event._condition)) {
        clearInterval(event._interval);
        
        event._interval = false;
        return true;
      }

      // if the condition is an object for just wrapping an element's event
      if($.isPlainObject(event._condition) 
          && event._condition.hasOwnProperty('element') 
          && event._condition.hasOwnProperty('event')) {
        event._condition.element.removeEventListener(event._condition.event, event._condition.method);
        
        event._interval = false;
        return true;
      }

      return false;
    };


    return event;
  }
}

n = Netflix();
var one = n.player.on('volumechange', function(event) {console.log('one')});
var two = n.player.on('volumechange', function(event) {console.log('two')});
var three = n.player.on('volumechange', function(event) {console.log('three')});
// n.player.off('volumechange');