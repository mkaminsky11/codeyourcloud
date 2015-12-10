/*===
* CODEYOURCLOUD
===*/


/**
* AUTHORIZATION
* authorizes the user
**/

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
		//decide wether to load sky or drive
		//keep it basic for now...
		cloud_use = "drive";
		if(window.location.href.indexOf("?sky=true") !== -1 || window.location.href.indexOf("#access_token=") !== -1){
			//some indication of sky
			if(sky.logged_in === true){
				//ok...load sky, I guess
				cloud_use = "sky";
			}
			else{
				console.log("redirect for skydrive");
				if(window.location.href.indexOf("no=true") === -1){
					window.location = "https://codeyourcloud.com/about";
				}
			}
		}
		else if(window.location.href.indexOf("?drive=true") !== -1 || window.location.href.indexOf("%22action%22:%22") !== -1 || window.location.href.indexOf("#state=/profile&access_token=") !== -1){
			//indication of drive
			if(drive.logged_in === true){
				//all good!
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
				//all good!
			}
			else if(drive.logged_in === false && sky.logged_in === true){
				cloud_use = "sky";
			}
			else if(drive.logged_in === true && sky.logged_in === true){
				//all good! -> prioritize drive
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
}


//insert a new collaborating user
function insertUser(name, color, photo, id, fileid){
	/*var new_user = "<img class=\"user-photo\" id=\"img_" + id + "\" src=\""+ photo +"\" height=\"53px\" width=\"53px\" style=\"border:solid 4px "+ color +"\">";
	$(".users-container[data-fileid='"+fileid+"']").html( $(".users-container[data-fileid='"+fileid+"']").html() + new_user);*/
	
	Messenger().post({
		message: name + " joined",
		type: 'info',
		showCloseButton: true
	});
}
function removeUser(id, fileid){
	/*try{
		$(".users-container[data-fileid='"+fileid+"']").find("#img_" + id).slideUp("slow",function(){
			$(".users-container[data-fileid='"+fileid+"']").find("#img_" + id).remove();
		});
	}
	catch(e){
	}*/
}

function new_file(){
	if(cloud_use === "drive"){
		insertNewFile(drive.root);
	}
	else if(cloud_use === "sky"){
		sky.insertNewFile(sky.upload_location, (new Date()).getTime()+".txt", "");
	}
}
