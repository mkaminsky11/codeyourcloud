function show_top_rename(){
	close_side();

	$("#new_title_input").css("display","block");
	
	$("#new_title_ok").css("display","block");
	
	$("#new_title_no").css("display","block");

	$("#nav").velocity({
		paddingTop: "60px"
	},{
		duration: 1000,
		queue: false
	});
	
	$("#new_title_input").velocity({
		top: "10px",
		rotateX: "0deg"
	},{
		duration: 1000,
		queue: false
	});
	
	$("#new_title_ok").velocity({
		top: "20px"
	},{
		duration: 1000,
		queue: false
	});
	
	$("#new_title_no").velocity({
		top: "20px"
	},{
		duration: 1000,
		queue: false
	});
}

function hide_top_rename(){
	

	$("#nav").velocity({
		paddingTop: "0px"
	},{
		duration: 1000,
		queue: false
	});
	
	$("#new_title_ok").velocity({
		top: "-60px"
	},{
		duration: 1000,
		queue: false,
		complete: function(){
			$("#new_title_ok").css("display","none");
		}
	});
	
	$("#new_title_no").velocity({
		top: "-60px"
	},{
		duration: 1000,
		queue: false,
		complete: function(){
			$("#new_title_no").css("display","none");
		}
	});
	
	$("#new_title_input").velocity({
		top: "-60px",
		rotateX: "90deg"
	},{
		duration: 1000,
		queue: false,
		complete: function(){
			$("#new_title_input").css("display","none");
		}
	});
}

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
		marginLeft: "-100%",
		rotateY: "90deg"
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
		marginLeft: "0%",
		rotateY: "0deg"
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

function hideDialog(modal){
	$("#detect-dialog").velocity("fadeOut",{ duration: 1500 });
	
	var t =  "#" + modal + "-dialog";
	var b = "#close-button-" + modal;
	
	//hide
		
	$(t).slideUp({
		complete: function(){
		
			$(b).velocity("fadeOut",{
				duration: 1000,
				queue: false
			});
			
			$("#detect-dialog").velocity("fadeOut",{
                                    duration: 1000,
                                    queue: false
                            });
		
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

function showDialog(modal){

	$("#detect-dialog").velocity("fadeIn",{ duration: 1500 });

	var t =  "#" + modal + "-dialog";
	var b = "#close-button-" + modal;
	
	//show it
	$(b).velocity("fadeIn",{
		duration: 1000,
		queue: false
	});

	$(t).velocity("slideDown",{
			duration: 1000,
			complete: function(){
			
				//$(b).velocity("fadeIn", { duration: 1000 })
			
				if(modal === "preview"){
					$(".preview-content").css("-webkit-overflow-scrolling","auto");
					setTimeout(function(){
						$(".preview-content").css("-webkit-overflow-scrolling","touch");
					}, 100);
				}
			}
		});
	
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
