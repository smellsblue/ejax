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

function testScreenContent() {
    mockEjax.ejax.setBufferContent("abc\n123\nxyz\n\ndef\n\n456\n");
    mockEjax.ejax.screen.hardRedraw();
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
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "                                                                                ", mockEjax.pixelRow(23));
}

function testScreenAfterStartingCommand() {
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("C-x");
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "C-x-                                                                            ", mockEjax.pixelRow(23));
}

function testScreenAfterCallingInvalidCommand() {
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("C-xC-h");
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "C-xC-h is undefined                                                             ", mockEjax.pixelRow(23));
}

function testScreenAfterCallingSingleInvalidCommand() {
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("M-\"");
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "M-\" is undefined                                                                ", mockEjax.pixelRow(23));
}

function testScreenAfterCallingInvalidCommandThenTyping() {
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("C-xC-hh");
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
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
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
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("C-xC-f");
    assertEquals("X cursor after C-xC-f", 11, currentX);
    assertEquals("Y cursor after C-xC-f", 23, currentY);
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "Find file:                                                                      ", mockEjax.pixelRow(23));

    mockEjax.fireKeyDowns("testFiBSPilLEFTDELle.txt");
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "Find file: testFile.txt                                                         ", mockEjax.pixelRow(23));
    assertEquals("X cursor after typing filename", 23, currentX);
    assertEquals("Y cursor after typing filename", 23, currentY);

    mockEjax.fireKeyDowns("RET");
    assertEquals("The loaded filename", "testFile.txt", loadedFilename);
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
    assertEquals("Screen row 22", " testFile.txt    L1 (Fundamental)-----------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "                                                                                ", mockEjax.pixelRow(23));
}

function testScrollingVertically() {
    var currentX, currentY;
    mockEjax.setCursor = function(x, y) {
        currentX = x;
        currentY = y;
    };
    var content = "";

    for (var i = 1; i < 100; i++) {
        content += "" + i + "\n";
    }

    var assertContent = function(startValue, lineNumber) {
        for (var i = 0; i < 21; i++) {
            var line = "" + (i + startValue);

            while (line.length < 80) {
                line += " ";
            }

            assertEquals("Screen row  " + i, line, mockEjax.pixelRow(i));
        }

        var expectedLine = " *scratch*    L" + lineNumber + " (Fundamental)";

        while (expectedLine.length < 80) {
            expectedLine += "-";
        }

        assertEquals("Screen row 22", expectedLine, mockEjax.pixelRow(22));
        assertEquals("Screen row 23", "                                                                                ", mockEjax.pixelRow(23));
    };

    mockEjax.ejax.setBufferContent(content);
    mockEjax.ejax.screen.hardRedraw();
    assertContent(1, 1);

    for (var i = 0; i < 21; i++) {
        mockEjax.fireKeyDowns("DOWN");
    }

    assertEquals("X cursor after moving down 21 times", 0, currentX);
    assertEquals("Y cursor after moving down 21 times", 21, currentY);
    mockEjax.fireKeyDowns("DOWN");
    assertContent(17, 23);
    assertEquals("X cursor after moving down 22 times", 0, currentX);
    assertEquals("Y cursor after moving down 22 times", 6, currentY);

    for (var i = 0; i < 7; i++) {
        mockEjax.fireKeyDowns("UP");
    }

    assertContent(1, 16);
    assertEquals("X cursor after moving up 7 times", 0, currentX);
    assertEquals("Y cursor after moving up 7 times", 15, currentY);
}

