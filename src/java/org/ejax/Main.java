package org.ejax;

import org.ejax.javascript.Execute;

public class Main {
    public static void main(String... args) throws Exception {
        for (String arg : args) {
            if (arg.equals("--browser")) {
                new Execute("ejax-browser-complete.js", "BrowserEjax", args).execute();
                return;
            }
        }

        new Execute("ejax-terminal-complete.js", "TerminalEjax", args).execute();
    }
}
