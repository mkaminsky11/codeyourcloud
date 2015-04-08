/*===
* CODEYOURCLOUD
*
* visual.js built by Michael Kaminsky
* handles google drive and realtime events like adding and remove users
*
===*/


/**
* RUN
* running code
**/
function run(){
	var code_before_replace = editor().getValue();
	if(editor().getOption("mode") === "text/x-coffeescript"){
		code_before_replace = CoffeeScript.compile(code_before_replace, { bare: true });
	}
	var find = 'console.log';
	var re = new RegExp(find, 'g');
	code_before_replace = code_before_replace.replace(re, 'print');
	
	
	document.getElementById('repl-iframe').contentWindow.eval(code_before_replace);
}


/**
* COLOR
* color picker
**/
function show_color(){
	$("#colorModal").modal('show');
}
$("#custom").spectrum({
	preferredFormat: "hex",
    showInput: true,
    clickoutFiresChange: true,
    showInitial: true,
    showButtons: false,
    move: function(tinycolor) { //TODO: this needs alot of work
		var color = tinycolor.toHexString();
		//insert this
		var before = editor().getDoc().getCursor();
		if(editor().getDoc().somethingSelected()){
			editor().getDoc().replaceSelection(color);
		}
		else{
			editor().getDoc().replaceRange(""+color, before);
		}
		var after = editor().getDoc().getCursor();
		//else{
		editor().getDoc().setSelection(before, after);
  		//}
    },
    beforeShow: function(tinycolor) { 
    	//if something selected, set color
    	//$("#custom").spectrum("set", colorString);
    }
});

function set_color(string){
	if(/^#[0-9A-F]{6}$/i.test(string)){
		$("#custom").spectrum("set",string);
	}
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
    if(event.keyCode == 13){
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
	$('#title').attr('readonly', false);
}

function hide_top_rename(){
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
			}
		});
	}

}

/**
* NAV
* sidebar tabs
**/
function nav_preview(){
	if($("#nav_preview").hasClass("active")){
		//already there
	}
	else{
		$("#navigate").find(".active").removeClass("active");
		$("#nav_preview").addClass("active");

		$(".preview").css("display","block");
		$(".terminal").css("display","none");
		$(".options").css("display","none");
		$(".tree-tree").css("display","none");
	}
}
function nav_lorem(){
	if($("#nav_lorem").hasClass("active")){
		//already there
	}
	else{
		$("#navigate").find(".active").removeClass("active");
		$("#nav_lorem").addClass("active");

		$(".preview").css("display","none");
		$(".terminal").css("display","none");
		$(".options").css("display","none");
		$(".tree-tree").css("display","none");
	}
}
function nav_terminal(){
	if($("#nav_terminal").hasClass("active")){
		//already there
	}
	else{
		$("#navigate").find(".active").removeClass("active");
		$("#nav_terminal").addClass("active");
		$(".preview").css("display","none");
		$(".terminal").css("display","block");
		$(".options").css("display","none");
		$(".tree-tree").css("display","none");
	}
}
function nav_options(){
	if($("#nav_options").hasClass("active")){
		//already there
	}
	else{
		$("#navigate").find(".active").removeClass("active");
		$("#nav_options").addClass("active");
		$(".preview").css("display","none");
		$(".terminal").css("display","none");
		$(".options").css("display","block");
		$(".tree-tree").css("display","none");
	}
}
function nav_chats(){
	
}
function nav_tree(){
	if($("#nav_tree").hasClass("active")){
		//already there
	}
	else{
		$("#navigate").find(".active").removeClass("active");
		$("#nav_tree").addClass("active");
		$(".preview").css("display","none");
		$(".terminal").css("display","none");
		$(".lorem").css("display","none");
		$(".options").css("display","none");
		$(".tree-tree").css("display","block");
	}
}

/**
* IMAGES
* if an image opened
**/
function read_image(file_id_id){
	var index = getIndex(file_id_id);
	if(editors[index].image !== true && editors[index].image){
		//just open it
		$("#image_div").css("display", "flex");
		$("#image_div").html("<img src='" + editors[index].image + "'>");
	}	
	else{
		getFile(file_id_id, function(resp){
			console.log(resp);
			var url = resp.thumbnailLink;

			editors[index].image = url;		

			$("#image_div").css("display","flex");
			$("#image_div").html("<img src='" + url  + "'>");
		});
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