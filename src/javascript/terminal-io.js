var curses = org.ejax.Curses;
var cursesKeyMapping = {};

(function() {
    var custom = function(x, ctrl, alt, shift) {
        return { keyCode: x, ctrl: ctrl, alt: alt, shift: shift };
    };

    var value = function(x) {
        return custom(x, false, false, false);
    };

    var different = {
        263: 8,   // BACKSPACE
        96:  192, // `
        48:  58,  // 0
        45:  189, // -
        61:  187, // =
        91:  219, // [
        93:  221, // ]
        92:  220, // \
        59:  186, // ;
        39:  222, // '
        44:  188, // ,
        46:  190, // .
        47:  191  // /
    };

    for (var key in different) {
        cursesKeyMapping[key] = value(different[key]);
        cursesKeyMapping["27-" + key] = custom(different[key], false, true, false);
    }

    // LEFT
    cursesKeyMapping[260] = value(37);
    cursesKeyMapping["27-91-49-59-51-68"] = custom(37, false, true, false);
    // RIGHT
    cursesKeyMapping[261] = value(39);
    cursesKeyMapping["27-91-49-59-51-67"] = custom(39, false, true, false);
    // UP
    cursesKeyMapping[259] = value(38);
    cursesKeyMapping["27-91-49-59-51-65"] = custom(38, false, true, false);
    // DOWN
    cursesKeyMapping[258] = value(40);
    cursesKeyMapping["27-91-49-59-51-66"] = custom(40, false, true, false);
    // DELETE
    cursesKeyMapping[330] = value(46);
    cursesKeyMapping["27-91-51-59-51-126"] = custom(46, false, true, false);
    // INSERT
    cursesKeyMapping[331] = value(45);
    cursesKeyMapping["27-91-50-59-51-126"] = custom(45, false, true, false);
    // PGUP
    cursesKeyMapping[339] = value(33);
    cursesKeyMapping["27-91-53-59-51-126"] = custom(33, false, true, false);
    // PGDOWN
    cursesKeyMapping[338] = value(34);
    cursesKeyMapping["27-91-54-59-51-126"] = custom(34, false, true, false);
    // HOME
    cursesKeyMapping[262] = value(36);
    // END
    cursesKeyMapping[360] = value(35);
    // F1-F12
    for (var i = 0; i < 12; i++) {
        cursesKeyMapping[i + 265] = value(i + 112);
    }

    var differentShifted = {
        126: 192, // ~
        33:  49,  // !
        64:  50,  // @
        35:  51,  // #
        36:  52,  // $
        37:  53,  // %
        94:  54,  // ^
        38:  55,  // &
        42:  56,  // *
        40:  57,  // (
        41:  58,  // )
        95:  189, // _
        43:  187, // +
        123: 219, // {
        125: 221, // }
        124: 220, // |
        58:  186, // :
        34:  222, // "
        60:  188, // <
        62:  190, // >
        63:  191  // ?
    };

    for (var key in differentShifted) {
        cursesKeyMapping[key] = custom(differentShifted[key], false, false, true);
        cursesKeyMapping["27-" + key] = custom(differentShifted[key], false, true, true);
    }

    // a-zA-Z
    for (var i = 0; i < 26; i++) {
        var codeValue = i + 65;
        var code = i + 97;
        var shiftedCode = i + 65;
        var ctrledCode = i + 1;
        var altedCode = "27-" + code;
        var altedShiftedCode = "27-" + shiftedCode;
        var ctrledAltedCode = "27-" + ctrledCode;
        cursesKeyMapping[code] = value(codeValue);
        cursesKeyMapping[shiftedCode] = custom(codeValue, false, false, true);
        cursesKeyMapping[ctrledCode] = custom(codeValue, true, false, false);
        cursesKeyMapping[altedCode] = custom(codeValue, false, true, false);
        cursesKeyMapping[altedShiftedCode] = custom(codeValue, false, true, true);
        cursesKeyMapping[ctrledAltedCode] = custom(codeValue, true, true, false);
    }

    // Ctrl+M is the same code as enter, so these should go after
    var exact = [13, 27, 32, 49, 50, 51, 52, 53, 54, 55, 56, 57];

    for (var i = 0; i < exact.length; i++) {
        cursesKeyMapping[exact[i]] = value(exact[i]);
        cursesKeyMapping["27-" + exact[i]] = custom(exact[i], false, true, false);
    }
})();

function TerminalEjax() {
    this.cursor = { x: 0, y: 0 };
    this.setCursor(this.cursor.x, this.cursor.y);
    this.rows = curses.rows();
    this.columns = curses.columns();
    this.instance = new Ejax(this.rows, this.columns, this);
    this.running = true;
}

