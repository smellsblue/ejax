load("ejax-core-complete.js");

function testIsString() {
    assertEquals("String isString", true, "".isString());
}

function testIsNotString() {
    assertEquals("Array isString", false, [].isString());
    assertEquals("Array of strings isString", false, ["abc", "xyz"].isString());
    assertEquals("Object isString", false, {}.isString());
    assertEquals("Number isString", false, (1).isString());
}

function testIsFunction() {
    assertEquals("String isFunction", true, (function() {}).isFunction());
}

function testIsNotFunction() {
    assertEquals("Array isFunction", false, [].isFunction());
    assertEquals("Array of strings isFunction", false, ["abc", "xyz"].isFunction());
    assertEquals("Object isFunction", false, {}.isFunction());
    assertEquals("Number isFunction", false, (1).isFunction());
}

function testInclusiveSplit() {
    assertArrayEquals("Inclusive split: ''", [""], "".inclusiveSplit("\n"));
    assertArrayEquals("Inclusive split: 'abc'", ["abc"], "abc".inclusiveSplit("\n"));
    assertArrayEquals("Inclusive split: 'abc\n'", ["abc\n", ""], "abc\n".inclusiveSplit("\n"));
    assertArrayEquals("Inclusive split: 'abc\n123'", ["abc\n", "123"], "abc\n123".inclusiveSplit("\n"));
    assertArrayEquals("Inclusive split: 'abc\n123\nxyz\n'", ["abc\n", "123\n", "xyz\n", ""], "abc\n123\nxyz\n".inclusiveSplit("\n"));
}
