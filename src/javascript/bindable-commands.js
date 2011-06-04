Ejax.groups = {};
Ejax.groups.BUFFERS = "Buffers";
Ejax.groups.CUSTOM = "Custom User Defined";
Ejax.groups.EDITING = "Editing";
Ejax.groups.JAVASCRIPT = "JavaScript";
Ejax.groups.MACROS = "Keyboard Macros"
Ejax.groups.MISC = "Misc";
Ejax.groups.NAVIGATION = "Navigation";
Ejax.groups.RECTANGLE = "Rectangle";

Ejax.bindable = function(options) {
    options.fn.bindable = true;
    options.fn.shortDescription = options.shortDescription || "";
    options.fn.description = options.description || "There is no help information for this function.";
    options.fn.group = options.group || Ejax.groups.MISC;
    options.fn.description = Format.byWord(options.fn.description, { columns: 79 });
    Ejax.fn[options.name] = options.fn;
};

Ejax.bindable({
    name: "ringBell",
    description: "Ring the bell and cancel certain commands.",
    fn: function() {
        this.bell();
    }
});

Ejax.bindable({
    name: "exit",
    shortDescription: "Exit application",
    description: "Exit the application.",
    fn: function() {
        this.io.exit();
    }
});

Ejax.bindable({
    name: "executeCommand",
    shortDescription: "Execute a command",
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
                    self.sendMessage(fnName + " is undefined");
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
    group: Ejax.groups.MISC,
    shortDescription: "Start shell buffer",
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
    name: "console",
    group: Ejax.groups.MISC,
    shortDescription: "Open console buffer",
    description: "If there is already a buffer named *console*, open it.  Otherwise create a new interactive console buffer and switch to that buffer.",
    fn: function() {
        var screen = this.screen;
        screen.changeBuffer(screen.getOrCreateBuffer("*console*", function() {
            var buffer = new Buffer(screen, { name: "*console*", mode: consoleMode, parameterMode: true });
            buffer.append("> ");
            return buffer;
        }));
    }
});

Ejax.bindable({
    name: "sendConsoleCommand",
    description: "Send the current command that is entered to the current console buffer to the console.  The command is appended to the output and then removed from the prompt.",
    fn: function() {
        var parameter = this.screen.currentWindow.buffer.content.getParameter();
        this.screen.currentWindow.buffer.content.setParameter("");

        if (!parameter.endsWith("\n")) {
            this.screen.currentWindow.buffer.append(parameter + "\n");
        } else {
            this.screen.currentWindow.buffer.append(parameter);
        }

        try {
            var result = Ejax.eval(parameter);

            if (!Object.isNullOrUndefined(result) && result.inspect && result.inspect.isFunction()) {
                this.screen.currentWindow.buffer.append(result.inspect() + "\n");
            } else {
                this.screen.currentWindow.buffer.append("" + result + "\n");
            }
        } catch (e) {
            var contents = "";

            if (e.name) {
                contents += e.name;
            } else {
                contents += "Error";
            }

            contents += ": ";

            if (e.message) {
                contents += e.message;
            }

            if (e.fileName) {
                var lineNumber = e.lineNumber;

                if (Object.isNullOrUndefined(e.lineNumber)) {
                    lineNumber = "unknown line";
                } else {
                    lineNumber = "line #" + lineNumber;
                }

                contents += "\n  From: " + e.fileName + " (" + lineNumber + ")";
            }

            if (e.stack) {
                contents += "\n" + e.stack;
            }

            this.screen.currentWindow.buffer.append(contents + "\n");
        }

        this.screen.currentWindow.buffer.append("> ");
    }
});

Ejax.bindable({
    name: "moveForward",
    group: Ejax.groups.NAVIGATION,
    shortDescription: "Move forward by character",
    description: "Move forward by one character.",
    fn: function() {
        this.screen.currentWindow.buffer.moveForward();
    }
});

