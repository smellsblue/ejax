load("mock-ejax.js");
load("ejax-core-complete.js");

var mockEjax;

function setUp() {
    ejax = null;
    mockEjax = new MockEjax();
    mockEjax.setupPixelMethods();
}

function testRectangleKillFromUpperLeft() {
    var currentX, currentY;
    mockEjax.setCursor = function(x, y) {
        currentX = x;
        currentY = y;
    };
    mockEjax.ejax.setBufferContent("abcdef\n123456\nuvwxyz\n098765\n");
    mockEjax.fireKeyDowns("RIGHTDOWNC-SPCDOWNDOWNRIGHTRIGHTC-xrk");
    assertEquals("Buffer content after rectangle kill", "abcdef\n1456\nuxyz\n0765\n", mockEjax.ejax.getBufferContent());
    assertEquals("Screen row  0", "abcdef                                                                          ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "1456                                                                            ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "uxyz                                                                            ", mockEjax.pixelRow(2));
    assertEquals("Screen row  3", "0765                                                                            ", mockEjax.pixelRow(3));
    assertEquals("X cursor after rectangle kill", 1, currentX);
    assertEquals("Y cursor after rectangle kill", 3, currentY);
    mockEjax.fireKeyDowns("RIGHTC-xrk");
    assertEquals("Buffer content after second rectangle kill", "abcdef\n156\nuyz\n065\n", mockEjax.ejax.getBufferContent());
    assertEquals("X cursor after rectangle kill", 1, currentX);
    assertEquals("Y cursor after rectangle kill", 3, currentY);
}

function testRectangleKillFromUpperRight() {
    var currentX, currentY;
    mockEjax.setCursor = function(x, y) {
        currentX = x;
        currentY = y;
    };
    mockEjax.ejax.setBufferContent("abcdef\n123456\nuvwxyz\n098765\n");
    mockEjax.fireKeyDowns("RIGHTDOWNRIGHTRIGHTC-SPCDOWNDOWNLEFTLEFTC-xrk");
    assertEquals("Buffer content after rectangle kill", "abcdef\n1456\nuxyz\n0765\n", mockEjax.ejax.getBufferContent());
    assertEquals("Screen row  0", "abcdef                                                                          ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "1456                                                                            ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "uxyz                                                                            ", mockEjax.pixelRow(2));
    assertEquals("Screen row  3", "0765                                                                            ", mockEjax.pixelRow(3));
    assertEquals("X cursor after rectangle kill", 1, currentX);
    assertEquals("Y cursor after rectangle kill", 3, currentY);
    mockEjax.fireKeyDowns("RIGHTC-xrk");
    assertEquals("Buffer content after second rectangle kill", "abcdef\n156\nuyz\n065\n", mockEjax.ejax.getBufferContent());
    assertEquals("X cursor after rectangle kill", 1, currentX);
    assertEquals("Y cursor after rectangle kill", 3, currentY);
}

function testRectangleKillFromLowerLeft() {
    var currentX, currentY;
    mockEjax.setCursor = function(x, y) {
        currentX = x;
        currentY = y;
    };
    mockEjax.ejax.setBufferContent("abcdef\n123456\nuvwxyz\n098765\n");
    mockEjax.fireKeyDowns("RIGHTDOWNDOWNDOWNC-SPCUPUPRIGHTRIGHTC-xrk");
    assertEquals("Buffer content after rectangle kill", "abcdef\n1456\nuxyz\n0765\n", mockEjax.ejax.getBufferContent());
    assertEquals("Screen row  0", "abcdef                                                                          ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "1456                                                                            ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "uxyz                                                                            ", mockEjax.pixelRow(2));
    assertEquals("Screen row  3", "0765                                                                            ", mockEjax.pixelRow(3));
    assertEquals("X cursor after rectangle kill", 1, currentX);
    assertEquals("Y cursor after rectangle kill", 1, currentY);
    mockEjax.fireKeyDowns("RIGHTC-xrk");
    assertEquals("Buffer content after second rectangle kill", "abcdef\n156\nuyz\n065\n", mockEjax.ejax.getBufferContent());
    assertEquals("X cursor after rectangle kill", 1, currentX);
    assertEquals("Y cursor after rectangle kill", 1, currentY);
}

function testRectangleKillFromLowerRight() {
    var currentX, currentY;
    mockEjax.setCursor = function(x, y) {
        currentX = x;
        currentY = y;
    };
    mockEjax.ejax.setBufferContent("abcdef\n123456\nuvwxyz\n098765\n");
    mockEjax.fireKeyDowns("RIGHTDOWNDOWNDOWNRIGHTRIGHTC-SPCUPUPLEFTLEFTC-xrk");
    assertEquals("Buffer content after rectangle kill", "abcdef\n1456\nuxyz\n0765\n", mockEjax.ejax.getBufferContent());
    assertEquals("Screen row  0", "abcdef                                                                          ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "1456                                                                            ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "uxyz                                                                            ", mockEjax.pixelRow(2));
    assertEquals("Screen row  3", "0765                                                                            ", mockEjax.pixelRow(3));
    assertEquals("X cursor after rectangle kill", 1, currentX);
    assertEquals("Y cursor after rectangle kill", 1, currentY);
    mockEjax.fireKeyDowns("RIGHTC-xrk");
    assertEquals("Buffer content after second rectangle kill", "abcdef\n156\nuyz\n065\n", mockEjax.ejax.getBufferContent());
    assertEquals("X cursor after rectangle kill", 1, currentX);
    assertEquals("Y cursor after rectangle kill", 1, currentY);
}

function testRectangleKillWithUnevenLines() {
    var currentX, currentY;
    mockEjax.setCursor = function(x, y) {
        currentX = x;
        currentY = y;
    };
    mockEjax.ejax.setBufferContent("abcdef\n123456\n\nxy\nxyz\nabcd\na\nuvwxyz\n");
    mockEjax.fireKeyDowns("RIGHTDOWNC-SPCC-aDOWNDOWNDOWNDOWNDOWNDOWNRIGHTRIGHTRIGHTC-xrk");
    assertEquals("Buffer content after rectangle kill", "abcdef\n1456\n\nx\nx\nad\na\nuxyz\n", mockEjax.ejax.getBufferContent());
    assertEquals("Screen row  0", "abcdef                                                                          ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "1456                                                                            ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "                                                                                ", mockEjax.pixelRow(2));
    assertEquals("Screen row  3", "x                                                                               ", mockEjax.pixelRow(3));
    assertEquals("Screen row  4", "x                                                                               ", mockEjax.pixelRow(4));
    assertEquals("Screen row  5", "ad                                                                              ", mockEjax.pixelRow(5));
    assertEquals("Screen row  6", "a                                                                               ", mockEjax.pixelRow(6));
    assertEquals("Screen row  7", "uxyz                                                                            ", mockEjax.pixelRow(7));
    assertEquals("X cursor after rectangle kill", 1, currentX);
    assertEquals("Y cursor after rectangle kill", 7, currentY);
}
