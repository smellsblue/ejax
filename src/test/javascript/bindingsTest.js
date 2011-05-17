load("file.js");
load("mock-ejax.js");
load("ejax-core-complete.js");

var mockEjax;

function setUp() {
    ejax = null;
    mockEjax = new MockEjax();
}

function testDeleteBinding() {
    mockEjax.ejax.setBufferContent("abc");
    mockEjax.ejax.setCursor(2);
    mockEjax.onKeyDown({ keyCode: 46, ctrl: false, alt: false, shift: false });
    assertEquals("Buffer position after first delete", 2, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    assertEquals("Buffer content after first delete", "ab", mockEjax.ejax.getBufferContent());
    mockEjax.onKeyDown({ keyCode: 46, ctrl: false, alt: false, shift: false });
    assertEquals("Buffer position after second delete", 2, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    assertEquals("Buffer content after first delete", "ab", mockEjax.ejax.getBufferContent());
}

function testBackspaceBinding() {
    mockEjax.ejax.setBufferContent("abc");
    mockEjax.ejax.setCursor(1);
    mockEjax.onKeyDown({ keyCode: 8, ctrl: false, alt: false, shift: false });
    assertEquals("Buffer position after first delete", 0, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    assertEquals("Buffer content after first delete", "bc", mockEjax.ejax.getBufferContent());
    mockEjax.onKeyDown({ keyCode: 8, ctrl: false, alt: false, shift: false });
    assertEquals("Buffer position after second delete", 0, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    assertEquals("Buffer content after first delete", "bc", mockEjax.ejax.getBufferContent());
}

function testFindFile() {
    var nameLoaded;
    mockEjax.file = function(name) {
        nameLoaded = name;
        return { contents: function() { return "abc\n123"; }, name: function() { return "test.html"; } };
    };
    mockEjax.onKeyDown({ keyCode: 88, ctrl: true, alt: false, shift: false });
    mockEjax.onKeyDown({ keyCode: 70, ctrl: true, alt: false, shift: false });
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
    mockEjax.onKeyDown({ keyCode: 13, ctrl: false, alt: false, shift: false });
    assertEquals("Name of file loaded", "test.html", nameLoaded);
    assertEquals("Buffer content after finding file", "abc\n123", mockEjax.ejax.getBufferContent());
}

function testEnterThenUp() {
    mockEjax.ejax.setBufferContent("abc");
    mockEjax.onKeyDown({ keyCode: 13, ctrl: false, alt: false, shift: false });
    mockEjax.onKeyDown({ keyCode: 38, ctrl: false, alt: false, shift: false });
    assertEquals("Buffer position after enter and up", 0, mockEjax.ejax.screen.currentWindow.buffer.cursor);
    assertEquals("Buffer content after enter and up", "\nabc", mockEjax.ejax.getBufferContent());
}

function testSaveFileBindings() {
    var file = java.io.File.createTempFile("buffersTestFile", ".txt");
    file.deleteOnExit();

    mockEjax.file = function(filename) {
        return new File(file.getAbsolutePath());
    };

    mockEjax.ejax.findFile(file.getAbsolutePath());
    mockEjax.ejax.setBufferContent("This is the contents of a test file.\n");
    mockEjax.onKeyDown({ keyCode: 88, ctrl: true, alt: false, shift: false });
    mockEjax.onKeyDown({ keyCode: 83, ctrl: true, alt: false, shift: false });
    assertEquals("File content after saving", "This is the contents of a test file.\n", new File(file.getAbsolutePath()).contents());
}
