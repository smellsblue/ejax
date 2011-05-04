package org.ejax;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

public class Curses {
    private static final String NATIVE_FILENAME = "libejaxnative.so";
    private static boolean installed = false;

    static {
        try {
            File library = new File(System.getProperty("java.io.tmpdir"), NATIVE_FILENAME);

            if (library.exists() && library.isFile()) {
                library.delete();
            }

            InputStream in = new BufferedInputStream(Thread.currentThread().getContextClassLoader().getResourceAsStream(NATIVE_FILENAME));

            try {
                OutputStream out = new BufferedOutputStream(new FileOutputStream(library));

                try {
                    byte[] buffer = new byte[1024];

                    for (int n = 0; n != -1; n = in.read(buffer)) {
                        out.write(buffer, 0, n);
                    }

                    out.flush();
                } finally {
                    out.close();
                }

                library.deleteOnExit();
            } finally {
                in.close();
            }

            System.load(library.getAbsolutePath());
            prepare();
        } catch (Exception e) {
            throw new RuntimeException("Failed to load native extensions from libejaxnative.so!", e);
        }
    }

    private static void prepare() {
        if (!installed) {
            install();

            Runtime.getRuntime().addShutdownHook(new Thread() {
                @Override
                public void run() {
                    uninstall();
                }
            });
        }
    }

    // Startup and shutdown hooks
    private native static void install();
    private native static void uninstall();

    // Various terminal options
    public native static int nl();
    public native static int nonl();
    public native static int cbreak();
    public native static int nocbreak();
    public native static int raw();
    public native static int noraw();
    public native static int echo();
    public native static int noecho();
    public native static int keypad(boolean value);
    public native static void timeout(int value);

    // Printing to the screen actions
    public native static int beep();
    public native static int clear();
    public native static int refresh();
    public native static int move(int x, int y);
    private native static int mvaddch(int x, int y, int c);

    public static void write(int x, int y, String str) {
        int columns = columns();

        for (int i = 0; i < str.length() && i < columns; i++) {
            mvaddch(x, y, str.charAt(i));
        }
    }

    // Keyboard input
    public native static int read();
    public native static int unread(int c);

    public static boolean available() {
        timeout(0);
        int value = read();
        timeout(-1);

        if (value >= 0) {
            unread(value);
        }

        return value >= 0;
    }

    // Screen dimensions
    public native static int rows();
    public native static int columns();
}
