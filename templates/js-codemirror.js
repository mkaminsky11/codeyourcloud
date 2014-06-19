editor = CodeMirror.fromTextArea(document.getElementById("bind"),{
    lineNumbers: true,
    mode: "text",
    theme: "pastel-on-dark",
    lineWrapping: true, 
    indentUnit: 4, 
    indentWithTabs: true
});
//set and get value
editor.setValue("val");

console.log(editor.getValue());
//will print "val"

//set mode
editor.setOption("mode","javascript");

//set theme
editor.setOption("theme","neo");

editor.on("change", function(cm, change) {
	//triggered on change
});

//js linting
editor.setOption("gutters",["CodeMirror-lint-markers"]);
editor.setOption("lint",CodeMirror.lint.javascript);

//tern
function getURL(url, c) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.send();
    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4) return;
      if (xhr.status < 400) return c(null, xhr.responseText);
      var e = new Error(xhr.responseText || "No response");
      e.status = xhr.status;
      c(e);
    };
}
function startTern(){
	getURL("https://codeyourcloud.com/lib/auto/ecma5.json", function(err, code) {
		if (err) throw new Error("Request for ecma5.json: " + err);
		server = new CodeMirror.TernServer({defs: [JSON.parse(code)]});
		editor.setOption("extraKeys", {
			"Ctrl-Space": function(cm) {
				server.complete(editor); 
			},
			"Ctrl-I": function(cm) { server.showType(cm); },
			"Ctrl-.": function(cm) { server.jumpToDef(cm); },
			"Ctrl-,": function(cm) { server.jumpBack(cm); },
			"Ctrl-Q": function(cm) { server.rename(cm); }
		})
		editor.on("cursorActivity", function(cm) { server.updateArgHints(editor); });
		});
}