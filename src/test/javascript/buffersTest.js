load("mock-ejax.js");
load("ejax-core-complete.js");

var mockEjax;

function setUp() {
    ejax = null;
    mockEjax = new MockEjax();
}

function testInitialCursor() {
    assertEquals("Initial buffer position", 0, mockEjax.ejax.currentBuffer.cursor);
}

function testNextLineFromIndex0() {
    mockEjax.ejax.setBufferContent("abc\n123\nxyz\n");
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after first next line", 4, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after second next line", 8, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after third next line", 12, mockEjax.ejax.currentBuffer.cursor);
}

function testNextLineFromIndex1() {
    mockEjax.ejax.setBufferContent("abc\n123\nxyz\n");
    mockEjax.ejax.setCursor(1);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after first next line", 5, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after second next line", 9, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after third next line", 12, mockEjax.ejax.currentBuffer.cursor);
}

function testNextLineFromIndex0WithVariedLines() {
    mockEjax.ejax.setBufferContent("abc\n\n123\n");
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after first next line", 4, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after second next line", 5, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after third next line", 9, mockEjax.ejax.currentBuffer.cursor);
}

function testNextLineFromIndex1WithVariedLines() {
    mockEjax.ejax.setBufferContent("abc\nxy\n\n123\n");
    mockEjax.ejax.setCursor(1);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after first next line", 5, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after second next line", 7, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after third next line", 8, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after fourth next line", 12, mockEjax.ejax.currentBuffer.cursor);
}

function testNextLineWithNewlinesAtTheBeginning() {
    mockEjax.ejax.setBufferContent("\n\n\nabc\n");
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after first next line", 1, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after second next line", 2, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after third next line", 3, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after fourth next line", 7, mockEjax.ejax.currentBuffer.cursor);
}

function testNextLineWithNoNewlinesAtTheEnd() {
    mockEjax.ejax.setBufferContent("\n\n\nabc");
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after first next line", 1, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after second next line", 2, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after third next line", 3, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.nextLine();
    assertEquals("Buffer position after fourth next line", 6, mockEjax.ejax.currentBuffer.cursor);
}

function testPreviousLineFromFirstCharacterOfLastLine() {
    mockEjax.ejax.setBufferContent("abc\n123\nxyz\n");
    mockEjax.ejax.setCursor(12);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after first previous line", 8, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after second previous line", 4, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after third previous line", 0, mockEjax.ejax.currentBuffer.cursor);
}

function testPreviousLineFromSecondCharacterOfLastLine() {
    mockEjax.ejax.setBufferContent("abc\n123\nxyz");
    mockEjax.ejax.setCursor(9);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after first previous line", 5, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after second previous line", 1, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after third previous line", 0, mockEjax.ejax.currentBuffer.cursor);
}

function testPreviousLineWithNewlinesAtBeginning() {
    mockEjax.ejax.setBufferContent("\n\n\n\nxyz\n");
    mockEjax.ejax.setCursor(8);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after first previous line", 4, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after secon previous line", 3, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after third previous line", 2, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after fourth previous line", 1, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after fifth previous line", 0, mockEjax.ejax.currentBuffer.cursor);
}

function testPreviousLineWithNewlinesAfterFirstLine() {
    mockEjax.ejax.setBufferContent("abc\n\n\n\nxyz\n");
    mockEjax.ejax.setCursor(11);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after first previous line", 7, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after secon previous line", 6, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after third previous line", 5, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after fourth previous line", 4, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after fifth previous line", 0, mockEjax.ejax.currentBuffer.cursor);
}

function testEmptyLineThenTwoLinesWithText() {
    mockEjax.ejax.setBufferContent("abc\n\nxyz\n123");
    mockEjax.ejax.setCursor(11);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after first previous line", 7, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after secon previous line", 4, mockEjax.ejax.currentBuffer.cursor);
    mockEjax.ejax.previousLine();
    assertEquals("Buffer position after third previous line", 0, mockEjax.ejax.currentBuffer.cursor);
}
