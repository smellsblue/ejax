function BufferContent(buffer, content) {
    this.buffer = buffer;
    this.set(content);
}

BufferContent.fn = BufferContent.prototype;

BufferContent.fn.getX = function(index) {
    return this.lineFrom(index).lineIndex;
};

BufferContent.fn.getY = function(index) {
    return this.lineFrom(index).index;
};

BufferContent.fn.length = function() {
    return this.cache.length;
};

BufferContent.fn.lineFrom = function(index) {
    var length = this.length();
    var result = -1;
    var start = 0;

    if (index == length) {
        start = length - this.lines[this.lines.length - 1].length;
        return { index: this.lines.length - 1, start: start, lineIndex: index - start };
    }

    this.eachLine(function(line, i) {
        if (index < line.length + start) {
            result = i;
            return false;
        }

        start += line.length;
    });

    return { index: result, start: start, lineIndex: index - start };
};

BufferContent.fn.displayCharAt = function(x, y) {
    if (y < 0 || y >= this.lines.length) {
        return " ";
    }

    var line = this.lines[y];

    if (x < 0 || x >= line.length) {
        return " ";
    }

    var c = line.charAt(x);

    if (c == "\n") {
        return " ";
    }

    return c;
};

BufferContent.fn.charAt = function(index) {
    var line = this.lineFrom(index);
    return this.lines[line.index].charAt(line.lineIndex);
};

BufferContent.fn.redraw = function() {
    this.buffer.redraw();
};

BufferContent.fn.insert = function(str, index) {
    var line = this.lineFrom(index);
    var toInsert = str.inclusiveSplit("\n");

    if (toInsert[0].indexOf("\n") >= 0) {
        var lineContent = this.lines[line.index];
        var remaining = lineContent.substring(line.lineIndex, lineContent.length);
        this.lines[line.index] = lineContent.substring(0, line.lineIndex);
        this.lines.splice(line.index + 1, 0, remaining);
    }

    this.lines[line.index] = this.lines[line.index].insert(toInsert.shift(), line.lineIndex);

    if (toInsert.length > 1 && toInsert[toInsert.length - 1].lastIndexOf("\n") < 0 && this.lines.length > line.index) {
        this.lines[line.index + 1] = this.lines[line.index + 1].insert(toInsert.splice(toInsert.length - 1, 1)[0], 0);
    }

    toInsert.splice(0, 0, line.index + 1, 0);
    this.lines.splice.apply(toInsert);
    this.cache.length += str.length;
    this.redraw();
};

BufferContent.fn.deleteAt = function(index) {
    var line = this.lineFrom(index);
    this.lines[line.index] = this.lines[line.index].remove(line.lineIndex, 1);

    if (this.lines[line.index].lastIndexOf("\n") < 0 && this.lines.length > line.index + 1) {
        this.lines[line.index] = this.lines[line.index] + this.lines.splice(line.index + 1, 1)[0];
    }

    this.cache.length--;
    this.redraw();
};

BufferContent.fn.remove = function(index, length) {
    // Naive for now
    for (var i = 0; i < length; i++) {
        this.deleteAt(index);
    }
};

BufferContent.fn.eachLine = function(fn) {
    for (var i = 0; i < this.lines.length; i++) {
        if (fn(this.lines[i], i) === false) {
            break;
        }
    }
};

BufferContent.fn.set = function(content) {
    this.lines = content.inclusiveSplit("\n");
    var cache = { length: 0 };
    this.cache = cache;

    this.eachLine(function(line) {
        cache.length += line.length;
    });

    this.redraw();
};

BufferContent.fn.get = function() {
    return this.lines.join("");
};

function Buffer(screen, options) {
    this.screen = screen;
    this.name = options.name;
    this.file = options.file;
    this.minibuffer = options.minibuffer;
    this.content = new BufferContent(this, "");
    this.startingLine = 0;
    this.cursor = 0;
    this.mode = options.mode || fundamentalMode;
}

Buffer.fn = Buffer.prototype;

Buffer.fn.getStatus = function() {
    return " " + this.name + "    (" + this.mode.description + ")";
};

Buffer.fn.displayCharAt = function(x, y) {
    return this.content.displayCharAt(x, y);
};

Buffer.fn.charAt = function(index) {
    if (index < 0 || index >= this.length()) {
        return null;
    }

    return this.content.charAt(index);
};

Buffer.fn.length = function() {
    return this.content.length();
};

Buffer.fn.getCursorX = function() {
    return this.content.getX(this.cursor);
};

Buffer.fn.getCursorY = function() {
    return this.content.getY(this.cursor);
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
    this.screen.resetCursor();
};

Ejax.fn.setCursor = function(value) {
    this.screen.currentWindow.buffer.setCursor(value);
};

Buffer.fn.moveForward = function() {
    this.setCursor(this.cursor + 1);
};

Ejax.fn.moveForward = function() {
    this.screen.currentWindow.buffer.moveForward();
};

Buffer.fn.moveBackward = function() {
    this.setCursor(this.cursor - 1);
};

