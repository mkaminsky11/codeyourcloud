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


function poly_loaded(){
    
}

window.addEventListener('polymer-ready', function(e){
	//the actual event
	
	checkGithub(); //declared in broadcast.js
	
	poly_loaded();

	//sets options
	line_wrap = editor().getOption("lineWrapping");
	line_number = editor().getOption("lineNumbers");
	if(line_wrap !== $('#side-wrap').prop('checked')){
		document.getElementById("side-wrap").toggle();
	}
	
	if(line_number !== $('#side-nums').prop('checked')){
		document.getElementById("side-nums").toggle();
	}

	editor().refresh();
	
	CoreStyle.g.paperInput.focusedColor = "#95A5A6";
});
