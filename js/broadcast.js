var broadcast = {};
broadcast.init = function(){
	//github already shown...
	var val = localStorage.getItem("cyc-donate")
	if(val === null){
		localStorage.setItem("cyc-donate", 0);
		$("#broadcast #donate").css("display","flex");
		broadcast.show();
	}
	else if(val === "0"){
		$("#broadcast #donate").css("display","flex");
		broadcast.show();
		localStorage.setItem("cyc-donate", 8); //countdown!
	}
	else{
		localStorage.setItem("cyc-donate", val - 1);
	}	
};

broadcast.show = function(){
	if($("#broadcast").css("display") === "none"){
		$("#broadcast").css("opacity",0).css("display","block");
		window.setTimeout(function(){
			$("#broadcast").velocity("transition.bounceUpIn");
		}, 500);
	}
	else{
		$("#broadcast").velocity("callout.bounce");
	}
};

broadcast.close = function(){
	$("#broadcast").velocity("transition.bounceDownOut",{
		complete: function(){
			$("#broadcast").css("display","none");
		}
	});
};

broadcast.minimapWarn = function(){
	
}

broadcast.reset = function(){
	$("#broadcast > div").css("display","none");
}

broadcast.ad_ok = function(){
	connection.send(JSON.stringify({type:"survey",vote:"yes"}));
}
broadcast.ad_no = function(){
	connection.send(JSON.stringify({type:"survey",vote:"no"}));
}