Ejax.bindable({
    name: "moveBackward",
    group: Ejax.groups.NAVIGATION,
    shortDescription: "Move backward by character",
    description: "Move backward by one character.",
    fn: function() {
        this.screen.currentWindow.buffer.moveBackward();
    }
});

Ejax.bindable({
    name: "moveForwardWord",
    group: Ejax.groups.NAVIGATION,
    shortDescription: "Move forward by word",
    description: "Move forward by one word.",
    fn: function() {
        this.screen.currentWindow.buffer.moveForwardWord();
    }
});

Ejax.bindable({
    name: "moveBackwardWord",
    group: Ejax.groups.NAVIGATION,
    shortDescription: "Move backward by word",
    description: "Move backward by one word.",
    fn: function() {
        this.screen.currentWindow.buffer.moveBackwardWord();
    }
});

Ejax.bindable({
    name: "nextLine",
    group: Ejax.groups.NAVIGATION,
    shortDescription: "Move down by line",
    description: "Move down by one line.",
    fn: function() {
        this.screen.currentWindow.buffer.nextLine();
    }
});

Ejax.bindable({
    name: "previousLine",
    group: Ejax.groups.NAVIGATION,
    shortDescription: "Move up by line",
    description: "Move up by one line.",
    fn: function() {
        this.screen.currentWindow.buffer.previousLine();
    }
});

Ejax.bindable({
    name: "pageDown",
    group: Ejax.groups.NAVIGATION,
    shortDescription: "Move down by page",
    description: "Scroll the window down by a visible page.",
    fn: function() {
        this.screen.currentWindow.pageDown();
    }
});

Ejax.bindable({
    name: "pageUp",
    group: Ejax.groups.NAVIGATION,
    shortDescription: "Move up by page",
    description: "Scroll the window up by a visible page.",
    fn: function() {
        this.screen.currentWindow.pageUp();
    }
});

