load("completionTree.js");

var tree;

function setUp() {
    tree = new CompletionTree();
}

function testEmptyTree() {
    assertEquals("Result of finding missing thing", false, tree.find("abc").exists);
}

function testNonEmptyTreeWithMissingValue() {
    tree.add("xyz", 123);
    assertEquals("Result of finding missing thing", false, tree.find("abc").exists);
}

function testNonEmptyTreeWithExactValue() {
    tree.add("xyz", 123);
    assertEquals("Exists result of finding exact thing", true, tree.find("xyz").exists);
    assertEquals("Partial result of finding exact thing", false, tree.find("xyz").partial);
    assertEquals("Value result of finding exact thing", 123, tree.find("xyz").value);
}

function testNonEmptyTreeWithPartialValue() {
    tree.add("xyz", 123);
    assertEquals("Exists result of finding partial thing", true, tree.find("xy").exists);
    assertEquals("Partial result of finding partial thing", true, tree.find("xy").partial);
}

function testMultiItemTreeWithExactValue() {
    tree.add("xyz", 123);
    tree.add("xya", 321);

    assertEquals("Exists result of finding exact thing", true, tree.find("xyz").exists);
    assertEquals("Partial result of finding exact thing", false, tree.find("xyz").partial);
    assertEquals("Value result of finding exact thing", 123, tree.find("xyz").value);

    assertEquals("Exists result of finding exact thing", true, tree.find("xya").exists);
    assertEquals("Partial result of finding exact thing", false, tree.find("xya").partial);
    assertEquals("Value result of finding exact thing", 321, tree.find("xya").value);
}
