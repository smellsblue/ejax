var Format = {};

// TODO: At some point, this should support tabs and flatten newlines.
Format.byWord = function(str, options) {
    var result = [];

    while (str.length > options.columns) {
        var index = str.lastIndexOf(" ", options.columns);

        if (index < 0) {
            result.push(str.substring(0, options.columns - 1) + "-");
            str = str.substring(options.columns - 1, str.length);
        } else {
            result.push(str.substring(0, index + 1).replace(/\s+$/, ""))
            str = str.substring(index + 1, str.length);
        }
    }

    result.push(str);
    return result.join("\n");
};