Ejax.bindable({
    name: "gotoLine",
    group: Ejax.groups.NAVIGATION,
    shortDescription: "Go to specific line",
    description: "Go to a specific line, read as a parameter.  If the line is not currently visible, the buffer will be centered on that line.  If the line is less than the first line, it will be changed to the first line.  Likewise, if the line is greater than the last line, it will be changed to the last line.",
    fn: function() {
        var self = this;

        this.readParameter({
            prompt: "Goto line: ",
            callback: function(line) {
                if (!/^\d+$/.test(line)) {
                    self.sendMessage("Expected int, got " + line);
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
    group: Ejax.groups.EDITING,
    description: "Insert the last typed key to the current buffer (if it is a printable key).",
    fn: function() {
        if (!Object.isNullOrUndefined(this.lastKey)) {
            this.screen.currentWindow.buffer.insert(this.lastKey);
        }
    }
});

Ejax.bindable({
    name: "deleteForward",
    group: Ejax.groups.EDITING,
    shortDescription: "Delete forward by character",
    description: "Delete one character at the cursor.",
    fn: function() {
        this.screen.currentWindow.buffer.deleteForward();
    }
});

Ejax.bindable({
    name: "deleteBackward",
    group: Ejax.groups.EDITING,
    shortDescription: "Delete backward by character",
    description: "Delete one character behind the cursor.",
    fn: function() {
        this.screen.currentWindow.buffer.deleteBackward();
    }
});

Ejax.bindable({
    name: "mark",
    shortDescription: "Mark cursor location",
    description: "Mark the current cursor location.  The mark can then be used in a lot of region based functions like copyRegion.",
    fn: function() {
        this.screen.currentWindow.buffer.mark();
    }
});

Ejax.bindable({
    name: "copyRegion",
    group: Ejax.groups.EDITING,
    shortDescription: "Copy the region",
    description: "Copy from the last marked position to the current cursor position.  The copied region can then be 'yank'ed, which will paste it to the buffer.",
    fn: function() {
        this.screen.currentWindow.buffer.copyRegion();
    }
});

Ejax.bindable({
    name: "killWordForward",
    group: Ejax.groups.EDITING,
    shortDescription: "Kill word forward",
    description: "Kill from the cursor to the end of the next word.  If the cursor has no more words in front, the rest of the buffer is killed.  What was killed can later be 'yank'ed.",
    fn: function() {
        this.screen.currentWindow.buffer.killWordForward();
    }
});

Ejax.bindable({
    name: "killWordBackward",
    group: Ejax.groups.EDITING,
    shortDescription: "Kill word backward",
    description: "Kill from the cursor to the beginning of the last word.  If the cursor has no more words behind it, the rest of the buffer is killed.  What was killed can later be 'yank'ed.",
    fn: function() {
        this.screen.currentWindow.buffer.killWordBackward();
    }
});

Ejax.bindable({
    name: "killLine",
    group: Ejax.groups.EDITING,
    shortDescription: "Kill the line",
    description: "Kill from the cursor to the end of the line.  If the cursor is at the end of the line, kill the newline character.  What was killed can later be 'yank'ed.",
    fn: function() {
        this.screen.currentWindow.buffer.killLine();
    }
});

Ejax.bindable({
    name: "killRegion",
    group: Ejax.groups.EDITING,
    shortDescription: "Kill the region",
    description: "Kill from the last marked position to the current cursor position.  This will remove the region from the buffer and copy it so it can later be 'yank'ed.",
    fn: function() {
        this.screen.currentWindow.buffer.killRegion();
    }
});

Ejax.bindable({
    name: "yank",
    group: Ejax.groups.EDITING,
    shortDescription: "Yank last killed or copied",
    description: "Yank what was last copied or killed into the current buffer.",
    fn: function() {
        this.screen.currentWindow.buffer.yank();
    }
});

Ejax.bindable({
    name: "killRectangle",
    group: Ejax.groups.RECTANGLE,
    shortDescription: "Kill the rectangle",
    description: "Kill the rectangle from the mark to the cursor.",
    fn: function() {
        this.screen.currentWindow.buffer.killRectangle();
    }
});

Ejax.bindable({
    name: "insertRectangle",
    group: Ejax.groups.RECTANGLE,
    shortDescription: "Insert into the rectangle",
    description: "Insert a string into the rectangle.  This will delete what is in the rectangle, and repeat the input parameter to each portion of the rectangle.",
    fn: function() {
        var screen = this.screen;
        var defaultValue = "";

        if (!Object.isNullOrUndefined(this.lastRectangleInsert)) {
            defaultValue = this.lastRectangleInsert;
        }

        this.readParameter({
            prompt: "String rectangle (default " + defaultValue + "): ",
            value: this.getWorkingDirectory(),
            callback: function(value) {
                if (value == "") {
                    value = defaultValue;
                }

                screen.currentWindow.buffer.insertRectangle(value);
                screen.ejax.lastRectangleInsert = value;
            }
        });
    }
});

Ejax.bindable({
    name: "undo",
    group: Ejax.groups.EDITING,
    shortDescription: "Undo",
    description: "Undo the last edit on the buffer.  There is a limit to the amount of edits that can be undone.",
    fn: function() {
        this.screen.currentWindow.buffer.undo(this.screen.currentWindow.rows - 1);
    }
});

Ejax.bindable({
    name: "lineStart",
    group: Ejax.groups.NAVIGATION,
    shortDescription: "Move to line beginning",
    description: "Move the cursor to the start of the current line.",
    fn: function() {
        this.screen.currentWindow.buffer.lineStart();
    }
});

Ejax.bindable({
    name: "lineEnd",
    group: Ejax.groups.NAVIGATION,
    shortDescription: "Move to line end",
    description: "Move the cursor to the end of the current line.",
    fn: function() {
        this.screen.currentWindow.buffer.lineEnd();
    }
});

Ejax.bindable({
    name: "bufferStart",
    group: Ejax.groups.NAVIGATION,
    shortDescription: "Move to buffer beginning",
    description: "Move the cursor to the beginning of the buffer.",
    fn: function() {
        this.screen.currentWindow.buffer.bufferStart();
    }
});

Ejax.bindable({
    name: "bufferEnd",
    group: Ejax.groups.NAVIGATION,
    shortDescription: "Move to buffer end",
    description: "Move the cursor to the end of the buffer.",
    fn: function() {
        this.screen.currentWindow.buffer.bufferEnd(this.screen.currentWindow.rows - 1);
    }
});

Ejax.bindable({
    name: "findFile",
    group: Ejax.groups.BUFFERS,
    shortDescription: "Load a file",
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
    group: Ejax.groups.BUFFERS,
    shortDescription: "Save the file",
    description: "Save the current buffer.  Presumably, this buffer is a loaded file and so any changes will be written out to disk.",
    fn: function() {
        this.screen.currentWindow.buffer.saveBuffer();
    }
});

Ejax.bindable({
    name: "changeBuffer",
    group: Ejax.groups.BUFFERS,
    shortDescription: "Change buffers",
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
    group: Ejax.groups.BUFFERS,
    shortDescription: "Kill current or other buffer",
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
    name: "quitCommand",
    shortDescription: "Quit current command",
    description: "Cancel the current command being run.  This typically cancels retrieving a parameter for a currently running command.  It will also cancel the recording of a macro.",
    fn: function() {
        this.cancelMacro();

        if (this.screen.currentWindow.buffer.minibuffer) {
            this.screen.currentWindow = this.screen.minibuffer.status.lastWindow;
            this.sendMessage("Quit");
            this.screen.minibuffer.status = null;
            this.screen.minibufferWindow.postRedraw();
            this.screen.resetCursor();
        } else {
            this.sendMessage("Quit");
        }
    }
});

Ejax.bindable({
    name: "helpForFunction",
    shortDescription: "Get help on function",
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
                    self.sendMessage(fnName + " is undefined");
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
    name: "evalRegion",
    group: Ejax.groups.JAVASCRIPT,
    shortDescription: "Evaluate the region as JavaScript",
    description: "Evaluate the code from the last marked position to the current cursor position.  If the results are not undefined or null, they will be presented in a new buffer.",
    fn: function() {
        this.screen.currentWindow.buffer.evalRegion();
    }
});

Ejax.bindable({
    name: "beginMacro",
    group: Ejax.groups.MACROS,
    shortDescription: "Start macro",
    description: "Begin a keyboard macro.  The macro can be cancelled by triggering a ringing of the bell or by C-g (quitCommand).  When cancelled, the macro cannot be executed.",
    fn: function() {
        this.startMacro();
    }
});

Ejax.bindable({
    name: "endMacro",
    group: Ejax.groups.MACROS,
    shortDescription: "Stop macro",
    description: "End the currently recording keyboard macro.  This will save the macro so it can be later executed.",
    fn: function() {
        this.stopMacro();
    }
});

Ejax.bindable({
    name: "runMacro",
    group: Ejax.groups.MACROS,
    shortDescription: "Run macro",
    description: "Run the last saved keyboard macro.  If the bell is rung while executing the macro, the macro will be cancelled at that point.",
    fn: function() {
        this.executeMacro();
    }
});

Ejax.bindable({
    name: "endOrRunMacro",
    group: Ejax.groups.MACROS,
    shortDescription: "Stop or run macro",
    description: "If a macro is being recorded, end it.  If not, run the last recorded macro.  If the bell is rung while executing the macro, the macro will be cancelled at that point.",
    fn: function() {
        if (this.recordingMacro) {
            this.endMacro();
        } else {
            this.runMacro();
        }
    }
});

Ejax.bindable({
    name: "insertMacro",
    group: Ejax.groups.MACROS,
    shortDescription: "Insert macro to buffer",
    description: "Insert the JavaScript macro definition for the last created macro.",
    fn: function() {
        this.screen.currentWindow.buffer.insertMacro(this.lastSavedMacro);
    }
});

Ejax.bindable({
    name: "nameMacro",
    group: Ejax.groups.MACROS,
    shortDescription: "Name last macro",
    description: "Name the last keyboard macro so it can be executed via executeCommand (which is bound to M-x).",
    fn: function() {
        var macro = this.lastSavedMacro;
        this.readParameter({
            prompt: "Name for last macro: ",
            callback: function(fnName) {
                Ejax.bindable({
                    name: fnName,
                    group: Ejax.groups.CUSTOM,
                    shortDescription: "A custom function",
                    description: "This is a macro bound to this name dynamically.  You should know this!",
                    fn: function() {
                        this.run(macro);
                    }
                });
            }
        });
    }
});

(function() {
    var createMacroBindable = function(num) {
        Ejax.bindable({
            name: "endOrRunMacro" + num,
            group: Ejax.groups.MACROS,
            shortDescription: "Stop or run macro " + num,
            description: "If a macro is being recorded, end it and store it in slot " + num + ".  If not, run the last recorded macro in slot " + num + ".  If the bell is rung while executing the macro, the macro will be cancelled at that point.",
            fn: function() {
                if (this.recordingMacro) {
                    this.endMacroInSlot(num);
                } else {
                    this.runMacroInSlot(num);
                }
            }
        });

        Ejax.bindable({
            name: "storeToMacro" + num,
            group: Ejax.groups.MACROS,
            shortDescription: "Store macro to " + num,
            description: "Save the last recorded macro in slot " + num + ".",
            fn: function() {
                this.saveLastMacroTo(num);
            }
        });

        Ejax.bindable({
            name: "insertMacro" + num,
            group: Ejax.groups.MACROS,
            shortDescription: "Insert macro " + num + " to buffer",
            description: "Insert the JavaScript macro definition for the macro recorded in slot " + num + ".",
            fn: function() {
                this.screen.currentWindow.buffer.insertMacro(this.slottedMacros[num]);
            }
        });

        Ejax.bindable({
            name: "nameMacro" + num,
            group: Ejax.groups.MACROS,
            shortDescription: "Name macro " + num,
            description: "Name the keyboard macro recorded in slot " + num + " so it can be executed via executeCommand (which is bound to M-x).",
            fn: function() {
                var macro = this.slottedMacros[num];
                this.readParameter({
                    prompt: "Name for macro " + num + ": ",
                    callback: function(fnName) {
                        Ejax.bindable({
                            name: fnName,
                            shortDescription: "A custom function",
                            description: "This is a macro bound to this name dynamically.  You should know this!",
                            fn: function() {
                                this.run(macro);
                            }
                        });
                    }
                });
            }
        });
    };

    for (var i = 0; i < 10; i++) {
        createMacroBindable(i);
    }
})();

Ejax.bindable({
    name: "referenceCard",
    shortDescription: "Show reference card",
    description: "Open a reference card.  The reference card will be opened in a new (or existing) *Reference Card* buffer.  If it is an existing buffer, the contents will be cleared and reconstructed (so be sure any changes have been saved).  The reference card is automatically generated from all functions that are executable via executeCommand (which is bound to M-x).",
    fn: function() {
        this.openReferenceCard();
    }
});

Ejax.bindable({
    name: "butterfly",
    shortDescription: "Let the butterflies loose",
    description: "Use butterflies to change bits.  The butterflies will flap their wings, causing a disturbance to ripple outward and change the flow of eddies in the upper atmosphere, which create momentary pockets of higher pressure air to form and act as a lense to focus cosmic rays to strike your drive platter and flip the desired bit.  Thanks to http://xkcd.com/378 for the inspiration.",
    fn: function() {
        this.sendMessage("Desired bit flipped!");
    }
});

// Ideas for functions to implement
// - helpBinding: do lookup on binding and get help for it
// - interactiveSearch: search interactively (and reverse search)
