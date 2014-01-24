var connection = new WebSocket('ws://64.207.146.34:8080');
connection.onopen = function () {
	console.log("open");
};
function comment(){
	var name = document.getElementById("comment_name").value;
	var mail = document.getElementById("comment_mail").value;
	var text = document.getElementById("comment_comment").value;
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