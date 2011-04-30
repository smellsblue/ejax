String.prototype.startsWith = function(value) {
    return this.indexOf(value) == 0;
};

String.prototype.isPrintable = function() {
    if (this.length == 0) {
        return false;
    }

    if (this.length > 1) {
        for (var i = 0; i < this.length; i++) {
            if (!this.charAt(i).isPrintable()) {
                return false;
            }
        }

        return true;
    }

    if (this == "\t" || this == "\n") {
        return true;
    }

    var code = this.charCodeAt(0);
    return code >= 32 && code <= 126; 
};

Object.prototype.isFunction = function() {
    return typeof(this) == "function";
};
