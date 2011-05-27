function Ejax() {};
Ejax.fn = Ejax.prototype;

load("monkeypatches.js");
load("buffers.js");

var mockBuffer = { redraw: function() { }, postRedraw: function() { } };

function testBufferContentLength() {
    assertEquals("Length of buffer content ''", 0, new BufferContent(mockBuffer, "").length());
    assertEquals("Length of buffer content 'abc'", 3, new BufferContent(mockBuffer, "abc").length());
    assertEquals("Length of buffer content 'abc\n'", 4, new BufferContent(mockBuffer, "abc\n").length());
    assertEquals("Length of buffer content 'abc\n123\nxyz'", 11, new BufferContent(mockBuffer, "abc\n123\nxyz").length());
}

function testBufferContentLength() {
    assertEquals("Length of buffer content ''", 0, new BufferContent(mockBuffer, "").length());
    assertEquals("Length of buffer content 'abc'", 3, new BufferContent(mockBuffer, "abc").length());
    assertEquals("Length of buffer content 'abc\n'", 4, new BufferContent(mockBuffer, "abc\n").length());
    assertEquals("Length of buffer content 'abc\n123\nxyz'", 11, new BufferContent(mockBuffer, "abc\n123\nxyz").length());
}

function testGet() {
    assertEquals("Content for ''", "", new BufferContent(mockBuffer, "").get());
    assertEquals("Content for 'abc'", "abc", new BufferContent(mockBuffer, "abc").get());
    assertEquals("Content for 'abc\n'", "abc\n", new BufferContent(mockBuffer, "abc\n").get());
    assertEquals("Content for 'abc\n123\nxyz'", "abc\n123\nxyz", new BufferContent(mockBuffer, "abc\n123\nxyz").get());
}

function testSet() {
    var setAndGet = function(value) {
        var bufferContent = new BufferContent(mockBuffer, "");
        bufferContent.set(value);
        return bufferContent.get();
    };
    assertEquals("Content after set for ''", "", setAndGet(""));
    assertEquals("Content after set for 'abc'", "abc", setAndGet("abc"));
    assertEquals("Content after set for 'abc\n'", "abc\n", setAndGet("abc\n"));
    assertEquals("Content after set for 'abc\n123\nxyz'", "abc\n123\nxyz", setAndGet("abc\n123\nxyz"));
}

function testCharAt() {
    var bufferContent = new BufferContent(mockBuffer, "abc\n123\nxyz");
    assertEquals("Char 'abc\n123\nxyz'[0]", "a", bufferContent.charAt(0));
    assertEquals("Char 'abc\n123\nxyz'[1]", "b", bufferContent.charAt(1));
    assertEquals("Char 'abc\n123\nxyz'[2]", "c", bufferContent.charAt(2));
    assertEquals("Char 'abc\n123\nxyz'[3]", "\n", bufferContent.charAt(3));
    assertEquals("Char 'abc\n123\nxyz'[4]", "1", bufferContent.charAt(4));
    assertEquals("Char 'abc\n123\nxyz'[5]", "2", bufferContent.charAt(5));
    assertEquals("Char 'abc\n123\nxyz'[6]", "3", bufferContent.charAt(6));
    assertEquals("Char 'abc\n123\nxyz'[7]", "\n", bufferContent.charAt(7));
    assertEquals("Char 'abc\n123\nxyz'[8]", "x", bufferContent.charAt(8));
    assertEquals("Char 'abc\n123\nxyz'[9]", "y", bufferContent.charAt(9));
    assertEquals("Char 'abc\n123\nxyz'[10]", "z", bufferContent.charAt(10));
}

function testInsertFromEmpty() {
    var bufferContent = new BufferContent(mockBuffer, "");
    bufferContent.insert("a", 0, 0);
    assertEquals("Result", "a", bufferContent.get());
}

function testInsertNoNewlines() {
    var insertAndGet = function(i) {
        var bufferContent = new BufferContent(mockBuffer, "abc");
        bufferContent.insert("1", i, 0);
        return bufferContent.get();
    };
    assertEquals("Result", "1abc", insertAndGet(0));
    assertEquals("Result", "a1bc", insertAndGet(1));
    assertEquals("Result", "ab1c", insertAndGet(2));
    assertEquals("Result", "abc1", insertAndGet(3));
}

