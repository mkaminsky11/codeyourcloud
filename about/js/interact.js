$("#touch-1").hover(function(){
	$("#touch-1 path").attr("fill","#E74C3C");
	$("#touch-1 ellipse").attr("fill","#E74C3C");
}, function(){
	$("#touch-1 path").attr("fill","#FF6169");
	$("#touch-1 ellipse").attr("fill","#FF6169");
});

$("#touch-2").hover(function(){
	$("#touch-2 path").attr("fill","#E74C3C");
	$("#touch-2 ellipse").attr("fill","#E74C3C");
}, function(){
	$("#touch-2 path").attr("fill","#FF6169");
	$("#touch-2 ellipse").attr("fill","#FF6169");
});

$("#touch-3").hover(function(){
	$("#touch-3 path").attr("fill","#E74C3C");
	$("#touch-3 ellipse").attr("fill","#E74C3C");
}, function(){
	$("#touch-3 path").attr("fill","#FF6169");
	$("#touch-3 ellipse").attr("fill","#FF6169");
});

$("#touch-4").hover(function(){
	$("#touch-4 path").attr("fill","#E74C3C");
	$("#touch-4 ellipse").attr("fill","#E74C3C");
}, function(){
	$("#touch-4 path").attr("fill","#FF6169");
	$("#touch-4 ellipse").attr("fill","#FF6169");
});






//===============
function show_touch_1(){
	$(".macbook").animate({
		marginLeft: "300px",
		marginTop: "0px",
	}, {
		duration: 500,
		queue: false,
		complete: function(){
			
		}
	});
	
	$("#touch-info-1").animate({
		left: "100px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$("#touch-info-2").animate({
		right: "-400px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$("#touch-info-3").animate({
		bottom: "-400px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$("#touch-info-4").animate({
		top: "-400px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$(".int").animate({
		paddingBottom: "50px"
	},{
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
}

function hide_touch_1(){
	$(".macbook").animate({
		marginLeft: "0px",
		marginTop: "0px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$("#touch-info-1").animate({
		left: "-400px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
}
//2
function show_touch_2(){
	$(".macbook").animate({
		marginLeft: "-300px",
		marginTop: "0px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$("#touch-info-2").animate({
		right: "100px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$("#touch-info-1").animate({
		left: "-400px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$("#touch-info-3").animate({
		bottom: "-400px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$("#touch-info-4").animate({
		top: "-400px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$(".int").animate({
		paddingBottom: "50px"
	},{
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
}

function hide_touch_2(){
	$(".macbook").animate({
		marginLeft: "0px",
		marginTop: "0px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
				
		}
	});
	
	$("#touch-info-2").animate({
		right: "-400px"
	}, {
		duration: 500,
		queue: false,
		easing: "easeInOutQuart",
		complete: function(){
			
		}
	});
}
//3
function show_touch_3(){
	$(".macbook").animate({
		marginLeft: "0px",
		marginTop: "-400px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$(".int").animate({
		paddingBottom: "175px"
	},{
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$("#touch-info-3").animate({
		bottom: "50px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$("#touch-info-1").animate({
		left: "-400px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$("#touch-info-2").animate({
		right: "-400px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$("#touch-info-4").animate({
		top: "-400px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
}

function hide_touch_3(){
	$(".macbook").animate({
		marginLeft: "0px",
		marginTop: "0px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
				
		}
	});
	
	$("#touch-info-3").animate({
		bottom: "-400px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$(".int").animate({
		paddingBottom: "50px"
	},{
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
}
//4
function show_touch_4(){
	$(".macbook").animate({
		marginLeft: "0px",
		marginTop: "150px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$("#touch-info-4").animate({
		top: "50px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$("#touch-info-1").animate({
		left: "-400px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$("#touch-info-2").animate({
		right: "-400px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$("#touch-info-3").animate({
		bottom: "-400px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
	
	$(".int").animate({
		paddingBottom: "50px"
	},{
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
}

function hide_touch_4(){
	$(".macbook").animate({
		marginLeft: "0px",
		marginTop: "0px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
				
		}
	});
	
	$("#touch-info-4").animate({
		top: "-400px"
	}, {
		duration: 500,
		easing: "easeInOutQuart",
		queue: false,
		complete: function(){
			
		}
	});
}


