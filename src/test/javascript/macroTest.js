load("mock-ejax.js");
load("ejax-core-complete.js");

var mockEjax;

function setUp() {
    ejax = null;
    mockEjax = new MockEjax();
    mockEjax.setupPixelMethods();
}

function testBeginEndRunMacro() {
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("C-x(acLEFTbRIGHT");
    assertEquals("Screen row  0", "abc                                                                             ", mockEjax.pixelRow(0));
    mockEjax.fireKeyDowns("C-x)");
    assertEquals("Screen row  0", "abc                                                                             ", mockEjax.pixelRow(0));
    mockEjax.fireKeyDowns("C-xe");
    assertEquals("Screen row  0", "abcabc                                                                          ", mockEjax.pixelRow(0));
    mockEjax.fireKeyDowns("C-xe");
    assertEquals("Screen row  0", "abcabcabc                                                                       ", mockEjax.pixelRow(0));
}

function testBeginRingBellForInvalidCommandEndRunMacro() {
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("C-x(acLEFTbRIGHTC-x)C-x(123C-xC-hC-x)C-xe");
    assertEquals("Screen row  0", "abc123abc                                                                       ", mockEjax.pixelRow(0));
}

function testBeginRingBellFromCommandEndRunMacro() {
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("C-x(acLEFTbRIGHTC-x)C-x(123C-aLEFTC-x)C-eC-xe");
    assertEquals("Screen row  0", "abc123abc                                                                       ", mockEjax.pixelRow(0));
}

function testBeginQuitCommandEndRunMacro() {
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("C-x(acLEFTbRIGHTC-x)C-x(123C-gC-x)C-xe");
    assertEquals("Screen row  0", "abc123abc                                                                       ", mockEjax.pixelRow(0));
}

function testSlottedMacros() {
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("F3abcC-1F3123C-M-e2");
    assertEquals("Screen row  0", "abc123                                                                          ", mockEjax.pixelRow(0));
    mockEjax.fireKeyDowns("C-1C-2C-1C-2");
    assertEquals("Screen row  0", "abc123abc123abc123                                                              ", mockEjax.pixelRow(0));
    mockEjax.fireKeyDowns("F3xyzF4C-1C-2M-3C-M-e1C-M-e2C-M-e3");
    assertEquals("Screen row  0", "abc123abc123abc123xyzabc123abc123xyz                                            ", mockEjax.pixelRow(0));
}

function testInsertMacro() {
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("F3abcRETF4M-xinsertMacroRET");
    assertEquals("Screen row  1", 'ejax.run(["a", "b", "c", "RET"]);                                               ', mockEjax.pixelRow(1));
}

function testInsertMacroWithEscapables() {
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("F3\"a\"RETF4M-xinsertMacroRET");
    assertEquals("Screen row  1", 'ejax.run(["\\"", "a", "\\"", "RET"]);                                             ', mockEjax.pixelRow(1));
}

function testInsertSlottedMacro() {
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("F3abcC-1F3123C-M-e2RETM-xinsertMacro1RETRETM-xinsertMacro2RET");
    assertEquals("Screen row  1", 'ejax.run(["a", "b", "c"]);                                                      ', mockEjax.pixelRow(1));
    assertEquals("Screen row  2", 'ejax.run(["1", "2", "3"]);                                                      ', mockEjax.pixelRow(2));
}

function testInsertAndExecuteMacro() {
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("F3RETabcF4C-SPCM-xinsertMacroRETC-xC-e");
    assertEquals("Screen row  2", "abc                                                                             ", mockEjax.pixelRow(2));
}

function testNameMacro() {
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("F3abcF4M-xnameMacroRETcallAbcRETM-xcallAbcRET");
    assertEquals("Screen row  0", "abcabc                                                                          ", mockEjax.pixelRow(0));
}

function testNameMacroAfterCreatingNewMacro() {
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("F3abcF4M-xnameMacroRETcallAbcRETF3123F4M-xcallAbcRET");
    assertEquals("Screen row  0", "abc123abc                                                                       ", mockEjax.pixelRow(0));
}

function testNameSlottedMacro() {
    mockEjax.ejax.screen.hardRedraw();
    mockEjax.fireKeyDowns("F3abcC-2F3123F4M-xnameMacro2RETcallAbcRETM-xcallAbcRET");
    assertEquals("Screen row  0", "abc123abc                                                                       ", mockEjax.pixelRow(0));
}
