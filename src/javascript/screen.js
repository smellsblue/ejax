function Screen(ejax, rows, columns) {
    this.ejax = ejax;
    this.rows = rows;
    this.columns = columns;
    this.currentBuffer = new Buffer(this, { name: "*scratch*" });
    this.buffers = {};
    this.buffers[this.currentBuffer.name] = this.currentBuffer;
    this.clear();
    this.redraw();
    this.resetCursor();
}

Screen.fn = Screen.prototype;

Screen.fn.clear = function() {
    for (var x = 0; x < this.columns; x++) {
        for (var y = 0; y < this.rows; y++) {
            this.ejax.io.setPixel(" ", x, y);
        }
    }
};

Screen.fn.redraw = function() {
    this.redrawBuffer(this.currentBuffer);
};

Screen.fn.redrawBuffer = function(buffer) {
    this.redrawBufferContent(buffer, 0, 0, this.rows - 1, this.columns);
    this.redrawBufferStatus(buffer, 0, this.rows - 1, this.columns);
};

Screen.fn.redrawBufferContent = function(buffer, initialX, initialY, rows, columns) {
    var i = buffer.startingIndex();

    for (var y = 0; y < rows; y++) {
        var finishedLine = false;

        for (var x = 0; x < columns; x++) {
            if (finishedLine) {
                this.ejax.io.setPixel(" ", initialX + x, initialY + y);
                continue;
            }

            var c = buffer.charAt(i);

            if (c == null || c == "\n") {
                finishedLine = true;
                this.ejax.io.setPixel(" ", initialX + x, initialY + y);
                continue;
            }

            this.ejax.io.setPixel(c, initialX + x, initialY + y);
            i++;
        }

        i = buffer.indexAfterNext("\n", i);
    }
};

Screen.fn.redrawBufferStatus = function(buffer, initialX, initialY, columns) {
    var status = buffer.getStatus();

    for (var i = 0; i < columns && i < status.length; i++) {
        this.ejax.io.setPixel(status.charAt(i), initialX + i, initialY, { invert: true });
    }

    for (var i = status.length; i < columns; i++) {
        this.ejax.io.setPixel(" ", initialX + i, initialY, { invert: true });
    }
};

Screen.fn.resetCursor = function() {
    this.ejax.io.setCursor(this.currentBuffer.getCursorX(), this.currentBuffer.getCursorY());
};

Screen.fn.changeBuffer = function(name) {
    if (!this.buffers[name]) {
        return;
    }

    this.currentBuffer = this.buffers[name];
    this.redrawBuffer(this.currentBuffer);
    this.resetCursor();
};

Screen.fn.addBuffer = function(buffer) {
    this.buffers[buffer.name] = buffer;
    this.changeBuffer(buffer.name);
};
