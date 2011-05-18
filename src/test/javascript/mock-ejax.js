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

MockEjax.fn.setPixel = function(c, x, y) {
};

MockEjax.fn.registerKeyDown = function(fn) {
    this.onKeyDown = fn;
};

MockEjax.fn.setCursor = function(x, y) {
};

MockEjax.fn.file = function(filename) {
};
