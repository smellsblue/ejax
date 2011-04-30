// njs stands for Native JavaScript, since native is reserved.
var njs = njs || {};
njs.out = njs.out || java.lang.System.out;

njs.charToString = njs.charToString || function(c) {
    return java.lang.Character.toString(c);
};

njs.fileExists = njs.fileExists || function(file) {
    return njs.isFile(file) && file.exists() && file.isFile();
};

njs.getResource = njs.getResource || function(filename) {
    return java.lang.Thread.currentThread().getContextClassLoader().getResource(filename);
};

njs.getResourceAsStream = njs.getResourceAsStream || function(filename) {
    return java.lang.Thread.currentThread().getContextClassLoader().getResourceAsStream(filename);
};

njs.isDigit = njs.isDigit || function(c) {
    return java.lang.Character.isDigit(c);
};

njs.isFile = njs.isFile || function(obj) {
    return obj instanceof java.io.File;
};

njs.isLetter = njs.isLetter || function(c) {
    return java.lang.Character.isLetter(c);
};

njs.isLowerCase = njs.isLowerCase || function(c) {
    return java.lang.Character.isLowerCase(c);
};

njs.isReader = njs.isReader || function(obj) {
    return obj instanceof java.io.Reader;
};

njs.isUpperCase = njs.isUpperCase || function(c) {
    return java.lang.Character.isUpperCase(c);
};

njs.isWhitespace = njs.isWhitespace || function(c) {
    return java.lang.Character.isWhitespace(c);
};

njs.newEngine = njs.newEngine || function() {
    return org.safari.javascript.Execute.newEngine();
};

njs.newFile = njs.newFile || function() {
    if (arguments.length == 1) {
        return new java.io.File(arguments[0]);
    } else if (arguments.length == 2) {
        return new java.io.File(arguments[0], arguments[1]);
    }

    return null;
};

njs.newFileReader = njs.newFileReader || function(arg) {
    return new java.io.FileReader(arg);
};

njs.newInputStreamReader = njs.newInputStreamReader || function(inputStream) {
    return new java.io.InputStreamReader(inputStream);
};

njs.newPrintWriter = njs.newPrintWriter || function(obj) {
    return new java.io.PrintWriter(obj);
};

njs.newStringBuilder = njs.newStringBuilder || function() {
    return new java.lang.StringBuilder();
};

njs.newStringReader = njs.newStringReader || function(contents) {
    return new java.io.StringReader(contents);
};

njs.newStringWriter = njs.newStringWriter || function() {
    return new java.io.StringWriter();
};

njs.readFileToString = njs.readFileToString || function(file) {
    return org.apache.commons.io.FileUtils.readFileToString(file);
};

njs.readLines = njs.readLines || function(reader) {
    return org.apache.commons.io.IOUtils.readLines(reader);
};

njs.toCharArray = njs.toCharArray || function(obj) {
    return org.apache.commons.io.IOUtils.toCharArray(obj);
};

njs.urlToFile = njs.urlToFile || function(url) {
    return org.apache.commons.io.FileUtils.toFile(url);
};

var core = core || {};
core.context = core.context || this;
core.engine = core.engine || scriptEngine;
core.webappsDirectory = core.webappsDirectory || "webapps";
core.loaded = core.loaded || {};

core.absoluteFile = core.absoluteFile || function() {
    if (arguments.length < 1) {
        throw new Error("Must have at least 1 argument to absoluteFile!");
    }

    var file = njs.newFile(arguments[0]);

    for (var i = 1; i < arguments.length; i++) {
        file = njs.newFile(file, arguments[i]);
    }

    return file;
};

core.explicitFile = core.explicitFile || function(filename) {
    var file = njs.newFile(filename);

    if (njs.fileExists(file)) {
        return file;
    }

    return null;
};

core.file = core.file || function(filename) {
    var file = core.explicitFile(filename);

    if (file != null) {
        return file;
    }

    return core.resourceFile(filename);
};

core.load = core.load || function() {
    for (var i = 0; i < arguments.length; i++) {
        var filename = arguments[i];
        var file = core.file(filename);
        var fullPath = file.getAbsolutePath();

        if (!core.loaded[fullPath]) {
            if (core.context.log && core.context.log.debug) {
                log.debug("Loading file '" + fullPath + "'");
            }

            core.loaded[fullPath] = true;
            var contents = njs.readFileToString(file);
            core.engine.eval(contents);
        }
    }
};

core.newEngine = core.newEngine || function() {
    return njs.newEngine();
};

core.propertiesToString = core.propertyList || function(obj) {
    var properties = [];

    for (var property in obj) {
        properties.push(property);
    }

    return properties.reduce(function(all, current) { return "" + all + ", " + current; });
};

core.reader = core.reader || function(filename) {
    if (njs.isReader(filename)) {
        return filename;
    }

    if (njs.isFile(filename)) {
        return njs.newFileReader(filename);
    }

    var file = core.explicitFile(filename);

    if (file != null) {
        return njs.newFileReader(file);
    }

    var input = njs.getResourceAsStream(filename);
    return njs.newInputStreamReader(input);
};

core.resourceFile = core.resourceFile || function(filename) {
    var url = njs.getResource(filename);
    return njs.newFile(url.toURI());
};

core.unload = core.unload || function(filename) {
    var file = core.file(filename);
    var fullPath = file.getAbsolutePath();
    core.loaded[fullPath] = undefined;

    if (core.context.log && core.context.log.debug) {
        log.debug("Unloaded file '" + fullPath + "'");
    }
};

function load() {
    core.load.apply(this, arguments);
}

function main(args) {
    println("testing");
}
