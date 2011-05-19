function time(fn) {
    var start = java.lang.System.currentTimeMillis();
    fn();
    var end = java.lang.System.currentTimeMillis();
    return end - start;
}
