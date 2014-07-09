
function loadDrive(){
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': true},handleAuth);
}
//handles result
function handleAuth(authResult){
	if (!authResult.error) {
		loadClient();
		sendData({type:"login",value:"true"});
	} 
	else {
		sendData({type:"login",value:"false"});
	}
}

function loadClient() {
	gapi.client.load('drive', 'v2', load_drive);
	if(getParameterByName("id") !== ""){
		current = getParameterByName("id");
		gapi.load("auth:client,drive-realtime,drive-share", load_real);
		sendData({type:"welcome",value:"false"});
	}
	else{
		//welcome();
		sendData({type:"welcome",value:"true"});
	}
	
}

function load_drive(){
	setInterval(function(){
		refreshToken();
	},3000000);
	get_info();
	drive_loaded = true;
	if(real_loaded){
		init();
	}
}

function refreshToken() {
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate':true},function(result){
		
	});
}

function get_info(){
	var request = gapi.client.drive.about.get();
    request.execute(function(resp) {
        myRootFolderId = resp.rootFolderId;
        myEmail = resp.user.emailAddress;
        
        
        userName = resp.name;
        try{
            userUrl = resp.user.picture.url;
        }
        catch(e){}
        try{
            userId = resp.user.permissionId;
            
        }
        catch(e){}
        
        sendData({
	        type: "info_drive",
	        folder: myRootFolderId,
	        mail: myEmail,
	        name: userName,
	        photo: userUrl,
	        id: userId
        });
    });
}

function load_real(){
	real_loaded = true;
	if(drive_loaded){
		init();
	}
}


function init_realtime(model){
	init_needed = true;
	getContentOfFile(current, model);
}
function errorFn(error){
	was_error = true;
	console.log(error);
	sendData({
		type:"error",
		data:error
	});
}


function init(){
	gapi.drive.realtime.load(current, loaded_realtime, init_realtime, errorFn);
}