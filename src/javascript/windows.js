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
            this.postRedraw();
        }
    } else if (!this.buffer.minibuffer && this.buffer.getCursorY() < 0) {
        while (this.buffer.getCursorY() < 0) {
            this.buffer.updateStartingLine(-(this.rows - 1) * 3 / 4);
            this.postRedraw();
        }
    }

    if (this.buffer.getCursorX() >= this.columns - 1) {
        while (this.buffer.getCursorX() >= this.columns - 1) {
            this.buffer.updateStartingColumn(this.columns * 3 / 4);
            this.postRedraw();
        }
    } else if (this.buffer.startingColumn == 0 && this.buffer.getCursorX() < 0 || this.buffer.startingColumn != 0 && this.buffer.getCursorX() < 1) {
        while (this.buffer.startingColumn == 0 && this.buffer.getCursorX() < 0 || this.buffer.startingColumn != 0 && this.buffer.getCursorX() < 1) {
            this.buffer.updateStartingColumn(-this.columns * 3 / 4);
            this.postRedraw();
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

EjaxWindow.fn.postRedraw = function() {
    this.screen.postRedraw(this);
};

EjaxWindow.fn.redraw = function() {
    this.redrawContent();
    this.redrawStatus();
};

EjaxWindow.fn.redrawContent = function() {
    var rows = this.rows - 1;
    var columns = this.columns;
    var startingColumn = this.buffer.startingColumn;
    var selfX = this.x;
    var selfY = this.y;
    var io = this.screen.ejax.io;
    var buffer = this.buffer;
    var whitespace = "";

    for (var i = 0; i < columns; i++) {
        whitespace += " ";
    }

    if (buffer.minibuffer) {
        rows++;
    }

    for (var y = 0; y < rows; y++) {
        var line = buffer.getLine(y);
        var x = 0, c;
        var lineUndefined = line === undefined;
        var lineLength = 0;
        var adjustedY = selfY + y;

        if (!lineUndefined) {
            lineLength = line.length;
        }

        if (startingColumn == 0) {
            if (lineUndefined || x >= lineLength) {
                c = " ";
            } else {
                c = line.charAt(x);
            }

            if (c == "\n") {
                c = " ";
            }
        } else if (lineUndefined || lineLength == 0 && buffer.isLastLine(y)) {
            c = " ";
        } else {
            c = "$";
        }

        io.setPixel(c, selfX + x, adjustedY);
        x++;

        if (!lineUndefined) {
            var toPrint = line.substring(startingColumn + x, startingColumn + x + columns - 2);

            if (toPrint.charAt(toPrint.length - 1) == "\n") {
                toPrint = toPrint.substring(0, toPrint.length - 1);
            }

            io.setPixels(toPrint, selfX + x, adjustedY);
            x += toPrint.length;
        }

        if (x < columns - 1) {
            var toPrint = whitespace.substring(0, columns - 1 - x);
            io.setPixels(toPrint, selfX + x, adjustedY);
            x += toPrint.length;
        }

        if (!lineUndefined && x + startingColumn < lineLength && line.charAt(x + startingColumn) != "\n") {
            c = "$";
        } else {
            c = " ";
        }

        io.setPixel(c, selfX + x, adjustedY);
    }
};

EjaxWindow.fn.redrawStatus = function() {
    if (this.buffer.minibuffer) {
        return;
    }

    var status = this.buffer.getStatus();

    for (var i = status.length; i < this.columns; i++) {
        status += "-";
    }

    this.screen.ejax.io.setPixels(status, this.x, this.rows - 1, { invert: true });
};

EjaxWindow.fn.pageDown = function() {
    this.buffer.pageDown(this.rows - 1);
};

EjaxWindow.fn.pageUp = function() {
    this.buffer.pageUp(this.rows - 1);
};
