
var mini = {
	displayed: false
};

mini.mini = function(){
	var mode = ".cm-s-"+ editor().getOption("theme");
	
	var text = editor().getValue();
	var array = text.split("\n");
	var html = "";
	
	$(".mini-row").remove();
	
	var prev = -1;
	
	for(var i = 0; i < array.length; i++){
		
		html += "<div class='mini-row'>"
		
		var line = array[i];
		for(var j = 0; j < line.length; j++){
			
			var check_string = "" + line.charAt(j);
			var out = editor().doc.cm.getTokenTypeAt({line:i,ch:j});
			
			if(check_string === "\t"){
				html += "<div class='mini-tab'></div>";
				prev = null; //?
			}
			else if(check_string === " "){
				html += "<div class='mini-space'></div>";
				prev = null; //?
			}
			else{
				if(out !== prev){
					//new, add space
					html += "<div class='mini-space'></div>";
				}
				
				//
				prev = out;
				
				var style = "";
				if(out !== null){
					style = "background-color:" + $(mode + " span.cm-" + out).css("color");
				}
				
				html += "<div class='mini-block mini-block-"+out+"' style='"+style+"'></div>";
			}
		}
		
		html += "</div>";
	}
	
	$(".mini-insert").after(html);
};

mini.view = function(){
	

};

mini.toggle = function(){
	if($(".mini").css("display") === "none"){
		$("#codemirror-sizer").css("width","calc(100% - 150px)");
	}
	else{
		$("#codemirror-sizer").css("width","calc(100% - 53px)");
	}
	$(".mini").toggle();
};