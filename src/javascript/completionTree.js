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

    if (tokens.length == 0) {
        this.node[token] = { value: value };
        this.keys.push(token);
        return;
    }

    if (!this.node[token] || this.node[token].constructor != CompletionNode) {
        this.node[token] = new CompletionNode();
        this.keys.push(token);
    }

    this.node[token].add(tokens, value);
};

CompletionNode.fn.find = function(requested, tokens) {
    if (tokens.length == 0) {
        return new CompletionResult(requested);
    }

    var token = tokens.shift();
    var node = this.node[token];

    if (!node) {
        return new CompletionResult(requested);
    }

    if (node.constructor == CompletionNode) {
        if (tokens.length == 0) {
            var result = new CompletionResult(requested, node);
            result.exists = true;
            result.partial = true;
            return result;
        }

        return node.find(requested, tokens);
    }

    if (tokens.length != 0) {
        return new CompletionResult(requested);
    }

    var result = new CompletionResult(requested);
    result.exists = true;
    result.partial = false;
    result.value = node.value;
    return result;
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

    while (node.constructor == CompletionNode && node.keys.length == 1) {
        var token = node.keys[0];

        if (token.toString && token.toString.isFunction()) {
            token = token.toString();
        }

        result += token;
        node = node.node[node.keys[0]];
    }

    return result;
};
