load("mock-ejax.js");
load("ejax-core-complete.js");
load("file.js");

var mockEjax;

function setUp() {
    ejax = null;
    mockEjax = new MockEjax();
}

function testInitialBufferName() {
    assertEquals("Initial buffer name", "*scratch*", mockEjax.ejax.screen.currentWindow.buffer.name);
}

function testLoadFileThenBufferName() {
    mockEjax.file = function(filename) {
        return new File(filename);
    };

    mockEjax.ejax.findFile("src/test/javascript/testFile.txt");
    assertEquals("Buffer name after loading file", "testFile.txt", mockEjax.ejax.screen.currentWindow.buffer.name);
}

function testSaveFile() {
    var file = java.io.File.createTempFile("buffersTestFile", ".txt");
    file.deleteOnExit();

    mockEjax.file = function(filename) {
        return new File(file.getAbsolutePath());
    };

    mockEjax.ejax.findFile(file.getAbsolutePath());
    mockEjax.ejax.setBufferContent("This is the contents of a test file.\n");
    mockEjax.ejax.saveBuffer();
    assertEquals("File content after saving", "This is the contents of a test file.\n", new File(file.getAbsolutePath()).contents());
}

function testInitialCursor() {
    assertEquals("Initial buffer position", 0, mockEjax.ejax.screen.currentWindow.buffer.cursor);
}

function testNextLineFromIndex0() {
    mockEjax.ejax.setBufferContent("abc\n123\nxyz\n");
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after first next line", 4, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after second next line", 8, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after third next line", 12, mockEjax.ejax.screen.currentWindow.buffer.cursor);
}

function testNextLineFromIndex1() {
    mockEjax.ejax.setBufferContent("abc\n123\nxyz\n");
    mockEjax.ejax.setCursor(1);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after first next line", 5, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after second next line", 9, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after third next line", 12, mockEjax.ejax.screen.currentWindow.buffer.cursor);
}

function testNextLineFromIndex0WithVariedLines() {
    mockEjax.ejax.setBufferContent("abc\n\n123\n");
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after first next line", 4, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after second next line", 5, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after third next line", 9, mockEjax.ejax.screen.currentWindow.buffer.cursor);
}

function testNextLineFromIndex1WithVariedLines() {
    mockEjax.ejax.setBufferContent("abc\nxy\n\n123\n");
    mockEjax.ejax.setCursor(1);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after first next line", 5, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after second next line", 7, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after third next line", 8, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after fourth next line", 12, mockEjax.ejax.screen.currentWindow.buffer.cursor);
}

function testNextLineWithNewlinesAtTheBeginning() {
    mockEjax.ejax.setBufferContent("\n\n\nabc\n");
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after first next line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after second next line", 2, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after third next line", 3, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after fourth next line", 7, mockEjax.ejax.screen.currentWindow.buffer.cursor);
}

function testNextLineWithNoNewlinesAtTheEnd() {
    mockEjax.ejax.setBufferContent("\n\n\nabc");
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after first next line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after second next line", 2, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after third next line", 3, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after fourth next line", 6, mockEjax.ejax.screen.currentWindow.buffer.cursor);
}

function testPreviousLineFromFirstCharacterOfLastLine() {
    mockEjax.ejax.setBufferContent("abc\n123\nxyz\n");
    mockEjax.ejax.setCursor(12);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after first previous line", 8, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after second previous line", 4, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after third previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursor);
}

function testPreviousLineFromSecondCharacterOfLastLine() {
    mockEjax.ejax.setBufferContent("abc\n123\nxyz");
    mockEjax.ejax.setCursor(9);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after first previous line", 5, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after second previous line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after third previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursor);
}

function testPreviousLineWithNewlinesAtBeginning() {
    mockEjax.ejax.setBufferContent("\n\n\n\nxyz\n");
    mockEjax.ejax.setCursor(8);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after first previous line", 4, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after secon previous line", 3, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after third previous line", 2, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after fourth previous line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after fifth previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursor);
}

function testPreviousLineWithNewlinesAfterFirstLine() {
    mockEjax.ejax.setBufferContent("abc\n\n\n\nxyz\n");
    mockEjax.ejax.setCursor(11);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after first previous line", 7, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after secon previous line", 6, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after third previous line", 5, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after fourth previous line", 4, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after fifth previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursor);
}

