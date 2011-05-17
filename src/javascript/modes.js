function Mode(name, description, bindings) {
    this.name = name;
    this.description = description;
    this.bindings = new Bindings(bindings);
}

Mode.fn = Mode.prototype;
