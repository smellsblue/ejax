function CompletionTree() {
    this.tokenizer = function(value) {
        return value.split("");
    };
    this.root = new CompletionNode();
}

CompletionTree.fn = CompletionTree.prototype;

CompletionTree.fn.add = function(tokens, value) {
    tokens = this.tokenizer(tokens);
    this.root.add(tokens, value);
};

CompletionTree.fn.find = function(str) {
    return this.root.find(str, this.tokenizer(str));
};

function CompletionNode() {
    this.node = {};
    this.keys = [];
}

CompletionNode.fn = CompletionNode.prototype;

CompletionNode.fn.add = function(tokens, value) {
    if (tokens.length == 0) {
        throw new Error("Cannot add with no tokens!");
    }

    var token = tokens.shift();

    if (token.toString && token.toString.isFunction()) {
        token = token.toString();
    }

    if (!this.node[token]) {
        this.node[token] = new CompletionNode();
        this.keys.push(token);
    }

    if (tokens.length == 0) {
        this.node[token].value = { value: value };
        return;
    }

    this.node[token].add(tokens, value);
};

CompletionNode.fn.find = function(requested, tokens) {
    if (tokens.length == 0) {
        var result = new CompletionResult(requested, this);
        result.exists = true;
        result.partial = true;

        if (this.value) {
            result.partial = false;
            result.value = this.value.value;
        }

        return result;
    }

    var token = tokens.shift();
    var node = this.node[token];

    if (!node) {
        return new CompletionResult(requested);
    }

    return node.find(requested, tokens);
};

function CompletionResult(requested, node) {
    this.exists = false;
    this.partial = false;
    this.result = null;
    this.requested = requested;
    this.node = node;
}

CompletionResult.fn = CompletionResult.prototype;

CompletionResult.fn.complete = function() {
    if (!this.node) {
        return this.requested;
    }

    var node = this.node;
    var result = this.requested;

    while (node.keys.length == 1 && !node.value) {
        var token = node.keys[0];

        if (token.toString && token.toString.isFunction()) {
            token = token.toString();
        }

        result += token;
        node = node.node[node.keys[0]];
    }

    return result;
};
