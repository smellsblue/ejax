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
editingBindings.bind("BSP", function() { ejax.deleteBackward(); });
editingBindings.type = function(key) { ejax.insert(key); };

var fundamentalMode = new Mode("fundamental", "Fundamental", editingBindings);
fundamentalMode.bindings.bind("C-xC-f", function() { ejax.readParameter("Find file: ", ejax.getWorkingDirectory(), function(result) { ejax.findFile(result); }); });
fundamentalMode.bindings.bind("C-xC-s", function() { ejax.saveBuffer(); });
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
minibufferMode.bindings.bind(["C-a", "HOME"], function() { ejax.screen.minibuffer.setCursor(ejax.screen.minibuffer.status.prompt.length); });
minibufferMode.bindings.bind(["C-d", "DEL"], function() { ejax.screen.minibuffer.status.deleteForward(); });
minibufferMode.bindings.bind("BSP", function() { ejax.screen.minibuffer.status.deleteBackward(); });
minibufferMode.bindings.type = function(key) {
    if (key == "\n") {
        ejax.screen.currentWindow = ejax.screen.minibuffer.status.lastWindow;
        ejax.screen.minibuffer.content.set("");
        ejax.screen.minibuffer.status.callback(ejax.screen.minibuffer.status.content);
        ejax.screen.minibuffer.status = null;
        ejax.screen.minibufferWindow.redraw();
    } else if (key == "\t") {
        // TODO: tab completion
    } else {
        ejax.screen.minibuffer.status.insert(key);
    }
};
