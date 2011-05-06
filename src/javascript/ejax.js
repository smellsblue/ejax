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

Ejax.keyboard = keyboard.standard;

Ejax.fn.keyDown = function(event) {
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
        this.keyCache = "";
    }

    this.keyCache += code;

    var result = this.processBinding(this.keyCache);

    if (result && result.isFunction()) {
        this.keyCache = null;
        result();
    } else if (!result) {
        this.keyCache = null;
    }
};

Ejax.fn.ringBell = function() {
    // TODO: This function should ring the bell if possible, and then
    // cancel some actions like creating a keyboard macro.
    this.io.beep();
};
