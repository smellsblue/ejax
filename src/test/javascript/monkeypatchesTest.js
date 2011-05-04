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
