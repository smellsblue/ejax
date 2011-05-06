load("file.js");

function testFileExists() {
    assertEquals("testFile.txt eixsts", true, new File("src/test/javascript/testFile.txt").exists());
}

function testFileContents() {
    assertEquals("testFile.txt contents", "abc\n123\n", new File("src/test/javascript/testFile.txt").contents());
}

function testNonExistentFileContents() {
    assertEquals("Nonexistent file exists", false, new File("src/test/javascript/nosuchfile.txt").exists());
    assertEquals("Nonexistent file contents", "", new File("src/test/javascript/nosuchfile.txt").contents());
}

// TODO: Tests to preserve DOS files... if I even care about that
// (which I don't...).