function testInsertWithNewlines() {
    var insertAndGet = function(x, y) {
        var bufferContent = new BufferContent(mockBuffer, "abc\n123\nxyz");
        bufferContent.insert("i", x, y);
        return bufferContent.get();
    };
    assertEquals("Result", "iabc\n123\nxyz", insertAndGet(0, 0));
    assertEquals("Result", "aibc\n123\nxyz", insertAndGet(1, 0));
    assertEquals("Result", "abic\n123\nxyz", insertAndGet(2, 0));
    assertEquals("Result", "abci\n123\nxyz", insertAndGet(3, 0));
    assertEquals("Result", "abc\ni123\nxyz", insertAndGet(0, 1));
    assertEquals("Result", "abc\n1i23\nxyz", insertAndGet(1, 1));
    assertEquals("Result", "abc\n12i3\nxyz", insertAndGet(2, 1));
    assertEquals("Result", "abc\n123i\nxyz", insertAndGet(3, 1));
    assertEquals("Result", "abc\n123\nixyz", insertAndGet(0, 2));
    assertEquals("Result", "abc\n123\nxiyz", insertAndGet(1, 2));
    assertEquals("Result", "abc\n123\nxyiz", insertAndGet(2, 2));
    assertEquals("Result", "abc\n123\nxyzi", insertAndGet(3, 2));
}

function testInsertNewline() {
    var insertAndGet = function(x, y) {
        var bufferContent = new BufferContent(mockBuffer, "abc\n123\nxyz");
        bufferContent.insert("\n", x, y);
        return bufferContent.get();
    };
    var insertAndGetLines = function(x, y) {
        var bufferContent = new BufferContent(mockBuffer, "abc\n123\nxyz");
        bufferContent.insert("\n", x, y);
        return bufferContent.lines;
    };
    assertEquals("Result index 0", "\nabc\n123\nxyz", insertAndGet(0, 0));
    assertArrayEquals("Array result index 0", ["\n", "abc\n", "123\n", "xyz"], insertAndGetLines(0, 0));
    assertEquals("Result index 1", "a\nbc\n123\nxyz", insertAndGet(1, 0));
    assertArrayEquals("Array result index 1", ["a\n", "bc\n", "123\n", "xyz"], insertAndGetLines(1, 0));
    assertEquals("Result index 2", "ab\nc\n123\nxyz", insertAndGet(2, 0));
    assertArrayEquals("Array result index 2", ["ab\n", "c\n", "123\n", "xyz"], insertAndGetLines(2, 0));
    assertEquals("Result index 3", "abc\n\n123\nxyz", insertAndGet(3, 0));
    assertArrayEquals("Array result index 3", ["abc\n", "\n", "123\n", "xyz"], insertAndGetLines(3, 0));
    assertEquals("Result index 4", "abc\n\n123\nxyz", insertAndGet(0, 1));
    assertArrayEquals("Array result index 4", ["abc\n", "\n", "123\n", "xyz"], insertAndGetLines(0, 1));
    assertEquals("Result index 5", "abc\n1\n23\nxyz", insertAndGet(1, 1));
    assertArrayEquals("Array result index 5", ["abc\n", "1\n", "23\n", "xyz"], insertAndGetLines(1, 1));
    assertEquals("Result index 6", "abc\n12\n3\nxyz", insertAndGet(2, 1));
    assertArrayEquals("Array result index 6", ["abc\n", "12\n", "3\n", "xyz"], insertAndGetLines(2, 1));
    assertEquals("Result index 7", "abc\n123\n\nxyz", insertAndGet(3, 1));
    assertArrayEquals("Array result index 7", ["abc\n", "123\n", "\n", "xyz"], insertAndGetLines(3, 1));
    assertEquals("Result index 8", "abc\n123\n\nxyz", insertAndGet(0, 2));
    assertArrayEquals("Array result index 8", ["abc\n", "123\n", "\n", "xyz"], insertAndGetLines(0, 2));
    assertEquals("Result index 9", "abc\n123\nx\nyz", insertAndGet(1, 2));
    assertArrayEquals("Array result index 9", ["abc\n", "123\n", "x\n", "yz"], insertAndGetLines(1, 2));
    assertEquals("Result index 10", "abc\n123\nxy\nz", insertAndGet(2, 2));
    assertArrayEquals("Array result index 10", ["abc\n", "123\n", "xy\n", "z"], insertAndGetLines(2, 2));
    assertEquals("Result index 11", "abc\n123\nxyz\n", insertAndGet(3, 2));
    assertArrayEquals("Array result index 11", ["abc\n", "123\n", "xyz\n", ""], insertAndGetLines(3, 2));
}

function testRemoveSingleCharacter() {
    var bufferContent = new BufferContent(mockBuffer, "a");
    bufferContent.remove(0, 0, 1);
    assertEquals("Content after delete letter", "", bufferContent.get());
    assertArrayEquals("Array after delete letter", [""], bufferContent.lines);

    bufferContent = new BufferContent(mockBuffer, "\n");
    bufferContent.remove(0, 0, 1);
    assertEquals("Content after delete newline", "", bufferContent.get());
    assertArrayEquals("Array after delete newline", [""], bufferContent.lines);
}

