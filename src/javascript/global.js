// This has global state that could depend on other things being
// defined, so it is all lumped at the end.

var defaultBindings = new Bindings();
defaultBindings.bind(["C-f", "RIGHT"], function() { ejax.moveForward(); });
defaultBindings.bind(["C-b", "LEFT"], function() { ejax.moveBackward(); });
defaultBindings.type = function(key) { ejax.insert(key); };

var fundamentalMode = new Mode("fundamental");
fundamentalMode.bindings = defaultBindings;
