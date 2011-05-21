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

BufferContent.fn.lastLine = function() {
    return this.lines.length - 1;
};

BufferContent.fn.length = function() {
    return this.cache.length;
};

BufferContent.fn.lineFrom = function(index) {
    var length = this.length();
    var result = -1;
    var lineLength = -1;
    var start = 0;

    if (index == length) {
        lineLength = this.lines[this.lastLine()].length;
        start = length - lineLength;
        return { index: this.lastLine(), start: start, lineIndex: index - start, length: lineLength };
    }

    this.eachLine(function(line, i) {
        if (index < line.length + start) {
            result = i;
            lineLength = line.length;
            return false;
        }

        start += line.length;
    });

    return { index: result, start: start, lineIndex: index - start, length: lineLength };
};

BufferContent.fn.isLastLine = function(y) {
    return y == this.lastLine();
};

BufferContent.fn.hasCharAt = function(x, y) {
    if (y < 0 || y >= this.lines.length) {
        return false;
    }

    var line = this.lines[y];

    if (x < 0 || x >= line.length) {
        return false;
    }

    return line.charAt(x) != "\n";
};

BufferContent.fn.getLine = function(y) {
    return this.lines[y];
};

BufferContent.fn.charAt = function(index) {
    var line = this.lineFrom(index);
    return this.lines[line.index].charAt(line.lineIndex);
};

BufferContent.fn.postRedraw = function() {
    this.buffer.postRedraw();
};

BufferContent.fn.insert = function(str, x, y) {
    var toInsert = str.inclusiveSplit("\n");

    if (toInsert[0].indexOf("\n") >= 0) {
        var lineContent = this.lines[y];
        var remaining = lineContent.substring(x, lineContent.length);
        this.lines[y] = lineContent.substring(0, x);
        this.lines.splice(y + 1, 0, remaining);
    }

    this.lines[y] = this.lines[y].insert(toInsert.shift(), x);

    if (toInsert.length > 1 && toInsert[toInsert.length - 1].lastIndexOf("\n") < 0 && this.lines.length > y) {
        this.lines[y + 1] = this.lines[y + 1].insert(toInsert.splice(toInsert.length - 1, 1)[0], 0);
    }

    toInsert.splice(0, 0, y + 1, 0);
    this.lines.splice.apply(toInsert);
    this.cache.length += str.length;
    this.postRedraw();
};

BufferContent.fn.deleteAt = function(x, y) {
    this.lines[y] = this.lines[y].remove(x, 1);

    if (this.lines[y].lastIndexOf("\n") < 0 && this.lines.length > y + 1) {
        this.lines[y] = this.lines[y] + this.lines.splice(y + 1, 1)[0];
    }

    this.cache.length--;
    this.postRedraw();
};

BufferContent.fn.remove = function(x, y, length) {
    // Naive for now
    for (var i = 0; i < length; i++) {
        this.deleteAt(x, y);
    }
};

