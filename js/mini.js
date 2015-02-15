/*
if integer, nothing
meta = regular
tag bracket -> <,>
tag -> html, div

	
	
=======

editor().doc.cm.getViewport() -> {to, from}
get whats is in viewport

cm.getTokenTypeAt(pos: {line, ch})
*/


//next, get colors

/*
	
CM         | MINI
---------------------
variable -> variable	
null -> reg
property -> property

//ex: .cm-s-3024-night span.cm-comment
*/

function mini(){
	var mode = ".cm-s-"+ editor().getOption("theme");
	
	var text = editor().getValue();
	var array = text.split("\n");
	var html = "";
	
	$(".mini-tab").remove();
	$(".mini-block").remove();
	$(".mini-space").remove();
	
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
	
	$("#mini-insert").after(html);
	//$("#mini").css("display","block");
}

function miniView(){
	
	var view = editor().doc.cm.getViewport();
	var from = view.from;
	var to = view.to;
	
	var top = $(".mini-row").eq(from).position().top + "px";
	var height = 4 * (to - from) + "px";
	
	$("#mini-scroll").css("height", height);
	$("#mini-scroll").css("top", top);
}

mini();