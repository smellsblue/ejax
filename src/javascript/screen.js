function Screen(ejax, rows, columns) {
    this.ejax = ejax;
    this.rows = rows;
    this.columns = columns;
    this.currentBuffer = new Buffer(this, { name: "*scratch*" });
    this.buffers = {};
    this.buffers[this.currentBuffer.name] = this.currentBuffer;
    this.clear();
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

Screen.fn.redrawBuffer = function(buffer) {
    this.redrawBufferContent(buffer, this.rows, this.columns);
};

Screen.fn.redrawBufferContent = function(buffer, rows, columns) {
    var i = buffer.startingIndex();

    for (var y = 0; y < rows; y++) {
        var finishedLine = false;

        for (var x = 0; x < columns; x++) {
            if (finishedLine) {
                this.ejax.io.setPixel(" ", x, y);
                continue;
            }

            var c = buffer.charAt(i);

            if (c == null || c == "\n") {
                finishedLine = true;
                this.ejax.io.setPixel(" ", x, y);
                continue;
            }

            this.ejax.io.setPixel(c, x, y);
            i++;
        }

        i = buffer.indexAfterNext("\n", i);
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
    this.clear();
    this.redrawBuffer(this.currentBuffer);
    this.resetCursor();
};

Screen.fn.addBuffer = function(buffer) {
    this.buffers[buffer.name] = buffer;
    this.changeBuffer(buffer.name);
};
