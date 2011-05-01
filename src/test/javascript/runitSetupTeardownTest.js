var runningValue = 0;
var lastValue = 0;
var first = true;

function setUp() {
    runningValue++;
}

function tearDown() {
    first = false;
    runningValue++;
}

function test1() {
    t();
}

function test2() {
    t();
}

function test3() {
    t();
}

function t() {
    var current = lastValue;
    lastValue = runningValue;

    if (first) {
        first = false;
        assertEquals("Running Value", 1, runningValue);
    } else {
        assertEquals("Running Value", current + 2, runningValue);
    }
}
