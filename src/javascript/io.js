function IO(io) {
    this.io = io;
}

IO.fn = IO.prototype;

IO.fn.setPixel = function(c, x, y) {
    if (this.io.setPixel) {
        return this.io.setPixel(c, x, y);
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
