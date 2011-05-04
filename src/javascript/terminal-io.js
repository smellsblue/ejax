var curses = org.ejax.Curses;
var cursesKeyMapping = {};

(function() {
    var custom = function(x, ctrl, alt, shift) {
        return { keyCode: x, ctrl: ctrl, alt: alt, shift: shift };
    };

    var value = function(x) {
        return custom(x, false, false, false);
    };

    var shifted = function(x) {
        return custom(x, false, false, true);
    };

    var ctrled = function(x) {
        return custom(x, true, false, false);
    };

    var different = {
        96:  192, // `
        48:  58,  // 0
        45:  189, // -
        61:  187, // =
        91:  219, // [
        93:  221, // ]
        92:  220,  // \
        59:  186,  // ;
        39:  222,  // '
        44:  188,  // ,
        46:  190,  // .
        47:  191,  // /
        260: 37,  // LEFT
        261: 39,  // RIGHT
        259: 38,  // UP
        258: 40   // DOWN
    };

    for (var key in different) {
        cursesKeyMapping[key] = value(different[key]);
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
        cursesKeyMapping[key] = shifted(differentShifted[key]);
    }

    // a-z
    for (var i = 97; i <= 122; i++) {
        var code = i - (97 - 65);
        cursesKeyMapping[i] = value(code);
        cursesKeyMapping[i - 96] = ctrled(code);
    }

    // A-Z
    for (var i = 65; i <= 90; i++) {
        cursesKeyMapping[i] = shifted(i);
    }

    // Ctrl+M is the same code as enter, so these should go after
    var exact = [13, 32, 49, 50, 51, 52, 53, 54, 55, 56, 57];

    for (var i = 0; i < exact.length; i++) {
        cursesKeyMapping[exact[i]] = value(exact[i]);
    }
})();

function TerminalEjax() {
    this.cursor = { x: 0, y: 0 };
    this.setCursor(this.cursor.x, this.cursor.y);
    this.rows = curses.rows();
    this.columns = curses.columns();
    this.instance = new Ejax(this.rows, this.columns, this);
}

TerminalEjax.fn = TerminalEjax.prototype;

TerminalEjax.fn.setPixel = function(c, x, y) {
    curses.write(x, y, c);
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

TerminalEjax.main = function(args) {
    curses.keypad(true);
    curses.nonl();
    curses.cbreak();
    curses.noecho();
    curses.clear();
    curses.move(0, 0);
    curses.refresh();
    var termEjax = new TerminalEjax();
    // Temporary dummy content.
    //ejax.setBufferContent("\nThis is the content.\n\n\nThis is all the content.\n\nThis is testing all the content.\nThis is testing a really really super duper humungoid ungodly wham bam thank you ma'am ridonculously long line.\nAnd now short one.\n\<script\>alert(\"hello & world!\");\</script\>");
    var c = curses.read();
    var size = 0;

    while (c != -1) {
        var mappedKey = cursesKeyMapping["" + c];

        if (mappedKey && termEjax.keyDownFn) {
            termEjax.keyDownFn({
                keyCode: mappedKey.keyCode,
                ctrl: mappedKey.ctrl,
                alt: mappedKey.alt,
                shift: mappedKey.shift
            });
        } else {
            var str = "KEY: " + c + "\n";
            if (size < 24) {
                ejax.setBufferContent(ejax.getBufferContent() + str);
                size++;
            } else {
                size = 1;
                ejax.setBufferContent(str);
            }
        }

        c = curses.read();
    }
};
