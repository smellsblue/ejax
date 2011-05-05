var BrowserEjax = {};

BrowserEjax.file = function(file) {
    return org.ejax.javascript.Execute.fileContents(file);
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
        }
    }

    var server = new Server(options);
    server.routes.to("/", function() { return BrowserEjax.template(BrowserEjax.file("ejax.html"), { secret: server.secret }); });
    server.routes.to("/ejax-complete-min.js", function() { return BrowserEjax.file("ejax-complete-min.js"); });
    var url = "http://localhost:" + server.port + "/?s=" + server.secret;
    server.log("Starting url for ejax: " + url);
    java.lang.Runtime.getRuntime().exec(["google-chrome", url]);
    server.run();
};
