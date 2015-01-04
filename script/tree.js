function show_tree_open(){
	$("#tree-open").fadeIn();
}

function sort_by_title(a,b) {
  if (a.title < b.title)
     return -1;
  if (a.title > b.title)
    return 1;
  return 0;
}

function tree_folder(id, callback){
	var ret = [];
	retrieveAllFilesInFolder(id, function(data){
		var goal = data.length;
		
		for(var i = 0; i < data.length; i++){
			var id_id = data[i].id;
			
			getFile(id_id, function(resp){
				//console.log(resp);
				var to_push = {
					title: resp.title,
					id: resp.id,
					folder: (resp.mimeType === "application/vnd.google-apps.folder")	
				};
				
				if(resp.explicitlyTrashed === true){
					goal--;
				}
				else{
					ret.push(to_push);
				}
				
				if(ret.length === goal){
					callback(ret.sort(sort_by_title));
				}
			});
		}
	});
}

$(".root-tree").attr("data-tree-ul", myRootFolderId);

function get_tree(id){
	tree_folder(id, function(data){
		var ret = "";
		for(var i = 0; i < data.length; i++){
			var title = data[i].title;
			
			var icon = "<i class='fa fa-file-text-o'></i>";
			
			if(typeof title !== 'undefined'){
				
				if(title.toLowerCase().indexOf(".jpg") !== -1 || title.toLowerCase().indexOf(".jepg") !== -1 || title.toLowerCase().indexOf(".png") !== -1 || title.toLowerCase().indexOf(".gif") !== -1 || title.toLowerCase().indexOf(".tiff") !== -1 || title.toLowerCase().indexOf(".svg") !== -1){
					icon = '<i class="fa fa-file-image-o"></i>';
				}
				else if(title.toLowerCase().indexOf(".pdf") !== -1){
					icon = '<i class="fa fa-file-pdf-o"></i>';
				}			
				else if(title.toLowerCase().indexOf(".html") !== -1 || title.toLowerCase().indexOf(".js") !== -1){
					icon = '<i class="fa fa-file-code-o"></i>';
				}
				else if(title.toLowerCase().indexOf(".zip") !== -1 || title.toLowerCase().indexOf(".gz") !== -1){
					icon = '<i class="fa fa-file-archive-o"></i>';
				}
				
				var to_push = "<li data-tree-li='" +data[i].id+ "'>"+"<span onclick='toggle_tree_file(\""+data[i].id+"\")'>" + icon + title + "</span>"+"</li>";
				
				if(data[i].folder === true){
					
					icon = "<i class='fa fa-folder'></i>";
					
					to_push = "<li data-tree-li='"+data[i].id+"'><span onclick='toggle_tree_folder(\""+data[i].id+"\")'>" + icon + title + "</span><ul data-tree-ul='"+data[i].id+"' style='display:none'></ul></li>";
				}
				
				ret = ret + to_push;
			}
		}
		
		$("[data-tree-ul='"+id+"']").html(ret);
		$("[data-tree-ul='"+id+"']").slideDown();

		$("[data-tree-li='"+id+"']>span>i").removeClass("fa-folder");
                $("[data-tree-li='"+id+"']>span>i").removeClass("fa-circle-o-notch");
		$("[data-tree-li='"+id+"']>span>i").removeClass("fa-spin");
                $("[data-tree-li='"+id+"']>span>i").addClass("fa-folder-open");

	});
}

function toggle_tree_folder(id){
	
	if($("[data-tree-ul='"+id+"']").css("display") === "none"){
		//show it
		$("[data-tree-li='"+id+"']>span>i").removeClass("fa-folder");
                $("[data-tree-li='"+id+"']>span>i").addClass("fa-spin");
		$("[data-tree-li='"+id+"']>span>i").addClass("fa-circle-o-notch");

		get_tree(id);
		
		$("[data-tree-li='"+id+"']>span>i").removeClass("fa-folder");
		$("[data-tree-li='"+id+"']>span>i").addClass("fa-folder-open");
	}
	else{
		//close it
		$("[data-tree-ul='"+id+"']").slideUp();
		
		$("[data-tree-li='"+id+"']>span>i").removeClass("fa-folder-open");
		$("[data-tree-li='"+id+"']>span>i").addClass("fa-folder");
	}
}

function toggle_tree_file(id){
	//addTab("loading...",fileId,false);
	
	//if already open...
	
	if($("[data-fileid='"+id+"']").length){
		//already there, open it
		opentab(id);
	}
	else{
		addTab("loading...", id, false);
	}
}
