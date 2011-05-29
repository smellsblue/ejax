// This has global state that could depend on other things being
// defined, so it is all lumped at the end.

// The overrideBindings override any mode bindings going on, so they
// start out empty.  These should really only be used for user defined
// bindings.
var overrideBindings = new Bindings();

var coreBindings = new Bindings();
coreBindings.bind("C-xC-c", function() { ejax.exit(); });

var editingBindings = new Bindings(coreBindings);
editingBindings.bind(["C-f", "RIGHT"], function() { ejax.moveForward(); });
editingBindings.bind(["C-b", "LEFT"], function() { ejax.moveBackward(); });
editingBindings.bind(["C-n", "DOWN"], function() { ejax.nextLine(); });
editingBindings.bind(["C-p", "UP"], function() { ejax.previousLine(); });
editingBindings.bind(["C-a", "HOME"], function() { ejax.lineStart(); });
editingBindings.bind(["C-e", "END"], function() { ejax.lineEnd(); });
editingBindings.bind(["C-d", "DEL"], function() { ejax.deleteForward(); });
editingBindings.bind("C-SPC", function() { ejax.mark(); });
editingBindings.bind("M-w", function() { ejax.copyRegion(); });
editingBindings.bind("C-w", function() { ejax.killRegion(); });
editingBindings.bind("C-y", function() { ejax.yank(); });
editingBindings.bind("BSP", function() { ejax.deleteBackward(); });
editingBindings.type = function() { ejax.insertSelf(); };

var fundamentalMode = new Mode("fundamental", "Fundamental", editingBindings);
fundamentalMode.bindings.bind("M-x", function() { ejax.executeCommand(); });
fundamentalMode.bindings.bind("M-<", function() { ejax.bufferStart(); });
fundamentalMode.bindings.bind("M->", function() { ejax.bufferEnd(); });
fundamentalMode.bindings.bind("M-gM-g", function() { ejax.gotoLine(); });
fundamentalMode.bindings.bind("C-xC-f", function() { ejax.findFile(); });
fundamentalMode.bindings.bind("C-xC-s", function() { ejax.saveBuffer(); });
fundamentalMode.bindings.bind("C-xb", function() { ejax.changeBuffer(); });
fundamentalMode.bindings.onFoundBinding = function(code) {
    logger.debug("Found function for key combo '" + code + "'");
    ejax.screen.minibuffer.setBufferContent("");
};
fundamentalMode.bindings.onMissedBinding = function(code) {
    logger.debug("No match for key combo '" + code + "'");
    ejax.screen.minibuffer.setBufferContent(code + " is undefined");
};
fundamentalMode.bindings.onPartialBinding = function(code) {
    logger.debug("Partial match for key combo '" + code + "'");
    ejax.screen.minibuffer.setBufferContent(code + "-");
};

var minibufferMode = new Mode("minibuffer", "MiniBuffer", editingBindings);
minibufferMode.bindings.bind("TAB", function() { ejax.screen.minibuffer.status.autoComplete(); });
minibufferMode.bindings.bind("RET", function() {
    ejax.screen.currentWindow = ejax.screen.minibuffer.status.lastWindow;
    var parameter = ejax.screen.minibuffer.content.getParameter();
    ejax.screen.minibuffer.content.set("");
    var status = ejax.screen.minibuffer.status;
    ejax.screen.minibuffer.status = null;
    ejax.screen.minibufferWindow.postRedraw();
    ejax.screen.resetCursor();
    status.callback(parameter);
});

var shellMode = new Mode("shell", "Shell", fundamentalMode.bindings);
shellMode.bindings.bind("TAB", function() { /* TODO */ });
shellMode.bindings.bind("RET", function() {
    var parameter = ejax.screen.currentWindow.buffer.content.getParameter();

    if (!parameter.endsWith("\n")) {
            parameter += "\n";
    }

    ejax.screen.currentWindow.buffer.content.setParameter("");
    ejax.screen.currentWindow.buffer.append(parameter);
    ejax.screen.currentWindow.buffer.shell.send(parameter);
});
