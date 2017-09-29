# Netflix.js

A chrome extension library which makes it easier to control Netflix.

## Installation 

### Quick Usage

If you want to just test out the library you can copy the following snippet into the console. To open the console in Google Chrome on Windows press `Ctrl` + `Shift` + `J` or on a Mac press `Cmd` + `Opt` + `J`.

```javascript
var head = document.getElementsByTagName('head')[0];

var jqueryScript = document.createElement('script');
jqueryScript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js';

var netflixScript = document.createElement('script');
netflixScript.src = 'https://rawgit.com/avrahamgoldman/netflix.js/master/netflix.js';

jqueryScript.onload = function() {
	jQuery.noConflict();
	head.appendChild(netflixScript);
};

netflixScript.onload = function() {
	flix = Netflix(jQuery);
	console.log('netflix.js loaded');
};

head.appendChild(jqueryScript);
```

To pause the player now simply paste the following in the console.

```javascript
flix.player.pause();
```

### In a Chrome Extension

To use netflix.js in a Chrome extension first grab a copy of `netflix.js` and add it to your extension's directory. If you are not using jQuery in your proejct download a copy and place it in your directory. 

Next, add both scripts to your content scripts array in `manifest.json`.

```javascript
{
  "manifest_version": 2,
  "name": "Extension Name",
  "version": "1.0",
  "permissions": [
    "activeTab"
  ],
  "content_scripts": [
    {
      "matches": ["*://www.netflix.com/*"],
      "js": ["js/jquery.js", "js/netflix.js", "js/script.js"]
    }
  ]
}

```

In your `js/script.js` call the `Netflix` function

```javascript
jQuery.noConflict();
(function($) {

var flix = Netflix($);

// add your code here

})(jQuery);
```

And now you're good to go!

## Page

#### Availability: All pages

###  Methods

#### `flix.page.getPage():String`
Returns a string equal to one of the following: <br>
`flix.page.BROWSE`, `flix.page.PLAYER`, `flix.page.TITLE`, `flix.page.SEARCH`, `flix.page.SETTINGS`, and `flix.page.UNKNOWN`

#### `flix.page.isBrowse():Boolean`
Returns `true` if the current page is a browse page, `false` if not.
  
#### `flix.page.isPlayer():Boolean`
Returns `true` if the current page is a video page, `false` if not.

#### `flix.page.isTitle():Boolean`
Returns `true` if the current page is a title details page, `false` if not.

#### `flix.page.isSearch():Boolean`
Returns `true` if the current page is a search results page, `false` if not.

#### `flix.page.isSettings():Boolean`
Returns `true` if the current page is a page for managing the user's account, `false` if not.

#### `flix.page.on(event:String, handler:Function):Function`
Attaches an handler for the specified event. Returns the handler passed in.

#### `flix.page.one(event:String, handler:Function):Function`
Attaches an handler for the specified event that will only be fired at most once. Returns the handler passed in.

#### `flix.page.off(event:String [, handler:Function]):Boolean`
Removes the specified handler or all handlers if none is given for the event. Returns `true` if at least one handler was removed, `false` if not.

### Events
**Note: To listen for all pages changes listen for both `load` and `change`.**
* **`load`** - Fired when the page is loaded.
* **`change`** - Fired when the page is changed without reloading.

## Player

#### Availability: When `flix.page.isPlayer()` is `true`

### Methods

#### `flix.player.play():Void`
###### *Available from `ready` event to `postplay` event.*
Plays the video.

#### `flix.player.pause():Void`
###### *Available from `ready` event to `postplay` event.*
Pauses the video.

#### `flix.player.isPlaying():Void`
###### *Available from `ready` event to `postplay` event.*
Returns `true` if the video is playing, `false` if not.

#### `flix.player.isPaused():Void`
###### *Available from `ready` event to `postplay` event.*
Returns `true` if the video is paused, `false` if not.

#### `flix.player.isBuffering():Void`
###### *Available from `ready` event to `postplay` event.*
Returns `true` if the video is buffering, `false` if not.

#### `flix.player.seekTo(seconds:Number):Void`
###### *Available from `ready` event to `postplay` event.*
Seeks to the specified time in seconds in the video. Note: the video maintains its state (i.e. if it was paused it says paused).

#### `flix.player.getCurrentTime():Number`
Returns the number of seconds elapsed since the start of the video.