function testScrollingHorizontally() {
    var currentX, currentY;
    mockEjax.setCursor = function(x, y) {
        currentX = x;
        currentY = y;
    };
    var content = "";

    var line = function(size) {
        for (var i = 0; i < size; i++) {
            content += "" + (i % 10);
        }

        content += "\n";
    };

    line(120);
    line(100);
    line(90);
    line(81);
    line(80);
    line(79);
    line(30);
    content += "\nabc\n\n";
    mockEjax.ejax.setBufferContent(content);
    mockEjax.ejax.screen.hardRedraw();

    assertEquals("Screen row 0", "0123456789012345678901234567890123456789012345678901234567890123456789012345678$", mockEjax.pixelRow(0));
    assertEquals("Screen row 1", "0123456789012345678901234567890123456789012345678901234567890123456789012345678$", mockEjax.pixelRow(1));
    assertEquals("Screen row 2", "0123456789012345678901234567890123456789012345678901234567890123456789012345678$", mockEjax.pixelRow(2));
    assertEquals("Screen row 3", "0123456789012345678901234567890123456789012345678901234567890123456789012345678$", mockEjax.pixelRow(3));
    assertEquals("Screen row 4", "0123456789012345678901234567890123456789012345678901234567890123456789012345678$", mockEjax.pixelRow(4));
    assertEquals("Screen row 5", "0123456789012345678901234567890123456789012345678901234567890123456789012345678 ", mockEjax.pixelRow(5));
    assertEquals("Screen row 6", "012345678901234567890123456789                                                  ", mockEjax.pixelRow(6));
    assertEquals("Screen row 7", "                                                                                ", mockEjax.pixelRow(7));
    assertEquals("Screen row 8", "abc                                                                             ", mockEjax.pixelRow(8));
    assertEquals("Screen row 9", "                                                                                ", mockEjax.pixelRow(9));
    assertEquals("Screen row 10", "                                                                                ", mockEjax.pixelRow(10));
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "                                                                                ", mockEjax.pixelRow(23));

    for (var i = 0; i < 78; i++) {
        mockEjax.fireKeyDowns("RIGHT");
    }

    assertEquals("Screen row 0", "0123456789012345678901234567890123456789012345678901234567890123456789012345678$", mockEjax.pixelRow(0));
    assertEquals("Screen row 1", "0123456789012345678901234567890123456789012345678901234567890123456789012345678$", mockEjax.pixelRow(1));
    assertEquals("Screen row 2", "0123456789012345678901234567890123456789012345678901234567890123456789012345678$", mockEjax.pixelRow(2));
    assertEquals("Screen row 3", "0123456789012345678901234567890123456789012345678901234567890123456789012345678$", mockEjax.pixelRow(3));
    assertEquals("Screen row 4", "0123456789012345678901234567890123456789012345678901234567890123456789012345678$", mockEjax.pixelRow(4));
    assertEquals("Screen row 5", "0123456789012345678901234567890123456789012345678901234567890123456789012345678 ", mockEjax.pixelRow(5));
    assertEquals("Screen row 6", "012345678901234567890123456789                                                  ", mockEjax.pixelRow(6));
    assertEquals("Screen row 7", "                                                                                ", mockEjax.pixelRow(7));
    assertEquals("Screen row 8", "abc                                                                             ", mockEjax.pixelRow(8));
    assertEquals("Screen row 9", "                                                                                ", mockEjax.pixelRow(9));
    assertEquals("Screen row 10", "                                                                                ", mockEjax.pixelRow(10));
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "                                                                                ", mockEjax.pixelRow(23));
    assertEquals("X cursor after moving right 78 times", 78, currentX);
    assertEquals("Y cursor after moving right 78 times", 0, currentY);

    mockEjax.fireKeyDowns("RIGHT");
    assertEquals("Screen row 0", "$12345678901234567890123456789012345678901234567890123456789                    ", mockEjax.pixelRow(0));
    assertEquals("Screen row 1", "$123456789012345678901234567890123456789                                        ", mockEjax.pixelRow(1));
    assertEquals("Screen row 2", "$12345678901234567890123456789                                                  ", mockEjax.pixelRow(2));
    assertEquals("Screen row 3", "$12345678901234567890                                                           ", mockEjax.pixelRow(3));
    assertEquals("Screen row 4", "$1234567890123456789                                                            ", mockEjax.pixelRow(4));
    assertEquals("Screen row 5", "$123456789012345678                                                             ", mockEjax.pixelRow(5));
    assertEquals("Screen row 6", "$                                                                               ", mockEjax.pixelRow(6));
    assertEquals("Screen row 7", "$                                                                               ", mockEjax.pixelRow(7));
    assertEquals("Screen row 8", "$                                                                               ", mockEjax.pixelRow(8));
    assertEquals("Screen row 9", "$                                                                               ", mockEjax.pixelRow(9));
    assertEquals("Screen row 10", "                                                                                ", mockEjax.pixelRow(10));
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "                                                                                ", mockEjax.pixelRow(23));
    assertEquals("X cursor after moving right 79 times", 19, currentX);
    assertEquals("Y cursor after moving right 79 times", 0, currentY);

    for (var i = 0; i < 18; i++) {
        mockEjax.fireKeyDowns("LEFT");
    }

    assertEquals("Screen row 0", "$12345678901234567890123456789012345678901234567890123456789                    ", mockEjax.pixelRow(0));
    assertEquals("Screen row 1", "$123456789012345678901234567890123456789                                        ", mockEjax.pixelRow(1));
    assertEquals("Screen row 2", "$12345678901234567890123456789                                                  ", mockEjax.pixelRow(2));
    assertEquals("Screen row 3", "$12345678901234567890                                                           ", mockEjax.pixelRow(3));
    assertEquals("Screen row 4", "$1234567890123456789                                                            ", mockEjax.pixelRow(4));
    assertEquals("Screen row 5", "$123456789012345678                                                             ", mockEjax.pixelRow(5));
    assertEquals("Screen row 6", "$                                                                               ", mockEjax.pixelRow(6));
    assertEquals("Screen row 7", "$                                                                               ", mockEjax.pixelRow(7));
    assertEquals("Screen row 8", "$                                                                               ", mockEjax.pixelRow(8));
    assertEquals("Screen row 9", "$                                                                               ", mockEjax.pixelRow(9));
    assertEquals("Screen row 10", "                                                                                ", mockEjax.pixelRow(10));
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "                                                                                ", mockEjax.pixelRow(23));
    assertEquals("X cursor after moving left 18 times", 1, currentX);
    assertEquals("Y cursor after moving left 18 times", 0, currentY);

    mockEjax.fireKeyDowns("LEFT");
    assertEquals("Screen row 0", "0123456789012345678901234567890123456789012345678901234567890123456789012345678$", mockEjax.pixelRow(0));
    assertEquals("Screen row 1", "0123456789012345678901234567890123456789012345678901234567890123456789012345678$", mockEjax.pixelRow(1));
    assertEquals("Screen row 2", "0123456789012345678901234567890123456789012345678901234567890123456789012345678$", mockEjax.pixelRow(2));
    assertEquals("Screen row 3", "0123456789012345678901234567890123456789012345678901234567890123456789012345678$", mockEjax.pixelRow(3));
    assertEquals("Screen row 4", "0123456789012345678901234567890123456789012345678901234567890123456789012345678$", mockEjax.pixelRow(4));
    assertEquals("Screen row 5", "0123456789012345678901234567890123456789012345678901234567890123456789012345678 ", mockEjax.pixelRow(5));
    assertEquals("Screen row 6", "012345678901234567890123456789                                                  ", mockEjax.pixelRow(6));
    assertEquals("Screen row 7", "                                                                                ", mockEjax.pixelRow(7));
    assertEquals("Screen row 8", "abc                                                                             ", mockEjax.pixelRow(8));
    assertEquals("Screen row 9", "                                                                                ", mockEjax.pixelRow(9));
    assertEquals("Screen row 10", "                                                                                ", mockEjax.pixelRow(10));
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "                                                                                ", mockEjax.pixelRow(23));
    assertEquals("X cursor after moving left 19 times", 60, currentX);
    assertEquals("Y cursor after moving left 19 times", 0, currentY);
}

