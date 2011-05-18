var runit = runit || {};
runit.FAILURE_VALUE = runit.FAILURE_VALUE || 1;
runit.lastRun = runit.lastRun || {};
runit.verbose = runit.verbose || false;
runit.context = runit.context || this;
runit.engine = runit.engine || scriptEngine;
runit.asserts = runit.asserts || {};
runit.asserts.ignoreAssertObjectEquals = runit.asserts.ignoreAssertObjectEquals || {};

runit.TestResult = runit.TestResult || function(script, testName, passed, error) {
    this.script = script;
    this.testName = testName;
    this.passed = passed;
    this.error = error;

    this.getResultType = function() {
        if (this.passed) {
            return ".";
        }

        if (this.error instanceof AssertionError) {
            return "F";
        }

        return "E";
    };

    this.getResultTypeName = function() {
        if (this.passed) {
            return "Success";
        }

        if (this.error instanceof AssertionError) {
            return "Failure";
        }

        return "Error";
    };

    this.print = function() {
        print(this.getResultType());
    };

    this.printDetails = function(count, fullDetails) {
        if (!this.passed) {
            println("");
            print(count + ") ");
            print(this.getResultTypeName());
            print(" from test '");

            if (fullDetails && this.script && this.script != "") {
                var scriptName = /\\|\/([^\\\/]*)$/.exec(this.script)[1];

                if (scriptName && scriptName != "") {
                    print(scriptName + " -> ");
                }
            }

            println(this.testName + "'");
            this.printError();
        }
    };

    this.printError = function() {
        if (this.error.rhinoException && typeof(this.error.rhinoException.printStackTrace) == "function") {
            print("  ");
            this.error.rhinoException.printStackTrace(java.lang.System.out);
        } else {
            println("  " + this.error.name + ": " + this.error.message);
        }
    };
};

runit.TestResultSet = runit.TestResultSet || function() {
    this.results = [];
    this.failureCount = 0;
    this.length = 0;

    this.push = function(result) {
        this.results.push(result);
        this.length++;

        if (!result.passed) {
            this.failureCount++;
        }
    };

    this.printResultsDetails = function() {
        var count = 0;

        for (var i = 0; i < this.results.length; i++) {
            if (!this.results[i].passed) {
                count++;
            }

            this.results[i].printDetails(count);
        }
    };

    this.getFailures = function() {
        var failures = [];

        for (var i = 0; i < this.results.length; i++) {
            if (!this.results[i].passed) {
                failures.push(this.results[i]);
            }
        }

        return failures;
    };
};

runit.TestFilter = runit.TestFilter || function(filter) {
    this.originalFilter = filter;
    this.enabled = false;
    this.filters = {};
    var splitFilter = filter.split(",");

    for (var i = 0; i < splitFilter.length; i++) {
        if (!splitFilter[i].match(/^\s*$/) ) {
            this.enabled = true;
            var filterValue = new String(splitFilter[i]).split(".", 2);
            this.filters[filterValue[0]] = this.filters[filterValue[0]] || { length: 0, tests: {} };

            if (filterValue.length == 2) {
                this.filters[filterValue[0]].length++;
                this.filters[filterValue[0]].tests[filterValue[1]] = true;
            }
        }
    }
};

runit.TestFilter.prototype.filterScripts = function(scripts) {
    if (!this.enabled) {
        return scripts;
    }

    var newScripts = [];

    for (var i = 0; i < scripts.length; i++) {
        var file = new java.io.File(scripts[i]);
        var name = new String(file.getName()).replace(/\.js$/, "");

        if (this.filters[name]) {
            newScripts.push(scripts[i])
        }
    }

    return newScripts;
};

runit.TestFilter.prototype.filterTest = function(name) {
    if (!this.enabled) {
        return true;
    }

    var file = new java.io.File(this.currentScript);
    var scriptName = new String(file.getName()).replace(/\.js$/, "");

    if (this.filters[scriptName].length == 0) {
        return true;
    }

    return this.filters[scriptName].tests[name];
};

