export default function (element) {
    var bounds = element.getBoundingClientRect();

    return element.offsetParent!==null &&
    	bounds.bottom <= window.innerHeight &&
        bounds.bottom >= 0 ? 'enter' : 'exit';
}
