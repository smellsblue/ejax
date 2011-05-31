function Bindings(inheritFrom) {
    this.tree = new CompletionTree();
    this.tree.tokenizer = parseBinding;
    this.bindings = [];

    if (inheritFrom && inheritFrom.bindings) {
        for (var i = 0; i < inheritFrom.bindings.length; i++) {
            var binding = inheritFrom.bindings[i];
            this.bind(binding.codes, binding.fn);
        }
    }

    if (inheritFrom && inheritFrom.type) {
        this.type = inheritFrom.type;
    }
}

Bindings.fn = Bindings.prototype;

Bindings.fn.bind = function(codes, fn) {
    if (codes.isString()) {
        codes = [codes];
    }

    this.bindings.push({ codes: codes, fn: fn });

    for (var index = 0; index < codes.length; index++) {
        this.tree.add(codes[index], fn);
    }
};

/**
 * Constant to represent a partial binding.  This cannot be a string
 * or a function, otherwise key processing will try to execute it as a
 * function.
 */
Bindings.PARTIAL = {};

/**
 * Returns Bindings.PARTIAL if the tokens are an incomplete part of a
 * binding, null if there is no binding, and the function or string
 * bound if it is a complete binding.
 */
Bindings.fn.process = function(tokens) {
    var result = this.tree.find(tokens);

    if (result.exists && result.partial) {
        return Bindings.PARTIAL;
    }

    if (result.exists) {
        return result.value;
    }

    return null;
};

Bindings.fn.getBindingsForFn = function(fn) {
    var result = [];

    for (var i = 0; i < this.bindings.length; i++) {
        var binding = this.bindings[i];

        if (binding.fn == fn) {
            result.push.apply(result, binding.codes);
        }
    }

    return result;
};

Ejax.fn.getBindingsForFn = function(fn) {
    var result = overrideBindings.getBindingsForFn(fn);
    var modeBindings = this.screen.currentWindow.buffer.mode.bindings.getBindingsForFn(fn);

    for (var i = 0; i < modeBindings.length; i++) {
        var code = modeBindings[i];

        if (!overrideBindings.process(code) && !result.contains(code)) {
            result.push(code);
        }
    }

    if (overrideBindings.type == fn) {
        result.push("type text");
    } else if (this.screen.currentWindow.buffer.mode.bindings.type == fn) {
        result.push("type text");
    }

    return result;
};

/**
 * Returns "partial" if the code is an incomplete part of a binding,
 * null if there is no binding, and the function bound if it is a
 * complete binding.
 */
Ejax.fn.processBinding = function(code) {
    this.lastCode = code;
    this.lastToken = null;
    this.lastKey = null;
    var modeBindings = this.screen.currentWindow.buffer.mode.bindings;
    var result = overrideBindings.process(code);

    // Any result warrants a valid binding, because otherwise a long
    // override would be overshadowed by a small mode binding.
    if (result) {
        return result;
    }

    result = modeBindings.process(code);

    if (result) {
        return result;
    }

    var tokens = parseBinding(code);

    if (tokens.length == 1 && tokens[0].isPrintable()) {
        this.lastToken = tokens[0];
        var key = tokens[0].getPrintKey();
        this.lastKey = key;

        if (overrideBindings.type) {
            return overrideBindings.type;
        }

        if (modeBindings.type) {
            return modeBindings.type;
        }
    }

    return null;
};

function parseBinding(code) {
    if (code.length < 1) {
        throw new Error("Invalid empty code!");
    }

    var originalCode = code;
    var tokens = [];
    var token = new Token();

    var chomp = function(value) {
        if (code.startsWith(value)) {
            code = code.substring(value.length, code.length);
            return true;
        }

        return false;
    };

    var key = function(value) {
        if (chomp(value)) {
            token.setKey(value);
            return true;
        }

        return false;
    };

    while (code.length > 0) {
        if (chomp("C-")) {
            token.setControl();
            continue;
        } else if (chomp("M-")) {
            token.setMeta();
            continue;
        }

        var found = false;

        for (var property in Token.specialKeys) {
            if (key(Token.specialKeys[property])) {
                token.setSpecialKey(property);
                tokens.push(token);
                token = new Token();
                found = true;
                break;
            }
        }

        if (found) {
            continue;
        }

        for (var i = 0; i < Token.invalidKeys.length; i++) {
            if (chomp(Token.invalidKeys[i])) {
                throw new Error("Invalid key in binding '" + originalCode + "'");
            }
        }

        token.setKey(code.charAt(0));
        code = code.substring(1, code.length);
        tokens.push(token);
        token = new Token();
    }

    if (token.startedDefining()) {
        throw new Error("Binding '" + originalCode + "' is not valid!");
    }

    return tokens;
};

Ejax.fn.bind = function(code, fn) {
    overrideBindings.bind(code, fn);
};
