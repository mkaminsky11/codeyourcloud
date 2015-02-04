window.setTimeout(function(){
	//console.log("hide");
	//hide_loading_spinner();
}, 2000);

function show_loading_spinner(){
	document.getElementById("paper-loading-spinner").active = true;
	$("#paper-loading-spinner").css("display","block");
}

function hide_loading_spinner(){
	document.getElementById("paper-loading-spinner").active = false;
	$("#paper-loading-spinner").css("display","none");
}

function show_top_rename(){
	$("#title").addClass("input").removeClass("no-input");
	$('#title').attr('readonly', false);
}

function hide_top_rename(){
	$("#title").addClass("no-input").removeClass("input");
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

var modal_open = false;

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
	
	$("#toggle_side_menu_button").attr("shape","menu");
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
	
	$("#toggle_side_menu_button").attr("shape","cancel");
}

/*========
DIALOGS
=========*/
function show_side_open(){
	//the open dialog
	close_side();
	open_picker()
}
function show_side_share(){
	//share dialog
	close_side();
	show_share()
}
function show_side_upload(){
	//upload dialogs
	close_side();
	upload_picker();
}

function nav_list(){
	if($("#nav_list").hasClass("active")){
		//already there
	}
	else{
		$("#navigate").find(".active").removeClass("active");
		$("#nav_list").addClass("active");
		
		$(".side-store").css("display","block");
		$(".preview").css("display","none");
		$(".terminal").css("display","none");
		$(".lorem").css("display","none");
		$(".options").css("display","none");
		$(".chats").css("display","none");
		$(".tree-tree").css("display","none");
	}
}

function nav_preview(){
	if($("#nav_preview").hasClass("active")){
		//already there
	}
	else{
		$("#navigate").find(".active").removeClass("active");
		$("#nav_preview").addClass("active");
		
		$(".side-store").css("display","none");
		$(".preview").css("display","block");
		$(".terminal").css("display","none");
		$(".lorem").css("display","none");
		$(".options").css("display","none");
		$(".chats").css("display","none");
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
		
		$(".side-store").css("display","none");
		$(".preview").css("display","none");
		$(".terminal").css("display","none");
		$(".lorem").css("display","block");
		$(".options").css("display","none");
		$(".chats").css("display","none");
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
		
		$(".side-store").css("display","none");
		$(".preview").css("display","none");
		$(".terminal").css("display","block");
		$(".lorem").css("display","none");
		$(".options").css("display","none");
		$(".chats").css("display","none");
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
		
		$(".side-store").css("display","none");
		$(".preview").css("display","none");
		$(".terminal").css("display","none");
		$(".lorem").css("display","none");
		$(".options").css("display","block");
		$(".chats").css("display","none");
		$(".tree-tree").css("display","none");
	}
}

function nav_chats(){
	if($("#nav_chats").hasClass("active")){
		//already there
	}
	else{
		$("#navigate").find(".active").removeClass("active");
		$("#nav_chats").addClass("active");
		
		$(".side-store").css("display","none");
		$(".preview").css("display","none");
		$(".terminal").css("display","none");
		$(".lorem").css("display","none");
		$(".options").css("display","none");
		$(".chats").css("display","block");
		$(".tree-tree").css("display","none");
	}
}

function nav_tree(){
	if($("#nav_tree").hasClass("active")){
		//already there
	}
	else{
		$("#navigate").find(".active").removeClass("active");
		$("#nav_tree").addClass("active");
		
		$(".side-store").css("display","none");
		$(".preview").css("display","none");
		$(".terminal").css("display","none");
		$(".lorem").css("display","none");
		$(".options").css("display","none");
		$(".chats").css("display","none");
		$(".tree-tree").css("display","block");
	}
}