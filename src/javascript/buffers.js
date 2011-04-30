function Buffer(ejax) {
    this.ejax = ejax;
    this.content = "";
    this.startingLine = 0;
    this.cursor = 0;
    this.mode = fundamentalMode;
}

Buffer.fn = Buffer.prototype;

Buffer.fn.charAt = function(index) {
    if (index < 0 || index >= this.content.length) {
        return null;
    }

    return this.content.charAt(index);
};

Buffer.fn.indexAfterNext = function(c, index) {
    while (true) {
        var nextC = this.charAt(index);

        if (nextC == null) {
            return index;
        } else if (nextC == c) {
            return index + 1;
        }

        index++;
    }

    return null;
};

Buffer.fn.startingIndex = function() {
    // TODO: implement;
    return 0;
};

Buffer.fn.getCursorX = function() {
    var count = 0;
    var index = this.cursor;

    if (this.content.charAt(index) == "\n") {
        count++;
        index--;
    }

    for (; index > 0; index--) {
        if (this.content.charAt(index) == "\n") {
            count--;
            break;
        }

        count++;
    }

    return count;
};

Buffer.fn.getCursorY = function() {
    var count = 0;
    var index = this.cursor;

    if (this.content.charAt(index) == "\n") {
        index--;
    }

    for (; index >= 0; index--) {
        if (this.content.charAt(index) == "\n") {
            count++;
        }
    }

    return count;
};

Buffer.fn.moveForward = function() {
    if (this.cursor >= this.content.length) {
        // TODO: Ring the bell
        return;
    }

    this.cursor++;
    this.ejax.io.setCursor(this.getCursorX(), this.getCursorY());
};

Ejax.fn.moveForward = function() {
    this.currentBuffer.moveForward();
};

Buffer.fn.moveBackward = function() {
    if (this.cursor <= 0) {
        // TODO: Ring the bell
        return;
    }

    this.cursor--;
    this.ejax.io.setCursor(this.getCursorX(), this.getCursorY());
};

Ejax.fn.moveBackward = function() {
    this.currentBuffer.moveBackward();
};

Buffer.fn.insert = function(str) {
    // TODO: implement;
};

Ejax.fn.insert = function(str) {
    this.currentBuffer.insert(str);
};

Buffer.fn.isVisible = function() {
    return this.ejax.isBufferVisible(this);
};

Ejax.fn.isBufferVisible = function(buffer) {
    return this.currentBuffer == buffer;
};

Buffer.fn.redraw = function() {
    if (this.isVisible()) {
        this.ejax.io.clear();
        this.ejax.io.redrawBuffer(this);
    }
};

Buffer.fn.setBufferContent = function(content) {
    this.content = content;
    this.redraw();
};

Ejax.fn.setBufferContent = function(content) {
    this.currentBuffer.setBufferContent(content);
};
