Object.isNullOrUndefined = function(obj) {
    return obj === null || obj === undefined;
};

Array.prototype.contains = function(value) {
    return this.indexOf(value) >= 0;
};

String.prototype.contains = function(value) {
    return this.indexOf(value) >= 0;
};

String.prototype.jsEscape = function() {
    var result = "";

    for (var i = 0; i < this.length; i++) {
        var c = this.charAt(i);

        if (c == "\n") {
            result += "\\n";
        } else if (c == "\r") {
            result += "\\r";
        } else if (c == "\t") {
            result += "\\t";
        } else if (c == "\"") {
            result += "\\\"";
        } else if (c == "\'") {
            result += "\\\'";
        } else if (c == "\\") {
            result += "\\\\";
        } else {
            result += c;
        }
    }

    return result;
};

String.prototype.inclusiveSplit = function(splitOn) {
    var result = [];
    var remaining = this;
    var index = remaining.indexOf(splitOn);

    while (index != -1) {
        result.push(remaining.substring(0, index + 1));
        remaining = remaining.substring(index + 1);
        index = remaining.indexOf(splitOn);
    }

    result.push(remaining);
    return result;
};

String.prototype.startsWith = function(value) {
    return this.indexOf(value) == 0;
};

String.prototype.endsWith = function(value) {
    return this.lastIndexOf(value) == this.length - value.length;
};

String.prototype.count = function(value) {
    var result = 0;
    var index = this.indexOf(value);

    while (index >= 0) {
        result++;
        index = this.indexOf(value, index + 1);
    }

    return result;
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
