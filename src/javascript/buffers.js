function BufferContent(buffer, content, parameterMode) {
    this.undoHistory = new UndoHistory(this);
    this.buffer = buffer;
    this.parameterMode = parameterMode;
    this.parameterX = 0;
    this.parameterY = 0;
    this.set(content);
}

BufferContent.fn = BufferContent.prototype;

BufferContent.fn.undo = function() {
    return this.undoHistory.undo();
};

BufferContent.fn.inRange = function(x, y) {
    if (x < 0 || y < 0 || y > this.lastLine()) {
        return false;
    }

    if (y == this.lastLine()) {
        return x <= this.lines[y].length;
    }

    return x < this.lines[y].length;
};

BufferContent.fn.copyStr = function(x, y, length) {
    if (y > this.lastLine()) {
        return "";
    }

    if (y == this.lastLine() && x >= this.lines[this.lastLine()].length) {
        return "";
    }

    var result = "";
    result += this.lines[y].substring(x, x + length);
    length -= result.length;
    y++;

    while (length > 0) {
        if (y > this.lastLine()) {
            break;
        }

        var str = this.lines[y].substring(0, length);
        length -= str.length;
        result += str;
        y++;
    }

    return result;
};

BufferContent.fn.copyRegion = function(fromX, fromY, toX, toY) {
    if (Object.isNullOrUndefined(fromX) || Object.isNullOrUndefined(fromY) || Object.isNullOrUndefined(toX) || Object.isNullOrUndefined(toY)) {
        return null;
    }

    if (!this.inRange(fromX, fromY) || !this.inRange(toX, toY)) {
        return null;
    }

    if (fromY > toY || (fromY == toY && fromX > toX)) {
        var temp = fromX;
        fromX = toX;
        toX = temp;
        temp = fromY;
        fromY = toY;
        toY = temp;
    }

    if (fromY == toY) {
        return this.lines[fromY].substring(fromX, toX);
    }

    var line = this.lines[fromY];
    var result = [line.substring(fromX, line.length)];

    for (var y = fromY + 1; y < toY; y++) {
        result.push(this.lines[y]);
    }

    result.push(this.lines[toY].substring(0, toX));
    return result.join("");
};

BufferContent.fn.getX = function(index) {
    return this.lineFrom(index).lineIndex;
};

BufferContent.fn.getY = function(index) {
    return this.lineFrom(index).index;
};

BufferContent.fn.getParameterX = function() {
    if (!this.parameterMode) {
        throw new Error("Cannot retrieve parameterX for non parameter mode buffer.");
    }

    return this.parameterX;
};

