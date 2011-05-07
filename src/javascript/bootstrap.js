var load;
var bootstrap = {};

(function () {
    var loadedFiles = {};

    bootstrap.canonicalPath = function(filename) {
        var file = new java.io.File(filename);

        if (file.exists() && file.isFile()) {
            return file.getCanonicalPath();
        }

        var url = java.lang.Thread.currentThread().getContextClassLoader().getResource(filename);

        if (url != null) {
            return url.toString();
        }

        var paths = java.lang.System.getProperty("java.class.path").split(java.lang.System.getProperty("path.separator"));
        var filenameWithSeparator = new java.lang.String(filename);

        if (!filenameWithSeparator.startsWith(java.io.File.separator)) {
            filenameWithSeparator = java.io.File.separator + filenameWithSeparator;
        }

        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            var pathFile = new java.io.File(path);

            if (!pathFile.exists()) {
                continue;
            }

            if (pathFile.isFile() && pathFile.getCanonicalPath().endsWith(filenameWithSeparator)) {
                return pathFile.getCanonicalPath();
            } else if (pathFile.isDirectory()) {
                file = new java.io.File(pathFile, filename);

                if (file.exists() && file.isFile()) {
                    return file.getCanonicalPath();
                }
            }
        }

        throw new Error("Cannot find canonical path to '" + filename + "'");
    };

    bootstrap.reader = function(filename) {
        var file = new java.io.File(filename);

        if (file.exists() && file.isFile()) {
            return new java.io.FileReader(file);
        }

        var stream = java.lang.Thread.currentThread().getContextClassLoader().getResourceAsStream(filename);

        if (stream != null) {
            return new java.io.InputStreamReader(stream);
        }

        var paths = java.lang.System.getProperty("java.class.path").split(java.lang.System.getProperty("path.separator"));
        var filenameWithSeparator = new java.lang.String(filename);

        if (!filenameWithSeparator.startsWith(java.io.File.separator)) {
            filenameWithSeparator = java.io.File.separator + filenameWithSeparator;
        }

        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            var pathFile = new java.io.File(path);

            if (!pathFile.exists()) {
                continue;
            }

            if (pathFile.isFile() && pathFile.getCanonicalPath().endsWith(filenameWithSeparator)) {
                return new java.io.FileReader(pathFile);
            } else if (pathFile.isDirectory()) {
                file = new java.io.File(pathFile, filename);

                if (file.exists() && file.isFile()) {
                    return new java.io.FileReader(file);
                }
            }
        }

        throw new Error("Cannot find file to load reader for '" + filename + "'");
    };


    load = function() {
        for (var i = 0; i < arguments.length; i++) {
            var fullPath = bootstrap.canonicalPath(arguments[i]);

            if (!loadedFiles[fullPath]) {
                loadedFiles[fullPath] = true;
                scriptEngine.eval(bootstrap.reader(arguments[i]));
            }
        }
    };
})();