function testEmptyLineThenTwoLinesWithText() {
    mockEjax.ejax.setBufferContent("abc\n\nxyz\n123");
    mockEjax.ejax.setCursor(11);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after first previous line", 7, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after secon previous line", 4, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after third previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursor);
}

function testDeleteForward() {
    mockEjax.ejax.setBufferContent("abc");
    mockEjax.ejax.setCursor(2);
    mockEjax.ejax.deleteForward();
    assertEquals("Buffer position after first delete", 2, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    assertEquals("Buffer content after first delete", "ab", mockEjax.ejax.getBufferContent());
    mockEjax.ejax.deleteForward();
    assertEquals("Buffer position after second delete", 2, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    assertEquals("Buffer content after first delete", "ab", mockEjax.ejax.getBufferContent());
}

function testDeleteBackward() {
    mockEjax.ejax.setBufferContent("abc");
    mockEjax.ejax.setCursor(1);
    mockEjax.ejax.deleteBackward();
    assertEquals("Buffer position after first delete", 0, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    assertEquals("Buffer content after first delete", "bc", mockEjax.ejax.getBufferContent());
    mockEjax.ejax.deleteBackward();
    assertEquals("Buffer position after second delete", 0, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    assertEquals("Buffer content after first delete", "bc", mockEjax.ejax.getBufferContent());
}

function testGotoStartOfLineWithPreviousLines() {
    mockEjax.ejax.setBufferContent("abc\nxyz");
    mockEjax.ejax.setCursor(5);
    mockEjax.ejax.lineStart();
    assertEquals("Buffer position after first lineStart", 4, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.lineStart();
    assertEquals("Buffer position after second lineStart", 4, mockEjax.ejax.screen.currentWindow.buffer.cursor);
}

function testGotoStartOfLineWithNoPreviousLines() {
    mockEjax.ejax.setBufferContent("abc\nxyz");
    mockEjax.ejax.setCursor(1);
    mockEjax.ejax.lineStart();
    assertEquals("Buffer position after first lineStart", 0, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.lineStart();
    assertEquals("Buffer position after second lineStart", 0, mockEjax.ejax.screen.currentWindow.buffer.cursor);
}

function testGotoStartOfLineWithNewlines() {
    mockEjax.ejax.setBufferContent("\n\n\n");
    mockEjax.ejax.setCursor(1);
    mockEjax.ejax.lineStart();
    assertEquals("Buffer position after first lineStart", 1, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.lineStart();
    assertEquals("Buffer position after second lineStart", 1, mockEjax.ejax.screen.currentWindow.buffer.cursor);
}

function testGotoStartOfLineWithNewlines() {
    mockEjax.ejax.setBufferContent("\n\n\n");
    mockEjax.ejax.setCursor(1);
    mockEjax.ejax.lineStart();
    assertEquals("Buffer position after first lineStart", 1, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.lineStart();
    assertEquals("Buffer position after second lineStart", 1, mockEjax.ejax.screen.currentWindow.buffer.cursor);
}

function testGotoEndOfLineWithMoreLines() {
    mockEjax.ejax.setBufferContent("abc\nxyz");
    mockEjax.ejax.setCursor(1);
    mockEjax.ejax.lineEnd();
    assertEquals("Buffer position after first lineEnd", 3, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.lineEnd();
    assertEquals("Buffer position after second lineEnd", 3, mockEjax.ejax.screen.currentWindow.buffer.cursor);
}

function testGotoEndOfLineWithNoMoreLines() {
    mockEjax.ejax.setBufferContent("abc\nxyz");
    mockEjax.ejax.setCursor(5);
    mockEjax.ejax.lineEnd();
    assertEquals("Buffer position after first lineEnd", 7, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.lineEnd();
    assertEquals("Buffer position after second lineEnd", 7, mockEjax.ejax.screen.currentWindow.buffer.cursor);
}

function testGotoEndOfLineWithNewlines() {
    mockEjax.ejax.setBufferContent("\n\n\n");
    mockEjax.ejax.setCursor(1);
    mockEjax.ejax.lineEnd();
    assertEquals("Buffer position after first lineStart", 1, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    mockEjax.ejax.lineEnd();
    assertEquals("Buffer position after second lineStart", 1, mockEjax.ejax.screen.currentWindow.buffer.cursor);
}