TerminalEjax.fn = TerminalEjax.prototype;

TerminalEjax.fn.setPixel = function(c, x, y, options) {
    var attributes = [];

    if (options.invert) {
        attributes.push(curses.ATTRIBUTE_REVERSE);
    }

    curses.write(x, y, c, attributes);
    curses.move(this.cursor.x, this.cursor.y);
};

TerminalEjax.fn.setPixels = function(str, x, y, options) {
    var attributes = [];

    if (options.invert) {
        attributes.push(curses.ATTRIBUTE_REVERSE);
    }

    curses.write(x, y, str, attributes);
    curses.move(this.cursor.x, this.cursor.y);
};

TerminalEjax.fn.registerKeyDown = function(fn) {
    this.keyDownFn = fn;
};

TerminalEjax.fn.setCursor = function(x, y) {
    this.cursor.x = x;
    this.cursor.y = y;
    curses.move(x, y);
};

TerminalEjax.fn.beep = function() {
    curses.beep();
};

TerminalEjax.fn.file = function(filename) {
    return new File(filename);
};

TerminalEjax.fn.exit = function() {
    this.running = false;
};

TerminalEjax.fn.processInput = function(mappedKey) {
    if (this.keyDownFn) {
        this.keyDownFn({
            keyCode: mappedKey.keyCode,
            ctrl: mappedKey.ctrl,
            alt: mappedKey.alt,
            shift: mappedKey.shift
        });
    }
};

TerminalEjax.main = function(args) {
    try {
        TerminalEjax.run(args);
    } catch(e) {
        logger.error("Error caused the app the end.", e);
    }
};

TerminalEjax.cursesSetup = function() {
    curses.keypad(true);
    curses.nonl();
    curses.cbreak();
    curses.raw();
    curses.noecho();
    curses.clear();
    curses.move(0, 0);
    curses.refresh();
};

TerminalEjax.cursesKeys = function() {
    TerminalEjax.cursesSetup();
    curses.write(0, 0, "Press q to quit", []);
    var c = curses.read();

    while (c != -1) {
        var code = c;

        while (curses.available()) {
            var nextCode = curses.read();
            code += "-" + nextCode;
        }

        if (code == 113) {
            break;
        }

        var mappedKey = cursesKeyMapping[code];
        curses.write(0, 1, "                                                                               ", []);
        curses.write(0, 2, "                                                                               ", []);
        code = "You typed: " + code;
        curses.write(0, 1, code, []);

        if (mappedKey) {
            var value = "The key was mapped to " + mappedKey.keyCode;

            if (mappedKey.ctrl) {
                value += " ctrl";
            }

            if (mappedKey.alt) {
                value += " alt";
            }

            if (mappedKey.shift) {
                value += " shift";
            }

            curses.write(0, 2, value, []);
        } else {
            curses.write(0, 2, "The key was not mapped", []);
        }

        c = curses.read();
    }
};

TerminalEjax.run = function(args) {
    for (var i = 0; i < args.length; i++) {
        var arg = args[i];

        if (arg == "--curseskeys") {
            return TerminalEjax.cursesKeys();
        }

        if (arg == "-l" || arg == "--log") {
            var log = new java.io.File("ejax.log");
            log = new java.io.FileWriter(log, true);
            log = new java.io.PrintWriter(log);

            java.lang.Runtime.getRuntime().addShutdownHook(new java.lang.Thread(function() {
                log.flush();
                log.close();
            }));

            setLogger(new Logger({
                println: function(msg) {
                    log.println(msg);
                    log.flush();
                }
            }, { enabled: true }));
        }
    }

    TerminalEjax.cursesSetup();
    var termEjax = new TerminalEjax();
    var c = curses.read();
    var size = 0;

    while (termEjax.running && c != -1) {
        var code = c;
        var codes = [c];

        while (curses.available()) {
            var nextCode = curses.read();
            code += "-" + nextCode;
            codes.push(nextCode);
        }

        var mappedKey = cursesKeyMapping[code];

        if (mappedKey) {
            termEjax.processInput(mappedKey);
        } else {
            var mappable = true;

            for (var i = 0; i < codes.length; i++) {
                if (!cursesKeyMapping[codes[i]]) {
                    mappable = false;
                    break;
                }
            }

            if (mappable) {
                for (var i = 0; i < codes.length; i++) {
                    termEjax.processInput(cursesKeyMapping[codes[i]]);
                }
            }
        }

        if (!termEjax.running) {
            break;
        }

        c = curses.read();
    }
};
