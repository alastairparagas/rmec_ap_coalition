$(document).ready(function(){


	document.addEventListener("online", function(){quizlet_sync();}, false);
	document.addEventListener("offline", function(){quizlet_off();}, false);

	
	$('.menu').click(function(){
		if($('.menu_bar').css('display') == 'none'){
			$('.menu_bar').slideDown('slow');
		}else{
			$('.menu_bar').slideUp('slow');
		}
	});
	
	function quizlet_sync(){
	$(".quizlet_cards").empty();
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
			localStorage["coalset" + i] = JSON.stringify(setarray);
		}
		quizlet_off();
	});
	}
	
	function quizlet_off(){
		for(i=0; i<20; i++){
			var setarray = JSON.parse(localStorage["coalset" + i]);
			var qz_id = setarray[0];
			var qz_sets = setarray[1];
			var qz_user = setarray[2];
			var qz_termcount = setarray[3];
			$('.quizlet_cards').append(
			"<a href='card.html?id=" + qz_id + "'><div class='quizlet_card'><h4>" + qz_sets + 
			" (" + qz_termcount + " terms)</h4><h5>" + qz_user + "<h5/></div></a>");
		}
	}

});