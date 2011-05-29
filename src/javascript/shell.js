function Shell(options) {
    this.running = true;
    this.shellCommand = options.shellCommand || Shell.shellCommand;
    this.outputFn = options.outputFn;
    var builder = new java.lang.ProcessBuilder(this.shellCommand).redirectErrorStream(true);
    if (options.columns) {
        builder.environment().put("COLUMNS", "" + options.columns);
    }
    if (options.rows) {
        builder.environment().put("LINES", "" + options.rows);
    }
    this.process = builder.start();
    this.input = new java.io.PrintWriter(this.process.getOutputStream());
    this.outputThread = this.threadFor(this.process.getInputStream());
    var self = this;
    java.lang.Runtime.getRuntime().addShutdownHook(new java.lang.Thread(function() {
        self.process.destroy();
    }));
}

Shell.shellCommand = ["/bin/bash", "-s"];
Shell.READ_SLEEP_TIME = 20;

Shell.fn = Shell.prototype;

Shell.fn.terminate = function() {
    this.running = false;
    this.process.destroy();
};

Shell.fn.send = function(str) {
    this.input.print(str);
    this.input.flush();
};

Shell.fn.threadFor = function(stream) {
    var self = this;
    stream = new java.io.BufferedInputStream(stream);

    var thread = new java.lang.Thread(function() {
        while (self.running) {
            if (stream.available() <= 0) {
                java.lang.Thread.sleep(Shell.READ_SLEEP_TIME);
                continue;
            }

            var b = stream.read();

            if (b < 0) {
                // TODO: Close the shell or something perhaps
                break;
            }

            var str = [b];

            while (stream.available() > 0) {
                str.push(stream.read());
            }

            self.outputFn(new String(new java.lang.String(str, "US-ASCII")));
        }
    });

    thread.setDaemon(true);
    thread.start();
    return thread;
};
