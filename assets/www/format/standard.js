$(document).ready(function(){
	
	var ls_set_date;
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();
	if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} ls_set_date = mm + '/' + dd + '/'+ yyyy;
	
	document.addEventListener("online", function(){
		quizlet_sync(); 
		drive_sync(); 
		news_sync(); 
		localStorage["istate"] = 'online';
	}, false);
	document.addEventListener("offline", function(){
		localStorage["istate"] = 'offline';
	}, false);
	
	function quizlet_sync(){
	var quizlet_userpage='https://api.quizlet.com/2.0/users/alastairparagas?client_id=2FSQyKuhuG&&callback=?';
	$.getJSON(quizlet_userpage, function(qz_data){
		var setarray = new Array();
		for(i=0; i<20; i++){
			var qz_user = qz_data['username'];
			var qz_sets = qz_data.sets[i]['title'];
			var qz_id = qz_data.sets[i]['id'];
			var qz_termcount = qz_data.sets[i]['term_count'];
			setarray[0] = qz_id;
			setarray[1] = qz_sets;
			setarray[2] = qz_user;
			setarray[3] = qz_termcount;
			$('.quizlet_cards').append(
			"<a href='card.html?id=" + qz_id + "'><div class='quizlet_card'><h4>" + qz_sets + 
			" (" + qz_termcount + " terms)</h4><h5>" + qz_user + "<h5/></div></a>");
			localStorage["coalset" + i] = JSON.stringify(setarray);
		}
	});
	}
	
	function drive_sync(){
	var drive_list='http://www.myrighttoplay.com/rmecapc/requestDriveFiles.php';
	$.getJSON(drive_list, function(dr_data){
		for(i=0; i<dr_data.items.length; i++){
			var dr_title = dr_data.items[i]['title'];
			var dr_id = dr_data.items[i]['id'];
			var dr_download = dr_data.items[i]['webContentLink'];
			var dr_mimetype = dr_data.items[i]['mimeType'];
			var filesarray = new Array();
			filesarray[0] = dr_id;
			localStorage["coalfiles" + i] = JSON.stringify(filesarray);
			if(localStorage.getItem("coalfilesex" + dr_id) === null){
				var filesarrayex = new Array();
				filesarrayex[0] = dr_title;
				filesarrayex[1] = dr_download;
				filesarrayex[2] = 'no';
				filesarrayex[3] = '';
				filesarrayex[4] = dr_mimetype;
				localStorage["coalfilesex" + dr_id] = JSON.stringify(filesarrayex);
			}
		}
		localStorage["coalfilesllength"] = dr_data.items.length;
	});
	}
	
	function news_sync(){
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
	});
	}
	
});