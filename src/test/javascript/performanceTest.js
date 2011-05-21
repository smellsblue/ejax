load("test-utils.js");
load("mock-ejax.js");
load("ejax-core-complete.js");

var mockEjax;

function setUp() {
    ejax = null;
    mockEjax = new MockEjax();
}

function testRedrawPerformance() {
    var delta = time(function() {
        for (var i = 0; i < 100; i++) {
            mockEjax.ejax.screen.redraw();
        }
    });
    assertLessThan("Redrawing 100 times takes less than 100ms", 100, delta);
}

function testHardRedrawPerformance() {
    var delta = time(function() {
        for (var i = 0; i < 100; i++) {
            mockEjax.ejax.screen.hardRedraw();
        }
    });
    assertLessThan("Hard redrawing 100 times takes less than 500ms", 500, delta);
}

function testInsertPerformance() {
    var delta = time(function() {
        for (var i = 0; i < 100; i++) {
            mockEjax.ejax.insert("a");
        }
    });
    assertLessThan("Inserting 100 characters takes less than 100ms", 100, delta);
}

function testDownUpPerformance() {
    mockEjax.ejax.setBufferContent("\n");
    var delta = time(function() {
        for (var i = 0; i < 100; i++) {
            mockEjax.ejax.nextLine();
            mockEjax.ejax.previousLine();
        }
    });
    assertLessThan("Moving down and up 100 times takes less than 100ms", 100, delta);
}

function testDownUpPerformanceViaKeydown() {
    mockEjax.ejax.setBufferContent("\n");
    var delta = time(function() {
        for (var i = 0; i < 100; i++) {
            mockEjax.onKeyDown({ keyCode: 40, ctrl: false, alt: false, shift: false });
            mockEjax.onKeyDown({ keyCode: 38, ctrl: false, alt: false, shift: false });
        }
    });
    assertLessThan("Moving down and up 100 times via keydown takes less than 500ms", 500, delta);
}
