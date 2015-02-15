
/*==============================
A file to store global variables
==============================*/

var editors = []; //the codemirror editor
var current_file = "";


function editor(){
	for(var i = 0; i < editors.length; i++){
  if(editors[i].id === current_file){
    return editors[i].editor;
  }
 }
}

function add_editor(e, id, welcome){
	//creates a new object to store stuff in
	var to_push = {
    	editor: e,
    	id: id,
    	welcome: welcome,
    	title: "",
    	ignore: false
	};
  
	editors.push(to_push);
	current_file = id;
	e.refresh();
}

function getEditor(id){
	//gets an editor by its file id
	for(var i = 0; i < editors.length; i++){
		if(editors[i].id === id){
			return editors[i].editor;
		}
	}
}

function getIndex(id){
	//gets the index of an editor with a given file id
	for(var i = 0; i < editors.length; i++){
		if(editors[i].id === id){
			return i;
		}
	}
}

function getIgnore(id){
	for(var i = 0; i < editors.length; i++){
		if(editors[i].id === id){
			return editors[i].ignore;
		}
	}
}

function setIgnore(id, ignore){
	for(var i = 0; i < editors.length; i++){
		if(editors[i].id === id){
			editors[i].ignore = ignore;
		}
	}
}

function setFileTitle(id, title){
	//first, set the h4 of the .tab-tab
	editors[getIndex(id)].title = title;
	$(".tab-tab[data-fileid='"+id+"']").find("h4").html(title);
	
	$("#tab-manager div[data-refersto='"+id+"']").html($("#tab-manager div[data-refersto='"+id+"']").html().replace("loading...", title));
	
	check_mode(id, title);
	var index = getIndex(id);
	
	if(current_file === id){
		$("#title").val(editors[index].title);
	}
	var t_t = title.toLowerCase();
	if(t_t.indexOf("png") !== -1 || t_t.indexOf(".jpg") !== -1 || t_t.indexOf(".jpeg") !== -1 || t_t.indexOf(".tiff") !== -1 || t_t.indexOf(".gif") !== -1){
		editors[index].image = true;
		if(current_file === id){
			read_image(id);
		}
	}
	
	var j = $("[data-tree-li='"+id+"'] span").html().split(">");
	j[2] = title;
	$("[data-tree-li='"+id+"'] span").html(j.join(">"))
}


var CLIENT_ID = '953350323460-0i28dhkj1hljs8m9ggvm3fbiv79cude6.apps.googleusercontent.com';
var SCOPES = ['https://www.googleapis.com/auth/drive.install','https://www.googleapis.com/auth/drive'];

var drive_loaded = false;
var real_loaded = false;
var doc_real;
var current = "";
var text;
var list;
var chats;
var binding;
var title;

var your_session_id = "";
var your_color = "";
var your_user_id = "";
var your_name = "";
var your_photo = "";

var chat_open = false;
var total_chat = 0;

var code;
var logged_in = false;

var converter = new Markdown.Converter();

