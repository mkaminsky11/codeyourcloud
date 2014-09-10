function poly_loaded(){
    var geval = eval;

    repl = new CodeMirrorREPL("terminal-iframe", {
        mode: "javascript",
        theme: "eclipse"
    });

    repl.print("/*please use print() not console.log()*/");

    window.print = function (message) {
        repl.print(message, "message");
    };

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

    function isExpression(code) {
        if (/^\s*function\s/.test(code)) return false;

        try {
            Function("return " + code);
            return true;
        } catch (error) {
            return false;
        }
    }

    function express(value) {
        if (value === null) var type = "Null";
        else if (typeof value === "Undefined") var type = "Undefined";
        else var type = Object.prototype.toString.call(value).slice(8, -1);

        switch (type) {
        case "String":
            value = '"' + value.replace('\\', '\\\\').replace('\0', '\\0').replace('\n', '\\n').replace('\r', '\\r').replace('\t', '\\t').replace('\v', '\\v').replace('"', '\\"') + '"';
        case "Number":
        case "Boolean":
        case "Function":
        case "Undefined":
        case "Null":
            repl.print(value);
            break;
        case "Object":
        case "Array":
            repl.print(JSON.stringify(value, 4));
            break;
        default:
            repl.print(value, "error");
        }
    }
}

window.addEventListener('polymer-ready', function(e){
	
	
	checkGithub();
	
	poly_loaded();
	line_wrap = editor().getOption("lineWrapping");
	line_number = editor().getOption("lineNumbers");
	if(line_wrap !== $('#side-wrap').prop('checked')){
		document.getElementById("side-wrap").toggle();
	}
	
	if(line_number !== $('#side-nums').prop('checked')){
		document.getElementById("side-nums").toggle();
	}

	editor().refresh();
});