# Insta-Streaks
Makes country streak counters show the streak count instantaneously.

1. [Click here to install Insta-Streaks script for Tampermonkey and Chrome](https://github.com/echandler/Insta-Streaks/raw/main/instaStreaks.user.js).
2. [Click here to install Simple Reverse Geocoding Script for instant preformance](https://github.com/echandler/Simple-Reverse-Geocoding-Script/raw/main/reverseGeocodingScript.user.js).
3. In the country streak script, make sure ```//grant none``` is at the top in the header, this is required for Insta-Streaks to work. If it isn't you will need to type it in manually (see picture). If you see any other ```\\@grant``` in the header it will need to be replaced, for example: ```\\@grant GM_addStyle``` should be replaced with ```\\@grant none```; in the case that messes up the country streak counter you will have to decide what to do.
4. Some bigdatacloud.net scripts need this generic API key "abcdefabcdef0123456789abcdefabcd" to get past that paticular scripts API key filter, it's not guaranteed to work thou.

![https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png](https://raw.githubusercontent.com/echandler/Insta-Streaks/main/Tampermonkey%20header%20%40grant%20none%20example%20.png)

## Custom Polygons

Make a new Tampermonkey script and paste this into it, changing what you think is necessary.

```
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    window._customCoordinates = {
        keys: ["state", "SomeKey"], // You need to know what keys in the response to override.
        customError: "Custom Error!",
        coordinatesObject: {
                      // The coordinates need to be [longitude, latitude] (x,y) NOT [latitude, longitude] (y,x).
          "Las Vegas":[ 
                          [[-115.400392,36.454904],[-115.327485,35.810499],[-114.705262,36.17827]]
                      ],
          "Los Angeles":[
                            [[-118.475614,34.192805],[-118.332671,33.863886],[-117.980986,34.083686]], // Los Angeles
                            [[-117.828794,33.841077],[-117.912504,33.88612],[-117.976989,33.83081],[-117.876616,33.768045]] // Anaheim
                        ],
        }
    };
    
})();
```

