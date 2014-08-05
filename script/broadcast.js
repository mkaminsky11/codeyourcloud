/*============
Ask to star repo
=============*/
checkGithub();

function checkGithub(){
	if(localStorage.getItem("github") === null || typeof localStorage.getItem("github") === 'undefined'){
		document.querySelector("#toast-github").show();
		
		localStorage.setItem("github","1");
	}
}