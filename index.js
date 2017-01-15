import emit from 'dom-emit/from';
import isInView from './lib/in-view.js';
import topisInView from './lib/top-in-view.js';
import bottomisInView from './lib/bottom-in-view.js';


let isWatching = false,

	initialized = false,

	// watched elements
	watchedItems = [],

	// standard events to listen for (at window level)
	standardEvents = ['load', 'scroll', 'hashchange', 'touchend', 'resize'],

	// watch (at window level) for these custom events that may also change if an element is in the view port
	// typically events causing elements display to toggle.
	customEvents = [],

	// stop watching scroll and stuff if there are no elements to watch
	registerWatchListChange = function() {

		if(watchedItems.length > 0 && !isWatching) {
			attach();
		}

		else if(watchedItems.length === 0 && isWatching) {
			detach();
		}

	},

	// add event listeners to the likes of window scroll
	attach = function(){
		isWatching = true;
		standardEvents.concat(customEvents)
			.forEach( ev  => window.addEventListener(ev, checkItems) );
	},

	// remove event listeners to the likes of window scroll
	detach = function(){
		isWatching = false;
		standardEvents.concat(customEvents)
			.forEach( ev => window.removeEventListener(ev, checkItems) );
	},

	// check / update the status of an element
	checkItem = function(item) {
		var inview = isInView( item.element );
		var topAction = topisInView( item.element );
		var bottomAction = bottomisInView( item.element );

		if(item.top !== topAction) {
			item.top = topAction;
			emit(item.element, "in-stalk.top." + topAction);
		}
		if(item.bottom !== bottomAction) {
			item.bottom = bottomAction;
			emit(item.element, "in-stalk.bottom." + bottomAction);
		}

		if(item.status ==='in' && !inview ) {
			emit(item.element, "in-stalk.out");
			emit(item.element, item.element.getBoundingClientRect().bottom < 0 ? 'in-stalk.out.top' : 'in-stalk.out.bottom');
			item.status = 'out';

		} else if(item.status==='out' && inview ) {
			emit(item.element, "in-stalk.in");
			emit(item.element, item.element.getBoundingClientRect().top<0 ? 'in-stalk.in.top' : 'in-stalk.in.bottom');
			item.status = 'in';

		} else if(item.status==='new') {
			item.status = inview ? 'in' : 'out';
			item.top = topAction;
			item.bottom = bottomAction;

			if(inview) {
				emit(item.element, "in-stalk.in");
			}
		}
	},

	// what to execute while scrolling / moving viewport location
	checkItems = function() {
		initialized = true;
		watchedItems.forEach( checkItem );
	};



export default {

	// add element to stalk list
	add: function(element) {
		var config = {
			element: element,
			status: 'new'
		};

		watchedItems.push(config);

		if(initialized) {
			checkItem( config );
		}

		registerWatchListChange();

	},

	// remove an element from stalk list
	remove: function(element) {
		var newlist = watchedItems.filter(item=>item.element!==element);

		if(newlist.length !== watchedItems.length) {
			watchedItems = newlist;
			registerWatchListChange();
			return true;
		}

		return false;

	},

	listenFor: function(eventName) {
		detach();
		customEvents = customEvents.filter(ev=>ev!==eventName).concat(eventName);
		registerWatchListChange();
	},

	ignore: function(eventName) {
		detach();
		customEvents = customEvents.filter(ev=>ev!==eventName);
		registerWatchListChange();
	},

	check: checkItems

};
