var runit = runit || {};
runit.FAILURE_VALUE = runit.FAILURE_VALUE || 1;
runit.lastRun = runit.lastRun || {};
runit.verbose = runit.verbose || false;
runit.context = runit.context || this;
runit.engine = runit.engine || scriptEngine;

runit.TestResult = runit.TestResult || function(testName, passed, error) {
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

    this.printDetails = function(count) {
        if (!this.passed) {
            println("");
            print(count + ") ");
            print(this.getResultTypeName());
            println(" from test '" + this.testName + "'");
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
    }
};

runit.main = runit.main || function(argv) {
    var scripts = [];

    for (var i = 0; i < argv.length; i++) {
        var arg = argv[i];

        if (arg.match(/^@.+/)) {
            arg = arg.substring(1, arg.length());
            var contents = org.ejax.javascript.Execute.fileLines(org.ejax.javascript.Execute.file(arg));

            for (var j = 0; j < contents.size(); j++) {
                var script = contents.get(j);

                if (!script.match(/^\s*$/)) {
                    scripts.push(script);
                }
            }
        } else {
            scripts.push(arg);
        }
    }

    var testCount = 0;
    var failureCount = 0;
    println("Running JavaScript tests.");

    for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];
        println("");
        println("Running tests for '" + script + "'");
        println("");

        try {
            var engine = org.ejax.javascript.Execute.newEngine();
            engine.eval("load(\"runit.js\")");
            engine.eval(new java.io.FileReader(org.ejax.javascript.Execute.file(script)));
            engine.invokeMethod(engine.eval("runit"), "run", [{verbose: runit.verbose}]);
            var lastCount = engine.eval("runit.lastRun.testCount;");
            var lastFailureCount = engine.eval("runit.lastRun.failureCount;");
            testCount += lastCount.intValue();
            failureCount += lastFailureCount.intValue();
        } catch (e) {
            if (e.rhinoException && typeof(e.rhinoException.printStackTrace) == "function") {
                e.rhinoException.printStackTrace();
            } else {
                println("Exception caught: " + e.name + ": " + e.message);
            }
            testCount++;
            failureCount++;
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

    for (var property in runit.context) {
        if (typeof(runit.context[property]) == "function" && property.match(/^test.+/)) {
            runit.verbosePrint("Found test '" + property + "'\n");
            tests.push({name: property, fn: runit.context[property]});
        }
    }

    for (var i = 0; i < tests.length; i++) {
        var result = runit.runTest(tests[i]);
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
};

runit.runTest = runit.runTest || function(test) {
    try {
        if (typeof(runit.context.setUp) == "function") {
            runit.context.setUp();
        }
    } catch (e) {
        return new runit.TestResult(test.name + "[setUp]", false, e);
    }

    try {
        test.fn();
    } catch (e) {
        return new runit.TestResult(test.name, false, e);
    }

    try {
        if (typeof(runit.context.tearDown) == "function") {
            runit.context.tearDown();
        }
    } catch (e) {
        return new runit.TestResult(test.name + "[tearDown]", false, e);
    }

    return new runit.TestResult(test.name, true);
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
        assertObjectEquals(msg + "[" + property + "]", args.expected[property], args.actual[property]);

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