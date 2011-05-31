var ejax = null;

function Ejax(rows, columns, io) {
    this.io = new IO(io);
    this.screen = new Screen(this, rows, columns);
    this.keyCache = null;
    var self = this;
    this.io.registerKeyDown(function(event) {
        self.keyDown(event);
    });
    ejax = this;
}

Ejax.fn = Ejax.prototype;

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

var keyboard = {};
keyboard.standard = {};

keyboard.standard.codeToToken = {
    32: "SPACE",
    27: "ESCAPE",
    46: "DELETE",
    8:  "BACKSPACE",
    45: "INSERT",
    9:  "TAB",
    13: "ENTER",
    37: "LEFT",
    39: "RIGHT",
    38: "UP",
    40: "DOWN",
    33: "PAGE_UP",
    34: "PAGE_DOWN",
    36: "HOME",
    35: "END",
    20: "CAPS_LOCK",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    96:  "NUM_0",
    97:  "NUM_1",
    98:  "NUM_2",
    99:  "NUM_3",
    100: "NUM_4",
    101: "NUM_5",
    102: "NUM_6",
    103: "NUM_7",
    104: "NUM_8",
    105: "NUM_9",
    106: "NUM_TIMES",
    107: "NUM_PLUS",
    109: "NUM_MINUS",
    110: "NUM_DOT",
    111: "NUM_DIVIDE",
    144: "NUM_LOCK"
};

keyboard.standard.codeToKey = {
    192: "`",
    49: "1",
    50: "2",
    51: "3",
    52: "4",
    53: "5",
    54: "6",
    55: "7",
    56: "8",
    57: "9",
    58: "0",
    189: "-",
    187: "=",
    65: "a",
    66: "b",
    67: "c",
    68: "d",
    69: "e",
    70: "f",
    71: "g",
    72: "h",
    73: "i",
    74: "j",
    75: "k",
    76: "l",
    77: "m",
    78: "n",
    79: "o",
    80: "p",
    81: "q",
    82: "r",
    83: "s",
    84: "t",
    85: "u",
    86: "v",
    87: "w",
    88: "x",
    89: "y",
    90: "z",
    219: "[",
    221: "]",
    220: "\\",
    186: ";",
    222: "'",
    188: ",",
    190: ".",
    191: "/",
};

keyboard.standard.codeToShiftedKey = {
    192: "~",
    49: "!",
    50: "@",
    51: "#",
    52: "$",
    53: "%",
    54: "^",
    55: "&",
    56: "*",
    57: "(",
    58: ")",
    189: "_",
    187: "+",
    65: "A",
    66: "B",
    67: "C",
    68: "D",
    69: "E",
    70: "F",
    71: "G",
    72: "H",
    73: "I",
    74: "J",
    75: "K",
    76: "L",
    77: "M",
    78: "N",
    79: "O",
    80: "P",
    81: "Q",
    82: "R",
    83: "S",
    84: "T",
    85: "U",
    86: "V",
    87: "W",
    88: "X",
    89: "Y",
    90: "Z",
    219: "{",
    221: "}",
    220: "|",
    186: ":",
    222: "\"",
    188: "<",
    190: ">",
    191: "?"
};

keyboard.standard.charToCode = {};
keyboard.standard.charToShifted = {};

for (var key in keyboard.standard.codeToKey) {
    keyboard.standard.charToCode[keyboard.standard.codeToKey[key]] = key;
}

for (var key in keyboard.standard.codeToShiftedKey) {
    keyboard.standard.charToCode[keyboard.standard.codeToShiftedKey[key]] = key;
    keyboard.standard.charToShifted[keyboard.standard.codeToShiftedKey[key]] = true;
}

for (var key in keyboard.standard.codeToToken) {
    keyboard.standard.charToCode[Token.specialKeys[keyboard.standard.codeToToken[key]]] = key;
}

keyboard.standard.tokenToEvent = function(token) {
    return { keyCode: keyboard.standard.charToCode[token.key], ctrl: token.control, alt: token.meta, shift: keyboard.standard.charToShifted[token.key] };
};

Ejax.keyboard = keyboard.standard;

