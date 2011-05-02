function Bindings() {
    this.tree = {};
}

Bindings.fn = Bindings.prototype;

Bindings.fn.bind = function(codes, fn) {
    if (codes.isString()) {
        codes = [codes];
    }

    for (var index = 0; index < codes.length; index++) {
        var code = codes[index];
        var tokens = parseBinding(code);
        var tree = this.tree;

        for (var i = 0; i < tokens.length - 1; i++) {
            var token = tokens[i];
            var next = tree[token.toString()];

            if (!next) {
                tree[token.toString()] = {};
                next = tree[token.toString()];
            } else if (next.isFunction()) {
                tree[token.toString()] = {};
                next = tree[token.toString()];
            }

            tree = next;
        }

        tree[tokens[tokens.length - 1].toString()] = fn;
    }
};

/**
 * Returns "partial" if the tokens are an incomplete part of a
 * binding, null if there is no binding, and the function bound if it
 * is a complete binding.
 */
Bindings.fn.process = function(tokens) {
    var tree = this.tree;

    for (var i = 0; i < tokens.length; i++) {
        var next = tree[tokens[i].toString()];

        if (!next) {
            return null;
        }

        if (next.isFunction()) {
            if (i != tokens.length - 1) {
                return null;
            } else {
                return next;
            }
        }

        tree = next;
    }

    return "partial";
};

/**
 * Returns "partial" if the code is an incomplete part of a binding,
 * null if there is no binding, and the function bound if it is a
 * complete binding.
 */
Ejax.fn.processBinding = function(code) {
    var modeBindings = this.screen.currentBuffer.mode.bindings;
    var tokens = this.parseBinding(code);
    var result = modeBindings.process(tokens);

    if (result) {
        return result;
    }

    result = defaultBindings.process(tokens);

    if (result) {
        return result;
    }

    if (tokens.length == 1 && tokens[0].isPrintable()) {
        var key = tokens[0].getPrintKey();

        if (modeBindings.type) {
            return new function() { modeBindings.type(key); };
        }

        if (defaultBindings.type) {
            return new function() { defaultBindings.type(key); };
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
            break;
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

Ejax.fn.parseBinding = function(code) {
    return parseBinding(code);
};

Ejax.fn.bind = function(code, fn) {
    defaultBindings.bind(code, fn);
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
