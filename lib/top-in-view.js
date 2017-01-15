export default function (element) {
    var bounds = element.getBoundingClientRect();

    return element.offsetParent!==null &&
        bounds.top <= window.innerHeight &&
    	bounds.top >= 0 ? 'enter' : 'exit';
}