Ejax.fn.keyDown = function(event) {
    try {
        this.processKeyDown(event);
    } catch(e) {
        var contents = "An error occurred.\n\n";

        if (e.name) {
            contents += "Error: " + e.name + "\n";
        }

        if (e.message) {
            contents += e.message + "\n";
        }

        if (e.fileName) {
            var lineNumber = e.lineNumber;

            if (Object.isNullOrUndefined(e.lineNumber)) {
                lineNumber = "unknown line";
            } else {
                lineNumber = "line #" + lineNumber;
            }

            contents += "  From: " + e.fileName + " (" + lineNumber + ")\n";
        }

        if (e.stack) {
            contents += "\n" + e.stack + "\n";
        }

        var buffer = this.screen.getOrCreateBuffer("*Error Information*");
        this.screen.setAvailableWindowBuffer(buffer);
        buffer.setBufferContent(contents);
        buffer.setCursor(0, 0);
        this.screen.redraw();
    }
};

Ejax.fn.processKeyDown = function(event) {
    var keyCode = event.keyCode;
    var ctrl = event.ctrl;
    var alt = event.alt;
    var shift = event.shift;
    var code = "";

    if (ctrl) {
        code += "C-";
    }

    if (alt) {
        code += "M-";
    }

    if (Ejax.keyboard.codeToToken[keyCode]) {
        code += Token.specialKeys[Ejax.keyboard.codeToToken[keyCode]];
    } else if (shift && Ejax.keyboard.codeToShiftedKey[keyCode]) {
        code += Ejax.keyboard.codeToShiftedKey[keyCode];
    } else if (Ejax.keyboard.codeToKey[keyCode]) {
        code += Ejax.keyboard.codeToKey[keyCode];
    } else {
        return;
    }

    if (this.keyCache == null) {
        this.keyCache = code;
    } else {
        this.keyCache += code;
    }

    var modeBindings = this.screen.currentWindow.buffer.mode.bindings;
    var result = this.processBinding(this.keyCache);

    if (result && (result.isFunction() || result.isString())) {
        var recording = this.recordingMacro;
        if (overrideBindings.onFoundBinding) {
            overrideBindings.onFoundBinding.call(this, this.keyCache);
        } else if (modeBindings.onFoundBinding) {
            modeBindings.onFoundBinding.call(this, this.keyCache);
        }
        var codeRan = this.keyCache;
        this.keyCache = null;
        try {
            if (result.isFunction()) {
                result();
            } else {
                this[result]();
            }
        } finally {
            // If recording... and STILL recording after calling function...
            if (recording && this.recordingMacro) {
                this.recordingMacroValue.push(codeRan);
            }
        }
    } else if (!result) {
        if (overrideBindings.onMissedBinding) {
            overrideBindings.onMissedBinding.call(this, this.keyCache);
        } else if (modeBindings.onMissedBinding) {
            modeBindings.onMissedBinding.call(this, this.keyCache);
        }
        this.keyCache = null;
    } else {
        if (overrideBindings.onPartialBinding) {
            overrideBindings.onPartialBinding.call(this, this.keyCache);
        } else if (modeBindings.onPartialBinding) {
            modeBindings.onPartialBinding.call(this, this.keyCache);
        }
    }

    // After keyboard processing, we can safely redraw just
    // once... this could go into some kind of interval function later
    // on perhaps, though then we have to deal with concurrency.
    this.screen.redraw();
};

Ejax.fn.showHelpFor = function(fnName) {
    var fn = this[fnName];

    if (!fn || !fn.bindable) {
        return;
    }

    var boundTo = this.getBindingsForFn(fnName);

    if (boundTo.length == 0) {
        boundTo = "nothing";
    } else {
        boundTo = boundTo.join(", ");
    }

    var contents = "";
    contents += fnName + "\n";
    contents += "\n";
    contents += "Currently bound to: " + boundTo + "\n";
    contents += "\n";
    contents += fn.description + "\n";

    var buffer = this.screen.getOrCreateBuffer("*Help*");
    this.screen.setAvailableWindowBuffer(buffer);
    buffer.setBufferContent(contents);
    buffer.setCursor(0, 0);
};

Ejax.fn.sendMessage = function(message) {
    this.screen.minibuffer.setBufferContent(message);
};

Ejax.fn.startMacro = function() {
    this.recordingMacro = true;
    this.recordingMacroValue = [];
};

Ejax.fn.stopMacro = function() {
    this.lastSavedMacro = this.recordingMacroValue;
    this.recordingMacro = false;
    this.recordingMacroValue = null;
};

Ejax.fn.executeMacro = function() {
    for (var i = 0; i < this.lastSavedMacro.length; i++) {
        var tokens = parseBinding(this.lastSavedMacro[i]);

        for (var j = 0; j < tokens.length; j++) {
            var token = tokens[j];
            this.keyDown(keyboard.standard.tokenToEvent(token));
        }
    }
};
