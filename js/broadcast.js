var broadcast = {};
broadcast.init = function(){
	
	console.log("broadcast");
	
	//GITHUB STAR
	if(localStorage.getItem("cyc-github-star") === null){
		//message not yet set
		localStorage.setItem("cyc-github-star", true);
		$("#broadcast").prepend("<iframe src='https://ghbtns.com/github-btn.html?user=mkaminsky11&repo=codeyourcloud&type=star&count=true' frameborder='0' scrolling='0' width='170px' height='20px'></iframe>");
		$("#broadcast").css("display","block");
	}
		
};