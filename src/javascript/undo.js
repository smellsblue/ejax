function UndoHistory(context) {
    this.context = context;
    this.history = [];
    this.size = 0;
    this.actionLevel = 0;
}

UndoHistory.fn = UndoHistory.prototype;
UndoHistory.MAX_SIZE = 100000;
UndoHistory.MAX_LENGTH = 1000;

UndoHistory.fn.startAction = function() {
    if (!this.action) {
        this.action = [];
    }

    this.actionLevel++;
};

UndoHistory.fn.endAction = function() {
    this.actionLevel--;

    if (this.actionLevel < 0) {
        this.actionLevel = 0;
    }

    if (this.actionLevel == 0 && this.action && this.action.length > 0) {
        this.history.push(new UndoAction(this.action));
        this.action = null;
    }
};

UndoHistory.fn.undo = function() {
    if (this.history.length < 1) {
        return false;
    }

    var item = this.history.splice(this.history.length - 1, 1)[0];
    this.size -= item.length;
    this.undoing = true;
    var result = item.undo(this.context);
    this.undoing = false;
    return result;
};

UndoHistory.fn.add = function(method, args, returnValue) {
    if (this.undoing) {
        return;
    }

    var item = new UndoItem(method, args, returnValue);

    if (this.actionLevel > 0) {
        this.action.push(item);
    } else {
        this.history.push(item);
    }

    this.size += item.length;

    while (this.size > UndoHistory.MAX_SIZE || this.history.length > UndoHistory.MAX_LENGTH) {
        this.forget();
    }
};

UndoHistory.fn.forget = function() {
    var item;

    if (this.history.length > 0) {
        item = this.history.splice(0, 1)[0];
    } else {
        item = this.action.splice(0, 1)[0];
    }

    this.size -= item.length;
};

function UndoItem(method, args, returnValue) {
    this.method = method;
    this.args = args;
    this.returnValue = returnValue;
    this.length = returnValue.length;

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
    return this.returnValue;
};

function UndoAction(items) {
    this.items = items;
    this.length = 0;

    for (var i = 0; i < items.length; i++) {
        this.length += items[i].length;
    }
}

UndoAction.fn = UndoAction.prototype;

UndoAction.fn.undo = function(context) {
    for (var i = this.items.length - 1; i >= 0; i--) {
        this.items[i].undo(context);
    }

    return this.items[0].returnValue;
};
