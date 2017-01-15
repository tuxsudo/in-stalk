var polyfilled = false;

if (typeof window !== "undefined" && typeof window.CustomEvent !== "function") {
			var CustomEvent$1 = function CustomEvent(event) {
						var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { bubbles: false, cancelable: false, detail: undefined };

						var evt = document.createEvent('CustomEvent');
						evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
						return evt;
			};

			CustomEvent$1.prototype = window.Event.prototype;

			window.CustomEvent = CustomEvent$1;

			polyfilled = true;
}

var emitter = function (element, evName, data) {
	return element.dispatchEvent(new CustomEvent(evName, { bubbles: true, detail: data }));
};

var isInView = function (element) {
    var bounds = element.getBoundingClientRect();

    return element.offsetParent !== null && bounds.bottom >= 0 && bounds.top <= window.innerHeight && bounds.right >= 0 && bounds.left <= window.innerWidth;
};

var topisInView = function (element) {
    var bounds = element.getBoundingClientRect();

    return element.offsetParent !== null && bounds.top <= window.innerHeight && bounds.top >= 0 ? 'enter' : 'exit';
};

var bottomisInView = function (element) {
    var bounds = element.getBoundingClientRect();

    return element.offsetParent !== null && bounds.bottom <= window.innerHeight && bounds.bottom >= 0 ? 'enter' : 'exit';
};

var isWatching = false;
var initialized = false;
var watchedItems = [];
var standardEvents = ['load', 'scroll', 'hashchange', 'touchend', 'resize'];
var customEvents = [];
var registerWatchListChange = function registerWatchListChange() {

	if (watchedItems.length > 0 && !isWatching) {
		attach();
	} else if (watchedItems.length === 0 && isWatching) {
		detach();
	}
};
var attach = function attach() {
	isWatching = true;
	standardEvents.concat(customEvents).forEach(function (ev) {
		return window.addEventListener(ev, checkItems);
	});
};
var detach = function detach() {
	isWatching = false;
	standardEvents.concat(customEvents).forEach(function (ev) {
		return window.removeEventListener(ev, checkItems);
	});
};
var checkItem = function checkItem(item) {
	var inview = isInView(item.element);
	var topAction = topisInView(item.element);
	var bottomAction = bottomisInView(item.element);

	if (item.top !== topAction) {
		item.top = topAction;
		emitter(item.element, "in-stalk.top." + topAction);
	}
	if (item.bottom !== bottomAction) {
		item.bottom = bottomAction;
		emitter(item.element, "in-stalk.bottom." + bottomAction);
	}

	if (item.status === 'in' && !inview) {
		emitter(item.element, "in-stalk.out");
		emitter(item.element, item.element.getBoundingClientRect().bottom < 0 ? 'in-stalk.out.top' : 'in-stalk.out.bottom');
		item.status = 'out';
	} else if (item.status === 'out' && inview) {
		emitter(item.element, "in-stalk.in");
		emitter(item.element, item.element.getBoundingClientRect().top < 0 ? 'in-stalk.in.top' : 'in-stalk.in.bottom');
		item.status = 'in';
	} else if (item.status === 'new') {
		item.status = inview ? 'in' : 'out';
		item.top = topAction;
		item.bottom = bottomAction;

		if (inview) {
			emitter(item.element, "in-stalk.in");
		}
	}
};
var checkItems = function checkItems() {
	initialized = true;
	watchedItems.forEach(checkItem);
};

var index = {

	// add element to stalk list
	add: function add(element) {
		var config = {
			element: element,
			status: 'new'
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

	listenFor: function listenFor(eventName) {
		detach();
		customEvents = customEvents.filter(function (ev) {
			return ev !== eventName;
		}).concat(eventName);
		registerWatchListChange();
	},

	ignore: function ignore(eventName) {
		detach();
		customEvents = customEvents.filter(function (ev) {
			return ev !== eventName;
		});
		registerWatchListChange();
	},

	check: checkItems

};

export default index;
