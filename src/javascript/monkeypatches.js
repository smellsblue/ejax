String.prototype.startsWith = function(value) {
    return this.indexOf(value) == 0;
};

Object.prototype.isFunction = function() {
    return typeof(this) == "function";
};

Object.prototype.isString = function() {
    return false;
};

String.prototype.isString = function() {
    // For some reason typeof(this) doesn't work for strings...
    return true;
};
