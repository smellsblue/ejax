function IO(io) {
    this.io = io;
}

IO.fn = IO.prototype;

IO.fn.separator = function() {
    if (this.io.separator) {
        return this.io.separator();
    }
};

IO.fn.shell = function(options) {
    if (this.io.shell) {
        return this.io.shell(options);
    }
};

IO.fn.setPixels = function(str, x, y, options) {
    if (!options) {
        options = {};
    }

    if (this.io.setPixels) {
        return this.io.setPixels(str, x, y, options);
    }
};

IO.fn.setPixel = function(c, x, y, options) {
    if (!options) {
        options = {};
    }

    if (this.io.setPixel) {
        return this.io.setPixel(c, x, y, options);
    }
};

IO.fn.registerKeyDown = function(fn) {
    if (this.io.registerKeyDown) {
        return this.io.registerKeyDown(fn);
    }
};

IO.fn.setCursor = function(x, y) {
    if (this.io.setCursor) {
        return this.io.setCursor(x, y);
    }
};

IO.fn.beep = function() {
    if (this.io.beep) {
        return this.io.beep();
    }
};

IO.fn.file = function(filename) {
    if (this.io.file) {
        return this.io.file(filename);
    }
};

IO.fn.exit = function() {
    if (this.io.exit) {
        return this.io.exit();
    }
};
