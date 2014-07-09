CodeMirrorREPL.prototype.isBalanced = function () {
    return true;
};

CodeMirrorREPL.prototype.eval = function () {};


function CodeMirrorREPL(textareaId, options) {
    var textarea = document.getElementById(textareaId);
    options = options || {};
    textarea.value = "";

    var keymap = {
        "Up": up,
        "Down": down,
        "Delete": del,
        "Ctrl-Z": undo,
        "Enter": enter,
        "Ctrl-A": select,
        "Ctrl-Delete": del,
        "Shift-Enter": enter,
        "Backspace": backspace,
        "Ctrl-Backspace": backspace
    };

    var options = {
        electricChars: false,
        theme: options.theme,
        mode: options.mode,
        smartIndent: false,
        lineWrapping: true,
        extraKeys: keymap,
        onChange: change,
        indentUnit: 4,
        undoDepth: 1,
        gutter: true
    };

    mirror = CodeMirror.fromTextArea(textarea, options);
    mirror.refresh();

    var history = [];
    var buffer = [];
    var repl = this;
    var user = true;
    var text = "";
    var line = 0;
    var ch = 0;
    var n = 0;

    repl.print = print;
    repl.setMode = setMode;
    repl.setTheme = setTheme;
    mirror.setGutterMarker(line, ">>");

    function undo() {}

    function up() {
        switch (n--) {
        case 0:
            n = 0;
            return;
        case history.length:
            text = mirror.getLine(line).slice(ch);
        }

        mirror.setLine(line, history[n]);
    }

    function down() {
        switch (n++) {
        case history.length:
            n--;
            return;
        case history.length - 1:
            mirror.setLine(line, text);
            return;
        }

        mirror.setLine(line, history[n]);
    }

    function enter() {
        var text = mirror.getLine(line);
        var input = text.slice(ch);
        user = false;

        if (text) {
            ch = 0;
            buffer.push(input);
            n = history.push(input);
            mirror.setLine(line++, text + '\n');
            var code = buffer.join('\n').replace(/\r/g, '\n');
            var balanced = repl.isBalanced(code);

            if (balanced) {
                repl.eval(code);
                buffer.length = 0;
                mirror.setGutterMarker(line, ">>");
            } else {
                if (balanced === null) {
                    buffer.pop();
                    code = buffer.join('\n').replace('\r', '\n');
                    mirror.setGutterMarker(line, repl.isBalanced(code) ? ">>" : "..");
                } else mirror.setGutterMarker(line, "..");
            }
        }

        setTimeout(function () {
            user = true;
        }, 0);
    }

    function select() {
        var length = mirror.getLine(line).slice(ch).length;
        mirror.setSelection({line: line, ch: 0}, {line: line, ch: length});
    }

    function backspace() {
        var selected = mirror.somethingSelected();
        var cursor = mirror.getCursor(true);
        var ln = cursor.line;
        var c = cursor.ch;

        if (ln === line && c >= ch + (selected ? 0 : 1)) {
            if (!selected) mirror.setSelection({line: ln, ch: c - 1}, cursor);
            mirror.replaceSelection("");
        }
    }

    function del() {
        var cursor = mirror.getCursor(true);
        var ln = cursor.line;
        var c = cursor.ch;

        if (ln === line && c < mirror.getLine(ln).length && c >= ch) {
            if (!mirror.somethingSelected()) mirror.setSelection({line: ln, ch: c + 1}, cursor);
            mirror.replaceSelection("");
        }
    }

    function change(mirror, changes) {
        var to = changes.to;
        var from = changes.from;
        var text = changes.text;
        var next = changes.next;
        var length = text.length;

        if (user) {
            if (from.line < line || from.ch < ch) mirror.undo();
            else if (length-- > 1) {
                mirror.undo();

                var ln = mirror.getLine(line).slice(ch);
                text[0] = ln.slice(0, from.ch) + text[0];

                for (var i = 0; i < length; i++) {
                    mirror.setLine(line, text[i]);
                    enter();
                }

                mirror.setLine(line, text[length] + ln.slice(to.ch));
            }
        }

        if (next) change(mirror, next);
    }

    function print(message, className) {
        var mode = user;
        var ln = line;
        user = false;

        message = String(message);
        var text = mirror.getLine(line);
        message = message.replace(/\n/g, '\r') + '\n';

        if (text) {
            mirror.setGutterMarker(line, "");
            var cursor = mirror.getCursor().ch;
        }

        mirror.setLine(line++, message);
        if (className) mirror.markText({line: ln, ch: 0}, {line: ln, ch: message.length}, className);

        if (text) {
            mirror.setLine(line, text);
            mirror.setGutterMarker(line, ">>");
            mirror.setCursor({line: line, ch: cursor});
        }

        setTimeout(function () {
            user = mode;
        }, 0);
        
        mirror.refresh();
    }

    function setMode(mode) {
        mirror.setOption("mode", mode);
    }

    function setTheme(theme) {
        mirror.setOption("theme", theme);
    }
}


