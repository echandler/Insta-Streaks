// ==UserScript==
// @name         Insta-Streaks v1.3
// @description  Modify the fetch function to divert requests to SGS for country streak scripts.
// @namespace    https://www.geoguessr.com/
// @version      1.3
// @author       echandler
// @match        https://www.geoguessr.com/*
// @run-at       document-start
// @copyright    2023, echandler
// @license      MIT
// @updateURL    https://github.com/echandler/Insta-Streaks/raw/main/instaStreaks.user.js
// @noframes
// ==/UserScript==

(function() {
    'use strict';
    function injected() {

        window.fetch = function() {
            let _fetch = window.fetch;
            let skipCache = false;
            let cachedV3API = null;
            let anchor = null;

            return async function(...args){
                if (!/geoguessr.com.(challenge|game)/i.test(location.href)){
                    return _fetch.apply(window, args);
                }

                if (/geoguessr.com.api.v3.(challenge|game)/i.test(args[0])){
                    if (!skipCache && cachedV3API !== null){

                        return new Promise((res)=>{ res(cachedV3API.clone())});

                    }

                    let v3APIRes= await _fetch.apply(window, args);

                    cachedV3API = v3APIRes.clone();

                    let resJSON = await v3APIRes.clone().json();

                    if (resJSON.state === undefined || resJSON.state === 'finished'){
                        // Online challenge breakdown end screen hack.
                        setTimeout(() => skipCache = true, 100);

                    } else {

                        skipCache = false;

                    }

                    setTimeout(()=> cachedV3API = null, 100);

                    return new Promise((res)=>{ res(v3APIRes)});

                }

                const nominatim = /nominatim.openstreetmap.org\/reverse.php/.test(args[0]);
                const bigDataCloud = /bigdata/i.test(args[0]);

                if (!window.sgs && (nominatim || bigDataCloud)){
                    if (anchor == null){
                        anchor = document.createElement('a');
                        anchor.innerText = "Click here to install the Simple Reverse Geocoding Script for best Insta-Streak preformance.";
                        anchor.setAttribute('href', "https://github.com/echandler/Simple-Reverse-Geocoding-Script/raw/main/reverseGeocodingScript.user.js");
                        anchor.style.cssText = "position: absolute; bottom: 1em; left: 1em; color: rgba(200,200,200,0.5);";
                        document.body.appendChild(anchor);
                        setTimeout(()=> {
                             anchor.parentElement.removeChild(anchor);
                             anchor = null;
                        }, 2000);
                    }

                    return _fetch.apply(window, args);
                }

                if (nominatim){
                    let lat = args[0].replace(/.*lat=(.*?)&.*/, '$1');
                    let lng = args[0].replace(/.*lon=(.*?)&.*/, '$1');

                    let sgsRes = await window.sgs.reverse({lat: parseFloat(lat), lng: parseFloat(lng)});

                    if (sgsRes.error){
                        sgsRes = {
                            country: {
                                admin_country_code: "Nope",
                                country_name: "Nope"
                            },
                        };
                    }

                    return new Promise((res) => res({
                            status: 200,
                            json : (res) => ({
                                address: {
                                    country: sgsRes.country.country_name,
                                    country_code: sgsRes.country.admin_country_code.toUpperCase(),
                                },
                            })
                        }));

                } else if (bigDataCloud){
                    //https://api.bigdatacloud.net/data/reverse-geocode?latitude=37.870365142822266&longitude=32.49225616455078&
                    let lat = args[0].replace(/.*latitude=(.*?)&.*/, '$1');
                    let lng = args[0].replace(/.*longitude=(.*?)&.*/, '$1');

                    let sgsRes = await window.sgs.reverse({lat: parseFloat(lat), lng: parseFloat(lng)});

                    if (sgsRes.error){
                        sgsRes = {
                            country: {
                                admin_country_code: "Nope",
                                country_name: "Nope"
                            },
                        };
                    }

                    return new Promise((res1) => res1({
                        status: 200,
                        json : () => ({
                            then: (res2) => res2({
                                countryCode: sgsRes.country.admin_country_code.toUpperCase(),
                            })
                        })
                    }));
                }

                return _fetch.apply(window, args);
            }

        }();
    }

    unsafeWindow.eval(`(${injected.toString()})()`);
})();
