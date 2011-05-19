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
    bufferContent.insert("a", 0);
    assertEquals("Result", "a", bufferContent.get());
}

function testInsertNoNewlines() {
    var insertAndGet = function(i) {
        var bufferContent = new BufferContent(mockBuffer, "abc");
        bufferContent.insert("1", i);
        return bufferContent.get();
    };
    assertEquals("Result", "1abc", insertAndGet(0));
    assertEquals("Result", "a1bc", insertAndGet(1));
    assertEquals("Result", "ab1c", insertAndGet(2));
    assertEquals("Result", "abc1", insertAndGet(3));
}

function testInsertWithNewlines() {
    var insertAndGet = function(i) {
        var bufferContent = new BufferContent(mockBuffer, "abc\n123\nxyz");
        bufferContent.insert("i", i);
        return bufferContent.get();
    };
    assertEquals("Result", "iabc\n123\nxyz", insertAndGet(0));
    assertEquals("Result", "aibc\n123\nxyz", insertAndGet(1));
    assertEquals("Result", "abic\n123\nxyz", insertAndGet(2));
    assertEquals("Result", "abci\n123\nxyz", insertAndGet(3));
    assertEquals("Result", "abc\ni123\nxyz", insertAndGet(4));
    assertEquals("Result", "abc\n1i23\nxyz", insertAndGet(5));
    assertEquals("Result", "abc\n12i3\nxyz", insertAndGet(6));
    assertEquals("Result", "abc\n123i\nxyz", insertAndGet(7));
    assertEquals("Result", "abc\n123\nixyz", insertAndGet(8));
    assertEquals("Result", "abc\n123\nxiyz", insertAndGet(9));
    assertEquals("Result", "abc\n123\nxyiz", insertAndGet(10));
    assertEquals("Result", "abc\n123\nxyzi", insertAndGet(11));
}

function testInsertNewline() {
    var insertAndGet = function(i) {
        var bufferContent = new BufferContent(mockBuffer, "abc\n123\nxyz");
        bufferContent.insert("\n", i);
        return bufferContent.get();
    };
    var insertAndGetLines = function(i) {
        var bufferContent = new BufferContent(mockBuffer, "abc\n123\nxyz");
        bufferContent.insert("\n", i);
        return bufferContent.lines;
    };
    assertEquals("Result index 0", "\nabc\n123\nxyz", insertAndGet(0));
    assertArrayEquals("Array result index 0", ["\n", "abc\n", "123\n", "xyz"], insertAndGetLines(0));
    assertEquals("Result index 1", "a\nbc\n123\nxyz", insertAndGet(1));
    assertArrayEquals("Array result index 1", ["a\n", "bc\n", "123\n", "xyz"], insertAndGetLines(1));
    assertEquals("Result index 2", "ab\nc\n123\nxyz", insertAndGet(2));
    assertArrayEquals("Array result index 2", ["ab\n", "c\n", "123\n", "xyz"], insertAndGetLines(2));
    assertEquals("Result index 3", "abc\n\n123\nxyz", insertAndGet(3));
    assertArrayEquals("Array result index 3", ["abc\n", "\n", "123\n", "xyz"], insertAndGetLines(3));
    assertEquals("Result index 4", "abc\n\n123\nxyz", insertAndGet(4));
    assertArrayEquals("Array result index 4", ["abc\n", "\n", "123\n", "xyz"], insertAndGetLines(4));
    assertEquals("Result index 5", "abc\n1\n23\nxyz", insertAndGet(5));
    assertArrayEquals("Array result index 5", ["abc\n", "1\n", "23\n", "xyz"], insertAndGetLines(5));
    assertEquals("Result index 6", "abc\n12\n3\nxyz", insertAndGet(6));
    assertArrayEquals("Array result index 6", ["abc\n", "12\n", "3\n", "xyz"], insertAndGetLines(6));
    assertEquals("Result index 7", "abc\n123\n\nxyz", insertAndGet(7));
    assertArrayEquals("Array result index 7", ["abc\n", "123\n", "\n", "xyz"], insertAndGetLines(7));
    assertEquals("Result index 8", "abc\n123\n\nxyz", insertAndGet(8));
    assertArrayEquals("Array result index 8", ["abc\n", "123\n", "\n", "xyz"], insertAndGetLines(8));
    assertEquals("Result index 9", "abc\n123\nx\nyz", insertAndGet(9));
    assertArrayEquals("Array result index 9", ["abc\n", "123\n", "x\n", "yz"], insertAndGetLines(9));
    assertEquals("Result index 10", "abc\n123\nxy\nz", insertAndGet(10));
    assertArrayEquals("Array result index 10", ["abc\n", "123\n", "xy\n", "z"], insertAndGetLines(10));
    assertEquals("Result index 11", "abc\n123\nxyz\n", insertAndGet(11));
    assertArrayEquals("Array result index 11", ["abc\n", "123\n", "xyz\n", ""], insertAndGetLines(11));
}