//[name, codemirror code, file extensions seperated by | ]
var modes = [
    {name: "APL", mime: "text/apl", mode: "apl", ext: ["dyalog", "apl"]},
	{name: "Swift", mime: "swift", mode:"swift", ext: ["swift"]},
	{name: "Text", mime: "text", mode: "text", ext:["txt"]},
    {name: "Asterisk", mime: "text/x-asterisk", mode: "asterisk"},
    {name: "C", mime: "text/x-csrc", mode: "clike", ext: ["c", "h", "pro"]},
    {name: "C++", mime: "text/x-c++src", mode: "clike", ext: ["cpp", "c++", "cc", "cxx", "hpp", "h++", "hh", "hxx"]},
    {name: "Cobol", mime: "text/x-cobol", mode: "cobol", ext: ["cob", "cpy"]},
    {name: "C#", mime: "text/x-csharp", mode: "clike", ext: ["cs"]},
    {name: "Clojure", mime: "text/x-clojure", mode: "clojure", ext: ["clj"]},
    {name: "CoffeeScript", mime: "text/x-coffeescript", mode: "coffeescript", ext: ["coffee"]},
    {name: "Common Lisp", mime: "text/x-common-lisp", mode: "commonlisp", ext: ["cl", "lisp", "el"]},
    {name: "Cypher", mime: "application/x-cypher-query", mode: "cypher", ext: ["cyp", "cypher"]},
    {name: "Cython", mime: "text/x-cython", mode: "python", ext: ["pyx", "pxd", "pxi"]},
    {name: "CSS", mime: "text/css", mode: "css", ext: ["css"]},
    {name: "CQL", mime: "text/x-cassandra", mode: "sql", ext: ["cql"]},
    {name: "D", mime: "text/x-d", mode: "d", ext: ["d"]},
    {name: "Dart", mime: "text/x-dart", mode: "dart", ext: ["dart"]},
    {name: "diff", mime: "text/x-diff", mode: "diff", ext: ["diff", "patch"]},
    {name: "Django", mime: "text/x-django", mode: "django", ext: ["django"]},
    {name: "DTD", mime: "application/xml-dtd", mode: "dtd", ext: ["dtd"]},
    {name: "Dylan", mime: "text/x-dylan", mode: "dylan", ext: ["dylan", "dyl", "intr"]},
    {name: "EBNF", mime: "text/x-ebnf", mode: "ebnf"},
    {name: "ECL", mime: "text/x-ecl", mode: "ecl", ext: ["ecl"]},
    {name: "Eiffel", mime: "text/x-eiffel", mode: "eiffel", ext: ["e"]},
    {name: "Embedded Javascript", mime: "application/x-ejs", mode: "htmlembedded", ext: ["ejs"]},
    {name: "Embedded Ruby", mime: "application/x-erb", mode: "htmlembedded", ext: ["erb"]},
    {name: "Erlang", mime: "text/x-erlang", mode: "erlang", ext: ["erl"]},
    {name: "Fortran", mime: "text/x-fortran", mode: "fortran", ext: ["f", "for", "f77", "f90"]},
    {name: "F#", mime: "text/x-fsharp", mode: "mllike", ext: ["fs"], alias: ["fsharp"]},
    {name: "Gas", mime: "text/x-gas", mode: "gas", ext: ["s"]},
    {name: "Gherkin", mime: "text/x-feature", mode: "gherkin", ext: ["feature"]},
    {name: "GitHub Flavored Markdown", mime: "text/x-gfm", mode: "gfm", file: /^(readme|contributing|history).md$/i},
    {name: "Go", mime: "text/x-go", mode: "go", ext: ["go"]},
    {name: "Groovy", mime: "text/x-groovy", mode: "groovy", ext: ["groovy"]},
    {name: "HAML", mime: "text/x-haml", mode: "haml", ext: ["haml"]},
    {name: "Haskell", mime: "text/x-haskell", mode: "haskell", ext: ["hs"]},
    {name: "Haxe", mime: "text/x-haxe", mode: "haxe", ext: ["hx"]},
    {name: "HXML", mime: "text/x-hxml", mode: "haxe", ext: ["hxml"]},
    {name: "ASP.NET", mime: "application/x-aspx", mode: "htmlembedded", ext: ["aspx"], alias: ["asp", "aspx"]},
    {name: "HTML", mime: "text/html", mode: "htmlmixed", ext: ["html", "htm"], alias: ["xhtml"]},
    {name: "HTTP", mime: "message/http", mode: "http"},
    {name: "IDL", mime: "text/x-idl", mode: "idl", ext: ["pro"]},
    {name: "Jade", mime: "text/x-jade", mode: "jade", ext: ["jade"]},
    {name: "Java", mime: "text/x-java", mode: "clike", ext: ["java"]},
    {name: "Java Server Pages", mime: "application/x-jsp", mode: "htmlembedded", ext: ["jsp"], alias: ["jsp"]},
    {name: "JavaScript", mime: "text/javascript", mode: "javascript", ext: ["js"]},
    {name: "JSON", mime: "application/json", mode: "javascript", ext: ["json", "map"]},
    {name: "JSON-LD", mime: "application/ld+json", mode: "javascript", ext: ["jsonld"]},
    {name: "Jinja2", mime: "null", mode: "jinja2", ext: ["jinja2"]},
    {name: "Julia", mime: "text/x-julia", mode: "julia", ext: ["jl"]},
    {name: "Kotlin", mime: "text/x-kotlin", mode: "kotlin", ext: ["kt"]},
    {name: "LESS", mime: "text/x-less", mode: "css", ext: ["less"]},
    {name: "LiveScript", mime: "text/x-livescript", mode: "livescript", ext: ["ls"]},
    {name: "Lua", mime: "text/x-lua", mode: "lua", ext: ["lua"]},
    {name: "Markdown", mime: "text/x-markdown", mode: "markdown", ext: ["markdown", "md", "mkd"]},
    {name: "mIRC", mime: "text/mirc", mode: "mirc"},
    {name: "MariaDB SQL", mime: "text/x-mariadb", mode: "sql"},
    {name: "Modelica", mime: "text/x-modelica", mode: "modelica", ext: ["mo"]},
    {name: "MS SQL", mime: "text/x-mssql", mode: "sql"},
    {name: "MySQL", mime: "text/x-mysql", mode: "sql"},
    {name: "Nginx", mime: "text/x-nginx-conf", mode: "nginx", file: /nginx.*\.conf$/i},
    {name: "NTriples", mime: "text/n-triples", mode: "ntriples", ext: ["nt"]},
    {name: "Objective C", mime: "text/x-objectivec", mode: "clike", ext: ["m", "mm"]},
    {name: "OCaml", mime: "text/x-ocaml", mode: "mllike", ext: ["ml", "mli", "mll", "mly"]},
    {name: "Octave", mime: "text/x-octave", mode: "octave", ext: ["m"]},
    {name: "Pascal", mime: "text/x-pascal", mode: "pascal", ext: ["p", "pas"]},
    {name: "PEG.js", mime: "null", mode: "pegjs", ext: ["jsonld"]},
    {name: "Perl", mime: "text/x-perl", mode: "perl", ext: ["pl", "pm"]},
    {name: "PHP", mime: "application/x-httpd-php", mode: "php", ext: ["php", "php3", "php4", "php5", "phtml"]},
    {name: "Pig", mime: "text/x-pig", mode: "pig", ext: ["pig"]},
    {name: "Plain Text", mime: "text/plain", mode: "null", ext: ["txt", "text", "conf", "def", "list", "log"]},
    {name: "PLSQL", mime: "text/x-plsql", mode: "sql", ext: ["pls"]},
    {name: "Properties files", mime: "text/x-properties", mode: "properties", ext: ["properties", "ini", "in"], alias: ["ini", "properties"]},
    {name: "Python", mime: "text/x-python", mode: "python", ext: ["py", "pyw"]},
    {name: "Puppet", mime: "text/x-puppet", mode: "puppet", ext: ["pp"]},
    {name: "Q", mime: "text/x-q", mode: "q", ext: ["q"]},
    {name: "R", mime: "text/x-rsrc", mode: "r", ext: ["r"], alias: ["rscript"]},
    {name: "reStructuredText", mime: "text/x-rst", mode: "rst", ext: ["rst"], alias: ["rst"]},
    {name: "RPM Changes", mime: "text/x-rpm-changes", mode: "rpm"},
    {name: "RPM Spec", mime: "text/x-rpm-spec", mode: "rpm", ext: ["spec"]},
    {name: "Ruby", mime: "text/x-ruby", mode: "ruby", ext: ["rb"], alias: ["jruby", "macruby", "rake", "rb", "rbx"]},
    {name: "Rust", mime: "text/x-rustsrc", mode: "rust", ext: ["rs"]},
    {name: "Sass", mime: "text/x-sass", mode: "sass", ext: ["sass"]},
    {name: "Scala", mime: "text/x-scala", mode: "clike", ext: ["scala"]},
    {name: "Scheme", mime: "text/x-scheme", mode: "scheme", ext: ["scm", "ss"]},
    {name: "SCSS", mime: "text/x-scss", mode: "css", ext: ["scss"]},
    {name: "Shell", mime: "text/x-sh", mode: "shell", ext: ["sh", "ksh", "bash"], alias: ["bash", "sh", "zsh"]},
    {name: "Sieve", mime: "application/sieve", mode: "sieve", ext: ["siv", "sieve"]},
    {name: "Slim", mimes: ["text/x-slim", "application/x-slim"], mode: "slim", ext: ["slim"]},
    {name: "Smalltalk", mime: "text/x-stsrc", mode: "smalltalk", ext: ["st"]},
    {name: "Smarty", mime: "text/x-smarty", mode: "smarty", ext: ["tpl"]},
    {name: "SmartyMixed", mime: "text/x-smarty", mode: "smartymixed"},
    {name: "Solr", mime: "text/x-solr", mode: "solr"},
    {name: "Soy", mime: "text/x-soy", mode: "soy", ext: ["soy"], alias: ["closure template"]},
    {name: "SPARQL", mime: "application/sparql-query", mode: "sparql", ext: ["rq", "sparql"], alias: ["sparul"]},
    {name: "Spreadsheet", mime: "text/x-spreadsheet", mode: "spreadsheet", alias: ["excel", "formula"]},
    {name: "SQL", mime: "text/x-sql", mode: "sql", ext: ["sql"]},
    {name: "MariaDB", mime: "text/x-mariadb", mode: "sql"},
    {name: "sTeX", mime: "text/x-stex", mode: "stex"},
    {name: "LaTeX", mime: "text/x-latex", mode: "stex", ext: ["text", "ltx"], alias: ["tex"]},
    {name: "SystemVerilog", mime: "text/x-systemverilog", mode: "verilog", ext: ["v"]},
    {name: "Tcl", mime: "text/x-tcl", mode: "tcl", ext: ["tcl"]},
    {name: "Textile", mime: "text/x-textile", mode: "textile", ext: ["textile"]},
    {name: "TiddlyWiki ", mime: "text/x-tiddlywiki", mode: "tiddlywiki"},
    {name: "Tiki wiki", mime: "text/tiki", mode: "tiki"},
    {name: "TOML", mime: "text/x-toml", mode: "toml", ext: ["toml"]},
    {name: "Tornado", mime: "text/x-tornado", mode: "tornado"},
    {name: "Turtle", mime: "text/turtle", mode: "turtle", ext: ["ttl"]},
    {name: "TypeScript", mime: "application/typescript", mode: "javascript", ext: ["ts"]},
    {name: "VB.NET", mime: "text/x-vb", mode: "vb", ext: ["vb"]},
    {name: "VBScript", mime: "text/vbscript", mode: "vbscript", ext: ["vbs"]},
    {name: "Velocity", mime: "text/velocity", mode: "velocity", ext: ["vtl"]},
    {name: "Verilog", mime: "text/x-verilog", mode: "verilog", ext: ["v"]},
    {name: "XML", mimes: ["application/xml", "text/xml"], mode: "xml", ext: ["xml", "xsl", "xsd"]},
    {name: "XQuery", mime: "application/xquery", mode: "xquery", ext: ["xy", "xquery"]},
    {name: "YAML", mime: "text/x-yaml", mode: "yaml", ext: ["yaml"]},
    {name: "Z80", mime: "text/x-z80", mode: "z80", ext: ["z80"]}
];

