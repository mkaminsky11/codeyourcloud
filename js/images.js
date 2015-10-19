var images = {};

images.ext = ["png","jpg","jpeg","gif","tiff"];
images.vide = ["mp3","mp4"];

images.init = function(id){
	drive.getFile(id, function(resp){
		//https://doc-0o-34-docs.googleusercontent.com/docs/securesc/5bfhdfjhb08jjkevjs6gmvs27afnj8mn/5uus0edh2velrig75kjpkdj6ltg7kmum/1429380000000/09572991516856320887/09572991516856320887/0ByWSHHBN-zyoeE1lX29JSzBFdFE
		//?e=download&gd=true
		$(".codemirror-container[data-fileid=\""+id+"\"]").append("<div class='codemirror-image'><img src='"+ images.getImageUrl(resp.downloadUrl) +"'></div>");
	});
}

images.isImage = function(ext){
	try{
		ext = ext.toLowerCase();
		if(images.ext.indexOf(ext) !== -1){
			return true;
		}
	}catch(e){}
	return false;
};

images.getImageUrl = function(downloadUrl){
	//downloadUrl
	//https://doc-08-34-docs.googleusercontent.com/docs/securesc/5bfhdfjhb08jjkevjs6gmvs27afnj8mn/mnndq44jcfv9eu02j2jbkufc9chh49mo/1445205600000/09572991516856320887/09572991516856320887/0ByWSHHBN-zyoX2Vtc3FCanNJdkE?e=download&gd=true
	return downloadUrl.split("?")[0];
}