function testGotoBufferStartAndEnd() {
    var content = "";

    for (var i = 1; i < 100; i++) {
        content += "" + i + "\n";
    }
    content += "100";

    var assertContent = function(startValue, max, lineNumber) {
        for (var i = 0; i < 21; i++) {
            var line = "";

            if (i + startValue <= max) {
                line += (i + startValue);
            }

            while (line.length < 80) {
                line += " ";
            }

            assertEquals("Screen row  " + i, line, mockEjax.pixelRow(i));
        }

        var expectedLine = " *scratch*    L" + lineNumber + " (Fundamental)";

        while (expectedLine.length < 80) {
            expectedLine += "-";
        }

        assertEquals("Screen row 22", expectedLine, mockEjax.pixelRow(22));
        assertEquals("Screen row 23", "                                                                                ", mockEjax.pixelRow(23));
    };

    mockEjax.ejax.setBufferContent(content);
    mockEjax.ejax.screen.hardRedraw();
    assertContent(1, 22, 1);
    mockEjax.fireKeyDowns("M->");
    assertContent(80, 100, 100);
    assertEquals("Buffer X position after second buffer end", 3, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second buffer end", 99, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.fireKeyDowns("M-<");
    assertContent(1, 22, 1);
    assertEquals("Buffer X position after second buffer start", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second buffer start", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorY);

    // With just a couple lines
    content = "1\n2\n3\n4\n5\n6\n7\n8\n9\n";
    mockEjax.ejax.setBufferContent(content);
    mockEjax.ejax.screen.hardRedraw();
    assertContent(1, 9, 1);
    mockEjax.fireKeyDowns("M->");
    assertContent(1, 9, 10);
    assertEquals("Buffer X position after second buffer end", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second buffer end", 9, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.fireKeyDowns("M-<");
    assertContent(1, 9, 1);
    assertEquals("Buffer X position after second buffer start", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second buffer start", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
}

function testExecuteCommand() {
    var currentX, currentY;
    mockEjax.setCursor = function(x, y) {
        currentX = x;
        currentY = y;
    };
    mockEjax.ejax.setBufferContent("abc\n");
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("M-x");
    assertEquals("X cursor after M-x", 4, currentX);
    assertEquals("Y cursor after M-x", 23, currentY);
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "M-x                                                                             ", mockEjax.pixelRow(23));

    // Testing running nextLine
    mockEjax.fireKeyDowns("nextLine");
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "M-x nextLine                                                                    ", mockEjax.pixelRow(23));
    assertEquals("X cursor after typing command", 12, currentX);
    assertEquals("Y cursor after typing command", 23, currentY);
    mockEjax.fireKeyDowns("RET");
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    assertEquals("Screen row 22", " *scratch*    L2 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "                                                                                ", mockEjax.pixelRow(23));
    assertEquals("X cursor after pressing enter", 0, currentX);
    assertEquals("Y cursor after pressing enter", 1, currentY);

    // Testing calling a function that doesn't exist
    mockEjax.fireKeyDowns("M-xnexRET");
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    assertEquals("Screen row 22", " *scratch*    L2 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "nex is undefined                                                                ", mockEjax.pixelRow(23));
    assertEquals("X cursor after pressing enter", 0, currentX);
    assertEquals("Y cursor after pressing enter", 1, currentY);

    // Testing calling a read parameter function from M-x
    mockEjax.fireKeyDowns("M-xexecuteCommandRET");
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    assertEquals("Screen row 22", " *scratch*    L2 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "M-x                                                                             ", mockEjax.pixelRow(23));
    mockEjax.fireKeyDowns("M-xnex");
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    assertEquals("Screen row 22", " *scratch*    L2 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "M-x nex                                                                         ", mockEjax.pixelRow(23));

    // Testing auto completion
    mockEjax.fireKeyDowns("TAB");
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    assertEquals("Screen row 22", " *scratch*    L2 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "M-x nextLine                                                                    ", mockEjax.pixelRow(23));
    assertEquals("X cursor after pressing tab", 12, currentX);
    assertEquals("Y cursor after pressing tab", 23, currentY);
}

function testFindFileTabCompletion() {
    var currentX, currentY, loadedFilename;
    mockEjax.setCursor = function(x, y) {
        currentX = x;
        currentY = y;
    };
    mockEjax.file = function(filename) {
        return new File(filename);
    };
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("C-xC-f");
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "Find file:                                                                      ", mockEjax.pixelRow(23));
    mockEjax.fireKeyDowns("sTAB");
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "Find file: src/                                                                 ", mockEjax.pixelRow(23));
    mockEjax.fireKeyDowns("tTAB");
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "Find file: src/test/                                                            ", mockEjax.pixelRow(23));
    mockEjax.fireKeyDowns("jTAB");
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "Find file: src/test/java                                                        ", mockEjax.pixelRow(23));
    mockEjax.fireKeyDowns("sTAB");
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "Find file: src/test/javascript/                                                 ", mockEjax.pixelRow(23));
    mockEjax.fireKeyDowns("tTAB");
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "Find file: src/test/javascript/test                                             ", mockEjax.pixelRow(23));
    mockEjax.fireKeyDowns("FTAB");
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "Find file: src/test/javascript/testFile.txt                                     ", mockEjax.pixelRow(23));
    mockEjax.fireKeyDowns("RET");
    assertEquals("Screen row 22", " testFile.txt    L1 (Fundamental)-----------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "                                                                                ", mockEjax.pixelRow(23));
}

function testGotoLine() {
    var content = "";

    for (var i = 1; i < 100; i++) {
        content += "" + i + "\n";
    }

    content += "100";

    var assertContent = function(startValue, max, lineNumber) {
        for (var i = 0; i < 21; i++) {
            var line = "";

            if (i + startValue <= max) {
                line += (i + startValue);
            }

            while (line.length < 80) {
                line += " ";
            }

            assertEquals("Screen row  " + i, line, mockEjax.pixelRow(i));
        }

        var expectedLine = " *scratch*    L" + lineNumber + " (Fundamental)";

        while (expectedLine.length < 80) {
            expectedLine += "-";
        }

        assertEquals("Screen row 22", expectedLine, mockEjax.pixelRow(22));
        assertEquals("Screen row 23", "                                                                                ", mockEjax.pixelRow(23));
    };

    mockEjax.ejax.setBufferContent(content);
    mockEjax.ejax.screen.hardRedraw();
    assertContent(1, 22, 1);
    mockEjax.fireKeyDowns("M-gM-g");
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "Goto line:                                                                      ", mockEjax.pixelRow(23));

    mockEjax.fireKeyDowns("22RET");
    assertContent(1, 22, 22);
    mockEjax.fireKeyDowns("M-gM-g100RET");
    assertContent(90, 100, 100);
    mockEjax.fireKeyDowns("M-gM-g90RET");
    assertContent(90, 100, 90);
    mockEjax.fireKeyDowns("M-gM-g0RET");
    assertContent(1, 22, 1);
    mockEjax.fireKeyDowns("M-gM-g1000RET");
    assertContent(90, 100, 100);
    mockEjax.fireKeyDowns("M-gM-g89RET");
    assertContent(79, 100, 89);
    mockEjax.fireKeyDowns("M-gM-gabcRET");
    assertEquals("Screen row 22", " *scratch*    L89 (Fundamental)-------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "Expected int, got abc                                                           ", mockEjax.pixelRow(23));
}

function testChangeBuffer() {
    mockEjax.ejax.setBufferContent("abc");
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("C-xb");
    assertEquals("Screen row  0", "abc                                                                             ", mockEjax.pixelRow(0));
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "Switch to buffer (default *scratch*):                                           ", mockEjax.pixelRow(23));
    mockEjax.fireKeyDowns("a");
    assertEquals("Screen row 23", "Switch to buffer (default *scratch*): a                                         ", mockEjax.pixelRow(23));
    mockEjax.fireKeyDowns("RET");
    assertEquals("Screen row  0", "                                                                                ", mockEjax.pixelRow(0));
    assertEquals("Screen row 22", " a    L1 (Fundamental)----------------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "                                                                                ", mockEjax.pixelRow(23));
    mockEjax.ejax.setBufferContent("xyz");
    mockEjax.fireKeyDowns("C-xb");
    assertEquals("Screen row 23", "Switch to buffer (default *scratch*):                                           ", mockEjax.pixelRow(23));
    mockEjax.fireKeyDowns("b");
    assertEquals("Screen row 23", "Switch to buffer (default *scratch*): b                                         ", mockEjax.pixelRow(23));
    mockEjax.fireKeyDowns("RET");
    assertEquals("Screen row  0", "                                                                                ", mockEjax.pixelRow(0));
    assertEquals("Screen row 22", " b    L1 (Fundamental)----------------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "                                                                                ", mockEjax.pixelRow(23));
    mockEjax.fireKeyDowns("C-xb*TAB");
    assertEquals("Screen row 22", " b    L1 (Fundamental)----------------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "Switch to buffer (default a): *scratch*                                         ", mockEjax.pixelRow(23));
    mockEjax.fireKeyDowns("RET");
    assertEquals("Screen row  0", "abc                                                                             ", mockEjax.pixelRow(0));
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "                                                                                ", mockEjax.pixelRow(23));
    mockEjax.fireKeyDowns("C-xb");
    assertEquals("Screen row 22", " *scratch*    L1 (Fundamental)--------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "Switch to buffer (default b):                                                   ", mockEjax.pixelRow(23));
    mockEjax.fireKeyDowns("RET");
    assertEquals("Screen row  0", "                                                                                ", mockEjax.pixelRow(0));
    assertEquals("Screen row 22", " b    L1 (Fundamental)----------------------------------------------------------", mockEjax.pixelRow(22));
    assertEquals("Screen row 23", "                                                                                ", mockEjax.pixelRow(23));
}

function testMinibufferEditingAndNavigation() {
    var currentX, currentY;
    mockEjax.setCursor = function(x, y) {
        currentX = x;
        currentY = y;
    };
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("M-xabc");
    assertEquals("Screen row 23", "M-x abc                                                                         ", mockEjax.pixelRow(23));
    assertEquals("X cursor after M-x", 7, currentX);
    assertEquals("Y cursor after M-x", 23, currentY);
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    mockEjax.fireKeyDowns("C-a");
    assertEquals("Screen row 23", "M-x abc                                                                         ", mockEjax.pixelRow(23));
    assertEquals("X cursor after C-a", 4, currentX);
    assertEquals("Y cursor after C-a", 23, currentY);
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    mockEjax.fireKeyDowns("LEFTdBSPDEL");
    assertEquals("Screen row 23", "M-x abc                                                                         ", mockEjax.pixelRow(23));
    assertEquals("X cursor after LEFTd", 3, currentX);
    assertEquals("Y cursor after LEFTd", 23, currentY);
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    mockEjax.fireKeyDowns("C-a");
    assertEquals("Screen row 23", "M-x abc                                                                         ", mockEjax.pixelRow(23));
    assertEquals("X cursor after second C-a", 0, currentX);
    assertEquals("Y cursor after second C-a", 23, currentY);
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    mockEjax.fireKeyDowns("C-e");
    assertEquals("Screen row 23", "M-x abc                                                                         ", mockEjax.pixelRow(23));
    assertEquals("X cursor after C-e", 7, currentX);
    assertEquals("Y cursor after C-e", 23, currentY);
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    mockEjax.fireKeyDowns("LEFT");
    assertEquals("Screen row 23", "M-x abc                                                                         ", mockEjax.pixelRow(23));
    assertEquals("X cursor after LEFT", 6, currentX);
    assertEquals("Y cursor after LEFT", 23, currentY);
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
    mockEjax.fireKeyDowns("RIGHT");
    assertEquals("Screen row 23", "M-x abc                                                                         ", mockEjax.pixelRow(23));
    assertEquals("X cursor after RIGHT", 7, currentX);
    assertEquals("Y cursor after RIGHT", 23, currentY);
    assertEquals("Max y value", 23, mockEjax.pixels.maxY);
}

function testParameterBufferAppending() {
    var currentX, currentY;
    mockEjax.setCursor = function(x, y) {
        currentX = x;
        currentY = y;
    };
    mockEjax.ejax.screen.currentWindow.buffer.content.parameterMode = true;
    mockEjax.ejax.screen.currentWindow.buffer.content.set("abc");
    mockEjax.ejax.screen.currentWindow.buffer.content.setParameter("123");
    mockEjax.ejax.setCursor(4, 0);
    mockEjax.ejax.screen.hardRedraw();
    assertEquals("Screen row  0", "abc123                                                                          ", mockEjax.pixelRow(0));
    mockEjax.ejax.screen.currentWindow.buffer.append("def");
    mockEjax.ejax.screen.redraw();
    assertEquals("Screen row  0", "abcdef123                                                                       ", mockEjax.pixelRow(0));
    assertEquals("X cursor after first append", 7, currentX);
    assertEquals("Y cursor after first append", 0, currentY);
    mockEjax.ejax.screen.currentWindow.buffer.append("\nxyz\nhello\n");
    mockEjax.ejax.screen.redraw();
    assertEquals("Screen row  0", "abcdef                                                                          ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "xyz                                                                             ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "hello                                                                           ", mockEjax.pixelRow(2));
    assertEquals("Screen row  3", "123                                                                             ", mockEjax.pixelRow(3));
    assertEquals("X cursor after second append", 1, currentX);
    assertEquals("Y cursor after second append", 3, currentY);
}

function testCopyPaste() {
    var currentX, currentY;
    mockEjax.setCursor = function(x, y) {
        currentX = x;
        currentY = y;
    };
    mockEjax.ejax.setBufferContent("abc");
    mockEjax.ejax.screen.hardRedraw();
    assertEquals("Screen row  0", "abc                                                                             ", mockEjax.pixelRow(0));
    mockEjax.fireKeyDowns("C-aC-SPCC-eM-wC-y");
    assertEquals("Screen row  0", "abcabc                                                                          ", mockEjax.pixelRow(0));
    assertEquals("X cursor after first paste", 6, currentX);
    assertEquals("Y cursor after first paste", 0, currentY);
    mockEjax.fireKeyDowns("RETdefRETC-SPCM-<M-wM->C-y");
    assertEquals("Screen row  0", "abcabc                                                                          ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "def                                                                             ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "abcabc                                                                          ", mockEjax.pixelRow(2));
    assertEquals("Screen row  3", "def                                                                             ", mockEjax.pixelRow(3));
    assertEquals("Screen row  4", "                                                                                ", mockEjax.pixelRow(4));
    assertEquals("X cursor after second paste", 0, currentX);
    assertEquals("Y cursor after second paste", 4, currentY);
}

function testKillPaste() {
    var currentX, currentY;
    mockEjax.setCursor = function(x, y) {
        currentX = x;
        currentY = y;
    };
    mockEjax.ejax.setBufferContent("abc");
    mockEjax.ejax.screen.hardRedraw();
    assertEquals("Screen row  0", "abc                                                                             ", mockEjax.pixelRow(0));
    mockEjax.fireKeyDowns("C-aC-SPCC-eC-wC-yC-y");
    assertEquals("Screen row  0", "abcabc                                                                          ", mockEjax.pixelRow(0));
    assertEquals("X cursor after first paste", 6, currentX);
    assertEquals("Y cursor after first paste", 0, currentY);
    mockEjax.fireKeyDowns("RETdefRETC-SPCM-<C-wC-yC-y");
    assertEquals("Screen row  0", "abcabc                                                                          ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "def                                                                             ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "abcabc                                                                          ", mockEjax.pixelRow(2));
    assertEquals("Screen row  3", "def                                                                             ", mockEjax.pixelRow(3));
    assertEquals("Screen row  4", "                                                                                ", mockEjax.pixelRow(4));
    assertEquals("X cursor after second paste", 0, currentX);
    assertEquals("Y cursor after second paste", 4, currentY);
}

function ignore_testKillBuffer() {
    assertEquals("Screen row 23", "Kill buffer (default *scratch*):                                                 ", mockEjax.pixelRow(23));
}
