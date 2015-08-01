$(window).resize(function() {
	var width = $("#screen").width();
	$("#svg2").css("width", width + "px");
	var mid = Math.floor(width / 2);
	$("#svg2").css("margin-left", "calc(50% - "+mid+"px)");
});

var width = $("#screen").width();
$("#svg2").css("width", (width - 1) + "px");
var mid = Math.floor(width / 2);
$("#svg2").css("margin-left", "calc(50% - "+mid+"px)");

$("#logos").fitText();

var ok = true;

/*********
COMMENTS
*********/
var connection = new WebSocket('wss://codeyourcloud.com:8080');
connection.onopen = function () {
	console.log("open");
};
connection.onmessage = function (message) {
	console.log(json);

	try {
		var json = JSON.parse(message.data);
		if(json.type === "ok"){
		}
	}
	catch(e){}
}
function comment(){
	var name = strip(document.getElementById("comment_name").value);
	var mail = strip(document.getElementById("comment_mail").value);
	var text = strip(document.getElementById("comment_comment").value);

	
	connection.send(JSON.stringify({type: "comment", sender: name, email: mail, comment: text}));
	document.getElementById("comment_name").value = "";
	document.getElementById("comment_mail").value = "";
	document.getElementById("comment_comment").value = "";
}
function resetForm(){
	document.getElementById("comment_name").value = "";
	document.getElementById("comment_mail").value = "";
	document.getElementById("comment_comment").value = "";	
}
function strip(string){
	var ret = string.split("(").join("").split(")").join("");
	ret = ret.split("{").join("").split("}").join("");
	ret = ret.split("+").join("").split("-").join("");
	ret = ret.split(";").join("").split("<").join("").split(">").join("");
	return ret;
}

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-47415821-1', 'codeyourcloud.com');
ga('send', 'pageview');