function testRemoveWithNewlines() {
    var removeAndGet = function(x, y) {
        var bufferContent = new BufferContent(mockBuffer, "abc\n123\nxyz");
        bufferContent.remove(x, y, 1);
        return bufferContent.get();
    };
    var removeAndGetLines = function(x, y) {
        var bufferContent = new BufferContent(mockBuffer, "abc\n123\nxyz");
        bufferContent.remove(x, y, 1);
        return bufferContent.lines;
    };
    assertEquals("Result index 0", "bc\n123\nxyz", removeAndGet(0, 0));
    assertArrayEquals("Array result index 0", ["bc\n", "123\n", "xyz"], removeAndGetLines(0, 0));
    assertEquals("Result index 1", "ac\n123\nxyz", removeAndGet(1, 0));
    assertArrayEquals("Array result index 1", ["ac\n", "123\n", "xyz"], removeAndGetLines(1, 0));
    assertEquals("Result index 2", "ab\n123\nxyz", removeAndGet(2, 0));
    assertArrayEquals("Array result index 2", ["ab\n", "123\n", "xyz"], removeAndGetLines(2, 0));
    assertEquals("Result index 3", "abc123\nxyz", removeAndGet(3, 0));
    assertArrayEquals("Array result index 3", ["abc123\n", "xyz"], removeAndGetLines(3, 0));
    assertEquals("Result index 4", "abc\n23\nxyz", removeAndGet(0, 1));
    assertArrayEquals("Array result index 4", ["abc\n", "23\n", "xyz"], removeAndGetLines(0, 1));
    assertEquals("Result index 5", "abc\n13\nxyz", removeAndGet(1, 1));
    assertArrayEquals("Array result index 5", ["abc\n", "13\n", "xyz"], removeAndGetLines(1, 1));
    assertEquals("Result index 6", "abc\n12\nxyz", removeAndGet(2, 1));
    assertArrayEquals("Array result index 6", ["abc\n", "12\n", "xyz"], removeAndGetLines(2, 1));
    assertEquals("Result index 7", "abc\n123xyz", removeAndGet(3, 1));
    assertArrayEquals("Array result index 7", ["abc\n", "123xyz"], removeAndGetLines(3, 1));
    assertEquals("Result index 8", "abc\n123\nyz", removeAndGet(0, 2));
    assertArrayEquals("Array result index 8", ["abc\n", "123\n", "yz"], removeAndGetLines(0, 2));
    assertEquals("Result index 9", "abc\n123\nxz", removeAndGet(1, 2));
    assertArrayEquals("Array result index 9", ["abc\n", "123\n", "xz"], removeAndGetLines(1, 2));
    assertEquals("Result index 10", "abc\n123\nxy", removeAndGet(2, 2));
    assertArrayEquals("Array result index 10", ["abc\n", "123\n", "xy"], removeAndGetLines(2, 2));
}

function testDeleteLine() {
    var bufferContent = new BufferContent(mockBuffer, "abc\n123\nxyz\n\ndef");
    bufferContent.deleteLine(1);
    assertEquals("Content after first delete", "abc\nxyz\n\ndef", bufferContent.get());
    assertEquals("Length after first delete", 12, bufferContent.length());
    bufferContent.deleteLine(10);
    assertEquals("Content after delete out of range", "abc\nxyz\n\ndef", bufferContent.get());
    assertEquals("Length after first delete", 12, bufferContent.length());
    bufferContent.deleteLine(3);
    assertEquals("Content after second delete", "abc\nxyz\n\n", bufferContent.get());
    assertEquals("Length after second delete", 9, bufferContent.length());
    bufferContent.deleteLine(3);
    assertEquals("Content after third delete", "abc\nxyz\n\n", bufferContent.get());
    assertEquals("Length after third delete", 9, bufferContent.length());
    bufferContent.deleteLine(1);
    assertEquals("Content after third delete", "abc\n\n", bufferContent.get());
    assertEquals("Length after third delete", 5, bufferContent.length());
    bufferContent.deleteLine(0);
    assertEquals("Content after third delete", "\n", bufferContent.get());
    assertEquals("Length after third delete", 1, bufferContent.length());
    bufferContent.deleteLine(0);
    assertEquals("Content after third delete", "", bufferContent.get());
    assertEquals("Length after third delete", 0, bufferContent.length());
}

