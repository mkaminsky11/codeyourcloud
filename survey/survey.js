var connection = new WebSocket('wss://codeyourcloud.com:8080');
connection.onopen = function () {
	console.log("open");
};
connection.onmessage = function (message) {
	try {
		var json = JSON.parse(message.data);
		if(json.type === "ok"){
			window.location = "https://codeyourcloud.com/survey/thanks.html";
		}
	} catch (e) {
		return;
	}
};
connection.onerror = function (error) {
};

var q1 = "n/a";
var q2 = "n/a";
var q3 = "n/a";
var q4 = "n/a";
var q5 = "n/a";
var q6 = "n/a";
var q7 = "n/a";
var q8 = "n/a";
var q9 = "n/a";
var q10 = "n/a";
function submit(){
	var ret = {};
	q_1();
	ret.q1 = strip(q1);
	q_2();
	ret.q2 = strip(q2);
	q_3();
	ret.q3 = strip(q3);
	q_4();
	ret.q4 = strip(q4);
	q_5();
	ret.q5 = strip(q5);
	q_6();
	ret.q6 = strip(q6);
	q_7();
	ret.q7 = strip(q7);
	q_8();
	ret.q8 = strip(q8);
	q_9();
	ret.q9 = strip(q9);
	q_10();
	ret.q10 = strip(q10);
	
	ret.type = "survey";
	connection.send(JSON.stringify(ret));
}
function q_1(){
	if($("#problem_usability").is(":checked")){
		q1 = "usability problems";
	}
	if($("#problem_support").is(":checked")){
		q1 = "support problems";
	}
	if($("#problem_other").val() !== ""){
		q1 = $("#problem_other").val();
	}
	q1 = "problem is: " + q1;
}
function q_2(){
	if($("#about_checkbox").is(":checked")){
		q2 = "about page";
	}
	if($("#landing_checkbox").is(":checked")){
		q2 = q2 + " landing page";
	}
	if($("#editor_checkbox").is(":checked")){
		q2 = q2 + " editor";
	}
	
	q2 = "wouldn't mind ads: " + q2;
}
function q_3(){
	if($("#image_nebula").is(":checked")){
		q3 = "nebula";
	}
	if($("#image_island").is(":checked")){
		q3 = "shattered island";
	}
	if($("#image_chalk").is(":checked")){
		q3 = "chalk";
	}
	if($("#image_wood").is(":checked")){
		q3 = "wood";
	}
	if($("#image_none").is(":checked")){
		q3 = "none";
	}
	
	q3 = "prefered image: " + q3;
}
function q_4(){
	if($("#mobile_yes").is(":checked")){
		q4 = "yes";
	}
	if($("#mobile_no").is(":checked")){
		q4 = "no";
	}
	
	if(q4 === "no"){
		q4 = "no, I haven't used mobile";
	}
	else{
		q4 = "yes, I have used mobile";
	}
}
function q_5(){
	if($("#github_yes").is(":checked")){
		q5 = "yes";
	}
	if($("#github_no").is(":checked")){
		q5 = "no";
	}
	if($("#github_none").is(":checked")){
		q5 = "none";
	}
	
	q5 = "github: " + q5;
}
function q_6(){
	if($("#best").val() !== ""){
		q6 = $("#best").val();
	}
	
	q6 = "the best thing is: " + q6;
}
function q_7(){
	if($("#look_good").is(":checked")){
		q7 = "good";
	}
	if($("#look_meh").is(":checked")){
		q7 = "meh";
	}
	if($("#lood_bad").is(":checked")){
		q7 = "bad";
	}
	
	q7 = "it looks: " + q7;
}
function q_8(){
	if($("#survey_good").is(":checked")){
		q8 = "good";
	}
	if($("#survey_bad").is(":checked")){
		q8 = "bad";
	}
	
	q8 = "surveys are: " + q8;
}
function q_9(){
	if($("#rec_yes").is(":checked")){
		q9 = "yes";
	}
	if($("#rec_no").is(":checked")){
		q9 = "no";
	}
	
	q9 = "recommend: " + q9;
}
function q_10(){
	if($("#more").val() !== ""){
		q10 = $("#more").val();
	}
}
function cancel(){
	window.location = "https://codeyourcloud.com";
}
function strip(text){
	var ret = text.split(">").join("").split("<").join("").split(";").join("").split("{").join("").split("}").join("");
	return ret;
}