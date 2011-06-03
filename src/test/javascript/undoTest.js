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

function ignore_testUndoWordDelete() {
    mockEjax.fireKeyDowns("abcC-BSPC-/");
    assertEquals("Content after undo", "abc", mockEjax.ejax.getBufferContent());
}

function ignore_testUndoKill() {
    mockEjax.fireKeyDowns("C-SPCabcRET123C-wC-/");
    assertEquals("Content after undo", "abc\n123", mockEjax.ejax.getBufferContent());
}
