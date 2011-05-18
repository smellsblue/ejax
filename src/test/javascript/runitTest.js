function testAssertEqualsTrue() {
    assertEquals(true, true);
    assertEquals("Custom Message", true, true);
}

function testAssertEqualsFalse() {
    assertEquals(false, false);
    assertEquals("Custom Message", false, false);
}

function testAssertThrowDoesntThrow() {
    var msg = "";

    try {
        assertThrows("Won't throw", function() {});
    } catch (e) {
        msg = e.message;
    }

    assertEquals("Error Message", "missing expected exception with message 'Won't throw'.", msg);
}

function testAssertThrowWrongMessage() {
    var msg = "";

    try {
        assertThrows("Wrong Message", function() {
            throw new Error("This is my message");
        });
    } catch (e) {
        msg = e.message;
    }

    assertEquals("Error Message", "Exception Message: expected <Wrong Message> but was <This is my message>", msg);
}

function testAssertThrowStringWrongMessage() {
    var msg = "";

    try {
        assertThrows("Wrong Message", function() {
            throw "This is my message";
        });
    } catch (e) {
        msg = e.message;
    }

    assertEquals("Error Message", "Exception Message: expected <Wrong Message> but was <This is my message>", msg);
}

function testAssertThrowsSuccessful() {
    var thrown = false;

    try {
        assertThrows("Correct Message", function() {
            throw "Correct Message";
        });
    } catch (e) {
        thrown = true;
    }

    assertEquals("Error Thrown", false, thrown);
}

function testAssertFailureMessageBoolean() {
    assertThrows("My Boolean: expected <true> but was <false>", function() {
        assertEquals("My Boolean", true, false);
    });

    assertThrows("expected <false> but was <true>", function() {
        assertEquals(false, true);
    });
}

function testAssertFailureMessageInt() {
    assertThrows("My Int: expected <123> but was <321>", function() {
        assertEquals("My Int", 123, 321);
    });

    assertThrows("expected <321> but was <123>", function() {
        assertEquals(321, 123);
    });
}

function testAssertFailureMessageString() {
    assertThrows("My String: expected <Correct String> but was <Wrong String>", function() {
        assertEquals("My String", "Correct String", "Wrong String");
    });

    assertThrows("expected <Correct String> but was <Wrong String>", function() {
        assertEquals("Correct String", "Wrong String");
    });
}

function testFail() {
    assertThrows("My custom failure.", function() {
        fail("My custom failure.");
    });
}

function testAssertObjectEqualsNull() {
    assertObjectEquals(null, null);
    assertObjectEquals("Custom Message", null, null);
}

function testAssertObjectEqualsUndefined() {
    assertObjectEquals(undefined, undefined);
    assertObjectEquals("Custom Message", undefined, undefined);
}

function testAssertObjectEqualsEmpty() {
    assertObjectEquals({}, {});
    assertObjectEquals("Custom Message", {}, {});
}

function testAssertObjectEqualsEmptyArray() {
    assertObjectEquals([], []);
    assertObjectEquals("Custom Message", [], []);
}

function CustomObject(property1, property2) {
    this.property1 = property1;
    this.property2 = property2;
}

function testAssertObjectEqualsSimpleObject() {
    assertObjectEquals({property1: 1, property2: 2}, {property1: 1, property2: 2});
    assertObjectEquals("Custom Message", {property1: 1, property2: 2}, {property1: 1, property2: 2});
    assertObjectEquals({property1: 1, property2: true}, {property1: 1, property2: true});
    assertObjectEquals({property1: 1, property2: "Correct Property"}, {property1: 1, property2: "Correct Property"});
    assertObjectEquals({property1: 1, property2: new Date(1234)}, {property1: 1, property2: new Date(1234)});
    assertObjectEquals({property1: 1, property2: /^.*$/}, {property1: 1, property2: /^.*$/});
    assertObjectEquals({property1: 1, property2: {prop1: 1, prop2: 2}}, {property1: 1, property2: {prop1: 1, prop2: 2}});
    assertObjectEquals(new CustomObject(1, 2), new CustomObject(1, 2));
}

function testAssertObjectEqualsWrongConstructor() {
    assertThrows("My Object: expected constructor <CustomObject> but was <Object>", function() {
        assertObjectEquals("My Object", new CustomObject(1, 2), {property1: 1, property2: 2});
    });

    assertThrows("expected constructor <Object> but was <CustomObject>", function() {
        assertObjectEquals({property1: 1, property2: 2}, new CustomObject(1, 2));
    });
}

