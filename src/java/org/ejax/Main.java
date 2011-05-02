package org.ejax;

import org.ejax.javascript.Execute;

public class Main {
    public static void main(String... args) throws Exception {
        new Execute("ejax-terminal-complete.js", "TerminalEjax", args).execute();
    }
}
