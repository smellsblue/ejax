# Description

This is a work in progress.  The goal is to have an editor with
functionality based on Emacs but written (almost) purely in JavaScript
so that it can run on the command line with Rhino, or in the browser
directly.

# Installation

To install, you just need to run ant.

The libraries you need:

* ant
* JDK with development headers (jni.h) and Rhino (OpenJDK 6 should work)
* curses with development headers
* gcc

# Running

After you run ant, you should be able to run:

    java -jar bin/ejax.jar

to run in command line mode, or

    java -jar bin/ejax.jar --browser

to run in the browser.

# Caveats

Keep in mind this is still heavily a work in progress... don't trust
it to be totally stable yet.  There are currently some performance
issues when running in the browser, but terminal performance is pretty
good.

# Contributions

Contributions are welcome, just send me a pull request on github.

# About Me

You can follow me as @smellsblue on twitter.  I love Ruby, Rails and
JavaScript, though I couldn't work 2 of those into this project,
sadly.
