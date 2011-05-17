String.prototype.startsWith = function(value) {
    return this.indexOf(value) == 0;
};

String.prototype.isString = function() {
    // For some reason typeof(this) doesn't work for strings...
    return true;
};

String.prototype.insert = function(str, index) {
    var before = this.substring(0, index);
    var after = this.substring(index, this.length);
    return before + str + after;
};

String.prototype.remove = function(index, length) {
    var before = this.substring(0, index);
    var after = this.substring(index + length, this.length);
    return before + after;
};

Object.prototype.isFunction = function() {
    return typeof(this) == "function";
};

Object.prototype.isString = function() {
    return false;
};
