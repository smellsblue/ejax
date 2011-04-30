function Mode(name) {
    this.name = name;
    this.bindings = new Bindings();
}

Mode.fn = Mode.prototype;
