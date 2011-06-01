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

Format.asTable = function(arrayOfArrays, options) {
    if (!options) {
        options = "";
    }

    if (arrayOfArrays.length == 0) {
        return "";
    }

    var maxLengths = [];

    for (var i = 0; i < arrayOfArrays.length; i++) {
        var row = arrayOfArrays[i];

        for (var j = 0; j < row.length; j++) {
            var length = (arrayOfArrays[i][j] || "").length;

            if (j >= maxLengths.length) {
                maxLengths.push(length);
            }

            if (length > maxLengths[j]) {
                maxLengths[j] = length;
            }
        }
    }

    return rows = Util.map(arrayOfArrays, function(row) {
        return Util.map(row, function(value, i) {
            value = value || "";

            if (i == row.length - 1) {
                if (i == 0) {
                    value = (options.prefix || "") + value;
                }

                return value;
            }

            while (value.length < maxLengths[i]) {
                value += " ";
            }

            if (i == 0) {
                value = (options.prefix || "") + value;
            }

            return value;
        }).join(options.columnSeparator || " ");
    }).join("\n");
};
