function Screen(ejax, rows, columns) {
    this.ejax = ejax;
    this.rows = rows;
    this.columns = columns;
    this.currentBuffer = new Buffer(this, { name: "*scratch*" });
    this.buffers = {};
    this.buffers[this.currentBuffer.name] = this.currentBuffer;
    this.clear();
    this.ejax.io.setCursor(this.currentBuffer.getCursorX(), this.currentBuffer.getCursorY());
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
    var x = 0;
    var y = 0;
    var i = buffer.startingIndex();

    while (true) {
        var c = buffer.charAt(i);

        if (c == null) {
            break;
        } else if (c == "\n") {
            y++;
            x = 0;
        } else {
            this.ejax.io.setPixel(c, x, y);
            x++;
        }

        if (x >= this.columns) {
            x = 0;
            y++;
            i = buffer.indexAfterNext("\n", i + 1);
        } else {
            i++;
        }

        if (y >= this.rows) {
            break;
        }
    }
};

Screen.fn.changeBuffer = function(name) {
    if (!this.buffers[name]) {
        return;
    }

    this.currentBuffer = this.buffers[name];
    this.redrawBuffer(this.currentBuffer);
};

Screen.fn.addBuffer = function(buffer) {
    this.buffers[buffer.name] = buffer;
    this.changeBuffer(buffer.name);
};
