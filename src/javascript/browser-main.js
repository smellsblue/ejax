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
    }

    return file;
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
    var url = "http://localhost:" + server.port + "/?s=" + server.secret;
    server.log("Starting url for ejax: " + url);
    java.lang.Runtime.getRuntime().exec(["google-chrome", url]);
    server.run();
};
