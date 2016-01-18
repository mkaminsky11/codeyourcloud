var sky = {};
sky.scopes = "wl.signin wl.skydrive wl.basic wl.skydrive_update";
sky.client_id = "0000000044157F3B";
sky.login_url = "https://login.live.com/oauth20_authorize.srf?client_id=0000000044157F3B&scope="+ encodeURIComponent(sky.scopes) +"&response_type=token&redirect_uri=" + encodeURIComponent("https://codeyourcloud.com");
sky.logout_url = "https://login.live.com/oauth20_logout.srf?client_id=0000000044157F3B&scope="+ encodeURIComponent(sky.scopes) +"&response_type=token&redirect_uri=" + encodeURIComponent("https://codeyourcloud.com");
sky.logged_in = false;
sky.loaded = false;
sky.username = null;
sky.upload_location = null;
sky.id = null;
sky.url = "https://codeyourcloud.com/images/other/none.jpg";


sky.load = function(){
	WL.init({
		client_id: "0000000044157F3B",
		redirect_uri: "https://codeyourcloud.com",
		scope: ["wl.signin","wl.skydrive","wl.basic","wl.skydrive_update"],
		response_type: "token"
	});
	
	WL.getLoginStatus(function(response) {
		$("#loading-bar").css("width","50%");
		console.log(response);
		//response.status
		sky.loaded = true;
		if(response.status === "connected"){
			sky.logged_in = true;
		}
		else{
			sky.logged_in = false;
		}
		
		if(drive.loaded === true){
			init();
		}
	});
}

sky.loadClient = function(){
	$("#loading-bar").css("width","70%");
	$("#help_button").remove();
	$(".share-button").remove();
	$("#log-out").attr("href", sky.logout_url);
	$("#swap").attr("href", "https://codeyourcloud.com?drive=true");
	$("#swap").html( $("#swap").html().replace("Switch To OneDrive", "Switch To Google Drive") );
	sky.getInfo();
}

/*
	
me -> get info: name, id
me/skydrive -> root folder

*/

sky.getInfo = function(){
	WL.api({
		path: "me",
        method: "GET"
	}).then(function(res){
		$("#loading-bar").css("width","90%");
		console.log(res);
		sky.id = res.id;
		sky.username = res.name;
		
		WL.api({
			path: "me/picture",
	        method: "GET"
		}).then(function(res){
			console.log(res);
			try{
				sky.url = res.location
				$("#profile_pic").attr("src",sky.url);
			}
			catch(e){
				$("#profile_pic").attr("src",sky.url);
			}
		}, function(err){
			$("#profile_pic").attr("src",sky.url);
		});
		
		try{
			$(".side-drive").css("display","none");
		}
		catch(e){}
		
		WL.api({
			path: "me/skydrive",
	        method: "GET"
		}).then(function(res){
			sky.root = res.id;
			sky.upload_location = res.upload_location;
			$(".root-tree").attr("data-tree-ul", sky.root);
			get_tree(sky.root);
			$("#loading-overlay").css("display","none");
		}, function(err){});
		
	}, function(err){});
}

sky.retrieveAllFilesInFolder = function(id, callback){
	WL.api({
    	path: (id + "/files"),
        method: "GET"
    }).then(function(res){
	    callback(res.data, id);
	}, function(err){});
};

sky.getFile = function(id, callback){
	WL.api({
    	path: (id),
        method: "GET"
    }).then(function(res){
	    callback(res);
	}, function(err){});	
}

sky.getContentOfFile = function(id, callback){
	WL.api({
    	path: (id + "/content"),
        method: "GET"
    }).then(function(res){
	    $.get(res.location, function(data){
		  callback(data);
		});
	}, function(err){});
}

sky.updateFile = function(id, body, callback){
	var url = 'https://apis.live.net/v5.0/'+id+'/content/' + '?access_token=' + WL.getSession().access_token;
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.onload = function () {
        callback(xhr.response);
    };
    xhr.onerror = function (error) {
    };
    xhr.send(new Blob([body]));
}

sky.trash = function(id){
	manager.removeTab(id);
	get_tree(sky.root);
	WL.api({
    	path: id,
		method: "DELETE"
	});
}

sky.renameFile = function(id, title){
	WL.api({
		path: id,
        method: "PUT",
        body: {
			name: title
		} 
	}).then(
		function (response) {
	},
    function (responseFailed) {
    });
}

sky.upload = function(){
		WL.fileDialog({
	        mode: "save"
	    }).then(
	        function(res){
	           try{
		           if($("#file").val() !== "" && res){
			           WL.upload({
			                path: res.data.folders[0].id,
			                element: "file",
			                overwrite: "rename"
			            }).then(
			            	function(r){
				            	get_tree(sky.root);
				            	addTab(r.id,false);
			            	},
			            	function(err){}
			            );
			        }
			    }catch(e){}
	        },
	        function (responseFailed) {
	    });
}

sky.insertNewFile = function(upload_location, file_name, body){
	var url = upload_location + file_name + '?access_token=' + WL.getSession().access_token;
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.onload = function () {
	    get_tree(sky.root);
        addTab(JSON.parse(xhr.response).id, false);
    };
    xhr.onerror = function (error) {
    };
    xhr.send(new Blob([body]));
}

sky.saveAs = function(){
	WL.fileDialog({
       mode: "save"
    }).then(
        function(res){
	        try{
	           var upload_location = res.data.folders[0].upload_location;
	           var file_name = $("#file-name").val();
	           $("#file-name").val("");
	           var body = editor().getValue();
	           
	           	var url = upload_location + file_name + '?access_token=' + WL.getSession().access_token;
			    var xhr = new XMLHttpRequest();
			    xhr.open('PUT', url);
			    xhr.onload = function () {
				    get_tree(sky.root);
			        addTab(JSON.parse(xhr.response).id, false);
			    };
			    xhr.onerror = function (error) {
			    };
			    xhr.send(new Blob([body]));
			}catch(e){}
	    },
	    function (responseFailed) {
	    }
	);
}