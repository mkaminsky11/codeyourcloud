if(window.location.href.indexOf("?search=") !== -1){
	$("#search_input").val(window.location.href.split("?search=")[1]);
	read_query(window.location.href.split("?search=")[1]);
}

function read_query(q){
	var query = q.split("_").join(" ").toLowerCase();
	$(".media").each(function(index){
		var title = $(this).attr("data-title").toLowerCase();
		var desc= $(this).find(".media-desc").html().toLowerCase();
		var this_display = $(this).css("display");
		
		if(title.indexOf(query) !== -1 || query.indexOf(title) !== -1 || desc.indexOf(query) !== -1 || query.indexOf(desc) !== -1){
    		//found
    		if(this_display === "none"){
    			$(this).slideDown("slow");
    		}
    		//$(this).removeClass("hide");
		}
		else{
			if(this_display !== "none"){
				$(this).slideUp("slow");
			}
    		//$(this).addClass("hide");
		}
	});
}
function search(){
	read_query($("#search_input").val());
	$("#search_input").val("");
}
$(".tags span").each(function(index){
	$(this).hover(function(){
		$(this).removeClass("label-default");
		$(this).addClass("label-success")
	},function(){
		$(this).removeClass("label-success");
		$(this).addClass("label-default");
	});
	
	$(this).click(function(){
		$("#search_input").val($(this).html());
		read_query($(this).html());
	});
});





var news_num = 1;
var news_max = 0;
$(".news").each(function(index){
	news_max++;
	if(index !== 0){
		$(this).addClass("hide");
	}
});

function test(){
	$("#profile").removeClass("hide");
	$("#main").css("margin-left","18%");
}

check_news();
function next(){
	if(news_num !== news_max){
		news_num++;
		$(".news").each(function(index){
			var index = news_max - Number($(this).attr("data-news")) + 1;
			if(news_num === index){
				$(this).removeClass("hide");
				check_news();
			}
			else{
				$(this).addClass("hide");
				check_news();
			}
		});
	}
}

function prev(){
	if(news_num !== 1){
		news_num--;
		$(".news").each(function(index){
			var index = news_max - Number($(this).attr("data-news")) + 1;
			if(news_num === index){
				$(this).removeClass("hide");
				check_news();
			}
			else{
				$(this).addClass("hide");
				check_news();
			}
		});
	}
}

function check_news(){
	var prev_display = $("#prev").css("display");
	var next_display = $("#next").css("display");
	if(news_num === 1){
		if(prev_display !== "none"){
			$("#prev").slideUp("slow");
		}
	}
	else{
		if(prev_display === "none"){
			$("#prev").slideDown("slow");
		}
	}
	
	if(news_num === news_max){
		if(next_display !== "none"){
			$("#next").slideUp("slow");
		}
	}
	else{
		if(next_display === "none"){
			$("#next").slideDown("slow");
		}
	}
}

test();