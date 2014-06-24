
var side_percent = "30%";
var modal_open = false;

if(window.location.href.indexOf("?mobile=true") !== -1){
	is_mobile = true;
}

if(is_mobile){
	side_percent = "80%";
	$("#side").css("width","80%");
	
	$(".side-modal").css("z-index","91");
	$(".side-modal").css("width","98%");
}

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
	$("#side").animate({
		marginLeft: "-100%"
	}, {
		duration: 1000,
		queue: false,
		complete: function(){
			$("#side").addClass("hide");
			$("#detect").addClass("hide");
		}
	});
	
	if(modal_open){
		//make it larger
		hide_side_modal();		
	}
}

function open_side(){
	side_open = true;
	$("#side").css("margin-left","-100%");
	$("#side").removeClass("hide");
	
	$("#side").animate({
		marginLeft: "0%"
	}, 1000, function(){
		$("#detect").removeClass("hide");
	});
}

$("#detect").click(function(){
	if(side_open){
		side_open = false;
		close_side();
	}	
});

/*=========
RENAME
==========*/
function toggle_side_rename(){
	$("#rename-div").slideToggle();
}

/*==========
MODALS
===========*/
function show_side_modal(){
	if(!modal_open){
		modal_open = true;
		$(".side-modal").css("margin-right","-100%");
		$(".side-modal").removeClass("hide");
		
		$(".side-modal").animate({
			marginRight: "0%"
		}, 1000, function(){
			
		});
	}
	
}

function hide_side_modal(){
	if(modal_open){
		modal_open = false;
		$(".side-modal").animate({
			marginRight: "-100%"
		}, 1000, function(){
			$(".side-modal").addClass("hide");
		});
	}
}

/*========
FUNCTIONS
=========*/
function show_side_open(){
	close_side();
	open_picker()
}
function show_side_share(){
	close_side();
	show_share()
}
function show_side_upload(){
	close_side();
	upload_picker();
}


function show_side_options(){
	if(!modal_open){
		show_side_modal();
	}
	$(".side-modal-title").html("OPTIONS");
	$(".side-modal-active").addClass("hide");
	$(".side-modal-active").removeClass("side-modal-active");
	
	$(".side-modal-options").addClass("side-modal-active");
	$(".side-modal-options").removeClass("hide");
}

function show_side_themes(){
	if(!modal_open){
		show_side_modal();
	}
	$(".side-modal-title").html("THEMES");
	$(".side-modal-active").addClass("hide");
	$(".side-modal-active").removeClass("side-modal-active");
	
	$(".side-modal-themes").addClass("side-modal-active");
	$(".side-modal-themes").removeClass("hide");
}

function show_side_modes(){
	if(!modal_open){
		show_side_modal();
	}
	$(".side-modal-title").html("LANGUAGES");
	$(".side-modal-active").addClass("hide");
	$(".side-modal-active").removeClass("side-modal-active");
	
	$(".side-modal-modes").addClass("side-modal-active");
	$(".side-modal-modes").removeClass("hide");
}

function show_side_chat(){
	if(!modal_open){
		show_side_modal();
	}
	$(".side-modal-title").html("CHAT");
	$(".side-modal-active").addClass("hide");
	$(".side-modal-active").removeClass("side-modal-active");
	
	$(".side-modal-chat").addClass("side-modal-active");
	$(".side-modal-chat").removeClass("hide");
}

function show_side_notepad(){
	if(!modal_open){
		show_side_modal();
	}
	$(".side-modal-title").html("NOTEPAD");
	$(".side-modal-active").addClass("hide");
	$(".side-modal-active").removeClass("side-modal-active");
	
	$(".side-modal-notepad").addClass("side-modal-active");
	$(".side-modal-notepad").removeClass("hide");
}

function show_side_console(){
	if(!modal_open){
		show_side_modal();
	}
	$(".side-modal-title").html("CONSOLE");
	$(".side-modal-active").addClass("hide");
	$(".side-modal-active").removeClass("side-modal-active");
	
	$(".side-modal-console").addClass("side-modal-active");
	$(".side-modal-console").removeClass("hide");
}

function show_side_random(){
	if(!modal_open){
		show_side_modal();
	}
	$(".side-modal-title").html("LOREM");
	$(".side-modal-active").addClass("hide");
	$(".side-modal-active").removeClass("side-modal-active");
	
	$(".side-modal-random").addClass("side-modal-active");
	$(".side-modal-random").removeClass("hide");
}

function show_side_terminal(){
	if(!modal_open){
		show_side_modal();
	}
	$(".side-modal-title").html("TERMINAL");
	$(".side-modal-active").addClass("hide");
	$(".side-modal-active").removeClass("side-modal-active");
	
	$(".side-modal-terminal").addClass("side-modal-active");
	$(".side-modal-terminal").removeClass("hide");
}

function show_side_preview(){
	updatePreview();
	if(!modal_open){
		show_side_modal();
	}
	$(".side-modal-title").html("PREVIEW");
	$(".side-modal-active").addClass("hide");
	$(".side-modal-active").removeClass("side-modal-active");
	
	$(".side-modal-preview").addClass("side-modal-active");
	$(".side-modal-preview").removeClass("hide");
}

/*=======
SWITCH
=========*/
$(".side-switch").each(function(index){
	var icon = $(this).attr("data-icon");
	
	var start_state = $(this).attr("data-state");
	var id = $(this).attr("id");
	var on = $(this).attr("data-onclick");
	var on_color = $(this).attr("on-color");
	var off_color = $(this).attr("off-color");
	
	
	var t = "<div id='"+id+"_switch"+"' class='switch-side-wrap' data-state='"+ start_state +"' onclick='"+on+"' on-color='"+on_color+"' off-color='"+off_color+"'><span class='switch-side-rail'><small class='switch-side-button'><i class='fa fa-" +icon+" switch-side-text'></i></small></span></div>";
	
	$(this).replaceWith(t);
	var new_id = "#" + id + "_switch";
	
	var s_t = $(new_id).attr("data-state");
	set_switch_state(new_id, s_t);
	
	$(new_id).click(function(){
		var s = $(new_id).attr("data-state");
		if(s === "off"){
			set_switch_state(new_id,"on");
		}
		else{
			set_switch_state(new_id,"off");
		}
	});
	
});
function set_switch_state(new_id, state){
		var on_color = $(new_id).attr("on-color");
		var off_color = $(new_id).attr("off-color");
		if(state === "on"){
			//switch to on
			var c = on_color;
			if(c === ""){
				c = "#2ECC71";
			}
			$(new_id).attr("data-state","on");
			$(new_id).find(".switch-side-button").animate({
				left: "42px",
				backgroundColor: c
			});
		}
		else{
			//switch to off
			var c = off_color;
			if(c === ""){
				c = "#E74C3C";
			}
			$(new_id).attr("data-state","off");
			$(new_id).find(".switch-side-button").animate({
				left: "0px",
				backgroundColor: c
			});
		}
}
function get_switch_state(switch_id){
	var s = $("#" + switch_id).attr("data-state");
	if(s === "on"){
		return true;
	}
	else{
		return false;
	}
}