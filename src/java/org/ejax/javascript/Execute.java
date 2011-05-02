package org.ejax.javascript;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

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

    public static File file(String filename) {
        try {
            File file = new File(filename);

            if (file.exists() && file.isFile()) {
                return file;
            }

            URL url = Thread.currentThread().getContextClassLoader().getResource(filename);

            if (url != null) {
                file = new File(url.toURI());

                if (file.exists() && file.isFile()) {
                    return file;
                }
            }

            String[] paths = System.getProperty("java.class.path").split(System.getProperty("path.separator"));
            String filenameWithSeparator = filename;

            if (!filenameWithSeparator.startsWith(File.separator)) {
                filenameWithSeparator = File.separator + filenameWithSeparator;
            }

            for (String path : paths) {
                File pathFile = new File(path);

                if (!pathFile.exists()) {
                    continue;
                }

                if (pathFile.isFile() && pathFile.getCanonicalPath().endsWith(filenameWithSeparator)) {
                    return pathFile;
                } else if (pathFile.isDirectory()) {
                    file = new File(pathFile, filename);

                    if (file.exists() && file.isFile()) {
                        return file;
                    }
                }
            }

            throw new FileNotFoundException("Cannot find file '" + filename + "'");
        } catch (Exception e) {
            throw new RuntimeException("Failure to load file '" + filename + "'.", e);
        }
    }

    public static String fileContents(File file) {
        try {
            BufferedReader reader = new BufferedReader(new FileReader(file));
            String line = reader.readLine();
            StringBuilder result = new StringBuilder();

            while (line != null) {
                result.append(line);
                result.append("\n");
                line = reader.readLine();
            }

            return result.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failure to read file contents of '" + file.getPath() + "'.", e);
        }
    }

    public static List<String> fileLines(File file) {
        try {
            BufferedReader reader = new BufferedReader(new FileReader(file));
            String line = reader.readLine();
            List<String> result = new LinkedList<String>();

            while (line != null) {
                result.add(line);
                line = reader.readLine();
            }

            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failure to read file lines of '" + file.getPath() + "'.", e);
        }
    }

    public static ScriptEngine newEngine() throws Exception {
        ScriptEngine engine = new ScriptEngineManager().getEngineByName("JavaScript");
        engine.put("scriptEngine", engine);
        engine.eval("var loadedFiles = {};\n" +
                    "function load() {\n" +
                    "    for (var i = 0; i < arguments.length; i++) {\n" +
                    "        var file = org.ejax.javascript.Execute.file(arguments[i]);\n" +
                    "        var fullPath = file.getCanonicalPath();\n" +
                    "        if (!loadedFiles[fullPath]) {\n" +
                    "            loadedFiles[fullPath] = true;\n" +
                    "            scriptEngine.eval(org.ejax.javascript.Execute.fileContents(file));\n" +
                    "        }\n" +
                    "    }\n" +
                    "}\n");
        return engine;
    }
}
