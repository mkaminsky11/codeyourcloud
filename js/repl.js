var repl = {};
repl.send = function(send){
	repl.elem.contentWindow.postMessage(JSON.stringify(send), '*');
}
repl.onmessage = function(e){
	//console.log(JSON.parse(e.data));
}
repl.init = function(){
		window.onmessage = repl.onmessage;
		repl.elem = document.getElementById("repl");
}