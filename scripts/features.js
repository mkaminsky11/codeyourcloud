$(".code-li").each(function(index){
	$(this).hover(function(){
		$(this).animate({
			backgroundColor: "#2980B9"
		});
	}, function(){
		$(this).animate({
			backgroundColor: "#3498DB"
		});
	});
});

$(".side-item").each(function(index){
	$(this).hover(function(){
		$(this).css("background-color", "#83AEC9");
		
	}, function(){
		$(this).css("background-color", "transparent");
		
	});
});