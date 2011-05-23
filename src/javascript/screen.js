function Screen(ejax, rows, columns) {
    this.toRedraw = [];
    this.ejax = ejax;
    this.rows = rows;
    this.columns = columns;
    this.windows = [];
    var scratch = new Buffer(this, { name: "*scratch*" });
    this.currentWindow = new EjaxWindow(this, scratch, 0, 0, rows - 1, columns);
    this.buffers = {};
    this.buffers[scratch.name] = scratch;
    this.windows.push(this.currentWindow);
    this.minibuffer = new Buffer(this, { name: "minibuffer", minibuffer: true, mode: minibufferMode });
    this.minibufferWindow = new EjaxWindow(this, this.minibuffer, 0, rows - 1, 1, columns);
    this.windows.push(this.minibufferWindow);
    this.clear();
    this.hardRedraw();
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

Screen.fn.hardRedraw = function() {
    this.eachWindow(function(window) {
        window.redraw();
    });
};

Screen.fn.postRedraw = function(window) {
    if (!this.toRedraw.contains(window)) {
        this.toRedraw.push(window);
    }
};

Screen.fn.redraw = function() {
    while (this.toRedraw.length > 0) {
        this.toRedraw.shift().redraw();
    }
};

Screen.fn.postRedrawBuffer = function(buffer) {
    var self = this;

    this.eachWindow(function(window) {
        if (window.buffer == buffer) {
            self.postRedraw(window);
        }
    });
};

Screen.fn.resetCursor = function() {
    this.currentWindow.updatePage();
    this.ejax.io.setCursor(this.currentWindow.getCursorX(), this.currentWindow.getCursorY());
    this.currentWindow.redrawStatus();
};

Screen.fn.changeBuffer = function(name) {
    if (!this.buffers[name]) {
        return;
    }

    this.currentWindow.buffer = this.buffers[name];
    this.postRedrawBuffer(this.currentWindow.buffer);
    this.resetCursor();
};

Screen.fn.addBuffer = function(buffer) {
    this.buffers[buffer.name] = buffer;
    this.changeBuffer(buffer.name);
};
