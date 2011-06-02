function MockEjax(options) {
    var content = null;
    var rows = 24;
    var columns = 80;

    if (options && options.content) {
        content = options.content;
    }

    if (options && options.rows) {
        rows = options.rows;
    }

    if (options && options.columns) {
        columns = options.columns;
    }

    this.ejax = new Ejax(rows, columns, this);

    if (content) {
        this.ejax.setBufferContent(content);
    }
}

MockEjax.fn = MockEjax.prototype;

MockEjax.fn.separator = function() {
    return new String(java.io.File.separator);
};

MockEjax.fn.setPixel = function(c, x, y, options) {
};

MockEjax.fn.setPixels = function(str, x, y, options) {
};

MockEjax.fn.setupPixelMethods = function() {
    this.setPixel = function(c, x, y) {
        this.pixels = this.pixels || {};
        this.pixels[y] = this.pixels[y] || {};
        this.pixels[y][x] = c;
        this.pixels[y].maxX = this.pixels[y].maxX || 0;
        this.pixels[y].maxX = Math.max(x, this.pixels[y].maxX);
        this.pixels.maxY = this.pixels.maxY || 0;
        this.pixels.maxY = Math.max(y, this.pixels.maxY);
    };

    this.setPixels = function(str, x, y) {
        for (var i = 0; i < str.length; i++) {
            this.setPixel(str.charAt(i), x + i, y);
        }
    };

    this.pixelRow = function(y) {
        if (y > this.pixels.maxY) {
            fail("" + y + " is outside the max y value of " + this.pixels.maxY);
        }

        var result = "";
        var row = this.pixels[y];

        for (var x = 0; x <= row.maxX; x++) {
            result += row[x];
        }

        return result;
    };
};

MockEjax.fn.registerKeyDown = function(fn) {
    this.onKeyDown = fn;
};

MockEjax.fn.setCursor = function(x, y) {
};

MockEjax.fn.file = function(filename) {
};

MockEjax.fn.fireKeyDowns = function(keys) {
    var tokens = parseBinding(keys);

    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        this.onKeyDown(keyboard.standard.tokenToEvent(token));
    }
};
