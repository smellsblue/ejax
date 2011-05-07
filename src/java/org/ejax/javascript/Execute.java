package org.ejax.javascript;

import java.io.InputStreamReader;
import java.util.Arrays;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

public class Execute {
    private String jsFile;
    private String execObj;
    private String[] args;

    public Execute(String jsFile, String execObj, String[] args) {
        this.jsFile = jsFile;
        this.execObj = execObj;
        this.args = args;
    }

    public void execute() throws Exception {
        ScriptEngine engine = newEngine();
        engine.eval("load(\"" + jsFile + "\");");
        Object result = ((Invocable) engine).invokeMethod(engine.eval(execObj), "main", (Object) args);

        if (result instanceof Number) {
            System.exit(((Number) result).intValue());
        }
    }

    public static void main(String[] args) throws Exception {
        if (args.length < 2) {
            throw new IllegalArgumentException("usage: Execute <jsFile> <objectWithExec> [<arg> [<arg> ...]]");
        }

        new Execute(args[0], args[1], Arrays.copyOfRange(args, 2, args.length)).execute();
    }

    public static ScriptEngine newEngine() throws Exception {
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("JavaScript");
        engine.put("scriptEngine", engine);
        engine.eval(new InputStreamReader(Thread.currentThread().getContextClassLoader().getResourceAsStream("ejax-bootstrap-complete.js")));
        return engine;
    }
}
