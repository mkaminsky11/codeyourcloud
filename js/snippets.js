var snippets = {
	data: [],
	edit_id: null
};

//data:
//	elem: dom element
//	snippet: snippet
//  editor: cm

//TODO: language change

snippets.init = function(){
	connect.snippets.getSnippets(function(data){
		if(data.err === false){
			//snippets @ data.snippets
			
			for(var i = 0; i < data.snippets.length; i++){
				snippets.insert(data.snippets[i]);
			}
		}
	});
};

snippets.add = function(){
	var to_push = {
		title: "New Snippet",
		language: "text/plain",
		content: ""
	};
	connect.snippets.addSnippets(to_push, function(data){
		if(data.err === false){
			//all good
			snippets.insert(data.data);
		}
	});
};

snippets.addCustom = function(snippet){
	var to_push = {
		title: snippet.title,
		language: snippet.language,
		content: snippet.content
	};
	connect.snippets.addSnippets(to_push, function(data){
		if(data.err === false){
			//all good
			snippets.insert(data.data);
		}
	});
};

snippets.import = function(){
	var input = document.getElementById("snippet-file");
	file = input.files[0];
    fr = new FileReader();
    fr.onload = function(){
	    try{
	    	var json = JSON.parse(fr.result).data;
	    	for(var i = 0; i < json.length; i++){
		    	snippets.addCustom(json[i]);
	    	}
	    }
	    catch(e){
		    
	    }
	}
    fr.readAsText(file);
}

snippets.insert = function(snippet){
  document.querySelector(".snippet-main>pre").style.display = "none";
	var elem = document.createElement("div");
	elem.className = "snippet-item";
	elem.setAttribute("data-id",snippet["_id"]);
	var title = document.createElement("div");
	title.className = "snippet-title";
	title.innerHTML = "<h4></h4>" + "<i class=\"zmdi zmdi-copy\" data-copyid=\""+snippet["_id"]+"\"></i>" + "<i onclick=\"snippets.edit('"+snippet["_id"]+"')\" class=\"zmdi zmdi-edit\"></i>" + "<i class=\"zmdi zmdi-delete\" onclick=\"snippets.delete('"+snippet["_id"]+"')\"></i>";
	var edit = document.createElement("div");
	edit.className = "snippet-edit";
	edit.style.display = "none";
	edit.innerHTML = "<input type=\"text\">" + "<i onclick=\"snippets.done('"+snippet["_id"]+"')\" class=\"zmdi zmdi-check\"></i>" + "<i class=\"zmdi zmdi-delete\" onclick=\"snippets.delete('"+snippet["_id"]+"')\"></i>" + "<select onchange=\"snippets.languageChange('"+snippet["_id"]+"')\">" + modeSelect + "</select>";
	var _editor = document.createElement("div");
	_editor.className = "snippet-editor";
	elem.appendChild(title);
	elem.appendChild(edit);
	elem.appendChild(_editor);
	document.querySelector(".snippet-main").appendChild(elem);
	elem.querySelector("h4").textContent = snippet.title;	//set values
	if(snippet.language === ""){
		snippet.language = "text/plain";
	}
	elem.querySelector("select").value = snippet.language;
	elem.querySelector("input").value = snippet.title;
	
	var editor = CodeMirror(_editor, {
	  value: snippet.content,
	  mode:  snippet.language,
	  readOnly: true,
	  lineNumbers: false,
      theme: settings.state.theme,
      lineWrapping: true, 
      indentUnit: 4,
      indentWithTabs: true,
      tabSize: settings.state.tabSize,
      viewPort: Infinity
	});
	
	//refresh on open
	
	snippets.data.push({
		elem: elem,
		snippet: snippet,
		editor: editor,
		copy: new Clipboard(elem.querySelector(".zmdi-copy"), {
			text: function(trigger){
				return snippets.getValue(trigger.getAttribute("data-copyid"));
			}
		})
	});
}

snippets.getValue = function(_id){
	for(var i = 0; i < snippets.data.length; i++){
      if(snippets.data[i].snippet["_id"] === _id){
        return snippets.data[i].editor.getValue();
      }
    }
    return "";
}

snippets.refreshEditors = function(){
  for(var i = 0; i < snippets.data.length; i++){
    snippets.data[i].editor.refresh();
  }
}

snippets.edit = function(_id){
  if(snippets.edit_id === null){
    //none currently editing
    //switch _id to editing mode
    for(var i = 0; i < snippets.data.length; i++){
      snippets.edit_id = _id;
      if(snippets.data[i].snippet["_id"] === _id){
        snippets.data[i].elem.querySelector(".snippet-title").style.display = "none";
        snippets.data[i].elem.querySelector(".snippet-edit").style.display = "";
        snippets.data[i].editor.setOption("readOnly",false);
        snippets.data[i].editor.setOption("lineNumbers",true);
      }
    }
  }
  else{
    //one already being edited
    //close + save current
    //TODO
    snippets.done(snippets.edit_id);
    snippets.edit(_id);
  }
}

snippets.done = function(_id){
  if(snippets.edit_id === _id){
    for(var i = 0; i < snippets.data.length; i++){
      snippets.edit_id = null;
      if(snippets.data[i].snippet["_id"] === _id){
        snippets.data[i].elem.querySelector(".snippet-title").style.display = "";
        snippets.data[i].elem.querySelector(".snippet-edit").style.display = "none";
        snippets.data[i].editor.setOption("readOnly",true);
        snippets.data[i].editor.setOption("lineNumbers",false);
        
        //save changes here
        
        snippets.data[i].snippet.title = snippets.data[i].elem.querySelector("input").value;
        snippets.data[i].snippet.language = snippets.data[i].elem.querySelector("select").value;
        snippets.data[i].snippet.content = snippets.data[i].editor.getValue();
        snippets.data[i].elem.querySelector("h4").textContent = snippets.data[i].snippet.title;
        
        connect.snippets.changeSnippet(_id, snippets.data[i].snippet, function(data){
	       // 
        });
      }
    }
  }
}

snippets.delete = function(_id){
	if(snippets.edit_id === _id){
		snippets.edit_id = null;
	}
	for(var i = 0; i < snippets.data.length; i++){
		if(snippets.data[i].snippet["_id"] === _id){
			//found it, delete
			connect.snippets.removeSnippet(_id, i, function(data, i){
				if(data.err === false){
					//no errors, so ok
					document.querySelector(".snippet-main").removeChild(snippets.data[i].elem);
					snippets.data[i].copy.destroy();
					snippets.data.splice(i, 1);
					if(snippets.data.length === 0){
					  document.querySelector(".snippet-main>pre").style.display = "";
					}
				}
			});
		}
	}
}

snippets.languageChange = function(_id){
	for(var i = 0; i < snippets.data.length; i++){
      if(snippets.data[i].snippet["_id"] === _id){
        snippets.data[i].snippet.language = snippets.data[i].elem.querySelector("select").value;
        snippets.data[i].editor.setOption("mode", snippets.data[i].snippet.language);
      }
    }
}