var themes = [
	"Seti",
	"Code Your Cloud",
	"3024 Day",
	"3024 Night",
	"Ambiance Mobile",
	"Ambiance",
	"Base16 Light",
	"Base16 Dark",
	"Blackboard",
	"Cobalt",
	"Eclipse",
	"Elegant",
	"Erlang Dark",
	"Lesser Dark",
	"Mbo",
	"Mdn Like",
	"Midnight",
	"Monokai",
	"Neat",
	"Night",
	"Paraiso Dark",
	"Paraiso Light",
	"Pastel On Dark",
	"RubyBlue",
	"Solarized",
	"The Matrix",
	"Tomorrow Night Eighties",
	"Twilight",
	"Vibrant Ink",
	"Xq light",
	"Xq dark",
	"Neo"
];

var themes_name = ["seti","code-your-cloud","3024-day", "3024-night", "ambiance-mobile", "ambiance", "base16-light", "base16-dark", "blackboard", "cobalt", "eclipse", "elegant", "erlang-dark", "lesser-dark", "mbo", "mdn-like", "midnight", "monokai", "neat", "night", "paraiso-dark", "paraiso-light", "pastel-on-dark", "rubyblue", "solarized", "the-matrix", "tomorrow-night-eighties", "twilight", "vibrant-ink", "xq-light", "xq-dark", "neo"];

