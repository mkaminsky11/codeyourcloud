var snippets = {
	data: []
};

//data:
//	elem: dom element
//	snippet: snippet

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
		language: editor().getOption("mode"),
		content: ""
	};
	connect.snippets.addSnippets(to_push, function(data){
		if(data.err === false){
			//all good
			console.log(data.data);
		}
	});
};

snippets.insert = function(snippet){
	var elem = document.createElement("div");
	elem.className = "snippet-item";
	elem.setAttribute("data-id",snippet["_id"]);
	document.querySelector(".snippet-main").appendChild(elem);
	
	var editor = CodeMirror(elem, {
	  value: snippet.content,
	  mode:  snippet.language,
	  readOnly: true,
	  lineNumbers: settings.state.lineNumbers,
      theme: settings.state.theme,
      lineWrapping: settings.state.lineWrap, 
      indentUnit: 4,
      indentWithTabs: true,
      tabSize: settings.state.tabSize
	});
	
	//refresh on open
	
	snippets.data.push({
		elem: elem,
		snippet: snippet,
		editor: editor
	});
}