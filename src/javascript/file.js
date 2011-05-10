function File(filename) {
    this.filename = filename;
}

File.fn = File.prototype;

File.fn.getJFile = function() {
    if (this.jFile) {
        return this.jFile;
    }

    this.jFile = new java.io.File(this.filename);
    return this.jFile;
};

File.fn.name = function() {
    return new String(this.getJFile().getName());
};

File.fn.exists = function() {
    return this.getJFile().exists();
};

File.fn.isDirectory = function() {
    return this.getJFile().isDirectory();
};

File.fn.isFile = function() {
    return this.getJFile().isFile();
};

File.fn.contents = function() {
    if (!this.exists()) {
        return "";
    }

    if (this.isDirectory()) {
        throw new Error("Cannot open a directory!");
    }

    var reader = new java.io.BufferedReader(new java.io.FileReader(this.getJFile()));

    try {
        var line = reader.readLine();
        var result = new java.lang.StringBuilder();

        while (line != null) {
            result.append(line);
            result.append("\n");
            line = reader.readLine();
        }

        return new String(result.toString());
    } finally {
        reader.close();
    }
};

File.fn.save = function(contents) {
    var writer = new java.io.FileWriter(this.getJFile());

    try {
        writer.write(contents, 0, contents.length);
        writer.flush();
    } finally {
        writer.close();
    }
};
