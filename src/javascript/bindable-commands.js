Ejax.fn.ringBell = function() {
    // TODO: This function should ring the bell if possible, and then
    // cancel some actions like creating a keyboard macro.
    this.io.beep();
};

Ejax.fn.exit = function() {
    this.io.exit();
};

Ejax.fn.executeCommand = function() {
    var self = this;

    this.readParameter({
        prompt: "M-x ",
        callback: function(fnName) {
            var fn = self[fnName];

            if (fn && fn.isFunction()) {
                self[fnName]();
            } else {
                self.screen.minibuffer.setBufferContent(fnName + " is undefined");
            }
        },
        autoCompleteFn: function() {
            var result = [];

            for (var property in Ejax.fn) {
                if (Ejax.fn[property] && Ejax.fn[property].isFunction()) {
                    result.push(property);
                }
            }

            return result;
        }
    });
};

Ejax.fn.shell = function() {
    var io = this.io;
    var buffer = new Buffer(this.screen, { name: "*shell*", mode: shellMode, columns: this.screen.columns, rows: this.screen.rows - 1, parameterMode: true });
    buffer.shell = this.io.shell({
        outputFn: function(str) {
            io.addJob(function() {
                buffer.append(str);
                buffer.postRedraw();
            });
        }
    });

    if (!buffer.shell) {
        throw new Error("Shell not supported!");
    }

    this.screen.addAndChangeBuffer(buffer);
};

Ejax.fn.sendShellCommand = function() {
    var parameter = this.screen.currentWindow.buffer.content.getParameter();

    if (!parameter.endsWith("\n")) {
            parameter += "\n";
    }

    this.screen.currentWindow.buffer.content.setParameter("");
    this.screen.currentWindow.buffer.append(parameter);
    this.screen.currentWindow.buffer.shell.send(parameter);
};

Ejax.fn.moveForward = function() {
    this.screen.currentWindow.buffer.moveForward();
};

Ejax.fn.moveBackward = function() {
    this.screen.currentWindow.buffer.moveBackward();
};

Ejax.fn.nextLine = function() {
    this.screen.currentWindow.buffer.nextLine();
};

Ejax.fn.previousLine = function() {
    this.screen.currentWindow.buffer.previousLine();
};

Ejax.fn.gotoLine = function() {
    var self = this;

    this.readParameter({
        prompt: "Goto line: ",
        callback: function(line) {
            if (!/^\d+$/.test(line)) {
                self.screen.minibuffer.setBufferContent("Expected int, got " + line);
                return;
            }

            line = parseInt(line, 10);
            var window = self.screen.currentWindow;
            window.buffer.gotoLine(line, window.rows - 1);
        }
    });
};

Ejax.fn.insertSelf = function() {
    if (!Object.isNullOrUndefined(this.lastKey)) {
        this.screen.currentWindow.buffer.insert(this.lastKey);
    }
};

Ejax.fn.deleteForward = function() {
    this.screen.currentWindow.buffer.deleteForward();
};

Ejax.fn.deleteBackward = function() {
    this.screen.currentWindow.buffer.deleteBackward();
};

Ejax.fn.mark = function() {
    this.screen.currentWindow.buffer.mark();
};

Ejax.fn.copyRegion = function() {
    this.screen.currentWindow.buffer.copyRegion();
};

Ejax.fn.killRegion = function() {
    this.screen.currentWindow.buffer.killRegion();
};

Ejax.fn.yank = function() {
    this.screen.currentWindow.buffer.yank();
};

Ejax.fn.lineStart = function() {
    this.screen.currentWindow.buffer.lineStart();
};

Ejax.fn.lineEnd = function() {
    this.screen.currentWindow.buffer.lineEnd();
};

Ejax.fn.bufferStart = function() {
    this.screen.currentWindow.buffer.bufferStart();
};

Ejax.fn.bufferEnd = function() {
    this.screen.currentWindow.buffer.bufferEnd(this.screen.currentWindow.rows - 1);
};

Ejax.fn.findFile = function() {
    var io = this.io;
    var screen = this.screen;

    this.readParameter({
        prompt: "Find file: ",
        value: this.getWorkingDirectory(),
        callback: function(filename) {
            var file = io.file(filename);
            var buffer = new Buffer(screen, { name: file.name(), file: file });
            buffer.setBufferContent(file.contents());
            screen.addAndChangeBuffer(buffer);
        },
        contextFn: function(value) {
            var path = "";
            var index = value.lastIndexOf(io.separator());

            if (index >= 0) {
                path = value.substring(0, index + 1);
            }

            return path;
        },
        contextAutoCompleteFn: function(path) {
            var current;
            var result = [];

            if (path == "") {
                current = io.file(".");
            } else {
                current = io.file(path);
            }

            var files = current.entries();

            for (var i = 0; i < files.length; i++) {
                result.push(path + files[i]);
            }

            return result;
        }
    });
};

Ejax.fn.saveBuffer = function() {
    this.screen.currentWindow.buffer.saveBuffer();
};

Ejax.fn.changeBuffer = function() {
    var screen = this.screen;
    var nextName = screen.nextAvailableBuffer().name;

    this.readParameter({
        prompt: "Switch to buffer (default " + nextName + "): ",
        callback: function(buffer) {
            if (buffer == "") {
                buffer = nextName;
            }

            screen.changeBuffer(screen.getOrCreateBuffer(buffer));
        },
        autoCompleteFn: function() {
            return screen.getBufferNames();
        }
    });
};

Ejax.fn.killBuffer = function() {
    var screen = this.screen;
    var name = screen.currentWindow.buffer.name;

    this.readParameter({
        prompt: "Kill buffer (default " + name + "): ",
        callback: function(buffer) {
            if (buffer == "") {
                buffer = name;
            }

            screen.killBuffer(screen.getBuffer(buffer));
        },
        autoCompleteFn: function() {
            return screen.getBufferNames();
        }
    });
};

Ejax.fn.autoComplete = function() {
    // TODO: Support shell mode auto completing.
    if (this.screen.currentWindow.buffer.minibuffer) {
        this.screen.currentWindow.buffer.status.autoComplete();
    }
};

Ejax.fn.parameterFinished = function() {
    this.screen.currentWindow = this.screen.minibuffer.status.lastWindow;
    var parameter = this.screen.minibuffer.content.getParameter();
    this.screen.minibuffer.content.set("");
    var status = this.screen.minibuffer.status;
    this.screen.minibuffer.status = null;
    this.screen.minibufferWindow.postRedraw();
    this.screen.resetCursor();
    status.callback(parameter);
};
