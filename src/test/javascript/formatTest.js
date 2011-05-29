load("format.js");

function testFormatByWordByColumns() {
    assertEquals("Formatting by word and columns", "This is a\ntest\nformatting", Format.byWord("This is a test formatting", { columns: 10 }));
}
