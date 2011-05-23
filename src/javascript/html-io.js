var HtmlEjax;

(function($) {
    var NORMAL_COLORS = { color: "black", backgroundColor: "white" };
    var INVERTED_COLORS = { color: "white", backgroundColor: "black" };
    var COLUMNS = 80;
    var ROWS = 24;

    var AjaxFile = function(filename, secret) {
        this.filename = filename;
        this.secret = secret;
    };

    AjaxFile.fn = AjaxFile.prototype;

    AjaxFile.fn.ajax = function(action, data) {
        if (!data) {
            data = {};
        }

        data.s = this.secret;
        data.filename = this.filename;

        var result = $.ajax({
            async: false,
            data: data,
            dataType: "json",
            type: "GET",
            url: "/file/" + action
        });
        return eval("[" + result.responseText + "]")[0].result;
    };

    AjaxFile.fn.name = function() {
        return this.ajax("name");
    };

    AjaxFile.fn.entries = function() {
        return this.ajax("entries");
    };

    AjaxFile.fn.contents = function() {
        return this.ajax("contents");
    };

    AjaxFile.fn.save = function(contents) {
        this.ajax("save", { contents: contents });
    };

    HtmlEjax = function(element, secret) {
        this.secret = secret;
        this.element = element;
        this.$element = $(element);
        this.$element.html("<pre></pre>");
        this.$screen = $("pre", this.$element);
        this.screen = [];
        this.rows = ROWS;
        this.columns = COLUMNS;
        this.$screen.css(NORMAL_COLORS);

        for (var y = 0; y < this.rows; y++) {
            for (var x = 0; x < this.columns; x++) {
                var pixel = $('<span class="pixel pixel-' + x + '-' + y + '"> </span>');
                this.screen[x] = this.screen[x] || [];
                this.screen[x][y] = pixel;
                this.$screen.append(pixel);
            }

            this.$screen.append("\n");
        }

        this.instance = new Ejax(this.rows, this.columns, this);
        var toggle = false;
        var self = this;

        setInterval(function() {
            if (toggle) {
                $(".cursor", self.$element).css(NORMAL_COLORS);
            } else {
                $(".cursor", self.$element).css(INVERTED_COLORS);
            }

            toggle = !toggle;
        }, 500);
    };

    HtmlEjax.fn = HtmlEjax.prototype;

    var escapables = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;"
    };

    HtmlEjax.fn.separator = function() {
        if (this.fileSeparator) {
            return this.fileSeparator;
        }

        var result = $.ajax({
            async: false,
            data: { s: this.secret },
            dataType: "json",
            type: "GET",
            url: "/file/separator"
        });

        var result = eval("[" + result.responseText + "]")[0].result;
        this.fileSeparator = result;
        return result;
    };

    HtmlEjax.fn.setPixel = function(c, x, y, options) {
        if (escapables[c]) {
            c = escapables[c];
        }

        var colors = NORMAL_COLORS;

        if (options.invert) {
            colors = INVERTED_COLORS;
        }

        this.screen[x][y].html(c).css(colors);
    };

    HtmlEjax.fn.setPixels = function(str, x, y, options) {
        var colors = NORMAL_COLORS;

        if (options.invert) {
            colors = INVERTED_COLORS;
        }

        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);

            if (escapables[c]) {
                c = escapables[c];
            }

            this.screen[x + i][y].html(c).css(colors);
        }
    };

    HtmlEjax.fn.registerKeyDown = function(fn) {
        var alt = false;
        var ctrl = false;
        var shift = false;

        $(window).blur(function() {
            alt = false;
            ctrl = false;
            shift = false;
        });
        $(window).keyup(function(event) {
            if (event.which == 18) {
                alt = false;
            } else if (event.which == 17) {
                ctrl = false;
            } else if (event.which == 16) {
                shift = false;
            }
            return false;
        });
        $(window).keydown(function(event) {
            try {
                if (event.which == 18) {
                    alt = true;
                } else if (event.which == 17) {
                    ctrl = true;
                } else if (event.which == 16) {
                    shift = true;
                } else {
                    fn({
                        keyCode: event.which,
                        ctrl: ctrl,
                        alt: alt,
                        shift: shift
                    });
                }
            } catch (e) {
                if (console && console.log) {
                    console.log("Error during keydown.", e, e.stack);
                }
            }
            return false;
        });
        $(window).keypress(function(event) {
            return false;
        });
    };

    HtmlEjax.fn.setCursor = function(x, y) {
        if (x < 0 || y < 0 || x >= this.columns || y >= this.rows) {
            throw new Error("Cursor out of range: " + x + ", " + y);
        }

        $(".cursor", this.$element).removeClass("cursor").css(NORMAL_COLORS);
        this.screen[x][y].addClass("cursor").css(INVERTED_COLORS);
    };

    HtmlEjax.fn.beep = function() {
        // TODO
    };

    HtmlEjax.fn.file = function(filename) {
        return new AjaxFile(filename, this.secret);
    };

    HtmlEjax.fn.exit = function() {
        // TODO
    };

    $.fn.ejax = function(secret) {
        if (ejax) {
            return this;
        }

        setLogger(new Logger({
            println: function(msg) {
                console.log(msg);
            }
        }));

        this[0].ejax = new HtmlEjax(this[0], secret);
        return this;
    };
})(jQuery);
