var connection = new WebSocket('wss://codeyourcloud.com:8080');
connection.onopen = function () {
	console.log("open");
};
connection.onmessage = function (message) {
	try {
		var json = JSON.parse(message.data);
		if(json.type === "ok"){
			window.location = "https://codeyourcloud.com/survey/thanks.html";
		}
	} catch (e) {
		return;
	}
};
connection.onerror = function (error) {
};


function submit(){
	var choice = 0;
	
	if($("#image_0").is(":checked")){
		choice = 0;
	}
	else if($("#image_1").is(":checked")){
		choice = 1;
	}
	else if($("#image_2").is(":checked")){
		choice = 2;
	}
	else if($("#image_3").is(":checked")){
		choice = 3;
	}
	else if($("#image_4").is(":checked")){
		choice = 4;
	}
	
	connection.send(JSON.stringify({type: "comment", sender: "image", email: "image@image.com", comment: "" + choice}));
	setTimeout(function(){
		window.location = "https://codeyourcloud.com/survey/thanks.html";
	}, 1000);
}
function cancel(){
	window.location = "https://codeyourcloud.com";
}