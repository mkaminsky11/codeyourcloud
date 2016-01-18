/*===
* CODEYOURCLOUD
===*/

var true_id = null;

var editors = []; //the codemirror editors
var current_file = "";

var converter = new Markdown.Converter();

//[name, codemirror code, file extensions seperated by | ]
var modeSelect = "";
var modes = CodeMirror.modeInfo;
var _mode = {};
_mode.modes = modes;
_mode.loaded = ["xml","javascript","clike","coffeescript","css","htmlmixed","go","markdown","php","perl","python","sass","ruby","sql","null"];

for(var i = 0; i < _mode.loaded.length; i++){
	if(_mode.loaded[i] !== "null"){
		var url = "https://codeyourcloud.com/lib/codemirror/mode/" + _mode.loaded[i] + "/" + _mode.loaded[i] + ".js";
	    jQuery.ajax({
	        url: url,
	        dataType: 'script',
	        success: function(){},
	        async: true
		});
	}
}

_mode.modeLoaded = function(mode){
	for(var i = 0; i < _mode.modes.length; i++){
		if(_mode.modes[i].mime === mode || (_mode.modes[i].mimes && _mode.modes[i].mimes.indexOf(mode) !== -1)){
			//found it!
			var _mode_name = _mode.modes[i].mode;
			if(_mode.loaded.indexOf(_mode_name) !== -1 || _mode_name === "null"){
				return [true, _mode_name];
			}
			else{
				return [false, _mode_name];
			}
		}
	}
	return [false, null];
}
_mode.loadMode = function(_mode_name, mode, id, callback){
	if(_mode_name !== "null"){
		var url = "https://codeyourcloud.com/lib/codemirror/mode/" + _mode_name + "/" + _mode_name + ".js";
	    jQuery.ajax({
	        url: url,
	        dataType: 'script',
	        success: function(){
				_mode.loaded.push(_mode_name);
				callback(id, mode);
			},
	        async: true
		});
	}
	else{
		callback(id, mode);
	}
}

var themes = [
	"3024-day.css",
	"3024-night.css",
	"abcdef.css",
	"ambiance.css",
	"ambiance-mobile.css",
	"base16-dark.css",
	"base16-light.css",
	"bespin.css",
	"blackboard.css",
	"cobalt.css",
	"colorforth.css",
	"dracula.css",
	"eclipse.css",
	"elegant.css",
	"erlang-dark.css",
	"hopscotch.css",
	"icecoder.css",
	"isotope.css",
	"lesser-dark.css",
	"liquibyte.css",
	"material.css",
	"mbo.css",
	"mdn-like.css",
	"midnight.css",
	"monokai.css",
	"neat.css",
	"neo.css",
	"night.css",
	"paraiso-dark.css",
	"paraiso-light.css",
	"pastel-on-dark.css",
	"railscasts.css",
	"rubyblue.css",
	"seti.css",
	"solarized.css",
	"the-matrix.css",
	"tomorrow-night-bright.css",
	"tomorrow-night-eighties.css",
	"ttcn.css",
	"twilight.css",
	"vibrant-ink.css",
	"xq-dark.css",
	"xq-light.css",
	"yeti.css",
	"zenburn.css"
];
for(var i = 0; i < themes.length; i++){
	themes[i] = themes[i].replace(".css","");
	$('<link rel="stylesheet" type="text/css" async href="https://codeyourcloud.com/lib/codemirror/theme/'+themes[i]+'.css" >').appendTo("head");
}

var themes_name = themes;
var is_mobile = false;
var real_mobile = false;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 	is_mobile = true;
 	real_mobile = true;
}
if(window.location.href.indexOf("?mobile=true") !== -1){
	is_mobile = true;
	//spoofing to test mobile
}
if(is_mobile === true){
  $(".move").addClass("is-mobile");
}

var side_open = false;
var developerKey = 'AIzaSyBTSFIgQkLly9v6Xuqc2Nqm-vX0jpyEbZk';
var cloud_use = null; //sky|drive

