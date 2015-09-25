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
	var new_user = "<img class=\"user-photo\" id=\"img_" + id + "\" src=\""+ photo +"\" height=\"53px\" width=\"53px\" style=\"border:solid 4px "+ color +"\">";
	$(".users-container[data-fileid='"+fileid+"']").html( $(".users-container[data-fileid='"+fileid+"']").html() + new_user);
	
	Messenger().post({
		message: name + " joined",
		type: 'info',
		showCloseButton: true
	});
}
function removeUser(id, fileid){
	try{
		$(".users-container[data-fileid='"+fileid+"']").find("#img_" + id).slideUp("slow",function(){
			$(".users-container[data-fileid='"+fileid+"']").find("#img_" + id).remove();
		});
	}
	catch(e){
	}
}


/**
* SAVING
* save and save as
**/
function save(){
	if(current_file !== "welcome"){
		var content = editor().getValue();
		if(typeof content !== "undefined"){ //if nothing is "null"
			if(cloud_use === "drive"){
		        var contentArray = new Array(content.length);
		        for (var i = 0; i < contentArray.length; i++) {
		            contentArray[i] = content.charCodeAt(i);
		        }
		        var byteArray = new Uint8Array(contentArray);
		        var blob = new Blob([byteArray], {type: 'text/plain'}); //this is the only way I could get this to work
		        var request = gapi.client.drive.files.get({'fileId': current_file});//gets the metadata, which is left alone
		
		        
		        request.execute(function(resp) {
		            drive.updateFile(current_file,resp,blob, function(resp){
			            manager.setSaveState(resp.id, true)
			        });
		        });
		    }
		    else if(cloud_use === "sky"){
			    sky.updateFile(current_file, content, function(resp){
				    console.log(resp);
			    });
		    }
	    }
	}
}

function trash(){
	if(current_file !== "welcome"){
		if(cloud_use === "drive"){
			drive.trash(current_file);
		}
		else if(cloud_use === "sky"){
			sky.trash(current_file);
		}
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

/**
* RENAMING
* renames the file
**/
function ok_rename(){
	setFileTitle(current_file, $("#title").val());
	if(cloud_use === "drive"){
		sendData({
			type: "title",
			title: $("#title").val()
		}, current_file);
	}
	else if(cloud_use === "sky"){
		sky.renameFile(current_file, $("#title").val());
	}
}
