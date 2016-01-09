var context = {};


/*CLICK FUNCTIONS*/


context.trash = function(){
  manager.trash($(context.taskItemInContext).attr("data-fileid"));
}

context.save = function(){
  manager.save($(context.taskItemInContext).attr("data-fileid"));
}

context.share = function(){
  picker.share($(context.taskItemInContext).attr("data-fileid"));
}

context.download = function(){
  picker.download($(context.taskItemInContext).attr("data-fileid"));
}

context.close = function(){
  manager.removeTab($(context.taskItemInContext).attr("data-fileid"));
}

context.rename = function(){
  var current_title = $(context.taskItemInContext).parent().parent().find("h4").text();
  var current_title = $(context.taskItemInContext).parent().parent().find("h4").text();
  manager.rename(current_title, $(context.taskItemInContext).attr("data-fileid"));
}

/*BACKBONE*/

context.clickInsideElement = function(e, className) {
  var el = e.srcElement || e.target;
  if ( el.classList.contains(className) ) {
    return el;
  } else {
    while ( el = el.parentNode ) {
      if ( el.classList && el.classList.contains(className) ) {
        return el;
      }
    }
  }
  return false;
}
  
context.getPosition = function(e) {
  var posx = 0;
  var posy = 0;
  if (!e) var e = window.event;
  if (e.pageX || e.pageY) {
    posx = e.pageX;
    posy = e.pageY;
  } else if (e.clientX || e.clientY) {
    posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  return {
    x: posx,
    y: posy
  }
}

context.contextMenuClassName = "context-menu";
context.contextMenuItemClassName = "context-menu__item";
context.contextMenuLinkClassName = "context-menu__link";
context.contextMenuActive = "context-menu--active";
context.taskItemClassName = "context-click";
context.taskItemInContext;
context.clickCoords;
context.clickCoordsX;
context.clickCoordsY;
context.menu = document.querySelector("#context");
context.menuItems = context.menu.querySelectorAll(".context-menu__item");
context.menuState = 0;
context.menuWidth;
context.menuHeight;
context.menuPosition;
context.menuPositionX;
context.menuPositionY;
context.windowWidth;
context.windowHeight;

context.init = function() {
  context.contextListener();
  context.clickListener();
  context.keyupListener();
  context.resizeListener();
}

context.contextListener = function() {
  document.addEventListener( "click", function(e) {
    //list to click within caret
    context.taskItemInContext = context.clickInsideElement( e, context.taskItemClassName );
    if (context.taskItemInContext ) {
      e.preventDefault();
      context.toggleMenuOn();
      context.positionMenu(e);
	  context.setId($(context.taskItemInContext).attr("data-fileid"));
    } else {
      context.taskItemInContext = null;
      context.toggleMenuOff();
      //now, check if need to open
      var tab_tab = context.clickInsideElement(e, "tab-tab");
      if(tab_tab){
        //manager.openTab($(tab_tab).attr("data-fileid"));
      }
    }
  });
}


context.clickListener = function() {
  document.addEventListener( "click", function(e) {
    //listen to click within context menu
    var clickeElIsLink = context.clickInsideElement( e, context.contextMenuLinkClassName );
    if (clickeElIsLink) {
      //e.preventDefault();
      context.menuItemListener( clickeElIsLink );
    } else {
      if(context.clickInsideElement( e, context.taskItemInContext )){
        
      }
      else{
        var button = e.which || e.button;
        if ( button === 1 ) {
          context.toggleMenuOff();
        }
      }
    }
  });
}


context.keyupListener = function() {
  window.onkeyup = function(e) {
    if ( e.keyCode === 27 ) {
      context.toggleMenuOff();
    }
  }
}


context.resizeListener = function() {
  window.onresize = function(e) {
    context.toggleMenuOff();
  };
}


context.toggleMenuOn = function() {
  if ( context.menuState !== 1 ) {
    context.menuState = 1;
    context.menu.classList.add(context.contextMenuActive);
  }
}

context.toggleMenuOff = function() {
  if ( context.menuState !== 0 ) {
    context.menuState = 0;
    context.menu.classList.remove( context.contextMenuActive );
  }
}


context.positionMenu = function(e) {
  context.clickCoords = context.taskItemInContext.getBoundingClientRect();
  context.clickCoordsX = context.clickCoords.left + context.clickCoords.width - 25;
  context.clickCoordsY = context.clickCoords.top + context.clickCoords.height + 10;

  context.menuWidth = context.menu.offsetWidth + 4;
  context.menuHeight = context.menu.offsetHeight + 4;

  context.windowWidth = window.innerWidth;
  context.windowHeight = window.innerHeight;

  if ( (context.windowWidth - context.clickCoordsX) < context.menuWidth ) {
    context.menu.style.left = context.windowWidth - context.menuWidth + "px";
  } else {
    context.menu.style.left = context.clickCoordsX + "px";
  }

  if ( (context.windowHeight - context.clickCoordsY) < context.menuHeight ) {
    context.menu.style.top = context.windowHeight - context.menuHeight + "px";
  } else {
    context.menu.style.top = context.clickCoordsY + "px";
  }
}

context.menuItemListener = function( link ) {
    context.toggleMenuOff();
}

context.setId = function(id){
	$(".side-drive-context-link").attr("href","https://drive.google.com/file/d/" + id + "/view?usp=drivesdk");
}