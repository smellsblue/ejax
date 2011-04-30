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
    if (this.cursor == 0) {
        return 0;
    }

    var endIndex = this.cursor;
    var startIndex = endIndex - 1;

    while (startIndex >= 0 && this.content.charAt(startIndex) != "\n") {
        startIndex--;
    }

    return endIndex - startIndex - 1;
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

Buffer.fn.setCursor = function(value) {
    if (value < 0) {
        this.ejax.ringBell();
        return;
    }

    if (value > this.content.length) {
        this.ejax.ringBell();
        return;
    }

    this.cursor = value;
    this.ejax.io.setCursor(this.getCursorX(), this.getCursorY());
};

Ejax.fn.setCursor = function(value) {
    this.currentBuffer.setCursor(value);
};

Buffer.fn.moveForward = function() {
    this.setCursor(this.cursor + 1);
};

Ejax.fn.moveForward = function() {
    this.currentBuffer.moveForward();
};

Buffer.fn.moveBackward = function() {
    this.setCursor(this.cursor - 1);
};

Ejax.fn.moveBackward = function() {
    this.currentBuffer.moveBackward();
};

Buffer.fn.nextLine = function() {
    // TODO
};

Ejax.fn.nextLine = function() {
    this.currentBuffer.nextLine();
};

Buffer.fn.previousLine = function() {
    // TODO
};

Ejax.fn.previousLine = function() {
    this.currentBuffer.previousLine();
};

Buffer.fn.insert = function(str) {
    var before = this.content.substring(0, this.cursor);
    var after = this.content.substring(this.cursor, this.content.length);
    this.setBufferContent(before + str + after);
    this.setCursor(this.cursor + str.length);
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
