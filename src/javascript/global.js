// This has global state that could depend on other things being
// defined, so it is all lumped at the end.

// The overrideBindings override any mode bindings going on, so they
// start out empty.  These should really only be used for user defined
// bindings.
var overrideBindings = new Bindings();

var coreBindings = new Bindings();
coreBindings.bind("C-xC-c", "exit");

var editingBindings = new Bindings(coreBindings);
editingBindings.bind(["C-f", "RIGHT"], "moveForward");
editingBindings.bind(["C-b", "LEFT"], "moveBackward");
editingBindings.bind(["M-f", "C-RIGHT", "M-RIGHT"], "moveForwardWord");
editingBindings.bind(["M-b", "C-LEFT", "M-LEFT"], "moveBackwardWord");
editingBindings.bind(["C-n", "DOWN"], "nextLine");
editingBindings.bind(["C-p", "UP"], "previousLine");
editingBindings.bind(["C-a", "HOME"], "lineStart");
editingBindings.bind(["C-e", "END"], "lineEnd");
editingBindings.bind(["C-d", "DEL"], "deleteForward");
editingBindings.bind("BSP", "deleteBackward");
editingBindings.bind(["M-d", "C-DEL"], "killWordForward");
editingBindings.bind("C-BSP", "killWordBackward");
editingBindings.bind("C-SPC", "mark");
editingBindings.bind("M-w", "copyRegion");
editingBindings.bind("C-w", "killRegion");
editingBindings.bind("C-k", "killLine");
editingBindings.bind("C-y", "yank");
editingBindings.bind("C-g", "quitCommand");
editingBindings.type = "insertSelf";

var fundamentalMode = new Mode("fundamental", "Fundamental", editingBindings);
fundamentalMode.bindings.bind("M-x", "executeCommand");
fundamentalMode.bindings.bind("M-<", "bufferStart");
fundamentalMode.bindings.bind("M->", "bufferEnd");
fundamentalMode.bindings.bind("M-gM-g", "gotoLine");
fundamentalMode.bindings.bind("C-xC-f", "findFile");
fundamentalMode.bindings.bind("C-xC-s", "saveBuffer");
fundamentalMode.bindings.bind("C-xb", "changeBuffer");
fundamentalMode.bindings.bind("C-xk", "killBuffer");
fundamentalMode.bindings.bind("C-hf", "helpForFunction");
fundamentalMode.bindings.bind("C-xC-e", "evalRegion");
fundamentalMode.bindings.bind(["C-v", "PGDWN"], "pageDown");
fundamentalMode.bindings.bind(["M-v", "PGUP"], "pageUp");
fundamentalMode.bindings.bind("C-xrk", "killRectangle");
fundamentalMode.bindings.bind(["C-x(", "F3"], "beginMacro");
fundamentalMode.bindings.bind("C-x)", "endMacro");
fundamentalMode.bindings.bind("C-xe", "runMacro");
fundamentalMode.bindings.bind("F4", "endOrRunMacro");
for (var i = 0; i < 10; i++) {
    // TODO: Better shortcut than C-M-e0 - C-M-e9
    fundamentalMode.bindings.bind(["C-" + i, "C-M-e" + i], "endOrRunMacro" + i);
    fundamentalMode.bindings.bind("M-" + i, "storeToMacro" + i);
}
fundamentalMode.bindings.onFoundBinding = function(code) {
    logger.debug("Found function for key combo '" + code + "'");
    this.screen.minibuffer.setBufferContent("");
};
fundamentalMode.bindings.onMissedBinding = function(code) {
    logger.debug("No match for key combo '" + code + "'");
    this.sendMessage(code + " is undefined");
};
fundamentalMode.bindings.onPartialBinding = function(code) {
    logger.debug("Partial match for key combo '" + code + "'");
    this.screen.minibuffer.setBufferContent(code + "-");
};

var minibufferMode = new Mode("minibuffer", "MiniBuffer", editingBindings);
minibufferMode.bindings.bind("TAB", "autoComplete");
minibufferMode.bindings.bind("RET", "parameterFinished");

var shellMode = new Mode("shell", "Shell", fundamentalMode.bindings);
shellMode.bindings.bind("TAB", "autoComplete");
shellMode.bindings.bind("RET", "sendShellCommand");
