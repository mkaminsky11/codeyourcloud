var elem = document.createElement("div");
elem.className = "color-main";
document.querySelector("body").appendChild(elem);

var canvas = document.createElement("canvas");
canvas.setAttribute("width",2420);
canvas.setAttribute("height", 3900);
elem.appendChild(canvas);

var select = document.createElement("select");
select.className = "color-select";
select.innerHTML = "<option value=\"hex\" selected>Hex</option><option value=\"rgb\">RGB</option><option value=\"rgba\">RGBA</option>";
elem.appendChild(select);

var input = document.createElement("input");
input.setAttribute("type", "text");
input.setAttribute("autocomplete", "off");
input.setAttribute("autocorrect", "off");
input.setAttribute("autocapitalize", "off");
input.setAttribute("spellcheck", false);
input.className = "color-input";
elem.appendChild(input);
input.value = "rgb(63,149,102)";

input.onkeypress = function(e){
    e.which = e.which || e.keyCode;
    if(e.which == 13) {
        // submit
        adjustMain(input.value);
    }
};

canvas.className = "color-canvas";
var context = canvas.getContext('2d');

var base_color = "rgb(255,0,0)";
var chosen_color = "rgb(255,0,0)";
var grad1_color = "rgb(255,0,0)";
var grad1_data = null;
var main_data = null;
var padding = 200;
var dim = {
  w: 2000,
  h: 1000,
  main: {
	  x: 2020,
	  y: 0,
	  drag: false
  },
  grad1: {
	  x: 1020,
	  drag: false
  }
};
var color_grd = null;

function rgbToString(r,g,b){
  return "rgb(" + r + "," + g + "," + b + ")";
}

function adjustMain(color){
	color = stringToRgb(color);
	var _r = color.r;
	var _g = color.g;
	var _b = color.b;
	var sat = saturate(_r,_g,_b);
	var close = closestColor(sat.r,sat.g,sat.b);
	dim.grad1.x = close.x;
	draw();
	for(var i = 0; i < main_data.length; i++){
		var _row = main_data[i];
		for(var j = 0; j < _row.length; j++){
			var _item = stringToRgb(_row[j]);
			if(_item.r === _r && _item.g === _g && _item.b === _b){
				//NOT QUIT WORKING
				dim.main.y = i*10 + padding;
				dim.main.x = j*10 + padding;
			}
		}
	}
	draw();
}

function saturate(r,g,b){
	if(r > g && r > b){
		r = 255;
	}
	else if(b > r && b > g){
		b = 255;
	}
	else if(g > r && g > b){
		g = 255;
	}
	else{
		//all equal!!!!!!
	}
	
	if(b > r && g > r){
		r = 0;	
	}
	else if(r > b && g > b){
		b = 0;
	}
	else if(r > g && b > g){
		g = 0;
	}
	else{
		//all equal!!!!!!!
	}
	
	return {
		r: r,
		g: g,
		b: b
	};
}

function colorDistance(goal, color){
	var d_r = color.r - goal.r;
	var d_g = color.g - goal.g;
	var d_b = color.b - goal.b;
	var sum = Math.pow(d_r, 2) + Math.pow(d_g, 2) + Math.pow(d_b, 2);
	return Math.pow(sum, 0.5);
}

function closestColor(r,g,b){
	for(var i = 0; i < grad1_data.length; i++){
		var item = grad1_data[i];
		if(item.r === r && item.g === g && item.b === b){
			return item;
		}
	}
}

function stringToRgb(string){
  string = string.replace("rgb(","").replace(")","").split(",");
  return {
    r: parseInt(string[0]),
    g: parseInt(string[1]),
    b: parseInt(string[2])
  };
}

function leftEdge(color){
  var _up = dim.h / 10 + 1;
  var ret = [];
  for(var i = 0; i <= _up; i++){
    var r = Math.round(255 - (255/_up)*i);
    ret.push(rgbToString( r,r,r ));
  }
  return ret;
}
var _l = leftEdge("");

function span(left, right){
  left = stringToRgb(left);
  right = stringToRgb(right);
  var r_i = left.r;
  var r_f = right.r;
  var d_r = r_f - r_i;
  var g_i = left.g;
  var g_f = right.g;
  var d_g = g_f - g_i;
  var b_i = left.b;
  var b_f = right.b;
  var d_b = b_f - b_i;
  var _across = dim.w / 10 + 1;
  var ret = [];
  for(var i = 0; i <= _across; i++){
    var _r = Math.round(r_i + (d_r/_across)*i);
    var _g = Math.round(g_i + (d_g/_across)*i);
    var _b = Math.round(b_i + (d_b/_across)*i);
    ret.push(rgbToString( _r,_g,_b ));
  }
  return ret;
}

function rightEdge(color){
  //color is an rgb string
  color = stringToRgb(color);
  var r = color.r;
  var d_r = r;
  var g = color.g;
  var d_g = g;
  var b = color.b;
  var d_b = b;
  var _up = dim.h / 10 + 1;
  var ret = [];
  for(var i = 0; i <= _up; i++){
    var _r = Math.round(r - (d_r/_up)*i);
    var _g = Math.round(g - (d_g/_up)*i);
    var _b = Math.round(b - (d_b/_up)*i);
    ret.push(rgbToString( _r,_g,_b ));
  }
  return ret;
}

