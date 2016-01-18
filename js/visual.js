var repl = {};
repl.send = function(send){
	document.getElementById("repl").contentWindow.postMessage(JSON.stringify(send), '*');
}
repl.onmessage = function(e){
	//console.log(JSON.parse(e.data));
}

//running code
function run(){
	var code_before_replace = editor().getValue();
	if(editor().getOption("mode") === "text/x-coffeescript"){
		code_before_replace = CoffeeScript.compile(code_before_replace, { bare: true });
	}
	var find = 'console.log'; //not console.log, but print
	var re = new RegExp(find, 'g');
	code_before_replace = code_before_replace.replace(re, '_window_print');
	//document.getElementById('repl-iframe').contentWindow.eval(code_before_replace);
}


/*
* COLOR PICKER
*/
function show_color(){
	$("#colorModal").modal('show');
}
var cj = colorjoe.rgb("color", '#113c38', [
	'close',
	'currentColor',
	['fields', {space: 'RGB', limit: 255, fix: 2}],
	'hex'
]);
cj.on('change', function(color) {
	console.log(color);
	color = color.css();
	var before = editor().getDoc().getCursor("from");
	if(editor().getDoc().somethingSelected()){
		console.log("h1");
		editor().getDoc().replaceSelection(color);
		var after = editor().getDoc().getCursor("to");
		editor().getDoc().setSelection(before, after);
	}
	else{
		console.log("h2");
		editor().getDoc().replaceRange(""+color, before);
		var after = editor().getDoc().getCursor();
		editor().getDoc().setSelection(before, after);
	}
});

function set_color(string){
	//if hex
	//if rgb
	
	//if(/^#[0-9A-F]{6}$/i.test(string)){ //is hex
	//	$("#custom").spectrum("set",string);
	//}
}

/**
* PREVIEW
* previewing editor in iframe
**/
function showPreview(){
	updatePreview();
	$("#previewModal").modal('show');
}
function updatePreview() {
	var allPreviews = document.getElementsByClassName('preview-frame');
	for(var i = 0; i < allPreviews.length; i++){
	    var previewFrame = allPreviews[i];
		var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
		preview.open();
		var c = editor().getValue();
		if(editor().getOption("mode") === "text/x-markdown" || editor().getOption("mode") === "gfm"){
			c = converter.makeHtml(c);
		}
		preview.write(c);
		preview.close();
	}
}

/**
* CHAT
* chat messages
**/
$(".chats-text").keyup(function(event){
    if(event.keyCode == 13 && !event.shiftKey){
        sendChat();
    }
});

/**
* LOADING
* loading spinner
**/
function show_loading_spinner(){
	document.getElementById("paper-loading-spinner").active = true;
	$("#paper-loading-spinner").css("display","block");
}

function hide_loading_spinner(){
	document.getElementById("paper-loading-spinner").active = false;
	$("#paper-loading-spinner").css("display","none");
}

/**
* RENAMING
* toggle rename
**/
function show_top_rename(){
	$("#rename-toggle").html('<i class="zmdi zmdi-check"></i>'); //switch to check
	$('#title').attr('readonly', false);
}

function hide_top_rename(){
	$("#rename-toggle").html('<i class="zmdi zmdi-edit"></i>'); //switch back
	$('#title').attr('readonly', true);
}

function toggle_rename_show(){
	if($('#title').attr('readonly')){
		//if disabled
		show_top_rename();
	}
	else{
		hide_top_rename();
		ok_rename();
	}
}

/**
* SIDE
* toggle sidebar
**/
function toggle_side(){
	if(side_open){
		side_open = false;
		close_side();
	}	
	else{
		side_open = true;
		open_side();
	}
}

function close_side(){
	side_open = false;
	$("#toggle_side_menu_button > i").removeClass("fa-circle-o");
	$("#toggle_side_menu_button > i").addClass("fa-dot-circle-o");
	$("#side").velocity({
		marginLeft: -300
	},{
		duration: 500,
		queue: false,
		complete: function(){
			$("#side").css("display","none").css("margin-left","0px");
		}
	});
	
	$(".move").velocity({
		marginLeft: 0
	},{
		duration: 500,
		queue: false
	});
	
	if(!is_mobile){
		$(".move").velocity({
			width: $(".move").width() + 300
		},{
			duration: 500,
			queue: false,
			complete: function(){
				$(".move").css("width","calc(100%)");
			}
		});
	}
}
function open_side(){
	side_open = true;
	$("#toggle_side_menu_button > i").addClass("fa-circle-o");
	$("#toggle_side_menu_button > i").removeClass("fa-dot-circle-o");
	$("#side").css("display","block").css("margin-left","-300px");
	$("#side").velocity({
		marginLeft: 0
	},{
		duration: 500,
		queue: false
	});
	
	$(".move").velocity({
		marginLeft: 300
	},{
		duration: 500,
		queue: false
	});
	
	if(!is_mobile){
		$(".move").velocity({
			width: $(".move").width() - 300
		},{
			duration: 500,
			queue: false,
			complete: function(){
				$(".move").css("width","calc(100% - 300px)");
				snippets.refreshEditors();
			}
		});
	}

}

/**
* NAV
* sidebar tabs
**/

var nav = {};
nav.possible = ["preview","tree","snippet"];
nav.nav = function(nav_to){
	var nav_button = "#nav_" + nav_to;
	if($(nav_button).hasClass("active")){
		//already there
	}
	else{
		$("#navigate").find(".active").removeClass("active");
		$(nav_button).addClass("active");
		for(var i = 0; i < nav.possible.length; i++){
			if(nav.possible[i] === nav_to){
				//what we want to show
				$(".nav-" + nav.possible[i]).css("display","block");
			}
			else{
				//what we want to hide
				$(".nav-" + nav.possible[i]).css("display","none");
			}
		}
	}
	
	if(nav_to === "snippet"){
	  snippets.refreshEditors();
	}
}

/**
* REPL
* javascript repl
**/
function setFocusThickboxIframe() {
    var iframe = $("#repl-iframe")[0];
    iframe.contentWindow.focus();
}
