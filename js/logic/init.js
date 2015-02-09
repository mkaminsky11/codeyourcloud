
function loadDrive(){
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': true},handleAuth);
}
//handles result
function handleAuth(authResult){
	if (!authResult.error) {
		loadClient();
	} 
	else {
	}
}

function loadClient() {

	current_file = getParameterByName("id");
	
	gapi.client.load('drive', 'v2', load_drive);
	gapi.load("auth:client,drive-realtime", load_real);
	
}

function load_drive(){
	setInterval(function(){
		refreshToken();
	},3000000);
	drive_loaded = true;
	if(real_loaded){
		init();
	}
}

function refreshToken() {
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate':true},function(result){
		
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
	getContentOfFile(current_file, model);
}

function errorFn(error){
	was_error = true;
	console.log(error);
}


function init(){
	gapi.drive.realtime.load(current_file, loaded_realtime, init_realtime, errorFn);
}