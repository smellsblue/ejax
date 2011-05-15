function Screen(ejax, rows, columns) {
    this.ejax = ejax;
    this.rows = rows;
    this.columns = columns;
    var scratch = new Buffer(this, { name: "*scratch*" });
    this.currentWindow = new EjaxWindow(this, scratch, 0, 0, rows - 1, columns);
    this.buffers = {};
    this.buffers[scratch.name] = scratch;
    this.windows = [this.currentWindow];
    this.minibuffer = new Buffer(this, { name: "minibuffer", minibuffer: true });
    this.windows.push(new EjaxWindow(this, this.minibuffer, 0, rows - 1, 1, columns));
    this.clear();
    this.redraw();
    this.resetCursor();
}

Screen.fn = Screen.prototype;

Screen.fn.eachWindow = function(fn) {
    for (var i = 0; i < this.windows.length; i++) {
        fn(this.windows[i]);
    }
};

Screen.fn.clear = function() {
    this.eachWindow(function(window) {
        window.clear();
    });
};

Screen.fn.redraw = function() {
    this.eachWindow(function(window) {
        window.redraw();
    });
};

Screen.fn.redrawBuffer = function(buffer) {
    this.eachWindow(function(window) {
        if (window.buffer == buffer) {
            window.clear();
            window.redraw();
        }
    });
};

Screen.fn.resetCursor = function() {
    this.ejax.io.setCursor(this.currentWindow.buffer.getCursorX(), this.currentWindow.buffer.getCursorY());
};

Screen.fn.changeBuffer = function(name) {
    if (!this.buffers[name]) {
        return;
    }

    this.currentWindow.buffer = this.buffers[name];
    this.redrawBuffer(this.currentWindow.buffer);
    this.resetCursor();
};

Screen.fn.addBuffer = function(buffer) {
    this.buffers[buffer.name] = buffer;
    this.changeBuffer(buffer.name);
};
