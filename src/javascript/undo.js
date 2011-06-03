function UndoHistory(context) {
    this.context = context;
    this.history = [];
    this.size = 0;
}

UndoHistory.fn = UndoHistory.prototype;
UndoHistory.MAX_SIZE = 100000;
UndoHistory.MAX_LENGTH = 1000;

UndoHistory.fn.undo = function() {
    if (this.history.length < 1) {
        return false;
    }

    var item = this.history.splice(this.history.length - 1, 1)[0];
    this.size -= item.length;
    this.undoing = true;
    item.undo(this.context);
    this.undoing = false;
};

UndoHistory.fn.add = function(method, args) {
    if (this.undoing) {
        return;
    }

    var item = new UndoItem(method, args);
    this.history.push(item);
    this.size += item.length;

    while (this.size > UndoHistory.MAX_SIZE || this.history.length > UndoHistory.MAX_LENGTH) {
        this.forget();
    }
};

UndoHistory.fn.forget = function() {
    var item = this.history.splice(0, 1)[0];
    this.size -= item.length;
};

function UndoItem(method, args) {
    this.method = method;
    this.args = args;
    this.length = 0;

    for (var i = 0; i < args.length; i++) {
        var arg = args[i];

        if (Object.isNullOrUndefined(arg) || !arg.isString()) {
            this.length++;
        } else {
            this.length += arg.length;
        }
    }
}

UndoItem.fn = UndoItem.prototype;

UndoItem.fn.undo = function(context) {
    context[this.method].apply(context, this.args)
};
