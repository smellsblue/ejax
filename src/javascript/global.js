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
fundamentalMode.bindings.bind("C-xC-f", function() { ejax.findFile(ejax.readParameter("Find file: ", ejax.getWorkingDirectory())); });
fundamentalMode.bindings.bind("C-xC-s", function() { ejax.saveBuffer(); });

var minibufferMode = new Mode("minibuffer", "MiniBuffer", editingBindings);