Ejax.fn.moveBackward = function() {
    this.screen.currentWindow.buffer.moveBackward();
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
    this.screen.currentWindow.buffer.nextLine();
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
    this.screen.currentWindow.buffer.previousLine();
};

Buffer.fn.insert = function(str) {
    this.content.insert(str, this.cursor);
    this.setCursor(this.cursor + str.length);
};

Ejax.fn.insert = function(str) {
    this.screen.currentWindow.buffer.insert(str);
};

Buffer.fn.deleteForward = function() {
    if (this.cursor >= this.content.length()) {
        this.screen.ejax.ringBell();
        return;
    }

    this.content.remove(this.cursor, 1);
};

Ejax.fn.deleteForward = function() {
    this.screen.currentWindow.buffer.deleteForward();
};

Buffer.fn.deleteBackward = function() {
    if (this.cursor <= 0) {
        this.screen.ejax.ringBell();
        return;
    }

    this.content.remove(this.cursor - 1, 1);
    this.moveBackward();
};

Ejax.fn.deleteBackward = function() {
    this.screen.currentWindow.buffer.deleteBackward();
};

Buffer.fn.lineStart = function() {
    var index = this.cursor;

    while (index > 0 && this.charAt(index - 1) != "\n") {
        index--;
    }

    this.setCursor(index);
};

Ejax.fn.lineStart = function() {
    this.screen.currentWindow.buffer.lineStart();
};

Buffer.fn.lineEnd = function() {
    var index = this.cursor;

    while (index < this.content.length() && this.charAt(index) != "\n") {
        index++;
    }

    this.setCursor(index);
};

Ejax.fn.lineEnd = function() {
    this.screen.currentWindow.buffer.lineEnd();
};

Ejax.fn.isBufferVisible = function(buffer) {
    return this.screen.currentWindow.buffer == buffer;
};

Buffer.fn.redraw = function() {
    this.screen.redrawBuffer(this);
};

Buffer.fn.setBufferContent = function(content) {
    this.content.set(content);
};

Ejax.fn.setBufferContent = function(content) {
    this.screen.currentWindow.buffer.setBufferContent(content);
};

Ejax.fn.getBufferContent = function() {
    return this.screen.currentWindow.buffer.content.get();
};

Ejax.fn.findFile = function(filename) {
    var file = this.io.file(filename);
    var buffer = new Buffer(this.screen, { name: file.name(), file: file });
    buffer.setBufferContent(file.contents());
    this.screen.addBuffer(buffer);
};

Buffer.fn.saveBuffer = function() {
    if (!this.file) {
        throw new Error("Saving a non-file buffer is not yet supported!");
    }

    this.file.save(this.content.get());
};

Ejax.fn.saveBuffer = function() {
    this.screen.currentWindow.buffer.saveBuffer();
};

Ejax.fn.getWorkingDirectory = function() {
    // TODO
    return "";
};

Ejax.fn.readParameter = function(prompt, content, callback) {
    if (this.screen.currentWindow == this.screen.minibufferWindow) {
        throw new Error("Cannot read a parameter from the minibuffer!");
    }

    this.screen.minibuffer.setMinibufferStatus(new MinibufferStatus({
        lastWindow: this.screen.currentWindow,
        prompt: prompt,
        content: content,
        callback: callback
    }));

    this.screen.currentWindow = this.screen.minibufferWindow;
    this.setCursor(this.screen.currentWindow.buffer.length());
};

Buffer.fn.setMinibufferStatus = function(status) {
    if (!this.minibuffer) {
        throw new Error("Cannot set minibuffer status of a non minibuffer!");
    }

    status.minibuffer = this;
    this.status = status;
    status.update();
};

function MinibufferStatus(options) {
    this.lastWindow = options.lastWindow;
    this.prompt = options.prompt || "";
    this.content = options.content || "";
    this.callback = options.callback || function(result) {};
}

MinibufferStatus.fn = MinibufferStatus.prototype;

MinibufferStatus.fn.update = function() {
    this.minibuffer.setBufferContent(this.prompt + this.content);
};

MinibufferStatus.fn.insert = function(str) {
    if (ejax.screen.minibuffer.cursor < this.prompt.length) {
        ejax.ringBell();
        return;
    }

    this.content = this.content.insert(str, ejax.screen.minibuffer.cursor - this.prompt.length);
    this.update();
    ejax.screen.minibuffer.setCursor(ejax.screen.minibuffer.cursor + str.length);
};

MinibufferStatus.fn.deleteForward = function() {
    if (ejax.screen.minibuffer.cursor < this.prompt.length || ejax.screen.minibuffer.cursor >= ejax.screen.minibuffer.content.length()) {
        ejax.ringBell();
        return;
    }

    this.content = this.content.remove(ejax.screen.minibuffer.cursor - this.prompt.length, 1);
    this.update();
};

MinibufferStatus.fn.deleteBackward = function() {
    if (ejax.screen.minibuffer.cursor <= this.prompt.length) {
        ejax.ringBell();
        return;
    }

    this.content = this.content.remove(ejax.screen.minibuffer.cursor - this.prompt.length - 1, 1);
    this.update();
    ejax.screen.minibuffer.moveBackward();
};
