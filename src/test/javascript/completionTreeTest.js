load("monkeypatches.js");
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

function testComplete() {
    tree.add("xyz", 123);
    tree.add("abc", 321);

    assertEquals("Exists result of finding exact thing", true, tree.find("x").exists);
    assertEquals("Partial result of finding exact thing", true, tree.find("x").partial);
    assertEquals("Requested result of finding exact thing", "x", tree.find("x").requested);
    assertEquals("complete() result of finding exact thing", "xyz", tree.find("x").complete());
}

function testCompleteWithMultiplePaths() {
    tree.add("java", "java");
    tree.add("javascript", "javascript");

    assertEquals("Exists result of finding exact thing", true, tree.find("j").exists);
    assertEquals("Partial result of finding exact thing", true, tree.find("j").partial);
    assertEquals("Requested result of finding exact thing", "j", tree.find("j").requested);
    assertEquals("complete() result of finding exact thing", "java", tree.find("j").complete());
    assertEquals("complete() result of finding exact thing", "javascript", tree.find("javas").complete());
}

function testCompleteWithMultipleDifferentPaths() {
    tree.add("src/test/", "src/test/");
    tree.add("src/javascript/", "src/javascript/");
    tree.add("src/native/", "src/native/");
    tree.add("src/java/", "src/java/");

    assertEquals("complete() result of finding exact thing", "src/java", tree.find("src/j").complete());
    assertEquals("complete() result of finding exact thing", "src/javascript/", tree.find("src/javas").complete());
}
