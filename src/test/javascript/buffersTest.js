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
    assertEquals("Initial buffer X position", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Initial buffer Y position", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
}

function testNextLineFromIndex0() {
    mockEjax.ejax.setBufferContent("abc\n123\nxyz\n");
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after first next line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after first next line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after second next line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second next line", 2, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after third next line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after third next line", 3, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
}

function testNextLineFromIndex1() {
    mockEjax.ejax.setBufferContent("abc\n123\nxyz\n");
    mockEjax.ejax.setCursor(1, 0);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after first next line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after first next line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after second next line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second next line", 2, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after third next line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after third next line", 3, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
}

function testNextLineFromIndex0WithVariedLines() {
    mockEjax.ejax.setBufferContent("abc\n\n123\n");
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after first next line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after first next line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after second next line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second next line", 2, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after third next line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after third next line", 3, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
}

function testNextLineFromIndex1WithVariedLines() {
    mockEjax.ejax.setBufferContent("abc\nxy\n\n123\n");
    mockEjax.ejax.setCursor(1, 0);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after first next line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after first next line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after second next line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second next line", 2, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after third next line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after third next line", 3, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after fourth next line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after fourth next line", 4, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
}

function testNextLineWithNewlinesAtTheBeginning() {
    mockEjax.ejax.setBufferContent("\n\n\nabc\n");
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after first next line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after first next line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after second next line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second next line", 2, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after third next line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after third next line", 3, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after fourth next line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after fourth next line", 4, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
}

function testNextLineWithNoNewlinesAtTheEnd() {
    mockEjax.ejax.setBufferContent("\n\n\nabc");
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after first next line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after first next line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after second next line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second next line", 2, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after third next line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after third next line", 3, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer X position after fourth next line", 3, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after fourth next line", 3, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
}

function testPreviousLineFromFirstCharacterOfLastLine() {
    mockEjax.ejax.setBufferContent("abc\n123\nxyz\n");
    mockEjax.ejax.setCursor(0, 3);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer X position after first previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after first previous line", 2, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer X position after second previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second previous line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer X position after third previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after third previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
}

function testPreviousLineFromSecondCharacterOfLastLine() {
    mockEjax.ejax.setBufferContent("abc\n123\nxyz");
    mockEjax.ejax.setCursor(1, 2);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer X position after first previous line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after first previous line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer X position after second previous line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer X position after third previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after third previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
}

function testPreviousLineWithNewlinesAtBeginning() {
    mockEjax.ejax.setBufferContent("\n\n\n\nxyz\n");
    mockEjax.ejax.setCursor(0, 5);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer X position after first previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after first previous line", 4, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer X position after secon previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after secon previous line", 3, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer X position after third previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after third previous line", 2, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer X position after fourth previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after fourth previous line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer X position after fifth previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after fifth previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
}

function testPreviousLineWithNewlinesAfterFirstLine() {
    mockEjax.ejax.setBufferContent("abc\n\n\n\nxyz\n");
    mockEjax.ejax.setCursor(0, 5);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer X position after first previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after first previous line", 4, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer X position after secon previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after secon previous line", 3, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer X position after third previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after third previous line", 2, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer X position after fourth previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after fourth previous line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer X position after fifth previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after fifth previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
}

function testEmptyLineThenTwoLinesWithText() {
    mockEjax.ejax.setBufferContent("abc\n\nxyz\n123");
    mockEjax.ejax.setCursor(2, 3);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer X position after first previous line", 2, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after first previous line", 2, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer X position after secon previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after secon previous line", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer X position after third previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after third previous line", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
}

function testDeleteForward() {
    mockEjax.ejax.setBufferContent("abc");
    mockEjax.ejax.setCursor(2, 0);
    mockEjax.ejax.deleteForward();
    assertEquals("Buffer X position after first delete", 2, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after first delete", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    assertEquals("Buffer content after first delete", "ab", mockEjax.ejax.getBufferContent());
    mockEjax.ejax.deleteForward();
    assertEquals("Buffer X position after second delete", 2, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second delete", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    assertEquals("Buffer content after first delete", "ab", mockEjax.ejax.getBufferContent());
}

function testDeleteBackward() {
    mockEjax.ejax.setBufferContent("abc");
    mockEjax.ejax.setCursor(1, 0);
    mockEjax.ejax.deleteBackward();
    assertEquals("Buffer X position after first delete", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after first delete", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    assertEquals("Buffer content after first delete", "bc", mockEjax.ejax.getBufferContent());
    mockEjax.ejax.deleteBackward();
    assertEquals("Buffer X position after second delete", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second delete", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    assertEquals("Buffer content after first delete", "bc", mockEjax.ejax.getBufferContent());
}

function testDeleteBackwardOnNewline() {
    mockEjax.ejax.setBufferContent("abc\n123\nxyz");
    mockEjax.ejax.setCursor(0, 2);
    mockEjax.ejax.deleteBackward();
    assertEquals("Buffer X position after delete", 3, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after delete", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    assertEquals("Buffer content after delete", "abc\n123xyz", mockEjax.ejax.getBufferContent());
}

function testGotoStartOfLineWithPreviousLines() {
    mockEjax.ejax.setBufferContent("abc\nxyz");
    mockEjax.ejax.setCursor(1, 1);
    mockEjax.ejax.lineStart();
    assertEquals("Buffer X position after first lineStart", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after first lineStart", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.lineStart();
    assertEquals("Buffer X position after second lineStart", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second lineStart", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
}

function testGotoStartOfLineWithNoPreviousLines() {
    mockEjax.ejax.setBufferContent("abc\nxyz");
    mockEjax.ejax.setCursor(1, 0);
    mockEjax.ejax.lineStart();
    assertEquals("Buffer X position after first lineStart", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after first lineStart", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.lineStart();
    assertEquals("Buffer X position after second lineStart", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second lineStart", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
}

function testGotoStartOfLineWithNewlines() {
    mockEjax.ejax.setBufferContent("\n\n\n");
    mockEjax.ejax.setCursor(0, 1);
    mockEjax.ejax.lineStart();
    assertEquals("Buffer X position after first lineStart", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after first lineStart", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.lineStart();
    assertEquals("Buffer X position after second lineStart", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second lineStart", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
}

function testGotoEndOfLineWithMoreLines() {
    mockEjax.ejax.setBufferContent("abc\nxyz");
    mockEjax.ejax.setCursor(1, 0);
    mockEjax.ejax.lineEnd();
    assertEquals("Buffer X position after first lineEnd", 3, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after first lineEnd", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.lineEnd();
    assertEquals("Buffer X position after second lineEnd", 3, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second lineEnd", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
}

function testGotoEndOfLineWithNoMoreLines() {
    mockEjax.ejax.setBufferContent("abc\nxyz");
    mockEjax.ejax.setCursor(1, 1);
    mockEjax.ejax.lineEnd();
    assertEquals("Buffer X position after first lineEnd", 3, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after first lineEnd", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.lineEnd();
    assertEquals("Buffer X position after second lineEnd", 3, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second lineEnd", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
}

function testGotoEndOfLineWithNewlines() {
    mockEjax.ejax.setBufferContent("\n\n\n");
    mockEjax.ejax.setCursor(0, 1);
    mockEjax.ejax.lineEnd();
    assertEquals("Buffer X position after first lineStart", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after first lineStart", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
    mockEjax.ejax.lineEnd();
    assertEquals("Buffer X position after second lineStart", 0, mockEjax.ejax.screen.currentWindow.buffer.cursorX);
    assertEquals("Buffer Y position after second lineStart", 1, mockEjax.ejax.screen.currentWindow.buffer.cursorY);
}
