load("mock-ejax.js");
load("ejax-core-complete.js");
load("file.js");

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

function testScreenContent() {
    mockEjax.ejax.setBufferContent("abc\n123\nxyz\n\ndef\n\n456\n");
    mockEjax.ejax.screen.clear();
    mockEjax.ejax.screen.redraw();
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    assertEquals("Screen row  0", "abc                                                                             ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "123                                                                             ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "xyz                                                                             ", mockEjax.pixelRow(2));
    assertEquals("Screen row  3", "                                                                                ", mockEjax.pixelRow(3));
    assertEquals("Screen row  4", "def                                                                             ", mockEjax.pixelRow(4));
    assertEquals("Screen row  5", "                                                                                ", mockEjax.pixelRow(5));
    assertEquals("Screen row  6", "456                                                                             ", mockEjax.pixelRow(6));
    assertEquals("Screen row  7", "                                                                                ", mockEjax.pixelRow(7));
    assertEquals("Screen row  8", "                                                                                ", mockEjax.pixelRow(8));
    assertEquals("Screen row  9", "                                                                                ", mockEjax.pixelRow(9));
    assertEquals("Screen row 10", "                                                                                ", mockEjax.pixelRow(10));
    assertEquals("Screen row 11", "                                                                                ", mockEjax.pixelRow(11));
    assertEquals("Screen row 12", "                                                                                ", mockEjax.pixelRow(12));
    assertEquals("Screen row 13", "                                                                                ", mockEjax.pixelRow(13));
    assertEquals("Screen row 14", "                                                                                ", mockEjax.pixelRow(14));
    assertEquals("Screen row 15", "                                                                                ", mockEjax.pixelRow(15));
    assertEquals("Screen row 16", "                                                                                ", mockEjax.pixelRow(16));
    assertEquals("Screen row 17", "                                                                                ", mockEjax.pixelRow(17));
    assertEquals("Screen row 18", "                                                                                ", mockEjax.pixelRow(18));
    assertEquals("Screen row 19", "                                                                                ", mockEjax.pixelRow(19));
    assertEquals("Screen row 20", "                                                                                ", mockEjax.pixelRow(20));
    assertEquals("Screen row 21", "                                                                                ", mockEjax.pixelRow(21));
    assertEquals("Screen row 22", " *scratch*    (Fundamental)-----------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "                                                                                ", mockEjax.pixelRow(23));
}

function testScreenAfterStartingCommand() {
    mockEjax.ejax.screen.clear();
    mockEjax.ejax.screen.redraw();
    mockEjax.onKeyDown({ keyCode: 88, ctrl: true, alt: false, shift: false });
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    assertEquals("Screen row 22", " *scratch*    (Fundamental)-----------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "C-x-                                                                            ", mockEjax.pixelRow(23));
}

function testScreenAfterCallingInvalidCommand() {
    mockEjax.ejax.screen.clear();
    mockEjax.ejax.screen.redraw();
    mockEjax.onKeyDown({ keyCode: 88, ctrl: true, alt: false, shift: false });
    mockEjax.onKeyDown({ keyCode: 72, ctrl: true, alt: false, shift: false });
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    assertEquals("Screen row 22", " *scratch*    (Fundamental)-----------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "C-xC-h is undefined                                                             ", mockEjax.pixelRow(23));
}

function testScreenAfterCallingInvalidCommandThenTyping() {
    mockEjax.ejax.screen.clear();
    mockEjax.ejax.screen.redraw();
    mockEjax.onKeyDown({ keyCode: 88, ctrl: true, alt: false, shift: false });
    mockEjax.onKeyDown({ keyCode: 72, ctrl: true, alt: false, shift: false });
    mockEjax.onKeyDown({ keyCode: 72, ctrl: false, alt: false, shift: false });
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    assertEquals("Screen row  0", "h                                                                               ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "                                                                                ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "                                                                                ", mockEjax.pixelRow(2));
    assertEquals("Screen row  3", "                                                                                ", mockEjax.pixelRow(3));
    assertEquals("Screen row  4", "                                                                                ", mockEjax.pixelRow(4));
    assertEquals("Screen row  5", "                                                                                ", mockEjax.pixelRow(5));
    assertEquals("Screen row  6", "                                                                                ", mockEjax.pixelRow(6));
    assertEquals("Screen row  7", "                                                                                ", mockEjax.pixelRow(7));
    assertEquals("Screen row  8", "                                                                                ", mockEjax.pixelRow(8));
    assertEquals("Screen row  9", "                                                                                ", mockEjax.pixelRow(9));
    assertEquals("Screen row 10", "                                                                                ", mockEjax.pixelRow(10));
    assertEquals("Screen row 11", "                                                                                ", mockEjax.pixelRow(11));
    assertEquals("Screen row 12", "                                                                                ", mockEjax.pixelRow(12));
    assertEquals("Screen row 13", "                                                                                ", mockEjax.pixelRow(13));
    assertEquals("Screen row 14", "                                                                                ", mockEjax.pixelRow(14));
    assertEquals("Screen row 15", "                                                                                ", mockEjax.pixelRow(15));
    assertEquals("Screen row 16", "                                                                                ", mockEjax.pixelRow(16));
    assertEquals("Screen row 17", "                                                                                ", mockEjax.pixelRow(17));
    assertEquals("Screen row 18", "                                                                                ", mockEjax.pixelRow(18));
    assertEquals("Screen row 19", "                                                                                ", mockEjax.pixelRow(19));
    assertEquals("Screen row 20", "                                                                                ", mockEjax.pixelRow(20));
    assertEquals("Screen row 21", "                                                                                ", mockEjax.pixelRow(21));
    assertEquals("Screen row 22", " *scratch*    (Fundamental)-----------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "                                                                                ", mockEjax.pixelRow(23));
}

function testReadingParameterToLoadFile() {
    var currentX, currentY, loadedFilename;
    mockEjax.setCursor = function(x, y) {
        currentX = x;
        currentY = y;
    };
    mockEjax.file = function(filename) {
        loadedFilename = filename;
        return new File("src/test/javascript/testFile.txt");
    };
    mockEjax.ejax.setBufferContent("abc\n123\nxyz\n\ndef\n\n456\n");
    mockEjax.onKeyDown({ keyCode: 88, ctrl: true, alt: false, shift: false });
    mockEjax.onKeyDown({ keyCode: 70, ctrl: true, alt: false, shift: false });
    assertEquals("X cursor after C-xC-f", 11, currentX);
    assertEquals("Y cursor after C-xC-f", 23, currentY);
    mockEjax.ejax.screen.clear();
    mockEjax.ejax.screen.redraw();
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    assertEquals("Screen row 22", " *scratch*    (Fundamental)-----------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "Find file:                                                                      ", mockEjax.pixelRow(23));

    mockEjax.onKeyDown({ keyCode: 84, ctrl: false, alt: false, shift: false });
    mockEjax.onKeyDown({ keyCode: 69, ctrl: false, alt: false, shift: false });
    mockEjax.onKeyDown({ keyCode: 83, ctrl: false, alt: false, shift: false });
    mockEjax.onKeyDown({ keyCode: 84, ctrl: false, alt: false, shift: false });
    mockEjax.onKeyDown({ keyCode: 70, ctrl: false, alt: false, shift: true });
    mockEjax.onKeyDown({ keyCode: 73, ctrl: false, alt: false, shift: false });
    mockEjax.onKeyDown({ keyCode: 76, ctrl: false, alt: false, shift: false });
    mockEjax.onKeyDown({ keyCode: 69, ctrl: false, alt: false, shift: false });
    mockEjax.onKeyDown({ keyCode: 190, ctrl: false, alt: false, shift: false });
    mockEjax.onKeyDown({ keyCode: 84, ctrl: false, alt: false, shift: false });
    mockEjax.onKeyDown({ keyCode: 88, ctrl: false, alt: false, shift: false });
    mockEjax.onKeyDown({ keyCode: 84, ctrl: false, alt: false, shift: false });
    assertEquals("X cursor after typing filename", 23, currentX);
    assertEquals("Y cursor after typing filename", 23, currentY);
    mockEjax.ejax.screen.clear();
    mockEjax.ejax.screen.redraw();
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    assertEquals("Screen row 22", " *scratch*    (Fundamental)-----------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "Find file: testFile.txt                                                         ", mockEjax.pixelRow(23));

    mockEjax.onKeyDown({ keyCode: 13, ctrl: false, alt: false, shift: false });
    assertEquals("The loaded filename", "testFile.txt", loadedFilename);
    mockEjax.ejax.screen.clear();
    mockEjax.ejax.screen.redraw();
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    assertEquals("Screen row  0", "abc                                                                             ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "123                                                                             ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "                                                                                ", mockEjax.pixelRow(2));
    assertEquals("Screen row  3", "                                                                                ", mockEjax.pixelRow(3));
    assertEquals("Screen row  4", "                                                                                ", mockEjax.pixelRow(4));
    assertEquals("Screen row  5", "                                                                                ", mockEjax.pixelRow(5));
    assertEquals("Screen row  6", "                                                                                ", mockEjax.pixelRow(6));
    assertEquals("Screen row  7", "                                                                                ", mockEjax.pixelRow(7));
    assertEquals("Screen row  8", "                                                                                ", mockEjax.pixelRow(8));
    assertEquals("Screen row  9", "                                                                                ", mockEjax.pixelRow(9));
    assertEquals("Screen row 10", "                                                                                ", mockEjax.pixelRow(10));
    assertEquals("Screen row 11", "                                                                                ", mockEjax.pixelRow(11));
    assertEquals("Screen row 12", "                                                                                ", mockEjax.pixelRow(12));
    assertEquals("Screen row 13", "                                                                                ", mockEjax.pixelRow(13));
    assertEquals("Screen row 14", "                                                                                ", mockEjax.pixelRow(14));
    assertEquals("Screen row 15", "                                                                                ", mockEjax.pixelRow(15));
    assertEquals("Screen row 16", "                                                                                ", mockEjax.pixelRow(16));
    assertEquals("Screen row 17", "                                                                                ", mockEjax.pixelRow(17));
    assertEquals("Screen row 18", "                                                                                ", mockEjax.pixelRow(18));
    assertEquals("Screen row 19", "                                                                                ", mockEjax.pixelRow(19));
    assertEquals("Screen row 20", "                                                                                ", mockEjax.pixelRow(20));
    assertEquals("Screen row 21", "                                                                                ", mockEjax.pixelRow(21));
    assertEquals("Screen row 22", " testFile.txt    (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "                                                                                ", mockEjax.pixelRow(23));
}
