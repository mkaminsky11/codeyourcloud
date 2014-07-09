
  //appends the overlay to each button
$(".ripple-button").each( function(){
   var $this = $(this);
$this.append("<div class='ripple'></div>");


$(this).click(function(e){
  var $clicked = $(this);
   
  //gets the clicked coordinates
  var offset = $clicked.offset();
  var relativeX = (e.pageX - offset.left);
  var relativeY = (e.pageY - offset.top);
  var width = $clicked.width();
   
   
  var $ripple = $clicked.find('.ripple');
   
  //puts the ripple in the clicked coordinates without animation
  $ripple.addClass("notransition");
  $ripple.css({"top" : relativeY, "left": relativeX});
  $ripple[0].offsetHeight;
  $ripple.removeClass("notransition");
   
  //animates the button and the ripple
  $clicked.addClass("hovered");
  $ripple.css({ "width": width * 2, "height": width*2, "margin-left": -width, "margin-top": -width });
   
  setTimeout(function(){
	  //resets the overlay and button
	  $ripple.addClass("notransition");
	  $ripple.attr("style", "");
	  $ripple[0].offsetHeight;
	  $clicked.removeClass("hovered");
	$ripple.removeClass("notransition");
	  }, 300 );
	});
});


