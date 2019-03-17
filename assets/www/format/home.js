$(document).ready(function(){
	
	var ls_set_date;
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();
	if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} ls_set_date = mm + '/' + dd + '/'+ yyyy;
	

	if(localStorage["ls_set_date"] != ls_set_date){
		localStorage["ls_set_date"] = ls_set_date;
		document.addEventListener("online", function(){getfb_sync(); getweather_sync();}, false);
		document.addEventListener("offline", function(){
			getfb_ol(); 
			getweather_ol();
		}, false);
		document.addEventListener("deviceReady", function(){
			navigator.notification.alert("To sync today's data, please turn on the internet. Data posted in the app may be old or inaccurate.",getfb_ol,'Syncing Accuracy','Okay');
		}, false);
	}else{
		document.addEventListener("online", function(){getfb_sync(); getweather_ol();}, false);
		document.addEventListener("offline", function(){getfb_ol(); getweather_ol();}, false);
	}
	
	$('.menu').click(function(){
		if($('.menu_bar').css('display') == 'none'){
			$('.menu_bar').slideDown('slow');
		}else{
			$('.menu_bar').slideUp('slow');
		}
	});
	
	function starttest() {
			$('.facebook_posts').imagesLoaded(function($images, $proper, $broken ) {
				ImgCache.options.debug = true;
				ImgCache.options.usePersistentCache = true;

				ImgCache.init(function() {
					for (var i = 0; i < $proper.length; i++) {
						ImgCache.cacheFile($($proper[i]).attr('src'));
					}
					for (var i = 0; i < $broken.length; i++) {
						ImgCache.useCachedFile($($broken[i]));
					}
				});
			});
	}
	
	function getfb_sync() {
		$(".facebook_posts").empty();
		$.get('https://graph.facebook.com/oauth/access_token?grant_type=client_credentials&client_id=309467489163017&client_secret=3b627eb8c14155c9c2e8345f3774d6d8', function(data){
			var accesstoken=data.split('=');
			var page_feed_url='https://graph.facebook.com/475898759100461/feed?access_token='+accesstoken[1];
			$.getJSON(page_feed_url, function(fbdata){
						$(".facebook_posts").empty();
						for(i=0; i<20; i++){
							var fbmessage = fbdata.data[i]['message'];
							var fbauthor = fbdata.data[i]['from']['name'];
							var fbfeedtime = fbdata.data[i]['created_time'];
							var fbid = fbdata.data[i]['from']['id'];
							var fbpicture = "https://graph.facebook.com/" + fbid + "/picture";
							var message = fbmessage + "<font class='light'> - " + fbauthor + "</font>";			
							var fbarray = new Array();
							fbarray[0] = fbmessage;
							fbarray[1] = fbauthor ;
							fbarray[2] = fbfeedtime;
							fbarray[3] = fbid;
							fbarray[4] = fbpicture;
							localStorage["coalmes" + i] = JSON.stringify(fbarray);
						}
						starttest();
						getfb_ol();
			});
		});
	}
		
	function getweather_sync(){
		$(".weather_board").empty();
		$(".fiveday_weather").empty();
		$.getJSON('http://api.wunderground.com/api/269422aa1a855937/forecast10day/q/FL/Miami.json?callback=?', function(wea_data){
					for(i=0; i<10; i++){
						var wea_desc = wea_data.forecast.txt_forecast.forecastday[i]['fcttext'];
						var wea_icon = wea_data.forecast.txt_forecast.forecastday[i]['icon'];
						var wea_day = wea_data.forecast.txt_forecast.forecastday[i]['title'];
						var wea_high = wea_data.forecast.simpleforecast.forecastday[i]['high']['fahrenheit'];
						var wea_low = wea_data.forecast.simpleforecast.forecastday[i]['low']['fahrenheit'];
						var wea_date = wea_data.forecast.simpleforecast.forecastday[i]['date']['month'];
						var weatherarray = new Array();
						weatherarray[0] = wea_icon;
						weatherarray[1] = wea_day;
						weatherarray[2] = wea_desc;
						weatherarray[3] = wea_high;
						weatherarray[4] = wea_low;
						localStorage["coalwea" + i] = JSON.stringify(weatherarray);	
						}
					getweather_ol();
		});
	}
	
	function getfb_ol() {
		$(".facebook_posts").empty();
		for(i=0; i<20; i++){
		var fbarray = JSON.parse(localStorage["coalmes" + i]);
			var fbmessage = fbarray[0];
			var fbauthor = fbarray[1];
			var fbfeedtime = fbarray[2];
			var fbid = fbarray[3];
			var fbpicture = fbarray[4];
		var message = fbmessage + "<font class='light'> - " + fbauthor + "</font>";
							
		$(".facebook_posts").append("<div class='fb_feed'><img class='fb_profile' src='" + fbpicture +
		"'>" + message + "</div>");
		}
		starttest();
	}
	
	function getweather_ol(){
		$(".weather_board").empty();
		$(".fiveday_weather").empty();
		for(i=0; i<4; i++){
		var weatherarray = JSON.parse(localStorage["coalwea" + i]);
		var wea_icon = weatherarray[0];
		var wea_day = weatherarray[1];
		var wea_desc = weatherarray[2];
		var wea_high = weatherarray[3];
		var wea_low = weatherarray[4];
			if(i==0){
				$(".weather_board").html(
				"<h4>Today is " + ls_set_date + "</h4>" +
				"<h5>" + wea_desc + "</h5>" + 
				"High Temp: " + wea_high + "<br/>" +
				"Low Temp: " + wea_low);
				$(".weather_image").attr('src', 'images/weather/' + wea_icon + '.gif');
			}else{
				if(wea_day != '' && wea_day != 'undefined'){
					$(".fiveday_weather").append(
					"<div class='row weather_row'><img src='images/weather/" + wea_icon + 
					".gif'><div><h4>" + wea_day + "</h4><h5>" + wea_desc + "</h5></div><div class='clearer'></div></div><br/>");
				}
			}
		}
	}
	

	$(".top_notify").click(function() {
		if($('.fiveday_weather').css('display') == 'none'){
			$('.fiveday_weather').slideDown('slow');
		}else{
			$('.fiveday_weather').slideUp('slow');
		}
     });
	 
	  
});		
	
	
	
	