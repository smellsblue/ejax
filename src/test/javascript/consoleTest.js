load("mock-ejax.js");
load("ejax-core-complete.js");

var mockEjax;

function setUp() {
    ejax = null;
    mockEjax = new MockEjax();
    mockEjax.setupPixelMethods();
    mockEjax.fireKeyDowns("M-xconsoleRET");
}

function testConsoleStatusLine() {
    assertEquals("Screen row 22", " *console*    L1 (Console)------------------------------------------------------", mockEjax.pixelRow(22));
}

function testInitialBufferContent() {
    assertEquals("Initial console content", "> ", mockEjax.ejax.getBufferContent());
}

function testVariables() {
    mockEjax.fireKeyDowns("varSPCabcSPC=SPC123;RETabcRET");
    assertEquals("Console content after variable", "> var abc = 123;\nundefined\n> abc\n123\n> ", mockEjax.ejax.getBufferContent());
}

function testNullInspect() {
    mockEjax.fireKeyDowns("nullRET");
    assertEquals("Console content after null", "> null\nnull\n> ", mockEjax.ejax.getBufferContent());
}

function testUndefinedInspect() {
    mockEjax.fireKeyDowns("undefinedRET");
    assertEquals("Console content after undefined", "> undefined\nundefined\n> ", mockEjax.ejax.getBufferContent());
}

function testEmptyLine() {
    mockEjax.fireKeyDowns("RET");
    assertEquals("Console content after empty line", "> \nundefined\n> ", mockEjax.ejax.getBufferContent());
}

function testIntInspect() {
    mockEjax.fireKeyDowns("123RET");
    assertEquals("Console content after 123", "> 123\n123\n> ", mockEjax.ejax.getBufferContent());
}

function testFloatInspect() {
    mockEjax.fireKeyDowns("1.1RET");
    assertEquals("Console content after 1.1", "> 1.1\n1.1\n> ", mockEjax.ejax.getBufferContent());
}

function testStringInspect() {
    mockEjax.fireKeyDowns("'abc'RET");
    assertEquals("Console content after abc", "> 'abc'\n\"abc\"\n> ", mockEjax.ejax.getBufferContent());
}

function testArrayInspect() {
    mockEjax.fireKeyDowns("[123,SPC'abc']RET");
    assertEquals("Console content after [123, 'abc']", "> [123, 'abc']\n[123, \"abc\"]\n> ", mockEjax.ejax.getBufferContent());
}

function testObjectInspect() {
    mockEjax.fireKeyDowns("({a:SPC123})RET");
    assertEquals("Console content after ({a: 123})", "> ({a: 123})\n{ a: 123 }\n> ", mockEjax.ejax.getBufferContent());
}

function testFunctionInspect() {
    mockEjax.fireKeyDowns("(functionSPC(x)SPC{SPCreturnSPCx;SPC})RET");
    assertEquals("Console content after (function (x) { return x; })", "> (function (x) { return x; })\n\nfunction (x) {\n    return x;\n}\n\n> ", mockEjax.ejax.getBufferContent());
}

function testRegexInspect() {
    mockEjax.fireKeyDowns("/abc/RET");
    assertEquals("Console content after /abc/", "> /abc/\n/abc/\n> ", mockEjax.ejax.getBufferContent());
}

function testBoolInspect() {
    mockEjax.fireKeyDowns("trueRETfalseRET");
    assertEquals("Console content after true and false", "> true\ntrue\n> false\nfalse\n> ", mockEjax.ejax.getBufferContent());
}

function testDateInspect() {
    var date = new Date(1307080056904);
    mockEjax.fireKeyDowns("newSPCDate(1307080056904)RET");
    assertEquals("Console content after date", "> new Date(1307080056904)\n" + date + "\n> ", mockEjax.ejax.getBufferContent());
}

function testErrorInspect() {
    var error = new Error("This is an error.");
    mockEjax.fireKeyDowns("newSPCError(\"ThisSPCisSPCanSPCerror.\")RET");
    assertEquals("Console content after error", "> new Error(\"This is an error.\")\n" + error + "\n> ", mockEjax.ejax.getBufferContent());
}
