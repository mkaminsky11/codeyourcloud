/*===
* CODEYOURCLOUD
*
* realtime.js built by Michael Kaminsky
* handles google drive and realtime events like adding and remove users
*
* contents:
*  authorization 
*  users
*  saving
*  renaming
===*/


/**
* AUTHORIZATION
* authorizes the user
**/

function loadDrive(){
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': true},handleAuth);
}
//handles result
function handleAuth(authResult){
	console.log("AUTH OUTPUT:");
	console.log(authResult);
	if (!authResult.error) {
		logged_in = true;
		loadClient();
	} 
	else {
		//?no = true is just used for testing purposes
		//it prevents a redirection in the event of an unauthorized user
		if(window.location.href.indexOf("no=true") === -1 && authResult.status.signed_in === false){
			window.location = "https://codeyourcloud.com/about";
		}
		
		if(window.location.href.indexOf("force=true") !== -1){
			loadClient();
			logged_in = true;
		}
		
		if(window.location.href.indexOf("output=true") !== -1){
			console.log("error:" + authResult.error);
			console.log("error subtype:" + authResult.error_subtype);
		}
	}
}
function loadClient() {
	gapi.client.load('drive', 'v2', load_drive);
}
function load_drive(){
	//this need to be refreshed every 55 minutes
	setInterval(function(){
		refreshToken();
	},3000000);
	get_info();
	
	
	var url = window.location.href;
	var query = window.location.href.split("?")[1];
	if(url.indexOf("%22action%22:%22open") !== -1){
		//need to open a file
		var query_id = query.split("%22")[3];
		addTab("loading...",query_id,false);
		
	}
	else if(url.indexOf("%22action%22:%22create%22") !== -1){
		//need to create new file
		var query_folder_id = query.split("%22")[3];
		insertNewFile(query_folder_id);
	}
}
function refreshToken() {
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate':true},function(result){
		
	});
}

function get_info(){
	//gets info about the user
    var request = gapi.client.drive.about.get();
    request.execute(function(resp) {
        myRootFolderId = resp.rootFolderId;
        try{
	        //if this fails, probably unauthorized
        	myEmail = resp.user.emailAddress;
        }
        catch(e){
	        myEmail = "error:unable to fetch email"; //just letting you know...
        }
        
        userName = resp.name;
        try{
	        //this has been known to fail occassionally
            userUrl = resp.user.picture.url;
            
            var tempUrl = userUrl;
            
            if(tempUrl.indexOf("https://") === -1){
	            //no https
	            tempUrl = "https:" + tempUrl;
            }
            
            if(typeof tempUrl === 'undefined'){
			//get the user profile, unless there is none
	            userUrl = "https://codeyourcloud.com/images/other/none.jpg";
	            tempUrl = "https://codeyourcloud.com/images/other/none.jpg";
            }
            
            $("#profile_pic").attr("src",tempUrl);
            
        }
        catch(e){ //fortunately, got the default image
	        userUrl = "https://codeyourcloud.com/images/other/none.jpg";
	        $("#profile_pic").attr("src",userUrl);
        }
        
        try{
	        //this is the link for published html files
            userId = resp.user.permissionId;
            $("#side-pub-link").attr("href", "https://codeyourcloud.com/pub/"+userId+"/index.html");
            
        }
        catch(e){}
        
        //gets user storage information
		//not currently used by anything, but...
        total_q = resp.quotaBytesTotal;
        user_q = resp.quotaBytesUsedAggregate;
        product_q = Math.round(user_q/total_q * 100);
        
        //initializes the tree view once the foot folder id is loaded
        $(".root-tree").attr("data-tree-ul", myRootFolderId);
        get_tree(myRootFolderId);
    });
}
/**
* USERS
* adds and removes user pictures
**/

//insert a new collaborating user
function insertUser(name, color, photo, id, fileid){
	var new_user = "<img class=\"user-photo\" id=\"img_" + id + "\" src=\""+ photo +"\" height=\"53px\" width=\"53px\" style=\"border:solid 4px "+ color +"\">";
	$(".users-container[data-fileid='"+fileid+"']").html( $(".users-container[data-fileid='"+fileid+"']").html() + new_user);
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
	if(current_file !== "welcome"){ //default screen, which can't be saved
		sendData({
			type: "save"
		}, current_file);
	}
}

function saveAs(){
	showSaveAsPicker();
}

/**
* RENAMING
* renames the file
**/
function ok_rename(){
	setFileTitle(current_file, $("#title").val());
	sendData({
		type: "title",
		title: $("#title").val()
	}, current_file);
}
