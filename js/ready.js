/*===
* CODEYOURCLOUD
===*/

$(document).ready(function(){
	console.log("Greetings, developer! Have you checked out Code Your Cloud on Github yet? You should. https://github.com/mkaminsky11/codeyourcloud");
	var e = CodeMirror(document.getElementById("welcome"),{
	    lineNumbers: true,
	    mode: "text",
	    theme: "seti",
	    lineWrapping: true, 
	    indentUnit: 4, 
	    indentWithTabs: true,
	    foldGutter: true,
		gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
		minimap: (getParameterByName("minimap") === "")
	});
	//sets the introduction text
	var txtFile = new XMLHttpRequest();
	txtFile.open("GET", "https://codeyourcloud.com/intro.txt", true);
	txtFile.onreadystatechange = function()
	{
		if (txtFile.readyState === 4 && txtFile.status === 200) {  // document is ready to parse.
			var allText = txtFile.responseText; 
			e.setValue(allText);
		}
	}
	txtFile.send(null);
	addEditor(e, "welcome", true);
	current_file = "welcome";
	editor().on("beforeSelectionChange", function(cm, selection){});
	editor().setOption("autoCloseBrackets",true); //TODO: make this optional
	editor().setOption("matchBrackets",true);
	$(".CodeMirror").css("line-height","1");
	//CHANGES IDE BASED ON FILE TYPE
	adjust();
	//MAKES SURE THAT THE OPTIONS ARE ALL OK
	settings.state.lineWrap = editor().getOption("lineWrapping");
	settings.state.lineNumber = editor().getOption("lineNumbers");
	if(settings.state.lineWrap !== $('#side-wrap').prop('checked')){
		document.getElementById("side-wrap").toggle();
	}
	if(settings.state.lineNumber !== $('#side-nums').prop('checked')){
		document.getElementById("side-nums").toggle();
	}
	editor().refresh(); //so that it fits the div wall
	//SETUP THEME
	if(localStorage.getItem("theme") !== null && themes_name.indexOf(localStorage.getItem("theme")) !== -1){
		setTheme(localStorage.getItem("theme"));
		$("#theme-select").val(localStorage.getItem("theme"));
	}
	broadcast.init();
	connect.init();
	context.init();
	window.onbeforeunload = function(){
		if(manager.allSaved() === false){
			return "You have unsaved work. Do you really want to quit?"
		}
	};
});
