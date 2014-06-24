function rotateCube(goal){
	$("#notch").animate({ nonexist: goal }, {
	    step: function(now,fx) {
	        $(this).css('-webkit-transform',"rotateZ(" + now + "deg)");
	        $(this).css('transform',"rotateZ(" + now + "deg)");
	        $(this).css('-moz-transform',"rotateZ(" + now + "deg)");
	    },
	    duration:500
	},'linear');
}
random_r();
function random_r(){
	var min = -3;
	var max = 3;
	var action_random = 360;
		
	rotateCube(action_random);
	
	setTimeout(function(){
		if($("#screen").length){
			random_r();
		}
	}, 1000);
}