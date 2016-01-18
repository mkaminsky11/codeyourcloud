function _window_send(send){
	window.top.postMessage(JSON.stringify(send), '*')
}

window.onmessage = function(e){
    //e.data
    //things to run
    //console.log goes to _window_send
};