function testParameterModeMarker() {
    var bufferContent = new BufferContent(mockBuffer, "");
    bufferContent.parameterMode = true;
    assertEquals("Buffer Content Parameter X", 0, bufferContent.getParameterX());
    assertEquals("Buffer Content Parameter Y", 0, bufferContent.getParameterY());
    bufferContent.set("abc\n123\nxyz");
    assertEquals("Buffer Content Parameter X", 3, bufferContent.getParameterX());
    assertEquals("Buffer Content Parameter Y", 2, bufferContent.getParameterY());
}

function testParameterModeGetAndSetParameter() {
    var bufferContent = new BufferContent(mockBuffer, "abc\n123: ");
    bufferContent.parameterMode = true;
    assertEquals("Parameter content before set", "", bufferContent.getParameter());
    bufferContent.setParameter("xyz");
    assertEquals("Parameter content after first set", "xyz", bufferContent.getParameter());
    assertEquals("Content after first set", "abc\n123: xyz", bufferContent.get());
    assertArrayEquals("Content lines after first set", ["abc\n", "123: xyz"], bufferContent.lines);
    assertEquals("Length after first set", 12, bufferContent.length());
    assertEquals("Buffer Content Parameter X after first set", 5, bufferContent.getParameterX());
    assertEquals("Buffer Content Parameter Y after first set", 1, bufferContent.getParameterY());
    bufferContent.setParameter("321");
    assertEquals("Parameter content after second set", "321", bufferContent.getParameter());
    assertEquals("Content after second set", "abc\n123: 321", bufferContent.get());
    assertArrayEquals("Content lines after second set", ["abc\n", "123: 321"], bufferContent.lines);
    assertEquals("Length after second set", 12, bufferContent.length());
    assertEquals("Buffer Content Parameter X after second set", 5, bufferContent.getParameterX());
    assertEquals("Buffer Content Parameter Y after second set", 1, bufferContent.getParameterY());
    bufferContent.setParameter("def\n321");
    assertEquals("Parameter content after second set", "def\n321", bufferContent.getParameter());
    assertEquals("Content after second set", "abc\n123: def\n321", bufferContent.get());
    assertArrayEquals("Content lines after second set", ["abc\n", "123: def\n", "321"], bufferContent.lines);
    assertEquals("Length after second set", 16, bufferContent.length());
    assertEquals("Buffer Content Parameter X after second set", 5, bufferContent.getParameterX());
    assertEquals("Buffer Content Parameter Y after second set", 1, bufferContent.getParameterY());
}

function testCanEditInContentZoneInParameterMode() {
    var bufferContent = new BufferContent(mockBuffer, "");
    bufferContent.parameterMode = true;
    bufferContent.set("abc\n123\nxyz: ");
    bufferContent.setParameter("def\n321");
    assertEquals("canEdit(0, 0)", false, bufferContent.canEdit(0, 0));
    assertEquals("canEdit(3, 0)", false, bufferContent.canEdit(3, 0));
    assertEquals("canEdit(0, 1)", false, bufferContent.canEdit(0, 1));
    assertEquals("canEdit(3, 1)", false, bufferContent.canEdit(3, 1));
    assertEquals("canEdit(0, 2)", false, bufferContent.canEdit(0, 2));
    assertEquals("canEdit(1, 2)", false, bufferContent.canEdit(1, 2));
    assertEquals("canEdit(4, 2)", false, bufferContent.canEdit(4, 2));
}

function testCanEditInParameterZoneInParameterMode() {
    var bufferContent = new BufferContent(mockBuffer, "");
    bufferContent.parameterMode = true;
    bufferContent.set("abc\n123\nxyz: ");
    bufferContent.setParameter("def\n321");
    assertEquals("canEdit(5, 2)", true, bufferContent.canEdit(5, 2));
    assertEquals("canEdit(6, 2)", true, bufferContent.canEdit(6, 2));
    assertEquals("canEdit(7, 2)", true, bufferContent.canEdit(7, 2));
    assertEquals("canEdit(8, 2)", true, bufferContent.canEdit(8, 2));
    assertEquals("canEdit(0, 3)", true, bufferContent.canEdit(0, 3));
    assertEquals("canEdit(2, 3)", true, bufferContent.canEdit(2, 3));
    assertEquals("canEdit(3, 3)", true, bufferContent.canEdit(3, 3));
}

