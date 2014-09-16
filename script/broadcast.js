/*============
Ask to star repo
=============*/

//just asks if you want to star the rep on github

function checkGithub(){

	//if this message has never been shown on this device

	if(localStorage.getItem("github") === null || typeof localStorage.getItem("github") === 'undefined'){
		document.querySelector("#toast-github").show();
		
		//ok, now it has

		localStorage.setItem("github","1");
	}
}
