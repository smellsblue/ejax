function EjaxWindow(screen, buffer, x, y, rows, columns) {
    this.screen = screen;
    this.buffer = buffer;
    this.x = x;
    this.y = y;
    this.rows = rows;
    this.columns = columns;
    // TODO: cursor should be part of the window, not the buffer
};

EjaxWindow.fn = EjaxWindow.prototype;

EjaxWindow.fn.getCursorX = function() {
    return this.buffer.getCursorX() + this.x;
};

EjaxWindow.fn.getCursorY = function() {
    return this.buffer.getCursorY() + this.y;
};

EjaxWindow.fn.updatePage = function() {
    if (!this.buffer.minibuffer && this.buffer.getCursorY() >= this.rows - 1) {
        while (this.buffer.getCursorY() >= this.rows - 1) {
            this.buffer.updateStartingLine((this.rows - 1) * 3 / 4);
            this.redraw();
        }
    } else if (!this.buffer.minibuffer && this.buffer.getCursorY() < 0) {
        while (this.buffer.getCursorY() < 0) {
            this.buffer.updateStartingLine(-(this.rows - 1) * 3 / 4);
            this.redraw();
        }
    }

    if (this.buffer.getCursorX() >= this.columns - 1) {
        while (this.buffer.getCursorX() >= this.columns - 1) {
            this.buffer.updateStartingColumn(this.columns * 3 / 4);
            this.redraw();
        }
    } else if (this.buffer.startingColumn == 0 && this.buffer.getCursorX() < 0 || this.buffer.startingColumn != 0 && this.buffer.getCursorX() < 1) {
        while (this.buffer.startingColumn == 0 && this.buffer.getCursorX() < 0 || this.buffer.startingColumn != 0 && this.buffer.getCursorX() < 1) {
            this.buffer.updateStartingColumn(-this.columns * 3 / 4);
            this.redraw();
        }
    }
};

EjaxWindow.fn.clear = function() {
    for (var x = 0; x < this.columns; x++) {
        for (var y = 0; y < this.rows; y++) {
            this.screen.ejax.io.setPixel(" ", this.x + x, this.y + y);
        }
    }
};

EjaxWindow.fn.redraw = function() {
    this.redrawContent();
    this.redrawStatus();
};

EjaxWindow.fn.redrawContent = function() {
    var rows = this.rows - 1;
    var startingColumn = this.buffer.startingColumn;

    if (this.buffer.minibuffer) {
        rows++;
    }

    for (var y = 0; y < rows; y++) {
        var line = this.buffer.getLine(y);
        var x = 0, c;

        if (startingColumn == 0) {
            if (line === undefined || x >= line.length) {
                c = " ";
            } else {
                c = line.charAt(x);
            }

            if (c == "\n") {
                c = " ";
            }
        } else if (line === undefined || line.length == 0 && this.buffer.isLastLine(y)) {
            c = " ";
        } else {
            c = "$";
        }

        this.screen.ejax.io.setPixel(c, this.x + x, this.y + y);

        for (x++; x < this.columns - 1; x++) {
            if (line === undefined || x + startingColumn >= line.length) {
                c = " ";
            } else {
                c = line.charAt(x + startingColumn);
            }

            if (c == "\n") {
                c = " ";
            }

            this.screen.ejax.io.setPixel(c, this.x + x, this.y + y);
        }

        if (line && x + startingColumn < line.length && line.charAt(x + startingColumn) != "\n") {
            c = "$";
        } else {
            c = " ";
        }

        this.screen.ejax.io.setPixel(c, this.x + x, this.y + y);
    }
};

EjaxWindow.fn.redrawStatus = function() {
    if (this.buffer.minibuffer) {
        return;
    }

    var status = this.buffer.getStatus();
    var initialY = this.rows - 1;

    for (var i = 0; i < this.columns && i < status.length; i++) {
        this.screen.ejax.io.setPixel(status.charAt(i), this.x + i, initialY, { invert: true });
    }

    for (var i = status.length; i < this.columns; i++) {
        this.screen.ejax.io.setPixel("-", this.x + i, initialY, { invert: true });
    }
};