function ignore_testAppendInParameterModeNoParameter() {
    var bufferContent = new BufferContent(mockBuffer, "");
    bufferContent.parameterMode = true;
    bufferContent.set("abc\n123");
    bufferContent.append("xyz");
    assertEquals("Parameter content after first append", "", bufferContent.getParameter());
    assertEquals("Content after first append", "abc\n123xyz", bufferContent.get());
    assertArrayEquals("Content lines after first append", ["abc\n", "123xyz"], bufferContent.lines);
    assertEquals("Length after first append", 10, bufferContent.length());
    assertEquals("Buffer Content Parameter X after first append", 6, bufferContent.getParameterX());
    assertEquals("Buffer Content Parameter Y after first append", 1, bufferContent.getParameterY());
    bufferContent.append("def\n321");
    assertEquals("Parameter content after second append", "", bufferContent.getParameter());
    assertEquals("Content after second append", "abc\n123xyzdef\n321", bufferContent.get());
    assertArrayEquals("Content lines after second append", ["abc\n", "123xyzdef\n", "321"], bufferContent.lines);
    assertEquals("Length after second append", 17, bufferContent.length());
    assertEquals("Buffer Content Parameter X after second append", 3, bufferContent.getParameterX());
    assertEquals("Buffer Content Parameter Y after second append", 2, bufferContent.getParameterY());
}

function ignore_testAppendInParameterModeWithParameter() {
    var bufferContent = new BufferContent(mockBuffer, "");
    bufferContent.parameterMode = true;
    bufferContent.set("abc\n123");
    bufferContent.setParameter("param");
    bufferContent.append("xyz");
    assertEquals("Parameter content after first append", "param", bufferContent.getParameter());
    assertEquals("Content after first append", "abc\n123xyzparam", bufferContent.get());
    assertArrayEquals("Content lines after first append", ["abc\n", "123xyzparam"], bufferContent.lines);
    assertEquals("Length after first append", 15, bufferContent.length());
    assertEquals("Buffer Content Parameter X after first append", 6, bufferContent.getParameterX());
    assertEquals("Buffer Content Parameter Y after first append", 1, bufferContent.getParameterY());
    bufferContent.append("def\n321");
    assertEquals("Parameter content after second append", "param", bufferContent.getParameter());
    assertEquals("Content after second append", "abc\n123xyzdef\n321param", bufferContent.get());
    assertArrayEquals("Content lines after second append", ["abc\n", "123xyzdef\n", "321param"], bufferContent.lines);
    assertEquals("Length after second append", 22, bufferContent.length());
    assertEquals("Buffer Content Parameter X after second append", 3, bufferContent.getParameterX());
    assertEquals("Buffer Content Parameter Y after second append", 2, bufferContent.getParameterY());
}

function testAppendInParameterModeWithParameterWithNewlines() {
    var bufferContent = new BufferContent(mockBuffer, "");
    bufferContent.parameterMode = true;
    bufferContent.set("abc\n123");
    bufferContent.setParameter("param\nvalue");
    bufferContent.append("xyz");
    assertEquals("Parameter content after first append", "param\nvalue", bufferContent.getParameter());
    assertEquals("Content after first append", "abc\n123xyzparam\nvalue", bufferContent.get());
    assertArrayEquals("Content lines after first append", ["abc\n", "123xyzparam\nvalue"], bufferContent.lines);
    assertEquals("Length after first append", 21, bufferContent.length());
    assertEquals("Buffer Content Parameter X after first append", 6, bufferContent.getParameterX());
    assertEquals("Buffer Content Parameter Y after first append", 1, bufferContent.getParameterY());
    bufferContent.append("def\n321");
    assertEquals("Parameter content after second append", "param\nvalue", bufferContent.getParameter());
    assertEquals("Content after second append", "abc\n123xyzdef\n321param\nvalue", bufferContent.get());
    assertArrayEquals("Content lines after second append", ["abc\n", "123xyzdef\n", "321param\nvalue"], bufferContent.lines);
    assertEquals("Length after second append", 28, bufferContent.length());
    assertEquals("Buffer Content Parameter X after second append", 3, bufferContent.getParameterX());
    assertEquals("Buffer Content Parameter Y after second append", 2, bufferContent.getParameterY());
}

function testAppendInNormalMode() {
    var bufferContent = new BufferContent(mockBuffer, "");
    bufferContent.set("abc\n123");
    bufferContent.append("xyz");
    assertEquals("Content after first append", "abc\n123xyz", bufferContent.get());
    assertArrayEquals("Content lines after first append", ["abc\n", "123xyz"], bufferContent.lines);
    assertEquals("Length after first append", 10, bufferContent.length());
    bufferContent.append("def\n321");
    assertEquals("Content after second append", "abc\n123xyzdef\n321", bufferContent.get());
    assertArrayEquals("Content lines after second append", ["abc\n", "123xyzdef\n", "321"], bufferContent.lines);
    assertEquals("Length after second append", 17, bufferContent.length());
}