#### `flix.player.getDuration():Number`
Returns the number of seconds in the video.

#### `flix.player.isMuted():Boolean`
Returns `true` if the video is muted, `false` if not.

#### `flix.player.mute():Void`
###### *Available from `ready` event to `postplay` event.*
Mutes the player.

#### `flix.player.unMute():Void`
###### *Available from `ready` event to `postplay` event.*
Unmutes the palyer.

#### `flix.player.getVolume():Float`
Returns the player's volume which is a float between `0` and `1`.

#### `flix.player.setVolume(volume:Float):Void`
###### *Available from `ready` event to `postplay` event.*
**Note: This function is still fairly buggy. Use with caution.**
Sets the player's volume to a Float between `0` and `1`.

#### `flix.player.nextEpisode():Void`
Navigates the page to the next episode. If the current episode is the last episode no action is taken.

#### `flix.player.backToBrowse():Void`
Navigates to last browsing page.

#### `flix.player.isFullscreen():Boolean`
###### *Available from `ready` event to `postplay` event.*
Returns `true` if the player is fullscreen, `false` if not.

#### `flix.player.toggleFullscreen():Void`
###### *Available from `ready` event to `postplay` event.*
If the player is normal sized it grows to fullscreen, otherwise it exits fullscreen.

#### `flix.player.getId():String`
Returns the current video's ID.

#### `flix.player.getTitle():String`
Returns the current video's title or show title if it is part of a show.

#### `flix.player.isShow():Boolean`
Returns `true` if the current video is part of a show, `false` if not.

#### `flix.player.isMovie():Boolean`
Returns `true` if the current video is not part of a show, `false` if not.

#### `flix.player.getSeason():Number`
###### *Available from `ready` event to `postplay` event.*
Returns the season the current video is in if the video is part of a show, `null` if not.

#### `flix.player.getEpisode():Number`
###### *Available from `ready` event to `postplay` event.*
Returns the current video's episode number if it is part of a show, `null` if not.

#### `flix.player.getEpisodeTitle():String`
###### *Available from `ready` event to `postplay` event.*
Returns current video's episode title if it is part of a show, `null` if not.

#### `flix.player.getEpisodeDescription():String`
###### *Available from `ready` event to `postplay` event.*
Returns current video's episode description if it is part of a show, `null` if not.

#### `flix.player.getMovieDescription():String`
###### *Available from `ready` event to `postplay` event.*
Returns current video's movie description if it is not part of a show, `null` if it is.

#### `flix.player.getMovieRating():String`
###### *Available from `ready` event to `postplay` event.*
Returns current video's movie rating if it is not part of a show, `null` if it is.

#### `flix.player.getMovieYear():String`
###### *Available from `ready` event to `postplay` event.*
Returns current video's movie publishing year if it is not part of a show, `null` if it is.

#### `flix.player.on(event:String, handler:Function):Function`
Attaches an handler for the specified event. Returns the handler passed in.

#### `flix.player.one(event:String, handler:Function):Function`
Attaches an handler for the specified event that will only be fired at most once. Returns the handler passed in.

#### `flix.player.off(event:String [, handler:Function]):Boolean`
Removes the specified handler or all handlers if none is given for the event. Returns `true` if at least one handler was removed, `false` if not.

### Events
* **`ready`** - Fired when the player is fully loaded.
* **`play`** - Fired when the player is no longer paused or is started.
* **`playing`** - Fired when is playing after being paused or buffering.
* **`pause`** - Fired when the player is paused.
* **`timeupdate`** - Fired repeatedly as video is playing.
* **`postplay`** - Fired when the player enters the postplay screen.
* **`seeked`** - Fired when the player skips to a new time.
* **`volumechange`** - Fired when the volume is changed.

## Constants

| Key | Value | Usage |
|------|---------|--------|
| `flix.page.BROWSE` | browse | Use to check value returned by `flix.page.getPage()` |
| `flix.page.PLAYER` | watch | Use to check value returned by `flix.page.getPage()` |
| `flix.page.TITLE`  | title | Use to check value returned by `flix.page.getPage()` |
| `flix.page.SEARCH` | search | Use to check value returned by `flix.page.getPage()` |
| `flix.page.SETTINGS` | settings | Use to check value returned by `flix.page.getPage()` |
| `flix.page.UNKNOWN` | unknown | Use to check value returned by `flix.page.getPage()` |

