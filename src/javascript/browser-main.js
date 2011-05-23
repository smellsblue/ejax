var BrowserEjax = {};

BrowserEjax.fileContents = function(filename) {
    var reader = new java.io.BufferedReader(bootstrap.reader(filename));

    try {
        var line = reader.readLine();
        var result = new java.lang.StringBuilder();

        while (line != null) {
            result.append(line);
            result.append("\n");
            line = reader.readLine();
        }

        return result.toString();
    } finally {
        reader.close();
    }
};

BrowserEjax.template = function(file, template) {
    for (var key in template) {
        file = file.replaceAll("\\{\\{" + key + "\\}\\}", template[key]);
        file = file.replaceAll("\\{\\{h:" + key + "\\}\\}", h(template[key]));
    }

    return file;
};

BrowserEjax.getFileName = function(params) {
    var result = new java.lang.StringBuilder();
    result.append('{ "result": "');
    result.append(js(new File(params.filename).name()));
    result.append('" }');
    return result.toString();
};

BrowserEjax.entries = function(params) {
    var result = new java.lang.StringBuilder();
    result.append('{ "result": [');
    var entries = new File(params.filename).entries();

    if (entries.length > 0) {
        result.append('"');
        result.append(js(entries[0]));
        result.append('"');
    }

    for (var i = 1; i < entries.length; i++) {
        result.append(', "');
        result.append(js(entries[i]));
        result.append('"');
    }

    result.append('] }');
    return result.toString();
};

BrowserEjax.getFileContents = function(params) {
    var result = new java.lang.StringBuilder();
    result.append('{ "result": "');
    result.append(js(new File(params.filename).contents()));
    result.append('" }');
    return result.toString();
};

BrowserEjax.saveFileContents = function(params) {
    new File(params.filename).save(params.contents);
    var result = new java.lang.StringBuilder();
    result.append('{ "result": "success" }');
    return result.toString();
};

BrowserEjax.separator = function(params) {
    var result = new java.lang.StringBuilder();
    result.append('{ "result": "');
    result.append(js(new String(java.io.File.separator)));
    result.append('" }');
    return result.toString();
};

BrowserEjax.main = function(args) {
    var options = {};

    for (var i = 0; i < args.length; i++) {
        var arg = args[i];

        if (arg == "-v" || arg == "--verbose") {
            options.verbose = true;
        } else if (arg == "-p" || arg == "--port") {
            i++;
            options.port = parseInt(args[i], 10);
        } else if (arg == "-s" || arg == "--secret") {
            i++;
            options.secret = args[i];
        }
    }

    var server = new Server(options);
    server.routes.to("/", function() { return BrowserEjax.template(BrowserEjax.fileContents("ejax.html"), { secret: server.secret }); });
    server.routes.to("/ejax-complete-min.js", function() { return BrowserEjax.fileContents("ejax-complete-min.js"); });
    server.routes.to("/file/name", BrowserEjax.getFileName);
    server.routes.to("/file/entries", BrowserEjax.entries);
    server.routes.to("/file/contents", BrowserEjax.getFileContents);
    server.routes.to("/file/save", BrowserEjax.saveFileContents);
    server.routes.to("/file/separator", BrowserEjax.separator);
    var url = "http://localhost:" + server.port + "/?s=" + server.secret;
    server.log("Starting url for ejax: " + url);
    java.lang.Runtime.getRuntime().exec(["xdg-open", url]);
    server.run();
};
