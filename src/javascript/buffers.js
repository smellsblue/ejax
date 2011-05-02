function Buffer(screen) {
    this.screen = screen;
    this.content = "";
    this.startingLine = 0;
    this.cursor = 0;
    this.mode = fundamentalMode;
}

Buffer.fn = Buffer.prototype;

Buffer.fn.charAt = function(index) {
    if (index < 0 || index >= this.length()) {
        return null;
    }

    return this.content.charAt(index);
};

Buffer.fn.length = function() {
    return this.content.length;
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

    while (startIndex >= 0 && this.charAt(startIndex) != "\n") {
        startIndex--;
    }

    return endIndex - startIndex - 1;
};

Buffer.fn.getCursorY = function() {
    var count = 0;
    var index = this.cursor;

    if (this.charAt(index) == "\n") {
        index--;
    }

    for (; index >= 0; index--) {
        if (this.charAt(index) == "\n") {
            count++;
        }
    }

    return count;
};

Buffer.fn.setCursor = function(value) {
    if (value < 0) {
        this.screen.ejax.ringBell();
        return;
    }

    if (value > this.length()) {
        this.screen.ejax.ringBell();
        return;
    }

    this.cursor = value;
    this.screen.ejax.io.setCursor(this.getCursorX(), this.getCursorY());
};

Ejax.fn.setCursor = function(value) {
    this.screen.currentBuffer.setCursor(value);
};

Buffer.fn.moveForward = function() {
    this.setCursor(this.cursor + 1);
};

Ejax.fn.moveForward = function() {
    this.screen.currentBuffer.moveForward();
};

Buffer.fn.moveBackward = function() {
    this.setCursor(this.cursor - 1);
};

Ejax.fn.moveBackward = function() {
    this.screen.currentBuffer.moveBackward();
};

Buffer.fn.nextLine = function() {
    var x = this.getCursorX();
    var index = this.cursor;

    if (this.charAt(index) != "\n") {
        while (index < this.length()) {
            index++;

            if (this.charAt(index) == "\n") {
                break;
            }
        }
    }

    for (var i = 0; index < this.length() && i <= x; i++) {
        index++;

        if (this.charAt(index) == "\n") {
            break;
        }
    }

    this.setCursor(index);
};

Ejax.fn.nextLine = function() {
    this.screen.currentBuffer.nextLine();
};

Buffer.fn.previousLine = function() {
    var x = this.getCursorX();
    var index = this.cursor - 1;
    var newlineCount = 0;

    while (index >= 0) {
        if (this.charAt(index) == "\n") {
            newlineCount++;

            if (newlineCount == 2) {
                break;
            }
        }

        index--;
    }

    if (newlineCount == 0) {
        this.setCursor(0);
        return;
    }

    index++;

    for (var i = 0; index < this.length() && i < x; i++) {
        if (this.charAt(index) == "\n") {
            break;
        }

        index++;
    }

    this.setCursor(index);
};

Ejax.fn.previousLine = function() {
    this.screen.currentBuffer.previousLine();
};

Buffer.fn.insert = function(str) {
    var before = this.content.substring(0, this.cursor);
    var after = this.content.substring(this.cursor, this.length());
    this.setBufferContent(before + str + after);
    this.setCursor(this.cursor + str.length);
};

Ejax.fn.insert = function(str) {
    this.screen.currentBuffer.insert(str);
};

Buffer.fn.isVisible = function() {
    return this.screen.ejax.isBufferVisible(this);
};

Ejax.fn.isBufferVisible = function(buffer) {
    return this.screen.currentBuffer == buffer;
};

Buffer.fn.redraw = function() {
    if (this.isVisible()) {
        this.screen.clear();
        this.screen.redrawBuffer(this);
    }
};

Buffer.fn.setBufferContent = function(content) {
    this.content = content;
    this.redraw();
};

Ejax.fn.setBufferContent = function(content) {
    this.screen.currentBuffer.setBufferContent(content);
};
