
var just_folder = [];
var count = 0;

function getFolder(folder_id, path){
	retrieveAllFilesInFolder(folder_id, path, addAllItems);
}

function compare(a,b) {
  if (a.name < b.name)
     return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

function justRoot(){
	justFolder(myRootFolderId);
}

function justFolder(folder_id){
	count = 0;
	just_folder = [];
	retrieveAllFilesInFolder(folder_id, justAllItems);
}
function justAllItems(result, id){
	if(typeof result[0] === 'undefined'){
		console.log("nothing");
		sendFolder([], id);
		return;
	}
	var goal = result.length;
	for(var j = 0; j < result.length; j++){
		try{
			test = result[j].id;
		}
		catch(e){
			j--;
		}
	}
	
	for(var i = 0; i < result.length; i++){
		try{
			getFile(result[i].id, justItem, goal, id);
		}
		catch(e){

		}
	}
}
function justItem(result, goal, id){
	count++;
	var is_folder = false;
	
	//console.log(result);
	if(result.mimeType === "application/vnd.google-apps.folder"){
		is_folder = true;
	}
	
	var to_push ={
		name: result.title,
		id: result.id,
		folder: is_folder,
		date: result.modifiedDate,
		mime: result.mimeType
	};
	
	if(result.explicitlyTrashed){
		
	}
	else{
		just_folder.push(to_push);
	}
	
	if(count === goal){
		sendFolder(just_folder.sort(compare), id);
	}
}

function one_folder_back(folder_id){
	getParents(folder_id, one_back);
}

function one_back(id){
	justFolder(id);
}