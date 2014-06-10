function rotateCube(id, goal){
	$("#" + id).animate({ nonexist: goal }, {
	    step: function(now,fx) {
	        $(this).css('-webkit-transform',"rotateX(" + now + "deg)");
	        $(this).css('transform',"rotateX(" + now + "deg)");
	        $(this).css('-moz-transform',"rotateX(" + now + "deg)");
	    },
	    duration:'slow'
	},'linear');
}
random_cube();
function random_cube(){
	var min = -3;
	var max = 3;
	var action_random = Math.floor(Math.random() * (max - min + 1)) + min;
	var lang_random = Math.floor(Math.random() * (max - min + 1)) + min;
	var adv_random = Math.floor(Math.random() * (max - min + 1)) + min;
	
	action_random *= 90;
	lang_random *= 90;
	adv_random *= 90;
	
	rotateCube("action-cube", action_random);
	rotateCube("lang-cube", lang_random);
	rotateCube("adv-cube", adv_random);
	
	setTimeout(function(){
		if($("#screen").length){
			random_cube();
		}
	}, 1000);
}

$("#adv-cube > div").each(function(index){
	$(this).bigtext();
});

$("#lang-cube > div").each(function(index){
	$(this).bigtext();
});

$("#action-cube > div").each(function(index){
	$(this).bigtext();
});