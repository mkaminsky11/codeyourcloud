var repl = {};
repl.send = function(send){
	repl.elem.contentWindow.postMessage(JSON.stringify(send), '*');
}
repl.init = function(){
		repl.elem = document.getElementById("repl");
}
repl.run = function(text){
	repl.send({
		type: "run",
		data: text
	});
}