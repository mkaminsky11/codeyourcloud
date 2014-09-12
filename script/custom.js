
var side_percent = "30%";
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
		marginLeft: "-100%"
	}, {
		duration: 1000,
		queue: false,
		complete: function(){
			$("#side").addClass("hide");
		}
	});
	$("#detect").velocity("fadeOut", { duration: 1500 })
	
	if(modal_open){
		//make it larger
		//hide_side_modal();		
	}
}

function open_side(){
	side_open = true;
	$("#side").css("margin-left","-100%");
	$("#side").removeClass("hide");
	
	$("#side").velocity({
		marginLeft: "0%"
	}, {
		duration: 1000,
		queue: false
	});
	$("#detect").velocity("fadeIn", { duration: 1500 })
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

	$("#detect-dialog").fadeIn();

	var t =  "#" + modal + "-dialog";
	var b = "#close-button-" + modal;
	if($(t).css("display") === "none"){
		//show it
		$(t).slideDown({
			complete: function(){
			
				$(b).velocity("fadeIn", { duration: 1500 })
			
				if(modal === "preview"){
					$(".preview-content").css("-webkit-overflow-scrolling","auto");
					setTimeout(function(){
						$(".preview-content").css("-webkit-overflow-scrolling","touch");
					}, 100);
				}
			}
		});
	}
	else{
		//hide
		
		$(t).slideUp({
			complete: function(){
			
				$(b).fadeOut();
				
				$("#detect-dialog").fadeOut();
			
				if(modal === "preview"){
					$(".preview-content").css("-webkit-overflow-scrolling","auto");
					setTimeout(function(){
						$(".preview-content").css("-webkit-overflow-scrolling","touch");
					}, 100);
				}
			}
		},{
			
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
	showDialog("random");
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