var is_mobile = false;
var real_mobile = false;


var side_open_width = "25%";

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 	is_mobile = true;
 	real_mobile = true;
}

if(window.location.href.indexOf("?mobile=true") !== -1){
	is_mobile = true;
	//spoofing to test mobile
}

if(is_mobile){
	to_mobile();
}

function to_mobile(){
	
	//some UI changes
	is_mobile = true;
	//makes the sidebar larger
}

function from_mobile(){
	side_open_width = "25%";

	//from mobile to desktop
	is_mobile = false;
}

$( window ).resize(function() {
  if($( window ).width() < 700){
	  if(!is_mobile){
		  to_mobile();
	  }
  }
  else{
	  if(is_mobile){
		  from_mobile();
	  }
  }
});


//swipe functions for mobile
var side_open = false;

document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;                                                        

function handleTouchStart(evt) {                                         
    xDown = evt.touches[0].clientX;                                      
    yDown = evt.touches[0].clientY;                                      
};                                                

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */ 
            if(is_mobile && side_open){
	            close_side();
            }
        } else {
            /* right swipe */
            if(is_mobile && !side_open){
	            open_side();
            }
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */ 
        } else { 
            /* down swipe */
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};


var current = "";
if(window.location.href.indexOf("#") !== -1){
	current = window.location.href.split("#")[1];
}

/*==========
INIT
============*/
var all_saved = false;
var was_error = false;
var were_changes = false;
var is_welcome = false;
var clock;

var init_needed = false;
var init_loaded = false;
var title_loaded = false;

/*==========
SQL/Get info

note: not currently enabled
==========*/
var line_wrap = false;
var line_number = true;

var theme_sql = "seti";
var auto_save = true;
var auto_save_int = 30000;
			
var sql_loaded = false;
var user_loaded = false;
			
var sql_font = 12;
var autoC = false;

var myRootFolderId;
var myEmail;
var userName;
var userUrl;
var userId;

var user_loaded = false;
var sql_loaded = false;
       
var total_q;
var user_q;
var product_q;

var rec = false;

var bottom_open = false;

var the_console;

var login_sql = 0;

var mirror;

var mode_select;
var theme_select;

/*=======
MESSENGER
========*/
Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
    theme: 'air'
};