function draw(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  color_grd = context.createLinearGradient(1020 + padding,1150 + padding,2020 + padding,1150 + padding);
  color_grd.addColorStop(0,"red");
  color_grd.addColorStop(1/6,"magenta");
  color_grd.addColorStop(2/6,"blue");
  color_grd.addColorStop(3/6,"aqua");
  color_grd.addColorStop(4/6,"lime");
  color_grd.addColorStop(5/6,"yellow");
  color_grd.addColorStop(1,"red");
  context.fillStyle = color_grd;
  context.fillRect(1020 + padding, 1150 + padding, 1000, 150);
  if(grad1_data === null){
	  grad1_data = [];
	  for(i = 1020; i < 1020 + 1000; i++){
		  var _c = context.getImageData(i + padding, 1150 + padding, 1, 1).data;
		  grad1_data.push({
			  x: i,
			  r: _c[0],
			  g: _c[1],
			  b: _c[2]
		  });
	  }
  }
  var _c = context.getImageData(dim.grad1.x + padding, 1150 + padding, 1, 1).data;
  if(dim.grad1.x === 2020){
	  _c = context.getImageData(dim.grad1.x - 1 + padding, 1150 + padding, 1, 1).data;
  }
  context.fillStyle = "white";
  context.fillRect(dim.grad1.x - 25 + padding, 1150-25 + padding, 50, 200);
  base_color = rgbToString(_c[0],_c[1],_c[2]);
  context.fillStyle = base_color;
  context.fillRect(dim.grad1.x - 15 + padding, 1150-15 + padding, 30, 180);
  
  var _r = rightEdge(base_color);
  main_data = [];
  for(var i = 0; i < _l.length; i++){
    var _row = span(_l[i], _r[i]);
    main_data.push(_row);
    for(var j = 0; j < _row.length; j++){
      var _y = 10 * i;
      var _x = 10 * j;
      context.fillStyle = _row[j];
      context.fillRect(_x + padding,_y + padding,10,10);
    }
  }
  var _c = context.getImageData(dim.main.x + padding, dim.main.y + padding, 1, 1).data;
  if(dim.main.x === (dim.w + 2*10) && dim.main.y === 0){
	  _c = context.getImageData(dim.main.x - 1 + padding, dim.main.y + 1 + padding, 1, 1).data;
  }
  chosen_color = rgbToString(_c[0],_c[1],_c[2]);
  
  context.fillStyle = "white";
  context.beginPath();
  context.arc(dim.main.x + padding, dim.main.y + padding, 100, 0, Math.PI*2, true); 
  context.closePath();
  context.fill();
  
  context.fillStyle = chosen_color;
  context.beginPath();
  context.arc(dim.main.x + padding, dim.main.y + padding, 100 - 10, 0, Math.PI*2, true); 
  context.closePath();
  context.fill();
  
  context.beginPath();
  context.arc(700 + padding, 1230 + padding, 100, 0, Math.PI*2, true);
  context.closePath();
  context.fill();
}

draw();

canvas.addEventListener("click", function( event ) {
	if(event.offsetX >= 20 && event.offsetY >= 20 && event.offsetX <= 220 && event.offsetY <= 120){
		dim.main.x = 10*event.offsetX - padding;
		dim.main.y = 10*event.offsetY - padding;
	}
	if(event.offsetX >= 122 && event.offsetY >= 135 && event.offsetX <= 222 && event.offsetY <= 150){
		dim.grad1.x = 10*event.offsetX - padding;
	}
	draw();
}, false);

canvas.addEventListener("mousedown", function( event ) {
	if(event.offsetX >= 20 && event.offsetY >= 20 && event.offsetX <= 220 && event.offsetY <= 120){
		if(dim.main.drag === false){
			dim.main.drag = true;
		}
	}
	if(event.offsetX >= 122 && event.offsetY >= 135 && event.offsetX <= 222 && event.offsetY <= 150){
		if(dim.grad1.drag === false){
			dim.grad1.drag = true;
		}
	}
}, false);

canvas.addEventListener("mousemove", function( event ) {
	//main gradient
	if(dim.main.drag === true){
		if(event.offsetX >= 20 && event.offsetY >= 20 && event.offsetX <= 220 && event.offsetY <= 120){
			dim.main.x = 10*event.offsetX - padding;
			dim.main.y = 10*event.offsetY - padding;
		}
		//if above, set to min
		if(event.offsetY < 20){
			dim.main.y = 0;
		}
		//if below, set to max
		if(event.offsetY > 120){
			dim.main.y = 1020;
		}
		//if left, set to min
		if(event.offsetX < 20){
			dim.main.x = 0;
		}
		//if right, set to max
		if(event.offsetX > 220){
			dim.main.x = 2019;
		}
		
		draw();
	}
	else if(dim.grad1.drag === true){
		if(event.offsetX >= 122 && event.offsetY >= 135 && event.offsetX <= 222 && event.offsetY <= 150){
			dim.grad1.x = 10*event.offsetX - padding;
		}
		//if left, set to min
		if(event.offsetX < 122){
			dim.grad1.x = 1020;
		}
		//if right, set to max
		if(event.offsetX > 222){
			dim.grad1.x = 2019;
		}
		
		draw();
	}
}, false);

canvas.addEventListener("mouseup", function( event ) {
	dim.main.drag = false;
	dim.grad1.drag = false;
}, false);