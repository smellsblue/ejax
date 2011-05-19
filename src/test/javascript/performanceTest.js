load("test-utils.js");
load("mock-ejax.js");
load("ejax-core-complete.js");

var mockEjax;

function setUp() {
    ejax = null;
    mockEjax = new MockEjax();
}

function ignore_testInsertPerformance() {
    var delta = time(function() {
        for (var i = 0; i < 100; i++) {
            mockEjax.onKeyDown({ keyCode: 65, ctrl: false, alt: false, shift: false });
        }
    });
    assertLessThan("Inserting 100 characters takes less than 1 second", 1000, delta);
}
