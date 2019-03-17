$(document).ready(function(){


	document.addEventListener("online", function(){news_sync();}, false);
	document.addEventListener("offline", function(){news_off();}, false);

	
	$('.menu').click(function(){
		if($('.menu_bar').css('display') == 'none'){
			$('.menu_bar').slideDown('slow');
		}else{
			$('.menu_bar').slideUp('slow');
		}
	});
	
	function news_sync(){
	$(".news_posts").empty();
	var news_api='http://api.nytimes.com/svc/news/v3/content/all/all/.json?&limit=20&api-key=86fe51fdd86f08e42494a5fb970b2c58:19:67192571';
	$.getJSON(news_api, function(news_data){
		var setarray = new Array();
		for(i=0; i<20; i++){
			var news_title = news_data.results[i]['title'];
			var news_desc = news_data.results[i]['abstract'];
			var news_url = news_data.results[i]['url'];
			var news_section = news_data.results[i]['section'];
			setarray[0] = news_title;
			setarray[1] = news_desc;
			setarray[2] = news_url;
			setarray[3] = news_section;
			localStorage["coalnews" + i] = JSON.stringify(setarray);
		}
		news_off();
	});
	}
	
	function news_off(){
		for(i=0; i<20; i++){
			var setarray = JSON.parse(localStorage["coalnews" + i]);
			var news_title = setarray[0];
			var news_desc = setarray[1];
			var news_url = setarray[2];
			var news_section = setarray[3];
			$('.news_posts').append(
			"<div class='news_post' id='" + i + "'><h4>" + news_title + 
			"</h4><h5>" + news_desc + "<h5/></div></a>");
		}
		$(".news_post").on("click", function(event){openNYTarticle($(this).attr("id"));});
	}
	
	function openNYTarticle(i){
		var filesarray = JSON.parse(localStorage["coalnews" + i]);
		var news_url = filesarray[2];
		window.plugins.webintent.startActivity({
		action: webintent.ACTION_VIEW,
		type: "text/html",
		url: news_url}, 
		function(success){}, 
		function(error){navigator.notification.alert('File cannot be opened. Reason: ' + error, drive_off, 'Error Opening','Okay');});
	}

});