var HtmlEjax;

(function($) {
    var COLUMNS = 80;
    var ROWS = 24;

    HtmlEjax = function(element) {
        this.element = element;
        this.$element = $(element);
        this.$element.html("<pre></pre>");
        this.$screen = $("pre", this.$element);
        this.screen = [];
        this.rows = ROWS;
        this.columns = COLUMNS;
        this.$screen.css({ color: "black", backgroundColor: "white" });

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
                $(".cursor", self.$element).css({ color: "black", backgroundColor: "white" });
            } else {
                $(".cursor", self.$element).css({ color: "white", backgroundColor: "black" });
            }

            toggle = !toggle;
        }, 500);
    }

    HtmlEjax.fn = HtmlEjax.prototype;

    HtmlEjax.fn.clear = function() {
        $(".pixel", this.$element).html(" ");
    };

    HtmlEjax.fn.redrawBuffer = function(buffer) {
        var x = 0;
        var y = 0;
        var i = buffer.startingIndex();

        while (true) {
            var c = buffer.charAt(i);

            if (c == null) {
                break;
            } else if (c == "\n") {
                y++;
                x = 0;
            } else {
                this.screen[x][y].html(c);
                x++;
            }

            if (x >= this.columns) {
                x = 0;
                y++;
                i = buffer.indexAfterNext("\n", i + 1);
            } else {
                i++;
            }

            if (y >= this.rows) {
                break;
            }
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

        $(".cursor", this.$element).removeClass("cursor").css({ color: "black", backgroundColor: "white" });
        this.screen[x][y].addClass("cursor").css({ color: "white", backgroundColor: "black" });
    };

    $.fn.ejax = function() {
        if (ejax) {
            return this;
        }

        this[0].ejax = new HtmlEjax(this[0]);
        return this;
    };
})(jQuery);