function testAssertObjectEqualsLessProperties() {
    assertThrows("My Object: missing expected property <property2>", function() {
        assertObjectEquals("My Object", {property1: 1, property2: 2}, {property1: 1});
    });

    assertThrows("missing expected property <property2>", function() {
        assertObjectEquals({property1: 1, property2: 2}, {property1: 1});
    });
}

function testAssertObjectEqualsMoreProperties() {
    assertThrows("My Object: unexpected property <property2>", function() {
        assertObjectEquals("My Object", {property1: 1}, {property1: 1, property2: 2});
    });

    assertThrows("unexpected property <property2>", function() {
        assertObjectEquals({property1: 1}, {property1: 1, property2: 2});
    });
}

function testAssertObjectEqualsWrongProperties() {
    assertThrows("My Object[property2]: expected <2> but was <22>", function() {
        assertObjectEquals("My Object", {property1: 1, property2: 2}, {property1: 1, property2: 22});
    });

    assertThrows("[property2]: expected <true> but was <false>", function() {
        assertObjectEquals({property1: 1, property2: true}, {property1: 1, property2: false});
    });

    assertThrows("[property2]: expected <Correct Property> but was <Wrong Property>", function() {
        assertObjectEquals({property1: 1, property2: "Correct Property"}, {property1: 1, property2: "Wrong Property"});
    });

    assertThrows("[property2]: expected <Wed Dec 31 1969 16:00:01 GMT-0800 (PST)> but was <Wed Dec 31 1969 16:00:12 GMT-0800 (PST)>", function() {
        assertObjectEquals({property1: 1, property2: new Date(1234)}, {property1: 1, property2: new Date(12345)});
    });

    assertThrows("[property2]: expected </\\/(.*)$/> but was </^\\/(.*)$/>", function() {
        assertObjectEquals({property1: 1, property2: /\/(.*)$/}, {property1: 1, property2: /^\/(.*)$/});
    });

    assertThrows("expected </\\/(.*)$/> but was </^\\/(.*)$/>", function() {
        assertObjectEquals(/\/(.*)$/, /^\/(.*)$/);
    });

    assertThrows("expected <Wed Dec 31 1969 16:00:01 GMT-0800 (PST)> but was <Wed Dec 31 1969 16:00:12 GMT-0800 (PST)>", function() {
        assertObjectEquals(new Date(1234), new Date(12345));
    });
}

function testAssertObjectEqualsWrongDeepProperties() {
    assertThrows("My Object[property2][prop1]: expected <2> but was <22>", function() {
        assertObjectEquals("My Object", {property1: 1, property2: {prop1: 2}}, {property1: 1, property2: {prop1: 22}});
    });

    assertThrows("[property2][prop1]: expected <true> but was <false>", function() {
        assertObjectEquals({property1: 1, property2: {prop1: true}}, {property1: 1, property2: {prop1: false}});
    });

    assertThrows("[property2][prop1]: expected <Correct Property> but was <Wrong Property>", function() {
        assertObjectEquals({property1: 1, property2: {prop1: "Correct Property"}}, {property1: 1, property2: {prop1: "Wrong Property"}});
    });

    assertThrows("[property2][prop1]: expected <Wed Dec 31 1969 16:00:01 GMT-0800 (PST)> but was <Wed Dec 31 1969 16:00:12 GMT-0800 (PST)>", function() {
        assertObjectEquals({property1: 1, property2: {prop1: new Date(1234)}}, {property1: 1, property2: {prop1: new Date(12345)}});
    });
}

function testAssertObjectEqualsWithArray() {
    assertObjectEquals([1, 2, 3], [1, 2, 3]);
    assertObjectEquals({prop: [1, 2, 3]}, {prop: [1, 2, 3]});
}

function testAssertObjectEqualsWithArrayFails() {
    assertThrows("[0]: expected <1> but was <3>", function() {
        assertObjectEquals([1, 2, 3], [3, 2, 1]);
    });

    assertThrows("[prop][0]: expected <1> but was <3>", function() {
        assertObjectEquals({prop: [1, 2, 3]}, {prop: [3, 2, 1]});
    });

    assertThrows("Array value[0]: expected <1> but was <3>", function() {
        assertObjectEquals("Array value", [1, 2, 3], [3, 2, 1]);
    });

    assertThrows("Array value[prop][0]: expected <1> but was <3>", function() {
        assertObjectEquals("Array value", {prop: [1, 2, 3]}, {prop: [3, 2, 1]});
    });

    assertThrows("Array value: missing expected property <3>", function() {
        assertObjectEquals("Array value", [1, 2, 3, 4], [1, 2, 3]);
    });

    assertThrows("Array value: unexpected property <3>", function() {
        assertObjectEquals("Array value", [1, 2, 3], [1, 2, 3, 4]);
    });
}
