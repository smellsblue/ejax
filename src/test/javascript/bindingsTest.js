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
