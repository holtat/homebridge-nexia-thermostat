export default (fn, wait) => {
    var timeout;
    return function () {
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn(...args);
        }, wait || 500);
    };
};