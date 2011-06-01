load("format.js");
load("util.js");

function testFormatByWordByColumns() {
    assertEquals("Formatting by word and columns", "This is a\ntest\nformatting", Format.byWord("This is a test formatting", { columns: 10 }));
}

function testFormatAsTable() {
    var table = [["a", "ab", "abc"], ["xyz", "x", "xy"]];
    var result = Format.asTable(table);
    assertEquals("Format table no options", "a   ab abc\n" +
                                            "xyz x  xy", result);
    result = Format.asTable(table, { prefix: "-" });
    assertEquals("Format table with options", "-a   ab abc\n" +
                                              "-xyz x  xy", result);
}

function testFormatAsTableWithNullsOrUndefineds() {
    var table = [[undefined, "ab", "abc"], ["xyz", null, "xy"]];
    var result = Format.asTable(table);
    assertEquals("Format table no options", "    ab abc\n" +
                                            "xyz    xy", result);
    result = Format.asTable(table, { prefix: "-" });
    assertEquals("Format table with options", "-    ab abc\n" +
                                              "-xyz    xy", result);
}

function testFormatAsTableWithVaryingLengths() {
    var table = [["ab", "abc"], ["xyz", "xy", "xy"], ["1", "123", "1", "12"]];
    var result = Format.asTable(table);
    assertEquals("Format table no options", "ab  abc\n" +
                                            "xyz xy  xy\n" +
                                            "1   123 1  12", result);
    result = Format.asTable(table, { prefix: "-" });
    assertEquals("Format table with options", "-ab  abc\n" +
                                              "-xyz xy  xy\n" +
                                              "-1   123 1  12", result);
}
