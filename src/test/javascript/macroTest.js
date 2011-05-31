load("mock-ejax.js");
load("ejax-core-complete.js");

var mockEjax;

function setUp() {
    ejax = null;
    mockEjax = new MockEjax();
    mockEjax.setPixel = function(c, x, y) {
        this.pixels = this.pixels || {};
        this.pixels[y] = this.pixels[y] || {};
        this.pixels[y][x] = c;
        this.pixels[y].maxX = this.pixels[y].maxX || 0;
        this.pixels[y].maxX = Math.max(x, this.pixels[y].maxX);
        this.pixels.maxY = this.pixels.maxY || 0;
        this.pixels.maxY = Math.max(y, this.pixels.maxY);
    };

    mockEjax.setPixels = function(str, x, y) {
        for (var i = 0; i < str.length; i++) {
            this.setPixel(str.charAt(i), x + i, y);
        }
    };

    mockEjax.pixelRow = function(y) {
        if (y > this.pixels.maxY) {
            fail("" + y + " is outside the max y value of " + this.pixels.maxY);
        }

        var result = "";
        var row = this.pixels[y];

        for (var x = 0; x <= row.maxX; x++) {
            result += row[x];
        }

        return result;
    };
}

function testBeginEndRunMacro() {
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("C-x(acLEFTbRIGHT");
    assertEquals("Screen row  0", "abc                                                                             ", mockEjax.pixelRow(0));
    mockEjax.fireKeyDowns("C-x)");
    assertEquals("Screen row  0", "abc                                                                             ", mockEjax.pixelRow(0));
    mockEjax.fireKeyDowns("C-xe");
    assertEquals("Screen row  0", "abcabc                                                                          ", mockEjax.pixelRow(0));
    mockEjax.fireKeyDowns("C-xe");
    assertEquals("Screen row  0", "abcabcabc                                                                       ", mockEjax.pixelRow(0));
}

function testBeginRingBellForInvalidCommandEndRunMacro() {
}

function testBeginRingBellFromCommandEndRunMacro() {
}

function testBeginQuitCommandEndRunMacro() {
}
