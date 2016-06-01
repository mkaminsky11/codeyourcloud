function _window_send(send){
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
	    var res = window.eval(to_run);
		_window_log(res);
    }
};