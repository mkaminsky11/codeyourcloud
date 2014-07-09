
var side_percent = "30%";
var modal_open = false;

if(window.location.href.indexOf("?mobile=true") !== -1){
	is_mobile = true;
}

if(is_mobile){
	side_percent = "80%";
	$("#side").css("width","80%");
	
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

function showDialog(modal){

	var t =  "#" + modal + "-dialog";
	if($(t).css("display") === "none"){
		//show it
		$(t).css("left","-100%");
		$(t).css("display","block");
		$(t).animate({
			left: "0%"
		},"easeInOutCubic",function(){
			if(modal === "preview"){
				$(".preview-content").css("-webkit-overflow-scrolling","auto");
				setTimeout(function(){
					$(".preview-content").css("-webkit-overflow-scrolling","touch");
				}, 100);
			}
		});
	}
	else{
		$(t).animate({
			left: "-100%"
		}, "easeInOutCubic",function(){
			$(t).css("left","0%");
			$(t).css("display","none");
			
			if(modal === "preview"){
				$(".preview-content").css("-webkit-overflow-scrolling","auto");
				setTimeout(function(){
					$(".preview-content").css("-webkit-overflow-scrolling","touch");
				}, 100);
			}
		});
	}
	
	close_side();
}

function show_side_options(){
	showDialog("options")
}

function show_side_themes(){
	showDialog("theme");
}

function show_side_modes(){
	showDialog("mode");
}

function show_side_chat(){
	showDialog("chat");
}



function show_side_random(){
	showDialog("lorem");
}

function show_side_terminal(){
	showDialog("terminal");
	setTimeout(function(){
		mirror.refresh();
	},500);
}

function show_side_preview(){
	updatePreview();
	showDialog("preview");
}
