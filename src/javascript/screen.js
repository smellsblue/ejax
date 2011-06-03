function Screen(ejax, rows, columns) {
    this.toRedraw = [];
    this.ejax = ejax;
    this.rows = rows;
    this.columns = columns;
    this.windows = [];
    var scratch = new Buffer(this, { name: "*scratch*" });
    this.currentWindow = new EjaxWindow(this, scratch, 0, 0, rows - 1, columns);
    this.buffers = {};
    this.recentBuffers = [];
    this.addBuffer(scratch);
    this.windows.push(this.currentWindow);
    this.minibuffer = new Buffer(this, { name: "minibuffer", minibuffer: true, mode: minibufferMode });
    this.minibufferWindow = new EjaxWindow(this, this.minibuffer, 0, rows - 1, 1, columns);
    this.windows.push(this.minibufferWindow);
    this.clear();
    this.hardRedraw();
    this.resetCursor();
}

Screen.fn = Screen.prototype;

Screen.fn.addBuffer = function(buffer) {
    if (buffer.minibuffer) {
        throw new Error("Cannot add minibuffer");
    }

    var originalName = buffer.name;
    var next = 2;

    while (this.buffers[buffer.name]) {
        buffer.name = originalName + "<" + next + ">";
        next++;
    }

    if (this.buffers[buffer.name]) {
        throw new Error("Buffer '" + buffer.name + "' already exits");
    }

    this.buffers[buffer.name] = buffer;
    this.recentBuffers.push(buffer);
};

Screen.fn.getBufferNames = function() {
    var result = [];

    for (var i = 0; i < this.recentBuffers.length; i++) {
        result.push(this.recentBuffers[i].name);
    }

    return result;
};

Screen.fn.eachWindow = function(fn) {
    for (var i = 0; i < this.windows.length; i++) {
        if (fn(this.windows[i]) === false) {
            break;
        }
    }
};

Screen.fn.clear = function() {
    this.eachWindow(function(window) {
        window.clear();
    });
};

Screen.fn.hardRedraw = function(buffer) {
    this.eachWindow(function(window) {
        if (!buffer || buffer == window.buffer) {
            window.redraw();
        }
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

Screen.fn.getBuffer = function(name) {
    return this.buffers[name];
};

Screen.fn.getOrCreateBuffer = function(name, factory) {
    if (this.buffers[name]) {
        return this.buffers[name];
    }

    var buffer;

    if (factory) {
        buffer = factory();
    } else {
        buffer = new Buffer(this, { name: name });
    }

    this.addBuffer(buffer);
    return this.buffers[name];
};

Screen.fn.setAvailableWindowBuffer = function(buffer) {
    var window = this.windows[0];

    if (window.buffer.minibuffer) {
        window = this.windows[1];
    }

    this.setWindowBuffer(window, buffer);
};

Screen.fn.setWindowBuffer = function(window, buffer) {
    if (window.buffer == buffer) {
        return;
    }

    if (window.buffer) {
        var index = this.recentBuffers.indexOf(window.buffer);

        // The buffer won't exist if we are killing the buffer
        if (index >= 0) {
            this.recentBuffers.splice(index, 1);
            this.recentBuffers.splice(0, 0, window.buffer);
        }
    }

    window.buffer = buffer;
    window.postRedraw();
};

Screen.fn.killBuffer = function(buffer) {
    if (!buffer) {
        return;
    }

    if (buffer.minibuffer) {
        throw new Error("Cannot kill the minibuffer!");
    }

    this.buffers[buffer.name] = null;
    var index = this.recentBuffers.indexOf(buffer);

    if (index >= 0) {
        this.recentBuffers.splice(index, 1);
    }

    if (this.recentBuffers.length == 0) {
        this.addBuffer(new Buffer(this, { name: "*scratch*" }));
    }

    var self = this;

    this.eachWindow(function(window) {
        if (window.buffer == buffer) {
            self.setWindowBuffer(window, self.nextAvailableBuffer());
        }
    });

    if (buffer.shell) {
        buffer.shell.terminate();
    }

    this.resetCursor();
};

Screen.fn.changeBuffer = function(buffer) {
    if (this.currentWindow.buffer.minibuffer) {
        throw new Error("Cannot change the minibuffer!");
    }

    if (!buffer) {
        return;
    }

    this.setWindowBuffer(this.currentWindow, buffer);
    this.resetCursor();
};

Screen.fn.addAndChangeBuffer = function(buffer) {
    this.addBuffer(buffer);
    this.changeBuffer(buffer);
};

Screen.fn.nextAvailableBuffer = function() {
    var buffer;

    for (var i = 0; i < this.recentBuffers.length; i++) {
        var found = false;
        buffer = this.recentBuffers[i];

        this.eachWindow(function(window) {
            if (buffer == window.buffer) {
                found = true;
                return false;
            }
        });

        if (!found) {
            return buffer;
        }
    }

    return buffer;
};