runit.file = runit.file || function(filename) {
    var file = new java.io.File(filename);

    if (file.exists() && file.isFile()) {
        return file;
    }

    // Cannot load a file from the jar, so skip that possibility

    var paths = java.lang.System.getProperty("java.class.path").split(java.lang.System.getProperty("path.separator"));
    var filenameWithSeparator = filename;

    if (!filenameWithSeparator.startsWith(java.io.File.separator)) {
        filenameWithSeparator = java.io.File.separator + filenameWithSeparator;
    }

    for (var i = 0; i < paths.length; i++) {
        var path = paths[i];
        var pathFile = new java.io.File(path);

        if (!pathFile.exists()) {
            continue;
        }

        if (pathFile.isFile() && pathFile.getCanonicalPath().endsWith(filenameWithSeparator)) {
            return pathFile;
        } else if (pathFile.isDirectory()) {
            file = new java.io.File(pathFile, filename);

            if (file.exists() && file.isFile()) {
                return file;
            }
        }
    }

    throw new Error("Cannot find file '" + filename + "'");
};

runit.fileLines = runit.fileLines || function(file) {
    var reader = new java.io.BufferedReader(new java.io.FileReader(file));

    try {
        var line = reader.readLine();
        var result = new java.util.LinkedList();

        while (line != null) {
            result.add(line);
            line = reader.readLine();
        }

        return result;
    } finally {
        reader.close();
    }
};

runit.main = runit.main || function(argv) {
    var scripts = [];
    var testsToRunFilter = "";

    for (var i = 0; i < argv.length; i++) {
        var arg = argv[i];

        if (arg.match(/^@.+/)) {
            arg = arg.substring(1, arg.length());
            var contents = runit.fileLines(runit.file(arg));

            for (var j = 0; j < contents.size(); j++) {
                var script = contents.get(j);

                if (!script.match(/^\s*$/)) {
                    scripts.push(script);
                }
            }
        } else if (arg.match(/^#/)) {
            testsToRunFilter = arg.substring(1, arg.length());
        } else {
            scripts.push(arg);
        }
    }

    testsToRunFilter = new runit.TestFilter(testsToRunFilter);
    var testCount = 0;
    var failureCount = 0;
    var failures = [];
    println("Running JavaScript tests.");
    scripts = testsToRunFilter.filterScripts(scripts);

    for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];
        testsToRunFilter.currentScript = script;
        println("");
        println("Running tests for '" + script + "'");
        println("");

        try {
            var engine = org.ejax.javascript.Execute.newEngine();
            engine.eval("load(\"runit.js\")");
            engine.eval(new java.io.FileReader(runit.file(script)));
            engine.invokeMethod(engine.eval("runit"), "run", [{verbose: runit.verbose, filter: testsToRunFilter, script: script}]);
            var lastCount = engine.eval("runit.lastRun.testCount;");
            var lastFailureCount = engine.eval("runit.lastRun.failureCount;");
            var lastFailures = engine.eval("runit.lastRun.failures;");
            testCount += lastCount.intValue();
            failureCount += lastFailureCount.intValue();

            for (var j = 0; j < lastFailures.length; j++) {
                failures.push(lastFailures[j]);
            }
        } catch (e) {
            if (e.rhinoException && typeof(e.rhinoException.printStackTrace) == "function") {
                e.rhinoException.printStackTrace();
            } else {
                println("Exception caught: " + e.name + ": " + e.message);
            }
            testCount++;
            failureCount++;
            failures.push(new runit.TestResult("", script, false, e));
        }
    }

    if (failures.length > 0) {
        println("");
        println("");
        println("All Failures:");

        for (var i = 0; i < failures.length; i++) {
            failures[i].printDetails(i + 1, true);
        }
    }

    println("");
    println("");
    println("==========================================");
    println("Total tests run: " + testCount + ", Failures: " + failureCount);
    println("==========================================");

    if (failureCount > 0) {
        return runit.FAILURE_VALUE;
    }
};

runit.run = runit.run || function(options) {
    runit.verbose = false;

    if (options && options["verbose"] === true) {
        runit.verbose = true;
    }

    var tests = [];
    var results = new runit.TestResultSet();
    var script = options.script;

    for (var property in runit.context) {
        if (typeof(runit.context[property]) == "function" && property.match(/^test.+/)) {
            if (!options.filter || options.filter.filterTest(property)) {
                runit.verbosePrint("Found test '" + property + "'\n");
                tests.push({name: property, fn: runit.context[property]});
            }
        }
    }

    for (var i = 0; i < tests.length; i++) {
        var result = runit.runTest(script, tests[i]);
        results.push(result);
        result.print();
    }

    println("");
    results.printResultsDetails();
    println("");
    println("");
    println("------------------------------------------");
    println("Tests run: " + results.length + ", Failures: " + results.failureCount);
    println("------------------------------------------");
    runit.lastRun.testCount = results.length;
    runit.lastRun.failureCount = results.failureCount;
    runit.lastRun.failures = results.getFailures();
};

