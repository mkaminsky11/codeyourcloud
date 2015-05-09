var images = {};

images.ext = ["png","jpg","jpeg","gif","tiff"];
images.vide = ["mp3","mp4"];

images.init = function(id){
	console.log("showing image");
	//https://doc-0o-34-docs.googleusercontent.com/docs/securesc/5bfhdfjhb08jjkevjs6gmvs27afnj8mn/5uus0edh2velrig75kjpkdj6ltg7kmum/1429380000000/09572991516856320887/09572991516856320887/0ByWSHHBN-zyoeE1lX29JSzBFdFE
	//?e=download&gd=true
	$(".codemirror-container[data-fileid=\""+id+"\"]").append("<img class='codemirror-image' src=''>");
}

images.isImage = function(ext){
	ext = ext.toLowerCase();
	if(images.ext.indexOf(ext) !== -1){
		return true;
	}
	return false;
};