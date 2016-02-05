/*===
* CODEYOURCLOUD
===*/

var realtime = {};
realtime.init = function(){
  realtime.socket = io.connect('https://codeyourcloud.com:443');
  realtime.socket.on('message', realtime.callback);
}
realtime.openFile = function(id){
  //make yourself known using cloud_use, id
};
realtime.insertText = function(){
  
};
realtime.deleteText = function(){
  
};
realtime.callback = function(data){
  console.log(data);
};
realtime.send = function(data){
	if(cloud_use === "drive"){
	  realtime.socket.emit('send', {
		data: data,
		access_token: gapi.auth.getToken().access_token,
		cloud: "drive"
	  });
	}
	else if(cloud_use === "sky"){
		WL.getLoginStatus(function(resp){
			var _a_t = resp.session.access_token;
			realtime.socket.emit('send', {
				data: data,
				access_token: _a_t,
				cloud: "sky"
			});
		});
	}
}


var _init = false;

function loadDrive(){
	drive.load();
}
function loadSky(){
	sky.load();
}
function init(){
	if(_init === false){
		_init = true;
		drive.checkAppLogin(function(_logged_in, _acct_data){
			true_id = _acct_data.user._id;
			$("#loading-bar").css("width","10%");
			if(_logged_in === false){
				console.log("redirect for no app login");
				if(window.location.href.indexOf("no=true") === -1){
					window.location = "https://codeyourcloud.com/about";
				}
			} else {
				
				cloud_use = "drive";
				if(window.location.href.indexOf("?sky=true") !== -1){
					//some indication of sky
					if(sky.logged_in === true){
						cloud_use = "sky";
						$("#loading-bar").css("width","30%");
					}
					else{
						console.log("redirect for skydrive");
						if(window.location.href.indexOf("no=true") === -1){
							window.location = "https://codeyourcloud.com/about";
						}
					}
				}
				else if(window.location.href.indexOf("?drive=true") !== -1 || window.location.href.indexOf("%22action%22:%22") !== -1){
					if(drive.logged_in === true){
						//all good!
						$("#loading-bar").css("width","30%");
					}
					else{
						console.log("redirect for drive");
						if(window.location.href.indexOf("no=true") === -1){
							window.location = "https://codeyourcloud.com/about";
						}
					}
				}
				else{
					//no indication
					if(drive.logged_in === true && sky.logged_in === false){
						$("#loading-bar").css("width","30%");
					}
					else if(drive.logged_in === false && sky.logged_in === true){
						cloud_use = "sky";
						$("#loading-bar").css("width","30%");
					}
					else if(drive.logged_in === true && sky.logged_in === true){
						$("#loading-bar").css("width","30%");
					}
					else{
						console.log("redirect for none");
						if(window.location.href.indexOf("no=true") === -1){
							window.location = "https://codeyourcloud.com/about";
						}
					}
				}
				
				if(cloud_use === "drive"){
					drive.loadClient();
				}
				else{
					sky.loadClient();
				}
			}
		});
	}
}

function new_file(){
	if(cloud_use === "drive"){
		insertNewFile(drive.root);
	}
	else if(cloud_use === "sky"){
		sky.insertNewFile(sky.upload_location, (new Date()).getTime()+".txt", "");
	}
}