function testRemoveSingleCharacter() {
    var bufferContent = new BufferContent(mockBuffer, "a");
    bufferContent.remove(0, 1);
    assertEquals("Content after delete letter", "", bufferContent.get());
    assertArrayEquals("Array after delete letter", [""], bufferContent.lines);

    bufferContent = new BufferContent(mockBuffer, "\n");
    bufferContent.remove(0, 1);
    assertEquals("Content after delete newline", "", bufferContent.get());
    assertArrayEquals("Array after delete newline", [""], bufferContent.lines);
}

function testRemoveWithNewlines() {
    var removeAndGet = function(i) {
        var bufferContent = new BufferContent(mockBuffer, "abc\n123\nxyz");
        bufferContent.remove(i, 1);
        return bufferContent.get();
    };
    var removeAndGetLines = function(i) {
        var bufferContent = new BufferContent(mockBuffer, "abc\n123\nxyz");
        bufferContent.remove(i, 1);
        return bufferContent.lines;
    };
    assertEquals("Result index 0", "bc\n123\nxyz", removeAndGet(0));
    assertArrayEquals("Array result index 0", ["bc\n", "123\n", "xyz"], removeAndGetLines(0));
    assertEquals("Result index 1", "ac\n123\nxyz", removeAndGet(1));
    assertArrayEquals("Array result index 1", ["ac\n", "123\n", "xyz"], removeAndGetLines(1));
    assertEquals("Result index 2", "ab\n123\nxyz", removeAndGet(2));
    assertArrayEquals("Array result index 2", ["ab\n", "123\n", "xyz"], removeAndGetLines(2));
    assertEquals("Result index 3", "abc123\nxyz", removeAndGet(3));
    assertArrayEquals("Array result index 3", ["abc123\n", "xyz"], removeAndGetLines(3));
    assertEquals("Result index 4", "abc\n23\nxyz", removeAndGet(4));
    assertArrayEquals("Array result index 4", ["abc\n", "23\n", "xyz"], removeAndGetLines(4));
    assertEquals("Result index 5", "abc\n13\nxyz", removeAndGet(5));
    assertArrayEquals("Array result index 5", ["abc\n", "13\n", "xyz"], removeAndGetLines(5));
    assertEquals("Result index 6", "abc\n12\nxyz", removeAndGet(6));
    assertArrayEquals("Array result index 6", ["abc\n", "12\n", "xyz"], removeAndGetLines(6));
    assertEquals("Result index 7", "abc\n123xyz", removeAndGet(7));
    assertArrayEquals("Array result index 7", ["abc\n", "123xyz"], removeAndGetLines(7));
    assertEquals("Result index 8", "abc\n123\nyz", removeAndGet(8));
    assertArrayEquals("Array result index 8", ["abc\n", "123\n", "yz"], removeAndGetLines(8));
    assertEquals("Result index 9", "abc\n123\nxz", removeAndGet(9));
    assertArrayEquals("Array result index 9", ["abc\n", "123\n", "xz"], removeAndGetLines(9));
    assertEquals("Result index 10", "abc\n123\nxy", removeAndGet(10));
    assertArrayEquals("Array result index 10", ["abc\n", "123\n", "xy"], removeAndGetLines(10));
}
