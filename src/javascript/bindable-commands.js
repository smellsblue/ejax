Ejax.bindable = function(options) {
    options.fn.bindable = true;
    options.fn.description = options.description || "There is no help information for this function.";
    options.fn.description = Format.byWord(options.fn.description, { columns: 79 });
    Ejax.fn[options.name] = options.fn;
};

Ejax.bindable({
    name: "ringBell",
    fn: function() {
        // TODO: This function should ring the bell if possible, and then
        // cancel some actions like creating a keyboard macro.
        this.io.beep();
    }
});

Ejax.bindable({
    name: "exit",
    fn: function() {
        this.io.exit();
    }
});

Ejax.bindable({
    name: "executeCommand",
    fn: function() {
        var self = this;

        this.readParameter({
            prompt: "M-x ",
            callback: function(fnName) {
                var fn = self[fnName];

                if (fn && fn.bindable && fn.isFunction()) {
                    self[fnName]();
                } else {
                    self.screen.minibuffer.setBufferContent(fnName + " is undefined");
                }
            },
            autoCompleteFn: function() {
                var result = [];

                for (var property in Ejax.fn) {
                    if (Ejax.fn[property] && Ejax.fn[property].bindable) {
                        result.push(property);
                    }
                }

                return result;
            }
        });
    }
});

Ejax.bindable({
    name: "shell",
    fn: function() {
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
    }
});

Ejax.bindable({
    name: "sendShellCommand",
    fn: function() {
        var parameter = this.screen.currentWindow.buffer.content.getParameter();

        if (!parameter.endsWith("\n")) {
                parameter += "\n";
        }

        this.screen.currentWindow.buffer.content.setParameter("");
        this.screen.currentWindow.buffer.append(parameter);
        this.screen.currentWindow.buffer.shell.send(parameter);
    }
});

Ejax.bindable({
    name: "moveForward",
    fn: function() {
        this.screen.currentWindow.buffer.moveForward();
    }
});

Ejax.bindable({
    name: "moveBackward",
    fn: function() {
        this.screen.currentWindow.buffer.moveBackward();
    }
});

Ejax.bindable({
    name: "nextLine",
    fn: function() {
        this.screen.currentWindow.buffer.nextLine();
    }
});

Ejax.bindable({
    name: "previousLine",
    fn: function() {
        this.screen.currentWindow.buffer.previousLine();
    }
});

Ejax.bindable({
    name: "gotoLine",
    fn: function() {
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
    }
});

Ejax.bindable({
    name: "insertSelf",
    fn: function() {
        if (!Object.isNullOrUndefined(this.lastKey)) {
            this.screen.currentWindow.buffer.insert(this.lastKey);
        }
    }
});

Ejax.bindable({
    name: "deleteForward",
    fn: function() {
        this.screen.currentWindow.buffer.deleteForward();
    }
});

Ejax.bindable({
    name: "deleteBackward",
    fn: function() {
        this.screen.currentWindow.buffer.deleteBackward();
    }
});

Ejax.bindable({
    name: "mark",
    fn: function() {
        this.screen.currentWindow.buffer.mark();
    }
});

Ejax.bindable({
    name: "copyRegion",
    fn: function() {
        this.screen.currentWindow.buffer.copyRegion();
    }
});

Ejax.bindable({
    name: "killRegion",
    fn: function() {
        this.screen.currentWindow.buffer.killRegion();
    }
});

Ejax.bindable({
    name: "yank",
    fn: function() {
        this.screen.currentWindow.buffer.yank();
    }
});

Ejax.bindable({
    name: "lineStart",
    fn: function() {
        this.screen.currentWindow.buffer.lineStart();
    }
});

Ejax.bindable({
    name: "lineEnd",
    fn: function() {
        this.screen.currentWindow.buffer.lineEnd();
    }
});

Ejax.bindable({
    name: "bufferStart",
    fn: function() {
        this.screen.currentWindow.buffer.bufferStart();
    }
});

Ejax.bindable({
    name: "bufferEnd",
    fn: function() {
        this.screen.currentWindow.buffer.bufferEnd(this.screen.currentWindow.rows - 1);
    }
});

Ejax.bindable({
    name: "findFile",
    fn: function() {
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
    }
});

Ejax.bindable({
    name: "saveBuffer",
    fn: function() {
        this.screen.currentWindow.buffer.saveBuffer();
    }
});

Ejax.bindable({
    name: "changeBuffer",
    fn: function() {
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
    }
});

Ejax.bindable({
    name: "killBuffer",
    fn: function() {
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
    }
});

Ejax.bindable({
    name: "autoComplete",
    fn: function() {
        // TODO: Support shell mode auto completing.
        if (this.screen.currentWindow.buffer.minibuffer) {
            this.screen.currentWindow.buffer.status.autoComplete();
        }
    }
});

Ejax.bindable({
    name: "parameterFinished",
    fn: function() {
        this.screen.currentWindow = this.screen.minibuffer.status.lastWindow;
        var parameter = this.screen.minibuffer.content.getParameter();
        this.screen.minibuffer.content.set("");
        var status = this.screen.minibuffer.status;
        this.screen.minibuffer.status = null;
        this.screen.minibufferWindow.postRedraw();
        this.screen.resetCursor();
        status.callback(parameter);
    }
});

Ejax.bindable({
    name: "helpForFunction",
    fn: function() {
        var self = this;

        this.readParameter({
            prompt: "Describe function: ",
            callback: function(fnName) {
                var fn = self[fnName];

                if (fn && fn.bindable && fn.isFunction()) {
                    self.showHelpFor(fnName);
                } else {
                    self.screen.minibuffer.setBufferContent(fnName + " is undefined");
                }
            },
            autoCompleteFn: function() {
                var result = [];

                for (var property in Ejax.fn) {
                    if (Ejax.fn[property] && Ejax.fn[property].bindable) {
                        result.push(property);
                    }
                }

                return result;
            }
        });
    }
});

// Ideas for functions to implement
// - executeRegion: execute from the mark to the current value
// - quit: quit the current parameter being processed
// - forward/backwardWord: move by words
// - pageUp/pageDown: self explanatory
