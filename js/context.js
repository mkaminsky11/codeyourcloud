var context = {};

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
    context.taskItemInContext = context.clickInsideElement( e, context.taskItemClassName );
    if (context.taskItemInContext ) {
      e.preventDefault();
      context.toggleMenuOn();
      context.positionMenu(e);
    } else {
      context.taskItemInContext = null;
      context.toggleMenuOff();
    }
  });
}


context.clickListener = function() {
  document.addEventListener( "click", function(e) {
    var clickeElIsLink = context.clickInsideElement( e, context.contextMenuLinkClassName );
    if (clickeElIsLink) {
      e.preventDefault();
      context.menuItemListener( clickeElIsLink );
    } else {
      if(context.clickInsideElement( e, context.taskItemClassName )){
        
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
  context.clickCoords = context.getPosition(e);
  context.clickCoordsX = context.clickCoords.x;
  context.clickCoordsY = context.clickCoords.y;

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