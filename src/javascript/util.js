var Util = {};

Util.map = function(array, fn) {
    var result = [];

    for (var i = 0; i < array.length; i++) {
        result.push(fn(array[i], i));
    }

    return result;
};
