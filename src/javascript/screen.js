function Screen(ejax) {
    this.ejax = ejax;
    this.currentBuffer = new Buffer(this);
    this.ejax.io.clear();
    this.ejax.io.setCursor(this.currentBuffer.getCursorX(), this.currentBuffer.getCursorY());
}

Screen.fn = Screen.prototype;
