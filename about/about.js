var connection = new WebSocket('wss://codeyourcloud.com:8080');
connection.onopen = function () {
	console.log("open");
};
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
	return string.replace(/(<([^>]+)>)/ig,"");
}
