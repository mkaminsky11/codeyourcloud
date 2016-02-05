function _window_send(send){
	send.s = "s";
	window.top.postMessage(JSON.stringify(send), '*')
}

function _window_log(val){
	_window_send({
		type: "run",
		data: val
	});
}

window.onmessage = function(e){
    //e.data
    //things to run
    //console.log goes to _window_send
    var json = JSON.parse(e.data);
    if(json.type === "run"){
	    var to_run = json.data.replace("console.log","_window_log");
	    eval(to_run);
    }
};