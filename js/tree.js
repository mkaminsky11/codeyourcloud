/*===
* CODEYOURCLOUD
*
* tree.js built by Michael Kaminsky
* manages the file tree
*
===*/

/*
* TREE
* manages the file tree
*/

var tree = {};

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
	if(cloud_use === "drive"){
		//gets all the files
		var ret = 0;
		drive.retrieveAllFilesInFolder(id, function(data, _root){
			var goal = data.length; //how many files total
			if(goal === 0){
			  tree_prime(_root);
			  callback();
			}
			for(var i = 0; i < data.length; i++){
				var id_id = data[i].id;
				//add placeholder element
				tree_placeholder(id_id, _root);
				
				//for each of the files, gets the information
  				drive.getFile(id_id, function(resp){
  					if(resp.explicitlyTrashed === true){ //if trashed, don't count
  						goal--;
  					}
  					else{
  					  //add it here
  					  ret++;
  					  if(ret === 1){
  					    tree_prime(_root);
  					  }
  					  treeInsert(resp.title, resp.id, (resp.mimeType === "application/vnd.google-apps.folder"), false, _root);
  					}
  					if(ret === goal){
  						callback(); //this is the finisher
  					}
  				});
			}
		});
	}
	else if(cloud_use === "sky"){
		sky.retrieveAllFilesInFolder(id, function(data, _root){
			for(var i = 0; i < data.length; i++){
			  //open it up!
			  tree_prime(_root);
			  
			  //add it here
			  treeInsert(data[i].name, data[i].id, (data[i].id.indexOf("folder") === 0), true, _root);
			}
			callback(); //this is the finisher
		});
	}
}
//sets the id of the root to by the root folder
$(".root-tree").attr("data-tree-ul", drive.root);

function tree_placeholder(id, root){
	var to_push = "<center style=\"display:none\" data-placeholder=\""+id+"\"></center>";
	$("[data-tree-ul='"+root+"']").append(to_push);
}

function treeInsert(title, the_id, folder, sky, root){
  var html = tree_insert({
    title: title,
    id: the_id,
    folder: folder
  });
  
  if(sky === false){
    //google drive
    $("center[data-placeholder='"+the_id+"']").replaceWith(html);
  }
  else{
    //skydrive
    $("[data-tree-ul='"+root+"']").append(html);
  }
}

function tree_insert(resp){
	var ret = "";
	var title = resp.title;
	var icon = '<i class="fa fa-align-left"></i>';
	var the_id = resp.id;
	if(typeof title !== 'undefined'){
		icon = tree.getIconByTitle(title);
		var caret = ""; //"<span class='context-click' data-fileid='"+data[i].id+"'><i class='zmdi zmdi-caret-down'></i></span>";
		var to_push = "<li data-tree-li='" + the_id + "' class='tree-file'>"+"<span onclick='toggle_tree_file(\""+the_id+"\")'>" + icon + title + caret + "</span>"+"</li>";
				
		if(resp.folder === true){
			icon = "<i class='fa fa-folder'></i>";
			to_push = "<li data-tree-li='"+the_id+"' class='tree-folder'><span onclick='toggle_tree_folder(\""+the_id+"\")'>" + icon + title + caret + "</span><ul data-tree-ul='"+the_id+"' style='display:none'></ul></li>";
		}
		ret = ret + to_push;
	}
	return ret;
}

function tree_prime(id){
  //data loading
  //opens the folder
	$("[data-tree-ul='"+id+"']").slideDown();
}

function tree_finish(id){
  //data done loading
}

//sets the tree contents for a folder
function get_tree(id){
	//gets the array of files/folders, passes to callback
	$("[data-tree-ul='"+id+"']").html("");
	tree_folder(id, function(){
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
	var found = manager.isOpen(id);
	if(found === true){
		//already there, open it
		manager.openTab(id);
	}
	else{
		addTab(id, false);
	}
}

tree.getIconByTitle = function(title){
	var icon = '<i class="fa fa-align-left"></i>';
	var ext_info = manager.extension(title.toLowerCase());
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
	return icon;
}

tree.getClassFromIcon = function(icon_html){
	return icon_html;
}
