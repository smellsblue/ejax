function MockEjax(options) {
    var content = null;
    var rows = 24;
    var columns = 80;

    if (options && options.content) {
        content = options.content;
    }

    if (options && options.rows) {
        rows = options.rows;
    }

    if (options && options.columns) {
        columns = options.columns;
    }

    this.ejax = new Ejax(rows, columns, this);

    if (content) {
        this.ejax.setBufferContent(content);
    }
}

MockEjax.fn = MockEjax.prototype;

MockEjax.fn.separator = function() {
    return new String(java.io.File.separator);
};

MockEjax.fn.setPixel = function(c, x, y, options) {
};

MockEjax.fn.setPixels = function(str, x, y, options) {
};

MockEjax.fn.registerKeyDown = function(fn) {
    this.onKeyDown = fn;
};

MockEjax.fn.setCursor = function(x, y) {
};

MockEjax.fn.file = function(filename) {
};

var prepared = false;
var charToCode = {};
var charToShifted = {};

function prepareCodes() {
    if (prepared) {
        return;
    }

    prepared = true;

    for (var key in keyboard.standard.codeToKey) {
        charToCode[keyboard.standard.codeToKey[key]] = key;
    }

    for (var key in keyboard.standard.codeToShiftedKey) {
        charToCode[keyboard.standard.codeToShiftedKey[key]] = key;
        charToShifted[keyboard.standard.codeToShiftedKey[key]] = true;
    }

    for (var key in keyboard.standard.codeToToken) {
        charToCode[Token.specialKeys[keyboard.standard.codeToToken[key]]] = key;
    }
}

MockEjax.fn.fireKeyDowns = function(keys) {
    prepareCodes();
    var tokens = parseBinding(keys);

    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        this.onKeyDown({ keyCode: charToCode[token.key], ctrl: token.control, alt: token.meta, shift: charToShifted[token] });
    }
};
