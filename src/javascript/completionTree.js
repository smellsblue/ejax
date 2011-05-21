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
    return this.root.find(this.tokenizer(str));
};

function CompletionNode() {
    this.node = {};
}

CompletionNode.fn = CompletionNode.prototype;

CompletionNode.fn.add = function(tokens, value) {
    if (tokens.length == 0) {
        throw new Error("Cannot add with no tokens!");
    }

    var token = tokens.shift();

    if (tokens.length == 0) {
        this.node[token] = { value: value };
        return;
    }

    if (!this.node[token] || this.node[token].constructor != CompletionNode) {
        this.node[token] = new CompletionNode();
    }

    this.node[token].add(tokens, value);
};

CompletionNode.fn.find = function(tokens) {
    if (tokens.length == 0) {
        return new CompletionResult();
    }

    var token = tokens.shift();
    var node = this.node[token];

    if (!node) {
        return new CompletionResult();
    }

    if (node.constructor == CompletionNode) {
        if (tokens.length == 0) {
            var result = new CompletionResult();
            result.exists = true;
            result.partial = true;
            return result;
        }

        return node.find(tokens);
    }

    if (tokens.length != 0) {
        return new CompletionResult();
    }

    var result = new CompletionResult();
    result.exists = true;
    result.partial = false;
    result.value = node.value;
    return result;
};

function CompletionResult() {
    this.exists = false;
    this.partial = false;
    this.result = null;
}
