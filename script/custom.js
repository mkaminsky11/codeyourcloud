function show_loading_spinner(){
	document.getElementById("paper-loading-spinner").active = true;
	$("#paper-loading-spinner").css("display","block");
}

function hide_loading_spinner(){
	document.getElementById("paper-loading-spinner").active = false;
	$("#paper-loading-spinner").css("display","none");
}

function show_top_rename(){
	//shows the rename input at the top of the screen
	close_side();
	//previous invisible
	$("#new_title_input").css("display","block");
	
	$("#new_title_ok").css("display","block");
	
	$("#new_title_no").css("display","block");
	//expands the nav bar to fit the input
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
	//hides the rename input

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
	/*$("#side").velocity({
		marginLeft: "-" + side_open_width,
		rotateY: "90deg"
	}, {
		duration: 700,
		queue: false,
		complete: function(){
			$("#side").addClass("hide");
		}
	});*/
	
	$("#side").velocity("transition.flipXOut", {
		drag: true, 
		duration: 325, 
		queue: false,
		complete: function(){
			$("#side").css("display","none");
		}
	});
	
	$("#detect").velocity("fadeOut", { duration: 1500 })
}

function open_side(){
	if(is_mobile){
		side_open_width = "80%";
	}
	else{
		side_open_width = "25%";
	}

	side_open = true;
	//$("#side").css("margin-left","-300px");
	$("#side").removeClass("hide");
	
	/*$(".side-item").css("opacity",0).delay(500).velocity("transition.slideLeftBigIn", {stagger: 55, drag: true, duration: 325});
	
	$("#side").velocity({
		marginLeft: "0%",
		rotateY: "0deg"
	}, {
		duration: 300,
		queue: false
	});*/
	
	$("#side").css("opacity",0).css("display","block").css("margin-left",0);
	
	$("#side").velocity("transition.flipXIn", {drag: true, duration: 325, queue: false});
	$(".side-item").not(":hidden").css("opacity",0).delay(500).velocity("transition.slideLeftBigIn", {stagger: 55, drag: true, duration: 325, queue: false});
	
	$("#detect").velocity("fadeIn", { duration: 400 });
}

$("#detect").click(function(){
	//partially clear screen
	if(side_open){
		side_open = false;
		close_side();
	}	
});

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

function hideDialog(modal){
	$("#detect-dialog").velocity("fadeOut",{ duration: 400 });
	
	var t =  "#" + modal + "-dialog";
	var b = "#close-button-" + modal;
	
	//hide
	//$(t).css("opacity",0).delay(500).velocity("transition.slideLeftBigIn",{
	$(t).velocity("transition.slideRightBigOut",{
		complete: function(){
		
			$(b).velocity("fadeOut",{
				duration: 400,
				queue: false
			});
			
			$("#detect-dialog").velocity("fadeOut",{
				duration: 400,
				queue: false
			});
		
			if(modal === "preview"){
				$(".preview-content").css("-webkit-overflow-scrolling","auto");
				setTimeout(function(){
					$(".preview-content").css("-webkit-overflow-scrolling","touch");
				}, 100);
			}
			
			$(t).css("display","none");
		},
		duration: 300,
		drag: true
	});
}

function showDialog(modal){

	$("#detect-dialog").velocity("fadeIn",{ duration: 400 });

	var t =  "#" + modal + "-dialog";
	var b = "#close-button-" + modal;
	
	//show it
	$(b).velocity("fadeIn",{
		duration: 400,
		queue: false
	});

	$(t).css("opacity",0).css("display","block").delay(500).velocity("transition.slideLeftBigIn",{
			duration: 300,
			drag: true,
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
