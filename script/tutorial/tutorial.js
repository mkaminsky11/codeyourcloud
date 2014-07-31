var tut_max = 4; 

function showTut(){
	$("#tutorial").slideDown();
}

function hideTut(){
	$("#tutorial").slideUp();
}

function advance(){
	
	var t = document.querySelector('core-animated-pages');

	if(t.selected === tut_max){

	}
	else{
		t.selected += 1;
	}
}

function go_back(){
	var t = document.querySelector('core-animated-pages');

	if(t.selected === 0){

	}
	else{
		t.selected -= 1;
	}
}

function expert(){
	var t = document.querySelector('core-animated-pages');
	t.selected = 2;
}