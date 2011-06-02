load("mock-ejax.js");
load("ejax-core-complete.js");
load("file.js");

var mockEjax;

function setUp() {
    ejax = null;
    mockEjax = new MockEjax();
    mockEjax.setupPixelMethods();
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

function testKillLinePaste() {
    var currentX, currentY;
    mockEjax.setCursor = function(x, y) {
        currentX = x;
        currentY = y;
    };
    mockEjax.ejax.setBufferContent("abcdef\n123456\nxyz");
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("RIGHTRIGHTC-k");
    assertEquals("Screen row  0", "ab                                                                              ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "123456                                                                          ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "xyz                                                                             ", mockEjax.pixelRow(2));
    assertEquals("X cursor after first kill", 2, currentX);
    assertEquals("Y cursor after first kill", 0, currentY);
    mockEjax.fireKeyDowns("C-y");
    assertEquals("Screen row  0", "abcdef                                                                          ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "123456                                                                          ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "xyz                                                                             ", mockEjax.pixelRow(2));
    assertEquals("X cursor after first yank", 6, currentX);
    assertEquals("Y cursor after first yank", 0, currentY);
    mockEjax.fireKeyDowns("C-k");
    assertEquals("Screen row  0", "abcdef123456                                                                    ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "xyz                                                                             ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "                                                                                ", mockEjax.pixelRow(2));
    assertEquals("X cursor after second kill", 6, currentX);
    assertEquals("Y cursor after second kill", 0, currentY);
    mockEjax.fireKeyDowns("C-y");
    assertEquals("Screen row  0", "abcdef                                                                          ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "123456                                                                          ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "xyz                                                                             ", mockEjax.pixelRow(2));
    assertEquals("X cursor after second yank", 0, currentX);
    assertEquals("Y cursor after second yank", 1, currentY);
    mockEjax.fireKeyDowns("C-k");
    assertEquals("Screen row  0", "abcdef                                                                          ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "                                                                                ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "xyz                                                                             ", mockEjax.pixelRow(2));
    assertEquals("X cursor after third kill", 0, currentX);
    assertEquals("Y cursor after third kill", 1, currentY);
    mockEjax.fireKeyDowns("C-k");
    assertEquals("Screen row  0", "abcdef                                                                          ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "xyz                                                                             ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "                                                                                ", mockEjax.pixelRow(2));
    assertEquals("X cursor after fourth kill", 0, currentX);
    assertEquals("Y cursor after fourth kill", 1, currentY);
    mockEjax.fireKeyDowns("C-kC-kC-kC-k");
    assertEquals("Screen row  0", "abcdef                                                                          ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "                                                                                ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "                                                                                ", mockEjax.pixelRow(2));
    assertEquals("X cursor after several additional kills", 0, currentX);
    assertEquals("Y cursor after several additional kills", 1, currentY);
}

function testKillWordForward() {
    var currentX, currentY;
    mockEjax.setCursor = function(x, y) {
        currentX = x;
        currentY = y;
    };
    mockEjax.ejax.setBufferContent("abc def  ghij k  \n123   456\nxyz\n\n");
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("RIGHTRIGHTM-d");
    assertEquals("Buffer content after first word delete", "ab def  ghij k  \n123   456\nxyz\n\n", mockEjax.ejax.getBufferContent());
    assertEquals("Screen row  0", "ab def  ghij k                                                                  ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "123   456                                                                       ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "xyz                                                                             ", mockEjax.pixelRow(2));
    assertEquals("X cursor after first delete", 2, currentX);
    assertEquals("Y cursor after first delete", 0, currentY);
    mockEjax.fireKeyDowns("M-d");
    assertEquals("Buffer content after second word delete", "ab  ghij k  \n123   456\nxyz\n\n", mockEjax.ejax.getBufferContent());
    assertEquals("X cursor after second delete", 2, currentX);
    assertEquals("Y cursor after second delete", 0, currentY);
    mockEjax.fireKeyDowns("LEFTLEFTM-d");
    assertEquals("Buffer content after third word delete", "  ghij k  \n123   456\nxyz\n\n", mockEjax.ejax.getBufferContent());
    assertEquals("X cursor after third delete", 0, currentX);
    assertEquals("Y cursor after third delete", 0, currentY);
    mockEjax.fireKeyDowns("M-d");
    assertEquals("Buffer content after fourth word delete", " k  \n123   456\nxyz\n\n", mockEjax.ejax.getBufferContent());
    mockEjax.fireKeyDowns("M-d");
    assertEquals("Buffer content after fifth word delete", "  \n123   456\nxyz\n\n", mockEjax.ejax.getBufferContent());
    mockEjax.fireKeyDowns("M-d");
    assertEquals("Buffer content after sixth word delete", "   456\nxyz\n\n", mockEjax.ejax.getBufferContent());
    mockEjax.fireKeyDowns("M-d");
    assertEquals("Buffer content after seventh word delete", "\nxyz\n\n", mockEjax.ejax.getBufferContent());
    mockEjax.fireKeyDowns("M-d");
    assertEquals("Buffer content after eighth word delete", "\n\n", mockEjax.ejax.getBufferContent());
    mockEjax.fireKeyDowns("M-d");
    assertEquals("Buffer content after ninth word delete", "", mockEjax.ejax.getBufferContent());
    mockEjax.fireKeyDowns("M-dM-dM-d");
    assertEquals("Buffer content after additional word deletes", "", mockEjax.ejax.getBufferContent());
    assertEquals("Screen row  0", "                                                                                ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "                                                                                ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "                                                                                ", mockEjax.pixelRow(2));
    assertEquals("X cursor after additional kills", 0, currentX);
    assertEquals("Y cursor after additional kills", 0, currentY);
}

function testKillWordBackward() {
    var currentX, currentY;
    mockEjax.setCursor = function(x, y) {
        currentX = x;
        currentY = y;
    };
    mockEjax.ejax.setBufferContent("abc def  ghij k  \n123   456\nxyz\n\n");
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("M->M-bC-BSP");
    assertEquals("Buffer content after first word delete", "abc def  ghij k  \n123   xyz\n\n", mockEjax.ejax.getBufferContent());
    assertEquals("Screen row  0", "abc def  ghij k                                                                 ", mockEjax.pixelRow(0));
    assertEquals("Screen row  1", "123   xyz                                                                       ", mockEjax.pixelRow(1));
    assertEquals("Screen row  2", "                                                                                ", mockEjax.pixelRow(2));
    assertEquals("X cursor after first delete", 6, currentX);
    assertEquals("Y cursor after first delete", 1, currentY);
    mockEjax.fireKeyDowns("C-BSP");
    assertEquals("Buffer content after second word delete", "abc def  ghij k  \nxyz\n\n", mockEjax.ejax.getBufferContent());
    mockEjax.fireKeyDowns("C-BSP");
    assertEquals("Buffer content after third word delete", "abc def  ghij xyz\n\n", mockEjax.ejax.getBufferContent());
    mockEjax.fireKeyDowns("C-BSP");
    assertEquals("Buffer content after fourth word delete", "abc def  xyz\n\n", mockEjax.ejax.getBufferContent());
    mockEjax.fireKeyDowns("C-BSP");
    assertEquals("Buffer content after fifth word delete", "abc xyz\n\n", mockEjax.ejax.getBufferContent());
    mockEjax.fireKeyDowns("C-BSP");
    assertEquals("Buffer content after sixth word delete", "xyz\n\n", mockEjax.ejax.getBufferContent());
    mockEjax.fireKeyDowns("SPCSPCC-BSP");
    assertEquals("Buffer content after seventh word delete", "xyz\n\n", mockEjax.ejax.getBufferContent());
    mockEjax.fireKeyDowns("M->C-BSP");
    assertEquals("Buffer content after eighth word delete", "", mockEjax.ejax.getBufferContent());
}
