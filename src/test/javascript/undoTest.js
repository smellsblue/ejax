load("mock-ejax.js");
load("ejax-core-complete.js");

var mockEjax;

function setUp() {
    ejax = null;
    mockEjax = new MockEjax();
    mockEjax.setupPixelMethods();
}

function testUndoSendsMessage() {
    mockEjax.fireKeyDowns("aC-/");
    assertEquals("Screen row 23", "Undo!                                                                           ", mockEjax.pixelRow(23));
}

function testSimpleUndo() {
    mockEjax.fireKeyDowns("aC-_");
    assertEquals("Content after undo", "", mockEjax.ejax.getBufferContent());
}

function testUndoPastEndOfHistory() {
    mockEjax.fireKeyDowns("C-/");
    assertEquals("Screen row 23", "No further undo information                                                     ", mockEjax.pixelRow(23));
}

function testUndoMultipleEdits() {
    mockEjax.fireKeyDowns("abcC-/C-/C-/");
    assertEquals("Content after undo", "", mockEjax.ejax.getBufferContent());
}

function testUndoPaste() {
    mockEjax.fireKeyDowns("C-SPCabcM-wC-yC-/");
    assertEquals("Content after undo", "abc", mockEjax.ejax.getBufferContent());
}

function testUndoDelete() {
    mockEjax.fireKeyDowns("aBSPC-/");
    assertEquals("Content after undo", "a", mockEjax.ejax.getBufferContent());
}

function testUndoWordDelete() {
    mockEjax.fireKeyDowns("abcC-BSPC-/");
    assertEquals("Content after undo", "abc", mockEjax.ejax.getBufferContent());
}

function testUndoKill() {
    mockEjax.fireKeyDowns("C-SPCabcRET123C-wC-/");
    assertEquals("Content after undo", "abc\n123", mockEjax.ejax.getBufferContent());
}

function testUndoRectangleKill() {
    mockEjax.ejax.setBufferContent("abc\n123\nxyz");
    mockEjax.fireKeyDowns("C-SPCDOWNDOWNRIGHTC-xrkC-/");
    assertEquals("Content after undo", "abc\n123\nxyz", mockEjax.ejax.getBufferContent());
}

function testUndoRectangleInsert() {
    mockEjax.ejax.setBufferContent("abc\n123\nxyz");
    mockEjax.fireKeyDowns("C-SPCDOWNDOWNRIGHTC-xrtdefRETC-/");
    assertEquals("Content after undo", "abc\n123\nxyz", mockEjax.ejax.getBufferContent());
}

function testCursorAfterUndoDelete() {
    var currentX, currentY;
    mockEjax.setCursor = function(x, y) {
        currentX = x;
        currentY = y;
    };
    mockEjax.ejax.setBufferContent("abc\n123\nxyz");
    mockEjax.fireKeyDowns("M-<C-dM->C-/");
    assertEquals("X cursor after undo", 0, currentX);
    assertEquals("Y cursor after undo", 0, currentY);
}

function testCursorAfterUndoAdd() {
    var currentX, currentY;
    mockEjax.setCursor = function(x, y) {
        currentX = x;
        currentY = y;
    };
    mockEjax.ejax.setBufferContent("abc\n123\nxyz");
    mockEjax.fireKeyDowns("M-<dM->C-/");
    assertEquals("X cursor after undo", 0, currentX);
    assertEquals("Y cursor after undo", 0, currentY);
}

// TODO: Test rectangle undo
