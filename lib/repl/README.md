# CodeMirror REPL #

An REPL abstraction layer over the [CodeMirror](http://codemirror.net/ "CodeMirror") web editor. Create a web based REPL for your programming language easily.

## Usage ##

You may see a working demo of the REPL here: [JavaScript REPL](https://rawgithub.com/aaditmshah/codemirror-repl/master/index.html "JavaScript REPL")

To start using CodeMirrorREPL you need to include (at least) the `codemirror-repl` script and stylesheet in the `<head>` section of your web page as follows:

```html
<link rel="stylesheet" href="./path/to/codemirror-repl.css"/>
<script src="./path/to/codemirror-repl.js"></script>
```

Next you create a `<textarea>` element in the `<body>` section of your web page and give it an `id`. You may also set it to `autofocus` as follows:

```html
<textarea id="repl" autofocus="true"></textarea>
```

Finally you create the REPL by calling the constructor `CodeMirrorREPL`. You must pass it the `id` of the textarea as the first argument. Optionally you may also pass it a mode and a theme as follows (read the CodeMirror [user manual](http://codemirror.net/2/doc/manual.html "CodeMirror: User Manual") for more information):

```javascript
var repl = new CodeMirrorREPL("repl", {
    mode: "javascript",
    theme: "eclipse"
});
```

You may now print messages using the `repl.print` method. It optionally accepts a CSS class name as the second argument --- used to pretty print text:

```javascript
repl.print("/* JavaScript REPL  Copyright (C) 2013  Aadit M Shah */");
```

CodeMirrorREPL automatically buffers input lines and makes them available to the interpreter whenever necessary. By default it will send every single line separately to the interpreter for evaluation.

You must define the method `repl.eval` to get the buffered input and evaluate it. For example:

```javascript
repl.eval = function (code) {
    try {
        if (isExpression(code)) {
            geval("__expression__ = " + code);
            express(__expression__);
        } else geval(code);
    } catch (error) {
        repl.print(error, "error");
    }
};
```

The above function evaluates JavaScript code in the global scope using the function `geval`. If the code throws an error the error is printed with the formatting for the CSS class `.error`.

Sometimes it's necessary to allow the user to enter more than one line of input before evaluation. CodeMirrorREPL determines when to buffer input lines by calling the method `repl.isBalanced`.

The `isBalanced` method is called with the buffered input as an argument. If it returns a truthy value the buffered input is sent for evaluation. If it returns `null` the last buffered input line is discarded.

By default `isBalanced` will always return `true` but you may override it as per your requirement. For example the following function checks whether the given JavaScript code is [balanced](http://rosettacode.org/wiki/Balanced_brackets "Balanced brackets - Rosetta Code"):

```javascript
repl.isBalanced = function (code) {
    var length = code.length;
    var delimiter = '';
    var brackets = [];
    var matching = {
        ')': '(',
        ']': '[',
        '}': '{'
    };

    for (var i = 0; i < length; i++) {
        var char = code.charAt(i);

        switch (delimiter) {
        case "'":
        case '"':
        case '/':
            switch (char) {
            case delimiter:
                delimiter = "";
                break;
            case "\\":
                i++;
            }

            break;
        case "//":
            if (char === "\n") delimiter = "";
            break;
        case "/*":
            if (char === "*" && code.charAt(++i) === "/") delimiter = "";
            break;
        default:
            switch (char) {
            case "'":
            case '"':
                delimiter = char;
                break;
            case "/":
                var lookahead = code.charAt(++i);
                delimiter = char;

                switch (lookahead) {
                case "/":
                case "*":
                    delimiter += lookahead;
                }

                break;
            case "(":
            case "[":
            case "{":
                brackets.push(char);
                break;
            case ")":
            case "]":
            case "}":
                if (!brackets.length || matching[char] !== brackets.pop()) {
                    repl.print(new SyntaxError("Unexpected closing bracket: '" + char + "'"), "error");
                    return null;
                }
            }
        }
    }

    return brackets.length ? false : true;
};
```

## License ##

```
    An REPL abstraction layer over the CodeMirror web editor.
    Copyright (C) 2013  Aadit M Shah

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
```
