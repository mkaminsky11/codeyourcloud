/*===
* CODEYOURCLOUD
===*/

$(document).ready(function(){
	console.log("Greetings, developer! Have you checked out Code Your Cloud on Github yet? You should. https://github.com/mkaminsky11/codeyourcloud");
	
	//=============
	//INITIALIZE WELCOME EDITOR
	//============
	var e = CodeMirror(document.getElementById("welcome"),{
		lineNumbers: settings.state.lineNumbers,
		mode: "text",
    	theme: settings.state.theme,
    	lineWrapping: settings.state.lineWrap, 
    	indentUnit: settings.state.indentUnit, 
    	indentWithTabs: settings.state.indentWithTabs,
    	foldGutter: true,
		  gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
	    minimap: settings.state.minimap,
	    tabSize: settings.state.tabSize
	});
	//sets the introduction text
	e.setValue(introText);
	addEditor(e, "welcome", true);
	current_file = "welcome";
	editor().on("beforeSelectionChange", function(cm, selection){});
	editor().setOption("autoCloseBrackets",true); //TODO: make this optional
	editor().setOption("matchBrackets",true);
	$(".CodeMirror").css("line-height","1");
	adjust();
	editor().refresh(); //so that it fits the div wall
	
	//=============
	//INIT
	//=============
	settings.init();
	broadcast.init();
	connect.init();
	context.init();
	// snippets.init(); //<----later
	
	//===========
	//SAVE DIALOG
	//===========
	window.onbeforeunload = function(){
		if(manager.allSaved() === false){
			return "You have unsaved work. Do you really want to quit?"
		}
	};
});
