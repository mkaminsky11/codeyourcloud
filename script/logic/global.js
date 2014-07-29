/*==============================
A file to store global variables
==============================*/

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

var logged_in = false;
var current_file = "";

/*==========
INIT
============*/
var all_saved = false;
var was_error = false;
var were_changes = false;
var is_welcome = false;

var init_needed = false;
var init_loaded = false;
var title_loaded = false;


var myRootFolderId;
var myEmail;
var userName;
var userUrl;
var userId;