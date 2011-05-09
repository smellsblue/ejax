function Logger(io, options) {
    if (!options) {
        options = {};
    }

    this.io = io;
    this.enabled = options.enabled || false;
    this.level = options.level || Logger.DEBUG;
}

var logger = new Logger({ println: function(msg) { } });

function setLogger(l) {
    logger = l;
}

Logger.LEVELS = ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"];

Logger.fn = Logger.prototype;

for (var i = 0; i < Logger.LEVELS.length; i++) {
    var levelValue = i;
    var level = Logger.LEVELS[i];
    Logger[level] = i;

    Logger.fn[level.toLowerCase()] = function(msg, e) {
        this.log(levelValue, msg, e);
    };
}

Logger.fn.log = function(level, msg, e) {
    if (!this.enabled) {
        return;
    }

    if (level < this.level) {
        return;
    }

    var error = "";

    if (e) {
        error += "\n" + e;
    }

    this.io.println(new Date() + " [" + Logger.LEVELS[level] + "]: " + msg + error);
};