BufferContent.fn.getParameterY = function() {
    if (!this.parameterMode) {
        throw new Error("Cannot retrieve parameterY for non parameter mode buffer.");
    }

    return this.parameterY;
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

BufferContent.fn.canEdit = function(x, y) {
    if (!this.parameterMode) {
        return true;
    }

    if (y < this.parameterY) {
        return false;
    }

    if (y > this.parameterY) {
        return true;
    }

    return x >= this.parameterX;
};

BufferContent.fn.append = function(value) {
    var x, y;

    if (this.parameterMode) {
        x = this.parameterX;
        y = this.parameterY;
        var index = value.lastIndexOf("\n");

        if (index < 0) {
            this.parameterX += value.length;
        } else {
            this.parameterX = value.length - index - 1;
        }

        this.parameterY += value.count("\n");
    } else {
        x = this.lines[this.lastLine()].length;
        y = this.lastLine();
    }

    this.insert(value, x, y);
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

    if (toInsert.length >= 1 && toInsert[toInsert.length - 1].lastIndexOf("\n") < 0 && this.lines.length > y) {
        this.lines[y + 1] = this.lines[y + 1].insert(toInsert.splice(toInsert.length - 1, 1)[0], 0);
    }

    toInsert.splice(0, 0, y + 1, 0);
    this.lines.splice.apply(this.lines, toInsert);
    this.cache.length += str.length;
    this.undoHistory.add("remove", [x, y, str.length], [x, y]);
    this.postRedraw();
};

BufferContent.fn.deleteAt = function(x, y) {
    var str = this.copyStr(x, y, 1);
    this.lines[y] = this.lines[y].remove(x, 1);

    if (this.lines[y].lastIndexOf("\n") < 0 && this.lines.length > y + 1) {
        this.lines[y] = this.lines[y] + this.lines.splice(y + 1, 1)[0];
    }

    this.cache.length--;
    this.undoHistory.add("insert", [str, x, y], [x, y]);
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

BufferContent.fn.deleteLine = function(index) {
    if (index < 0 || index > this.lastLine()) {
        return;
    }

    this.remove(0, index, this.lines[index].length);
};

BufferContent.fn.set = function(content) {
    this.lines = content.inclusiveSplit("\n");
    var cache = { length: 0 };
    this.cache = cache;

    this.eachLine(function(line) {
        cache.length += line.length;
    });

    this.parameterX = this.lines[this.lines.length - 1].length;
    this.parameterY = this.lines.length - 1;
    this.postRedraw();
};

BufferContent.fn.get = function() {
    return this.lines.join("");
};

BufferContent.fn.setParameter = function(value) {
    if (!this.parameterMode) {
        throw new Error("Cannot set parameter for non parameter mode buffer.");
    }

    var parameterLength = this.lines[this.parameterY].length - this.parameterX;

    for (var i = this.parameterY + 1; i < this.lines.length; i++) {
        parameterLength += this.lines[i].length;
    }

    this.remove(this.parameterX, this.parameterY, parameterLength)
    this.insert(value, this.parameterX, this.parameterY)
};

BufferContent.fn.getParameter = function() {
    if (!this.parameterMode) {
        throw new Error("Cannot retrieve parameter for non parameter mode buffer.");
    }

    var result = [];
    var line = this.lines[this.parameterY];

    if (this.parameterX < line.length) {
        result.push(line.substring(this.parameterX, line.length));
    }

    for (var i = this.parameterY + 1; i < this.lines.length; i++) {
        result.push(this.lines[i]);
    }

    return result.join("");
};

function Buffer(screen, options) {
    this.screen = screen;
    this.name = options.name;
    this.file = options.file;
    this.minibuffer = options.minibuffer;
    this.content = new BufferContent(this, "", this.minibuffer || options.parameterMode);
    this.startingLine = 0;
    this.startingColumn = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.mode = options.mode || fundamentalMode;
}

Buffer.fn = Buffer.prototype;

Buffer.fn.getStatus = function() {
    return " " + this.name + "    L" + (this.cursorY + 1) + " (" + this.mode.description + ")";
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
    var x = this.cursorX + 1;
    var y = this.cursorY;

    if (y == this.content.lastLine()) {
        if (x > lineLength) {
            this.screen.ejax.ringBell();
            return;
        }
    } else if (x >= lineLength) {
        x = 0;
        y++;
    }

    this.setCursor(x, y);
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

Buffer.WORD_CHAR_REGEX = /[a-zA-Z0-9]/;
Buffer.NON_WORD_CHAR_REGEX = /[^a-zA-Z0-9]/;

Buffer.fn.moveForwardWord = function() {
    // TODO: Use a more efficient algorithm
    var wordChar = Buffer.WORD_CHAR_REGEX;
    var nonWordChar = Buffer.NON_WORD_CHAR_REGEX;

    if (this.cursorY == this.content.lastLine() && this.cursorX == this.content.getLine(this.cursorY).length) {
        this.screen.ejax.ringBell();
        return;
    }

    while (nonWordChar.test(this.content.getLine(this.cursorY).charAt(this.cursorX))) {
        if (this.cursorY == this.content.lastLine() && this.cursorX == this.content.getLine(this.cursorY).length) {
            break;
        }

        this.moveForward();
    }

    while (wordChar.test(this.content.getLine(this.cursorY).charAt(this.cursorX))) {
        if (this.cursorY == this.content.lastLine() && this.cursorX == this.content.getLine(this.cursorY).length) {
            break;
        }

        this.moveForward();
    }
};

Buffer.fn.moveBackwardWord = function() {
    // TODO: Use a more efficient algorithm
    var wordChar = Buffer.WORD_CHAR_REGEX;
    var nonWordChar = Buffer.NON_WORD_CHAR_REGEX;

    if (this.cursorY == 0 && this.cursorX == 0) {
        this.screen.ejax.ringBell();
        return;
    }

    this.moveBackward();

    while (nonWordChar.test(this.content.getLine(this.cursorY).charAt(this.cursorX))) {
        if (this.cursorY == 0 && this.cursorX == 0) {
            break;
        }

        this.moveBackward();
    }

    var foundWordChar = false;

    while (wordChar.test(this.content.getLine(this.cursorY).charAt(this.cursorX))) {
        if (this.cursorY == 0 && this.cursorX == 0) {
            break;
        }

        this.moveBackward();
        foundWordChar = true;
    }

    if (foundWordChar && nonWordChar.test(this.content.getLine(this.cursorY).charAt(this.cursorX))) {
        this.moveForward();
    }
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

Buffer.fn.pageDown = function(rows) {
    if (this.startingLine + rows - 1 > this.content.lastLine()) {
        this.screen.ejax.ringBell();
        return;
    }

    this.startingLine += rows - 1;
    this.postRedraw();
    this.setCursor(0, this.startingLine);
};

Buffer.fn.pageUp = function(rows) {
    if (this.startingLine == 0) {
        this.screen.ejax.ringBell();
        return;
    }

    this.startingLine -= rows - 1;

    if (this.startingLine < 0) {
        this.startingLine = 0;
    }

    this.postRedraw();
    this.setCursor(0, this.startingLine + rows - 2);
};

Buffer.fn.gotoLine = function(line, rows) {
    line = line - 1;

    if (line > this.content.lastLine()) {
        line = this.content.lastLine();
    }

    if (line < 0) {
        line = 0;
    }

    if (line < this.startingLine || line > this.startingLine + rows) {
        this.startingLine = line - Math.floor(rows / 2) + 1;

        if (this.startingLine < 0) {
            this.startingLine = 0;
        }

        this.postRedraw();
    }

    this.setCursor(0, line);
};

Buffer.fn.append = function(str) {
    var lastY = this.content.lastLine();
    var lastX = this.content.getLine(lastY).length;

    if (this.content.parameterMode) {
        lastX = this.content.getParameterX();
        lastY = this.content.getParameterY();
    }

    var cursorAtEnd = this.cursorY > lastY || (this.cursorY == lastY && this.cursorX >= lastX);
    this.content.append(str);

    if (!cursorAtEnd) {
        return;
    }

    var x, y;
    var newlineCount = str.count("\n");

    if (this.cursorY > lastY) {
        x = this.cursorX;
        y = this.cursorY + newlineCount;
    } else if (newlineCount > 0) {
        var remainingX = str.length - str.lastIndexOf("\n") - 1;
        x = remainingX + this.cursorX - lastX;
        y = this.cursorY + newlineCount;
    } else {
        x = this.cursorX + str.length;
        y = this.cursorY;
    }

    this.setCursor(x, y);
};

Buffer.fn.insert = function(str) {
    var x = this.cursorX;
    var y = this.cursorY;

    if (!this.content.canEdit(x, y)) {
        this.screen.ejax.ringBell();
        return;
    }

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

Buffer.fn.insertMacro = function(macro) {
    var macroValues = [];

    for (var i = 0; i < macro.length; i++) {
        macroValues.push('"' + macro[i].jsEscape() + '"');
    }

    this.insert("ejax.run([" + macroValues.join(", ") + "]);");
};

Buffer.fn.deleteForward = function() {
    if (!this.content.canEdit(this.cursorX, this.cursorY)) {
        this.screen.ejax.ringBell();
        return;
    }

    if (this.cursorY == this.content.lastLine() && this.cursorX >= this.content.getLine(this.cursorY).length) {
        this.screen.ejax.ringBell();
        return;
    }

    this.content.remove(this.cursorX, this.cursorY, 1);
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

    if (!this.content.canEdit(x, y)) {
        this.screen.ejax.ringBell();
        return;
    }

    this.moveBackward();
    this.content.remove(x, y, 1);
};

Buffer.fn.mark = function() {
    this.markX = this.cursorX;
    this.markY = this.cursorY;
};

Buffer.fn.evalRegion = function() {
    var toEval = this.content.copyRegion(this.markX, this.markY, this.cursorX, this.cursorY);

    if (Object.isNullOrUndefined(toEval)) {
        this.screen.ejax.ringBell();
        return;
    }

    var result = Ejax.eval(toEval);

    if (Object.isNullOrUndefined(result)) {
        return;
    }

    var content = "";
    content += "Result type: " + typeof(result) + "\n";
    content += "Result:\n";
    content += result;
    var buffer = new Buffer(this.screen, { name: "*Eval Results*" });
    buffer.setBufferContent(content);
    this.screen.addAndChangeBuffer(buffer);
};

Buffer.fn.copyRegion = function() {
    var result = this.content.copyRegion(this.markX, this.markY, this.cursorX, this.cursorY);
    if (Object.isNullOrUndefined(result)) {
        this.screen.ejax.ringBell();
        return;
    }

    this.screen.ejax.yanked = result;
};

Buffer.fn.killRegion = function() {
    var result = this.content.copyRegion(this.markX, this.markY, this.cursorX, this.cursorY);
    if (Object.isNullOrUndefined(result)) {
        this.screen.ejax.ringBell();
        return;
    }

    if (this.cursorY > this.markY || (this.cursorY == this.markY && this.cursorX > this.markX)) {
        this.setCursor(this.markX, this.markY);
    }

    this.content.remove(this.cursorX, this.cursorY, result.length);
    this.screen.ejax.yanked = result;
};

Buffer.fn.killWordForward = function() {
    if (this.cursorY == this.content.lastLine() && this.cursorX == this.content.getLine(this.cursorY).length) {
        this.screen.ejax.ringBell();
        return;
    }

    var startX = this.cursorX;
    var startY = this.cursorY;
    this.moveForwardWord();
    var endX = this.cursorX;
    var endY = this.cursorY;
    var result = this.content.copyRegion(startX, startY, endX, endY);
    this.setCursor(startX, startY);
    this.content.remove(this.cursorX, this.cursorY, result.length);
    this.screen.ejax.yanked = result;
};

Buffer.fn.killWordBackward = function() {
    if (this.cursorY == 0 && this.cursorX == 0) {
        this.screen.ejax.ringBell();
        return;
    }

    var startX = this.cursorX;
    var startY = this.cursorY;
    this.moveBackwardWord();
    var endX = this.cursorX;
    var endY = this.cursorY;
    var result = this.content.copyRegion(endX, endY, startX, startY);
    this.content.remove(this.cursorX, this.cursorY, result.length);
    this.screen.ejax.yanked = result;
};

Buffer.fn.killLine = function() {
    var line = this.content.getLine(this.cursorY);
    var length = line.length - 1;

    if (this.cursorY == this.content.lastLine()) {
        length = line.length;
    }

    if (this.cursorY == this.content.lastLine() && this.cursorX >= line.length) {
        this.screen.ejax.ringBell();
        return;
    }

    var toX = length;
    var toY = this.cursorY;

    if (this.cursorX == length) {
        toX = 0;
        toY++;
    }

    var result = this.content.copyRegion(this.cursorX, this.cursorY, toX, toY);

    if (Object.isNullOrUndefined(result)) {
        throw new Error("Unexpected null.");
    }

    this.content.remove(this.cursorX, this.cursorY, result.length);
    this.screen.ejax.yanked = result;
};

Buffer.fn.yank = function() {
    if (Object.isNullOrUndefined(this.screen.ejax.yanked)) {
        this.screen.ejax.ringBell();
        return;
    }

    this.insert(this.screen.ejax.yanked);
};

Buffer.fn.normalizedRectangle = function() {
    var fromX = this.markX;
    var fromY = this.markY;
    var toX = this.cursorX;
    var toY = this.cursorY;

    if (fromY > toY || (fromY == toY && fromX > toX)) {
        var temp = fromX;
        fromX = toX;
        toX = temp;
        temp = fromY;
        fromY = toY;
        toY = temp;
    }

    if (fromX > toX) {
        var temp = fromX;
        fromX = toX;
        toX = temp;
    }

    return { fromX: fromX, fromY: fromY, toX: toX, toY: toY };
};

Buffer.fn.killRectangle = function() {
    var rectangle = this.normalizedRectangle();
    var width = rectangle.toX - rectangle.fromX;

    for (var y = rectangle.fromY; y <= rectangle.toY; y++) {
        var line = this.content.getLine(y);
        var length = width;
        var maxLength = line.length - 1;

        if (this.content.lastLine() == y) {
            maxLength++;
        }

        if (rectangle.fromX >= maxLength) {
            continue;
        }

        if (rectangle.fromX + length > maxLength) {
            length = maxLength - rectangle.fromX;
        }

        this.content.remove(rectangle.fromX, y, length);
    }

    if (this.cursorX != rectangle.fromX) {
        this.setCursor(rectangle.fromX, this.cursorY);
    }

    if (this.markX != rectangle.fromX) {
        this.markX = rectangle.fromX;
    }
};

Buffer.fn.insertRectangle = function(value) {
    var rectangle = this.normalizedRectangle();
    var width = rectangle.toX - rectangle.fromX;

    for (var y = rectangle.fromY; y <= rectangle.toY; y++) {
        var line = this.content.getLine(y);
        var length = width;
        var maxLength = line.length - 1;

        if (this.content.lastLine() == y) {
            maxLength++;
        }

        if (rectangle.fromX > maxLength) {
            var spaces = "";
            var amount = rectangle.fromX - maxLength;

            for (var i = 0; i < amount; i++) {
                spaces += " ";
            }

            this.content.insert(spaces, maxLength, y);
        }

        if (rectangle.fromX + length > maxLength) {
            length = maxLength - rectangle.fromX;
        }

        this.content.remove(rectangle.fromX, y, length);
        this.content.insert(value, rectangle.fromX, y);
    }

    if (this.cursorX != rectangle.fromX) {
        this.setCursor(rectangle.fromX, this.cursorY);
    }

    if (this.markX != rectangle.fromX) {
        this.markX = rectangle.fromX;
    }
};

Buffer.fn.undo = function(rows) {
    var result = this.content.undo();
    if (result === false) {
        this.screen.ejax.sendMessage("No further undo information");
    } else {
        this.screen.ejax.sendMessage("Undo!");
        this.gotoLine(result[1], rows);
        this.setCursor(result[0], result[1]);
    }
};

Buffer.fn.lineStart = function() {
    if (this.content.parameterMode && this.cursorY == this.content.getParameterY() && this.cursorX >= this.content.getParameterX()) {
        this.setCursor(this.content.getParameterX(), this.cursorY);
        return;
    }

    this.setCursor(0, this.cursorY);
};

Buffer.fn.lineEnd = function() {
    if (this.cursorY == this.content.lastLine()) {
        this.setCursor(this.content.getLine(this.cursorY).length, this.cursorY);
    } else {
        this.setCursor(this.content.getLine(this.cursorY).length - 1, this.cursorY);
    }
};

Buffer.fn.bufferStart = function() {
    this.startingLine = 0;
    this.setCursor(0, 0);
    this.postRedraw();
};

Buffer.fn.bufferEnd = function(rows) {
    this.startingLine = this.content.lines.length - rows + 1;

    if (this.startingLine < 0) {
        this.startingLine = 0;
    }

    this.setCursor(this.content.getLine(this.content.lastLine()).length, this.content.lastLine());
    this.postRedraw();
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

Buffer.fn.saveBuffer = function() {
    if (!this.file) {
        throw new Error("Saving a non-file buffer is not yet supported!");
    }

    this.file.save(this.content.get());
};

Ejax.fn.getWorkingDirectory = function() {
    // TODO
    return "";
};

Ejax.fn.readParameter = function(options) {
    if (this.screen.currentWindow == this.screen.minibufferWindow) {
        throw new Error("Cannot read a parameter from the minibuffer!");
    }

    this.screen.minibuffer.content.set(options.prompt || "");
    this.screen.minibuffer.content.setParameter(options.value || "");

    this.screen.minibuffer.setMinibufferStatus(new MinibufferStatus({
        lastWindow: this.screen.currentWindow,
        callback: options.callback,
        contextFn: options.contextFn,
        contextAutoCompleteFn: options.contextAutoCompleteFn,
        autoCompleteFn: options.autoCompleteFn
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
};

function MinibufferStatus(options) {
    this.lastWindow = options.lastWindow;
    this.callback = options.callback || function(result) {};
    this.autoCompleteFn = options.autoCompleteFn;
    this.contextFn = options.contextFn;
    this.contextAutoCompleteFn = options.contextAutoCompleteFn;
    this.contextTrees = {};
}

MinibufferStatus.fn = MinibufferStatus.prototype;

MinibufferStatus.fn.autoComplete = function() {
    var content = this.minibuffer.content;
    var tree = this.tree;

    if (!tree && this.autoCompleteFn) {
        this.tree = new CompletionTree();
        tree = this.tree;
        var completions = this.autoCompleteFn();

        for (var i = 0; i < completions.length; i++) {
            tree.add(completions[i], completions[i]);
        }
    }

    if (!tree && this.contextFn && this.contextAutoCompleteFn) {
        var context = this.contextFn(content.getParameter());
        tree = this.contextTrees[context];

        if (!tree) {
            tree = new CompletionTree();
            var completions = this.contextAutoCompleteFn(context);

            for (var i = 0; i < completions.length; i++) {
                tree.add(completions[i], completions[i]);
            }

            this.contextTrees[context] = tree;
        }
    }

    if (tree) {
        var result = tree.find(content.getParameter());

        if (result.exists && result.partial) {
            content.setParameter(result.complete());
            this.minibuffer.setCursor(content.getLine(content.lastLine()).length, content.lastLine());
        }

        return;
    }
};
