/*===
* CODEYOURCLOUD
*
* tree.js built by Michael Kaminsky
* manages the file tree
*
* contents:
*  tree
===*/

/*
* TREE
* manages the file tree
*/

//not yet functional
function show_tree_open(){
	$("#tree-open").fadeIn();
}
//don't want them to be in a random order
function sort_by_title(a,b) {
  if (a.title < b.title)
     return -1;
  if (a.title > b.title)
    return 1;
  return 0;
}
//gets the contents of a folder
function tree_folder(id, callback){
	var ret = [];
	//gets all the files
	retrieveAllFilesInFolder(id, function(data){
		var goal = data.length; //how many files total
		
		for(var i = 0; i < data.length; i++){
			var id_id = data[i].id;
			//for each of the files, gets the information
			getFile(id_id, function(resp){
				var to_push = {
					title: resp.title,
					id: resp.id,
					folder: (resp.mimeType === "application/vnd.google-apps.folder") //is it a folder?	
				};
				if(resp.explicitlyTrashed === true){ //if trashed, don't count
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
//sets the id of the root to by the root folder
$(".root-tree").attr("data-tree-ul", myRootFolderId);
//sets the tree contents for a folder
function get_tree(id){
	//gets the array of files/folders, passes to callback
	tree_folder(id, function(data){
		var ret = ""; //the html that will be returned
		for(var i = 0; i < data.length; i++){
			var title = data[i].title;
			var icon = '<i class="fa fa-align-left"></i>'; //the default
			if(typeof title !== 'undefined'){
				icon = getIconByTitle(title);
				
				var to_push = "<li data-tree-li='" +data[i].id+ "' class='tree-file'>"+"<span onclick='toggle_tree_file(\""+data[i].id+"\")'>" + icon + title + "</span>"+"</li>";
				
				if(data[i].folder === true){
					icon = "<i class='fa fa-folder'></i>";
					to_push = "<li data-tree-li='"+data[i].id+"' class='tree-folder'><span onclick='toggle_tree_folder(\""+data[i].id+"\")'>" + icon + title + "</span><ul data-tree-ul='"+data[i].id+"' style='display:none'></ul></li>";
				}
				ret = ret + to_push;
			}
		}
		//sets the html
		$("[data-tree-ul='"+id+"']").html(ret);
		//opens the folder
		$("[data-tree-ul='"+id+"']").slideDown();
		//removes the loading icon
		$("[data-tree-li='"+id+"']>span>i").removeClass("fa-folder");
        $("[data-tree-li='"+id+"']>span>i").removeClass("fa-circle-o-notch");
		$("[data-tree-li='"+id+"']>span>i").removeClass("fa-spin");
        $("[data-tree-li='"+id+"']>span>i").addClass("fa-folder-open");
        

	});
}
//what happens when you click on a folder
function toggle_tree_folder(id){
	if($("[data-tree-ul='"+id+"']").css("display") === "none"){ //not yet open
		//set loading icon
		$("[data-tree-li='"+id+"']>span>i").removeClass("fa-folder");
        $("[data-tree-li='"+id+"']>span>i").addClass("fa-spin");
		$("[data-tree-li='"+id+"']>span>i").addClass("fa-circle-o-notch");
		//get information
		get_tree(id);
		$("[data-tree-li='"+id+"']>span>i").removeClass("fa-folder");
		$("[data-tree-li='"+id+"']>span>i").addClass("fa-folder-open");
	}
	else{ //open, close it
		$("[data-tree-ul='"+id+"']").slideUp();
		
		$("[data-tree-li='"+id+"']>span>i").removeClass("fa-folder-open");
		$("[data-tree-li='"+id+"']>span>i").addClass("fa-folder");
	}
}
//what happens when you click on a file
function toggle_tree_file(id){
	//if already open...
	var found = false;
	for(var i = 0; i < editors.length; i++){
		if(editors[i].id === id){
			found = true;
		}
	}
	if(found === true){
		//already there, open it
		opentab(id);
	}
	else{
		addTab("loading...", id, false);
	}
}

function getIconByTitle(title){
	var icon = '<i class="fa fa-align-left"></i>';
	var ext_info = extension(title.toLowerCase());
	var ext = ext_info.ext;
	var hidden = ext_info.hidden;
	//custom icons with custom colors!
	if(ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "gif" || ext === "tiff" || ext === "svg"){
		icon = '<i class="fa fa-file-image-o" style="color:#1ABC9C"></i>';
	}
	else if(ext === "pdf"){
		icon = '<i class="fa fa-file-pdf-o"></i>';
	}
	else if(ext === "tar" || ext === "zip" || ext === "xz" || ext === "gz"){
		icon = '<i class="fa fa-file-archive-o"></i>';
	}
	else if(ext === "java" || ext === "class" || ext === "jar"){
		icon = '<i class="devicons devicons-java" style="color:#E67E22"></i>';
	}
	else if(ext === "rb" || ext === "ru"){
		icon = '<i class="devicons devicons-ruby" style="color:#E74C3C"></i>';
	}	
	else if(ext === "scala"){
		icon = '<i class="devicons devicons-scala" style="color:#E74C3C"></i>';
	}	
	else if(ext === "py"){
		icon = '<i class="devicons devicons-python" style="color:#F1C40F"></i>';
	}	
	else if(ext === "go"){
		icon = '<i class="devicons devicons-go" style="color:#3498DB"></i>';
	}	
	else if(ext === "md"){
		icon = '<i class="devicons devicons-markdown" style="color:#3498DB"></i>';
	}				
	else if(ext === "php"){
		icon = '<i class="devicons devicons-php" style="color:#9B59B6"></i>';
	}
	else if(ext === "js"){
		icon = '<i class="devicons devicons-javascript" style="color:#F1C40F"></i>';
	}	
	else if(ext === "coffee"){
		icon = '<i class="devicons devicons-coffeescript" style="color:#ECF0F1"></i>';
	}	
	else if(ext === "sass"){
		icon = '<i class="devicons devicons-sass" style="color:#E74C3C"></i>';
	}	
	else if(ext === "less"){
		icon = '<i class="devicons devicons-less" style="color:#3498DB"></i>';
	}	
	else if(ext === "css"){
		icon = '<i class="devicons devicons-css3" style="color:#3498DB"></i>';
	}
	else if(ext === "html"){
		icon = '<i class="devicons devicons-html5" style="color:#E67E22"></i>';
	}
	else if(ext === "swift"){
		icon = '<i class="devicons devicons-swift" style="color:#E67E22"></i>';
	}
	else if(ext === "clj"){
		icon = '<i class="devicons devicons-clojure" style="color:#2ECC71"></i>';
	}
	else if(ext === "pl"){
		icon = '<i class="devicons devicons-perl" style="color:#9B59B6"></i>';
	}
	else if(ext === "groovy"){
		icon = '<i class="devicons devicons-groovy" style="color:#E67E22"></i>';
	}
	else if(ext === "hs"){
		icon = '<i class="devicons devicons-haskell" style="color:#E67E22"></i>';
	}
	else if(ext === "sh" || ext === "bat" || ext === "bash"){
		icon = '<i class="devicons devicons-terminal"></i>';
	}
	else if(ext === "dart"){
		icon = '<i class="devicons devicons-dart" style="color:#3498DB"></i>';
	}
	else if(title.toLowerCase().indexOf(".html") !== -1 || title.toLowerCase().indexOf(".js") !== -1){
		icon = '<i class="fa fa-file-code-o"></i>';
	}
	return icon;
}
