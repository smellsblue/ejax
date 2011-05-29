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

function Token() {
    this.key = null;
    this.specialKey = null;
    this.control = false;
    this.meta = false;
};

Token.specialKeys = {
    SPACE: "SPC",
    ESCAPE: "ESC",
    DELETE: "DEL",
    BACKSPACE: "BSP",
    INSERT: "INS",
    TAB: "TAB",
    ENTER: "RET",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    UP: "UP",
    DOWN: "DOWN",
    PAGE_UP: "PGUP",
    PAGE_DOWN: "PGDWN",
    HOME: "HOME",
    END: "END",
    CAPS_LOCK: "CAPS-LOCK",
    F1: "F1",
    F2: "F2",
    F3: "F3",
    F4: "F4",
    F5: "F5",
    F6: "F6",
    F7: "F7",
    F8: "F8",
    F9: "F9",
    F10: "F10",
    F11: "F11",
    F12: "F12",
    NUM_0: "NUM-0",
    NUM_1: "NUM-1",
    NUM_2: "NUM-2",
    NUM_3: "NUM-3",
    NUM_4: "NUM-4",
    NUM_5: "NUM-5",
    NUM_6: "NUM-6",
    NUM_7: "NUM-7",
    NUM_8: "NUM-8",
    NUM_9: "NUM-9",
    NUM_LOCK: "NUM-LOCK",
    NUM_MINUS: "NUM--",
    NUM_PLUS: "NUM-+",
    NUM_DOT: "NUM-.",
    NUM_TIMES: "NUM-*",
    NUM_DIVIDE: "NUM-/"
};

Token.specialKeysToChar = {
    SPACE: " ",
    TAB: "\t",
    ENTER: "\n",
    NUM_0: "0",
    NUM_1: "1",
    NUM_2: "2",
    NUM_3: "3",
    NUM_4: "4",
    NUM_5: "5",
    NUM_6: "6",
    NUM_7: "7",
    NUM_8: "8",
    NUM_9: "9",
    NUM_MINUS: "-",
    NUM_PLUS: "+",
    NUM_DOT: ".",
    NUM_TIMES: "*",
    NUM_DIVIDE: "/"
};

Token.invalidKeys = [" ", "\t", "\n", "\r"]

Token.fn = Token.prototype;

Token.fn.isPrintable = function() {
    if (this.control || this.meta) {
        return false;
    }

    if (this.specialKey) {
        if (Token.specialKeysToChar[this.specialKey]) {
            return true;
        }

        return false;
    }

    return true;
};

Token.fn.getPrintKey = function() {
    if (this.specialKey) {
        return Token.specialKeysToChar[this.specialKey] || "";
    }

    return this.key;
};

Token.fn.setKey = function(c) {
    this.key = c;
    return this;
};

Token.fn.setControl = function() {
    if (this.control) {
        throw new Error("Cannot have a token with 2 controls!");
    }

    this.control = true;
    return this;
};

Token.fn.setMeta = function() {
    if (this.meta) {
        throw new Error("Cannot have a token with 2 controls!");
    }

    this.meta = true;
    return this;
};

Token.fn.setSpecialKey = function(value) {
    if (this.specialKey) {
        throw new Error("Cannot have a token with 2 special key values!");
    }

    this.specialKey = value;
    return this;
};

Token.fn.startedDefining = function() {
    if (this.control || this.meta || this.key != null) {
        return true;
    }

    return false;
};

Token.fn.toString = function() {
    var str = "";

    if (this.control) {
        str += "C-";
    }

    if (this.meta) {
        str += "M-";
    }

    return str + this.key;
};
