function Server(options) {
    if (!options) {
        options = {};
    }

    this.port = options.port || 7010;
    this.routes = options.routes || new Routes();
    this.verbose = options.verbose;
    var possible = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    this.log("Generating secret...");
    var random = java.security.SecureRandom.getInstance("SHA1PRNG");
    this.secret = "";

    for (var i = 0; i < 32; i++) {
        this.secret += possible.charAt(random.nextInt(possible.length));
    }

    this.log(this.secret);
    this.server = new java.net.ServerSocket(this.port);
    this.executor = java.util.concurrent.Executors.newCachedThreadPool();
}

Server.fn = Server.prototype;

Server.fn.log = function(msg) {
    if (this.verbose) {
        println(msg);
    }
};

Server.fn.run = function() {
    while (true) {
        var socket = this.server.accept();
        var request = new Request(this, socket);
        this.executor.execute(function() {
            request.handle();
        });
    }
};

function Request(server, socket) {
    this.server = server;
    this.socket = socket;
}

Request.fn = Request.prototype;

Request.fn.handle = function(socket) {
    try {
        this.input = new java.io.BufferedInputStream(this.socket.getInputStream());
        this.out = new java.io.PrintWriter(new java.io.BufferedWriter(new java.io.OutputStreamWriter(this.socket.getOutputStream(), "UTF-8")));
        this.readType();
        var query = new String(this.readQuery());
        this.server.log("Handling request for: " + query);
        var path = query;
        var params = new Params();
        var queryStart = query.indexOf("?");

        if (queryStart >= 0) {
            path = query.substring(0, queryStart);
            params.parse(query.substring(queryStart + 1, query.length));
        }

        this.server.routes.route(this, path, params);
    } catch (e) {
        try {
            this.server.log("Uh oh: " + (e.message || e));

            if (!this.sentStatus) {
                this.status(500, "Internal error: " + (e.message || e));
            }
        } catch (e2) {
            this.server.log("Woah, double error: " + (e2.message || e2));
        }
    } finally {
        try {
            this.out.close();
            this.input.close();
        } finally {
            this.socket.close();
        }
    }
};

Request.fn.read = function() {
    var data = this.input.read();

    if (data < 0) {
        return null;
    }

    return java.lang.Character.toString(data);
};

Request.fn.readType = function() {
    var type = "";
    var c = this.read();

    while (c != null && c != " ") {
        type += c;
        c = this.read();
    }

    if (type.toLowerCase() != "get") {
        this.status(500, "Invalid request type: " + type);
        this.error();
        throw new Error("Invalid request type: " + type);
    }
};

Request.fn.readQuery = function() {
    var c = this.read();
    var query = new java.lang.StringBuilder();

    while (c != null && c != " ") {
        query.append(c);
        c = this.read();
    }

    return query.toString();
};

Request.fn.status = function(status, optionalMsg) {
    if (this.sentStatus) {
        return;
    }

    if (status == 200) {
        this.sentStatus = true;
        this.out.println("HTTP/1.0 200 OK");
        this.out.println("Content-Type: text/html; charset=UTF-8");
        this.out.println("Cache-Control: no-cache");
        this.out.println("Pragma: no-cache");
        this.out.println();
    } else if (status == 404) {
        this.sentStatus = true;
        this.out.println("HTTP/1.0 404 Not Found");
        this.out.println("Content-Type: text/html; charset=UTF-8");
        this.out.println("Cache-Control: no-cache");
        this.out.println("Pragma: no-cache");
        this.out.println();

        if (optionalMsg) {
            this.error("404: " + optionalMsg);
        }
    } else if (status == 500) {
        this.sentStatus = true;
        this.out.println("HTTP/1.0 500 Internal Server Error");
        this.out.println("Content-Type: text/html; charset=UTF-8");
        this.out.println("Cache-Control: no-cache");
        this.out.println("Pragma: no-cache");
        this.out.println();

        if (optionalMsg) {
            this.error("500: " + optionalMsg);
        }
    } else {
        this.server.log("Unknown status: " + status);
        status(500, "Unknown status: " + status);
        throw new Error("Error 500, unknown status.");
    }
};

Request.fn.error = function(msg) {
    if (!this.sentStatus) {
        this.status(500);
    }

    this.server.log("Error with message: " + msg);
    this.out.println();
    this.out.println("<html><body>");
    this.out.println(h(msg));
    this.out.println("</body></html>");
};

function Params() {
}

Params.fn = Params.prototype;

Params.fn.parse = function(str) {
    var args = str.split("&");
    var decode = function(x) { return new String(java.net.URLDecoder.decode(x, "UTF-8")); };

    for (var i = 0; i < args.length; i++) {
        var arg = args[i];

        if (arg == "") {
            continue;
        }

        var index = arg.indexOf("=");

        if (index < 0) {
            this[decode(arg)] = null;
        } else {
            this[decode(arg.substring(0, index))] = decode(arg.substring(index + 1, arg.length));
        }
    }
};

Params.fn.toString = function() {
    var result = new java.lang.StringBuilder();
    result.append("{");
    var first = true;

    for (var key in this) {
        if (!Params.prototype[key]) {
            if (!first) {
                result.append(", ");
            }

            result.append(key);
            result.append(": ");
            result.append(this[key]);
            first = false;
        }
    }

    result.append("}");
    return result.toString();
}

function Routes() {
    this.routes = {};
}

Routes.fn = Routes.prototype;

Routes.fn.to = function(path, fn) {
    this.routes[path] = fn;
};

Routes.fn.route = function(request, path, params) {
    request.server.log("Routing: " + path + " with params: " + params);

    if (!params.s || params.s != request.server.secret) {
        request.server.log("Secret " + params.s + " does not match " + request.server.secret);
        request.status(500, "Secret does not match!");
    } else if (this.routes[path]) {
        try {
            var content = this.routes[path]();
            if (!content) {
                request.server.log("Empty content at " + path);
                request.status(404, "Could not find: " + path);
            } else {
                request.status(200);
                request.out.println();
                request.out.println(content);
            }
        } catch(e) {
            request.server.log("Error from route " + path + ": " + (e.message || e));
            request.status(500, "Error from route " + path + ": " + (e.message || e));
        }
    } else {
        request.server.log("Nothing found at " + path);
        request.status(404, "Could not find: " + path);
    }
}

function h(str) {
    var result = new java.lang.StringBuilder();

    for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);

        if (c == "<") {
            result.append("&lt;");
        } else if (c == ">") {
            result.append("&gt;");
        } else if (c == "\"") {
            result.append("&quot;");
        } else if (c == "\'") {
            result.append("&#039;");
        } else if (c == "&") {
            result.append("&amp;");
        } else {
            result.append(c);
        }
    }

    return result.toString();
}
