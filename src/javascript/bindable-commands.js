Ejax.bindable = function(options) {
    options.fn.bindable = true;
    options.fn.description = options.description || "There is no help information for this function.";
    options.fn.description = Format.byWord(options.fn.description, { columns: 79 });
    Ejax.fn[options.name] = options.fn;
};

Ejax.bindable({
    name: "ringBell",
    description: "Ring the bell and cancel certain commands.",
    fn: function() {
        // TODO: This function should ring the bell if possible, and then
        // cancel some actions like creating a keyboard macro.
        this.io.beep();
    }
});

Ejax.bindable({
    name: "exit",
    description: "Exit the application.",
    fn: function() {
        this.io.exit();
    }
});

Ejax.bindable({
    name: "executeCommand",
    description: "Execute any bindable command dynamically.  A parameter is read and that parameter is run if it is a bindable command.  The parameter can be tab completed.",
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
    description: "Create a new interactive shell buffer and switch to that buffer.",
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
    description: "Send the current command that is entered to the current shell buffer to the shell.  The command is appended to the output and then removed from the prompt.",
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
    description: "Move forward by one character.",
    fn: function() {
        this.screen.currentWindow.buffer.moveForward();
    }
});

Ejax.bindable({
    name: "moveBackward",
    description: "Move backward by one character.",
    fn: function() {
        this.screen.currentWindow.buffer.moveBackward();
    }
});

Ejax.bindable({
    name: "nextLine",
    description: "Move down by one line.",
    fn: function() {
        this.screen.currentWindow.buffer.nextLine();
    }
});

Ejax.bindable({
    name: "previousLine",
    description: "Move up by one line.",
    fn: function() {
        this.screen.currentWindow.buffer.previousLine();
    }
});

Ejax.bindable({
    name: "gotoLine",
    description: "Go to a specific line, read as a parameter.  If the line is not currently visible, the buffer will be centered on that line.  If the line is less than the first line, it will be changed to the first line.  Likewise, if the line is greater than the last line, it will be changed to the last line.",
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
    description: "Insert the last typed key to the current buffer (if it is a printable key).",
    fn: function() {
        if (!Object.isNullOrUndefined(this.lastKey)) {
            this.screen.currentWindow.buffer.insert(this.lastKey);
        }
    }
});

Ejax.bindable({
    name: "deleteForward",
    description: "Delete one character at the cursor.",
    fn: function() {
        this.screen.currentWindow.buffer.deleteForward();
    }
});

Ejax.bindable({
    name: "deleteBackward",
    description: "Delete one character behind the cursor.",
    fn: function() {
        this.screen.currentWindow.buffer.deleteBackward();
    }
});

Ejax.bindable({
    name: "mark",
    description: "Mark the current cursor location.  The mark can then be used in a lot of region based functions like copyRegion.",
    fn: function() {
        this.screen.currentWindow.buffer.mark();
    }
});

Ejax.bindable({
    name: "copyRegion",
    description: "Copy from the last marked position to the current cursor position.  The copied region can then be 'yank'ed, which will paste it to the buffer.",
    fn: function() {
        this.screen.currentWindow.buffer.copyRegion();
    }
});

Ejax.bindable({
    name: "killRegion",
    description: "Kill from the last marked position to the current cursor position.  This will remove the region from the buffer and copy it so it can later be 'yank'ed.",
    fn: function() {
        this.screen.currentWindow.buffer.killRegion();
    }
});

Ejax.bindable({
    name: "yank",
    description: "Yank what was last copied or killed into the current buffer.",
    fn: function() {
        this.screen.currentWindow.buffer.yank();
    }
});

Ejax.bindable({
    name: "lineStart",
    description: "Move the cursor to the start of the current line.",
    fn: function() {
        this.screen.currentWindow.buffer.lineStart();
    }
});

Ejax.bindable({
    name: "lineEnd",
    description: "Move the cursor to the end of the current line.",
    fn: function() {
        this.screen.currentWindow.buffer.lineEnd();
    }
});

Ejax.bindable({
    name: "bufferStart",
    description: "Move the cursor to the beginning of the buffer.",
    fn: function() {
        this.screen.currentWindow.buffer.bufferStart();
    }
});

Ejax.bindable({
    name: "bufferEnd",
    description: "Move the cursor to the end of the buffer.",
    fn: function() {
        this.screen.currentWindow.buffer.bufferEnd(this.screen.currentWindow.rows - 1);
    }
});

Ejax.bindable({
    name: "findFile",
    description: "Find a file and open its contents into a new buffer, and show that buffer.  The filename is read as a parameter.  The filename can be tab completed.",
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
    description: "Save the current buffer.  Presumably, this buffer is a loaded file and so any changes will be written out to disk.",
    fn: function() {
        this.screen.currentWindow.buffer.saveBuffer();
    }
});

Ejax.bindable({
    name: "changeBuffer",
    description: "Change which buffer is being shown in the current window.  The buffer name is read as a parameter and can be tab completed.",
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
    description: "Kill the current buffer.  Any changes not saved will be lost.  The most recent buffer shown will be loaded into the current window in its place.",
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
    description: "Auto complete the parameter being read.  The values for the auto complete depends entirely on the parameter being read.",
    fn: function() {
        // TODO: Support shell mode auto completing.
        if (this.screen.currentWindow.buffer.minibuffer) {
            this.screen.currentWindow.buffer.status.autoComplete();
        }
    }
});

Ejax.bindable({
    name: "parameterFinished",
    description: "The parameter has finished being input, so the value is passed to whatever callback was registered for the parameter.  The function that requested the parameter is then completed.",
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
    description: "Get help for a function.  The function name is read as a parameter and can be tab completed.",
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