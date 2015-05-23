"use strict";

(function () {
    "use strict";

    var $$$es6$element$inviewport$$default = (function () {

        var isWatching = false,
            initialized = false,

        // watched elements
        watchedItems = [],

        // standard events to listen for (at window level)
        standardEvents = ["load", "scroll", "hashchange", "touchend", "resize"],

        // watch (at window level) for these custom events that may also change if an element is in the view port
        // typically events causing elements display to toggle.
        customEvents = [],

        // true if element in viewport
        isInView = function isInView(element) {
            var bounds = element.getBoundingClientRect();

            return element.offsetParent !== null && bounds.bottom >= 0 && bounds.top <= window.innerHeight && bounds.right >= 0 && bounds.left <= window.innerWidth;
        },

        // tell errrbody the element entered / exited the viewport
        broadcastElementStatus = function (element, status) {
            return element.dispatchEvent(new CustomEvent("viewport:" + status, { bubbles: true }));
        },

        // stop watching scroll and stuff if there are no elements to watch
        registerWatchListChange = function registerWatchListChange() {

            if (watchedItems.length > 0 && !isWatching) {
                attachListener();
            } else if (watchedItems.length === 0 && isWatching) {
                detachListener();
            }
        },

        // add event listeners to the likes of window scroll
        attachListener = function attachListener() {
            isWatching = true;
            standardEvents.concat(customEvents).forEach(function (ev) {
                return window.addEventListener(ev, checkItems);
            });
        },

        // remove event listeners to the likes of window scroll
        detachListener = function detachListener() {
            isWatching = false;
            standardEvents.concat(customEvents).forEach(function (ev) {
                return window.removeEventListener(ev, checkItems);
            });
        },

        // check / update the status of an element
        checkItem = function checkItem(item) {
            var inview = isInView(item.element);

            if (item.status === "in" && !inview) {
                broadcastElementStatus(item.element, "out");
                item.status = "out";
            } else if (item.status === "out" && inview) {
                broadcastElementStatus(item.element, "in");
                item.status = "in";
            } else if (item.status === "new") {
                item.status = inview ? "in" : "out";

                if (inview) {
                    broadcastElementStatus(item.element, "in");
                }
            }
        },

        // what to execute while scrolling / moving viewport location
        checkItems = function checkItems() {
            initialized = true;
            watchedItems.forEach(checkItem);
        };

        return {

            // add element to stalk list
            add: function add(element) {
                var config = {
                    element: element,
                    status: "new"
                };

                watchedItems.push(config);

                if (initialized) {
                    checkItem(config);
                }

                registerWatchListChange();
            },

            // remove an element from stalk list
            remove: function remove(element) {
                var newlist = watchedItems.filter(function (item) {
                    return item.element !== element;
                });

                if (newlist.length !== watchedItems.length) {
                    watchedItems = newlist;
                    registerWatchListChange();
                    return true;
                }

                return false;
            },

            addListener: function addListener(eventName) {
                detachListener();
                customEvents.push(eventName);
                registerWatchListChange();
            },

            removeListener: function removeListener(eventName) {
                detachListener();
                customEvents = customEvents.filter(function (ev) {
                    return ev !== eventName;
                });
                registerWatchListChange();
            },

            check: checkItems

        };
    })();

    window.viewportwatcher = $$$es6$element$inviewport$$default;
}).call(undefined);