runit.runTest = runit.runTest || function(script, test) {
    try {
        if (typeof(runit.context.setUp) == "function") {
            runit.context.setUp();
        }
    } catch (e) {
        return new runit.TestResult(script, test.name + "[setUp]", false, e);
    }

    try {
        test.fn();
    } catch (e) {
        return new runit.TestResult(script, test.name, false, e);
    }

    try {
        if (typeof(runit.context.tearDown) == "function") {
            runit.context.tearDown();
        }
    } catch (e) {
        return new runit.TestResult(script, test.name + "[tearDown]", false, e);
    }

    return new runit.TestResult(script, test.name, true);
};

runit.verbosePrint = runit.verbosePrint || function(msg) {
    if (runit.verbose) {
        print(msg);
    }
};

function AssertionError(message) {
    this.name = "AssertionError";
    this.message = message;
}

function assertEquals() {
    var args = parseAssertArguments(arguments);

    if (args.expected != args.actual) {
        fail(assertionMessage(args.message) + "expected <" + args.expected + "> but was <" + args.actual + ">");
    }
}

function assertionMessage(message) {
    var msg = "";

    if (message) {
        msg += message + ": ";
    }

    return msg;
}

function assertArrayEquals() {
    var args = parseAssertArguments(arguments);

    if (args.expected === null || args.expected === undefined) {
        assertEquals(args.message, args.expected, args.actual);
        return;
    }

    if (args.actual === null || args.actual === undefined) {
        assertEquals(args.message, args.expected, args.actual);
    }

    assertEquals("Array lengths: " + args.msg, args.expected.length, args.actual.length);

    for (var i = 0; i < args.expected.length; i++) {
        assertEquals("Array value " + i + ": " + args.msg, args.expected[i], args.actual[i]);
    }
}

function assertObjectEquals() {
    var args = parseAssertArguments(arguments);

    if (args.expected === null || args.expected === undefined) {
        assertEquals(args.message, args.expected, args.actual);
        return;
    }

    if (args.actual === null || args.actual === undefined) {
        assertEquals(args.message, args.expected, args.actual);
    }

    if (args.expected.constructor != args.actual.constructor) {
        fail(assertionMessage(args.message) + "expected constructor <" + args.expected.constructor.name + "> but was <" + args.actual.constructor.name + ">");
    }

    var expectedProperties = {};
    var actualProperties = {};

    for (var property in args.expected) {
        expectedProperties[property] = {value: args.expected[property]};
    }

    for (var property in args.actual) {
        if (!expectedProperties[property]) {
            fail(assertionMessage(args.message) + "unexpected property <" + property + ">");
        }

        actualProperties[property] = {value: args.actual[property]};
    }

    for (var property in args.expected) {
        if (!actualProperties[property]) {
            fail(assertionMessage(args.message) + "missing expected property <" + property + ">");
        }

        var msg = args.message || "";

        if (runit.asserts.ignoreAssertObjectEquals[property] !== true) {
            assertObjectEquals(msg + "[" + property + "]", args.expected[property], args.actual[property]);
        }

        if (args.expected[property] && typeof(args.expected[property].toString) == "function") {
            assertEquals(msg + "[" + property + "]", args.expected[property].toString(), args.actual[property].toString());
        }
    }

    if (args.expected && typeof(args.expected.toString) == "function") {
        assertEquals(args.message, args.expected.toString(), args.actual.toString());
    }
}

function assertThrows(expectedMessage, fn) {
    var thrown = false;

    try {
        fn();
    } catch (e) {
        thrown = true;
        if (e && e.message) {
            assertEquals("Exception Message", expectedMessage, e.message);
        } else {
            assertEquals("Exception Message", expectedMessage, e);
        }
    }

    if (!thrown) {
        fail("missing expected exception with message '" + expectedMessage + "'.");
    }
}

function fail(message) {
    throw new AssertionError(message);
}

function parseAssertArguments(args) {
    var result = {
        message: null,
        expected: null,
        actual: null
    };

    if (args.length == 2) {
        result.expected = args[0];
        result.actual = args[1];
    } else if (args.length == 3) {
        result.message = args[0];
        result.expected = args[1];
        result.actual = args[2];
    } else {
        throw new Error("Invalid number of arguments to assert!  2 or 3 expected!");
    }

    return result;
}
