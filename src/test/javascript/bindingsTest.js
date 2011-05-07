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
    assertEquals("Buffer position after first delete", 2, mockEjax.ejax.screen.currentBuffer.cursor);
    assertEquals("Buffer content after first delete", "ab", mockEjax.ejax.getBufferContent());
    mockEjax.onKeyDown({ keyCode: 46, ctrl: false, alt: false, shift: false });
    assertEquals("Buffer position after second delete", 2, mockEjax.ejax.screen.currentBuffer.cursor);
    assertEquals("Buffer content after first delete", "ab", mockEjax.ejax.getBufferContent());
}

function testBackspaceBinding() {
    mockEjax.ejax.setBufferContent("abc");
    mockEjax.ejax.setCursor(1);
    mockEjax.onKeyDown({ keyCode: 8, ctrl: false, alt: false, shift: false });
    assertEquals("Buffer position after first delete", 0, mockEjax.ejax.screen.currentBuffer.cursor);
    assertEquals("Buffer content after first delete", "bc", mockEjax.ejax.getBufferContent());
    mockEjax.onKeyDown({ keyCode: 8, ctrl: false, alt: false, shift: false });
    assertEquals("Buffer position after second delete", 0, mockEjax.ejax.screen.currentBuffer.cursor);
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
    assertEquals("Name of file loaded", "test.html", nameLoaded);
    assertEquals("Buffer content after finding file", "abc\n123", mockEjax.ejax.getBufferContent());
}

function testEnterThenUp() {
    mockEjax.ejax.setBufferContent("abc");
    mockEjax.onKeyDown({ keyCode: 13, ctrl: false, alt: false, shift: false });
    mockEjax.onKeyDown({ keyCode: 38, ctrl: false, alt: false, shift: false });
    assertEquals("Buffer position after enter and up", 0, mockEjax.ejax.screen.currentBuffer.cursor);
    assertEquals("Buffer content after enter and up", "\nabc", mockEjax.ejax.getBufferContent());
}
