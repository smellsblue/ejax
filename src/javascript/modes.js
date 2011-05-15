function Mode(name, description) {
    this.name = name;
    this.description = description;
    this.bindings = new Bindings();
}

Mode.fn = Mode.prototype;
