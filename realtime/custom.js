var side_open = false;
var side_percent = "30%";

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
	$("#side").animate({
		marginLeft: "-100%"
	}, 1000, function(){
		$("#side").addClass("hide");
		$("#detect").addClass("hide");
	});
}

function open_side(){
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
if(is_welcome){
	$("#rename-toggle").addClass("hide");
}

function toggle_side_rename(){
	$("#rename-div").slideToggle();
}