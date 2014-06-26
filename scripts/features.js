$(".code-li").each(function(index){
	$(this).hover(function(){
		$(this).animate({
			backgroundColor: "#2980B9"
		})
	}, function(){
		$(this).animate({
			backgroundColor: "#3498DB"
		})
	});
});

$(".side-item").each(function(index){
	$(this).hover(function(){
		$(this).animate({
			backgroundColor: "#83AEC9"
		},{
			duraction: 200,
			queue: false
		});
		
	}, function(){
		$(this).animate({
			backgroundColor: "transparent"
		},{
			duraction: 200,
			queue: false
		});
		
	});
});