BufferContent.fn.eachLine = function(arg1, arg2) {
    var fn = arg1;
    var start = 0;

    if (!fn.isFunction()) {
        fn = arg2;
        start = arg1;
    }

    for (var i = start; i < this.lines.length; i++) {
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

    this.postRedraw();
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
    this.startingColumn = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.mode = options.mode || fundamentalMode;
}

Buffer.fn = Buffer.prototype;

Buffer.fn.getStatus = function() {
    return " " + this.name + "    (" + this.mode.description + ")";
};

Buffer.fn.isLastLine = function(y) {
    return this.content.isLastLine(y + this.startingLine);
};

Buffer.fn.hasCharAt = function(x, y) {
    return this.content.hasCharAt(x + this.startingColumn, y + this.startingLine);
};

Buffer.fn.getLine = function(y) {
    return this.content.getLine(y + this.startingLine);
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

Buffer.fn.updateStartingLine = function(adjustment) {
    this.startingLine += Math.floor(adjustment);

    if (this.startingLine < 0) {
        this.startingLine = 0;
    }

    if (this.startingLine >= this.content.lastLine()) {
        this.startingLine = this.content.lastLine();
    }
};

Buffer.fn.updateStartingColumn = function(adjustment) {
    this.startingColumn += Math.floor(adjustment);

    if (this.startingColumn < 0) {
        this.startingColumn = 0;
    }

    // TODO: Should we have an upper bounds check like in
    // updateStartingLine?
};

Buffer.fn.getCursorX = function() {
    return this.cursorX - this.startingColumn;
};

Buffer.fn.getCursorY = function() {
    return this.cursorY - this.startingLine;
};

Buffer.fn.setCursor = function(x, y) {
    var lastLine = this.content.lastLine();

    if (y > lastLine) {
        y = lastLine;
    }

    if (y < 0) {
        y = 0;
    }

    var lineLength = this.content.getLine(y).length;

    if (x >= lineLength && y != lastLine) {
        x = lineLength - 1;
    } else if (x > lineLength && y == lastLine) {
        x = lineLength;
    }

    if (x < 0) {
        x = 0;
    }

    this.cursorX = x;
    this.cursorY = y;
    this.screen.resetCursor();
};

Ejax.fn.setCursor = function(x, y) {
    this.screen.currentWindow.buffer.setCursor(x, y);
};

Buffer.fn.moveForward = function() {
    var lineLength = this.content.getLine(this.cursorY).length;
    var x = this.cursorX;
    var y = this.cursorY;

    if (x + 1 >= lineLength) {
        if (y == this.content.lastLine()) {
            this.screen.ejax.ringBell();
            return;
        }

        x = 0;
        y++;
    } else {
        x++;
    }

    this.setCursor(x, y);
};

Ejax.fn.moveForward = function() {
    this.screen.currentWindow.buffer.moveForward();
};

Buffer.fn.moveBackward = function() {
    var x = this.cursorX;
    var y = this.cursorY;

    if (x - 1 < 0) {
        if (y == 0) {
            this.screen.ejax.ringBell();
            return;
        }

        y--;
        x = this.content.getLine(y).length - 1;
    } else {
        x--;
    }

    this.setCursor(x, y);
};

Ejax.fn.moveBackward = function() {
    this.screen.currentWindow.buffer.moveBackward();
};

Buffer.fn.nextLine = function() {
    var x = this.cursorX;
    var y = this.cursorY;

    if (y == this.content.lastLine()) {
        var lineLength = this.content.getLine(y).length;

        if (x >= lineLength) {
            this.screen.ejax.ringBell();
            return;
        }

        x = lineLength;
    } else {
        y++;
        var lineLength = this.content.getLine(y).length;

        if (x >= lineLength) {
            x = lineLength - 1;
        }
    }

    this.setCursor(x, y);
};

Ejax.fn.nextLine = function() {
    this.screen.currentWindow.buffer.nextLine();
};

Buffer.fn.previousLine = function() {
    var x = this.cursorX;
    var y = this.cursorY;

    if (y == 0) {
        if (x == 0) {
            this.screen.ejax.ringBell();
            return;
        }

        x = 0;
    } else {
        y--;
        var lineLength = this.content.getLine(y).length;

        if (x >= lineLength) {
            x = lineLength - 1;
        }
    }

    this.setCursor(x, y);
};

Ejax.fn.previousLine = function() {
    this.screen.currentWindow.buffer.previousLine();
};

Buffer.fn.insert = function(str) {
    var x = this.cursorX;
    var y = this.cursorY;

    y += str.count("\n");
    var lastNewline = str.lastIndexOf("\n");

    if (lastNewline >= 0) {
        x = str.length - lastNewline - 1;
    } else {
        x += str.length;
    }

    this.content.insert(str, this.cursorX, this.cursorY);
    this.setCursor(x, y);
};

Ejax.fn.insert = function(str) {
    this.screen.currentWindow.buffer.insert(str);
};

Buffer.fn.deleteForward = function() {
    if (this.cursorY == this.content.lastLine() && this.cursorX >= this.content.getLine(this.cursorY).length) {
        this.screen.ejax.ringBell();
        return;
    }

    this.content.remove(this.cursorX, this.cursorY, 1);
};

Ejax.fn.deleteForward = function() {
    this.screen.currentWindow.buffer.deleteForward();
};

Buffer.fn.deleteBackward = function() {
    var x = this.cursorX;
    var y = this.cursorY;

    if (x <= 0 && y <= 0) {
        this.screen.ejax.ringBell();
        return;
    }

    if (x == 0) {
        y--;
        x = this.content.getLine(y).length - 1;
    } else {
        x--;
    }

    this.moveBackward();
    this.content.remove(x, y, 1);
};

Ejax.fn.deleteBackward = function() {
    this.screen.currentWindow.buffer.deleteBackward();
};

Buffer.fn.lineStart = function() {
    this.setCursor(0, this.cursorY);
};

Ejax.fn.lineStart = function() {
    this.screen.currentWindow.buffer.lineStart();
};

Buffer.fn.lineEnd = function() {
    if (this.cursorY == this.content.lastLine()) {
        this.setCursor(this.content.getLine(this.cursorY).length, this.cursorY);
    } else {
        this.setCursor(this.content.getLine(this.cursorY).length - 1, this.cursorY);
    }
};

Ejax.fn.lineEnd = function() {
    this.screen.currentWindow.buffer.lineEnd();
};

Buffer.fn.bufferStart = function() {
    this.startingLine = 0;
    this.setCursor(0, 0);
    this.postRedraw();
};

Ejax.fn.bufferStart = function() {
    this.screen.currentWindow.buffer.bufferStart();
};

Buffer.fn.bufferEnd = function(rows) {
    this.startingLine = this.content.lines.length - rows + 1;

    if (this.startingLine < 0) {
        this.startingLine = 0;
    }

    this.setCursor(this.content.getLine(this.content.lastLine()).length, this.content.lastLine());
    this.postRedraw();
};

Ejax.fn.bufferEnd = function() {
    this.screen.currentWindow.buffer.bufferEnd(this.screen.currentWindow.rows - 1);
};

Ejax.fn.isBufferVisible = function(buffer) {
    return this.screen.currentWindow.buffer == buffer;
};

Buffer.fn.postRedraw = function() {
    this.screen.postRedrawBuffer(this);
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
    var buffer = this.screen.currentWindow.buffer;
    var lastLine = buffer.content.lastLine();
    this.setCursor(buffer.content.getLine(lastLine).length, lastLine);
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
    var minibuffer = ejax.screen.minibuffer;
    if (minibuffer.cursorX < this.prompt.length) {
        ejax.ringBell();
        return;
    }

    this.content = this.content.insert(str, minibuffer.cursorX - this.prompt.length);
    this.update();
    minibuffer.setCursor(minibuffer.cursorX + str.length, minibuffer.cursorY);
};

MinibufferStatus.fn.deleteForward = function() {
    var minibuffer = ejax.screen.minibuffer;

    if (minibuffer.cursorX < this.prompt.length || minibuffer.cursorX >= minibuffer.content.length()) {
        ejax.ringBell();
        return;
    }

    this.content = this.content.remove(minibuffer.cursorX - this.prompt.length, 1);
    this.update();
};

MinibufferStatus.fn.deleteBackward = function() {
    var minibuffer = ejax.screen.minibuffer;

    if (minibuffer.cursorX <= this.prompt.length) {
        ejax.ringBell();
        return;
    }

    this.content = this.content.remove(minibuffer.cursorX - this.prompt.length - 1, 1);
    this.update();
    minibuffer.moveBackward();
};