var introText = (function () {/*
 ________  ________  ________  _______  
|\   ____\|\   __  \|\   ___ \|\  ___ \
\ \  \___|\ \  \|\  \ \  \_|\ \ \   __/|
 \ \  \    \ \  \\\  \ \  \ \\ \ \  \_|/__
  \ \  \____\ \  \\\  \ \  \_\\ \ \  \_|\ \
   \ \_______\ \_______\ \_______\ \_______\
    \|_______|\|_______|\|_______|\|_______|
          


  ___    ___ ________  ___  ___  ________ 
 |\  \  /  /|\   __  \|\  \|\  \|\   __  \
 \ \  \/  / | \  \|\  \ \  \\\  \ \  \|\  \
  \ \    / / \ \  \\\  \ \  \\\  \ \   _  _\
   \/  /  /   \ \  \\\  \ \  \\\  \ \  \\  \|
 __/  / /      \ \_______\ \_______\ \__\\ _\
|\___/ /        \|_______|\|_______|\|__|\|__|
\|___|/                                               
                                                      
                                                      
 ________  ___       ________  ___  ___  ________     
|\   ____\|\  \     |\   __  \|\  \|\  \|\   ___ \
\ \  \___|\ \  \    \ \  \|\  \ \  \\\  \ \  \_|\ \
 \ \  \    \ \  \    \ \  \\\  \ \  \\\  \ \  \ \\ \
  \ \  \____\ \  \____\ \  \\\  \ \  \\\  \ \  \_\\ \
   \ \_______\ \_______\ \_______\ \_______\ \_______\
    \|_______|\|_______|\|_______|\|_______|\|_______|
                                                      
                                                      
A free, in-browser code editor for Google Drive and OneDrive! Check us out at:

	github.com/mkaminsky11/codeyourcloud.com
	
To get started, open a file by clicking the folder icon in the top-right corner or by opening the sidebar    
*/}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];

/*=======
MESSENGER
========*/
/*Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
    theme: 'air',
    hideAfter: 5
};*/

function infoFromUrl() {
  if (window.location.hash) {
    var authResponse = window.location.hash.substring(1);
    var authInfo = JSON.parse(
      '{"' + authResponse.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
      function(key, value) { return key === "" ? value : decodeURIComponent(value); });
    return authInfo;
  }
  else {
  }
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function esc(text){
  return $("#escape").text(text).html()
}

String.prototype.toUnicode = function(){
    var result = "";
    for(var i = 0; i < this.length; i++){
        result += "\\u" + ("000" + this[i].charCodeAt(0).toString(16)).substr(-4);
    }
    return result;
};

function knownCharCodeAt(str, idx) {
  str += '';
  var code,
      end = str.length;
  var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
  while ((surrogatePairs.exec(str)) != null) {
    var li = surrogatePairs.lastIndex;
    if (li - 2 < idx) {
      idx++;
    }
    else {
      break;
    }
  }
  if (idx >= end || idx < 0) {
    return NaN;
  }
  code = str.charCodeAt(idx);
  var hi, low;
  if (0xD800 <= code && code <= 0xDBFF) {
    hi = code;
    low = str.charCodeAt(idx + 1);
    // Go one further, since one of the "characters" is part of a surrogate pair
    return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
  }
  return code;
}

function encode_utf8(s) {
  return unescape(encodeURIComponent(s));
}

function decode_utf8(s) {
  return decodeURIComponent(escape(s));
}

function codeToChar(text){
	var newText = text.replace(/\\u[0-9a-z][0-9a-z][0-9a-z][0-9a-z]/g, 
	    function($0, $1) {
	        return String.fromCharCode(knownCharCodeAt("" + $1), 0);
	    }
	);
	return newText;
}

function charToCode(text){
	text = text.split("");
	for(var i = 0; i < text.length; i++){
		if(/[^\u0000-\u007F]+/g.test(text[i]) === true){
			var item = text[i];
			text[i] = "";
			if(i < (text.length - 1)){
				text[i + 1] =  item.toUnicode() + text[i +1];
			}
			else{
				text = text.reverse();
				text.push(item.toUnicode());
				text = text.reverse();
			}
		}
	}
	return text.join("");
}