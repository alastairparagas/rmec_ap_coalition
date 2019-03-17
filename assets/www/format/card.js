$(document).ready(function(){
	
	$('.menu').click(function(){
		if($('.menu_bar').css('display') == 'none'){
			$('.menu_bar').slideDown('slow');
		}else{
			$('.menu_bar').slideUp('slow');
		}
	});
	
	$( '.row:first' ).on( 'click', 'h5', function () {save_cards();});
	
	function getparam(name) {
		return decodeURI(
			(RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
		);
	}
	
	function getcards(){
	$(".quizlet_cards").empty();
	var set_id = getparam("id");
	var quizlet_setpage='https://api.quizlet.com/2.0/sets/' + set_id + '?client_id=2FSQyKuhuG&&callback=?';
	$.getJSON(quizlet_setpage, function(qz_data){
		var qz_title = qz_data['title'];
		var qz_termcount = qz_data['term_count'];
		if(localStorage.getItem("coalcard" + set_id) === null){
			$('.quizlet_header').html(
			"<h4>" + qz_title + " (" + qz_termcount + " terms)</h4><h5 class='save_offline'>Save Offline</h5>");
		}else{
			$('.quizlet_header').html(
			"<h4>" + qz_title + " (" + qz_termcount + " terms)</h4>");
		}
		for(i=0; i <= qz_termcount; i++){
			var qz_term = qz_data.terms[i]['term'];
			var qz_definition = qz_data.terms[i]['definition'];
			$('.quizlet_cards').append(
			"<div class='quizlet_card " + i + "'><h4>" + qz_term + 
			"</h4><h5>" + qz_definition + "<h5/></div>");
		}
	});
	}
	
	function save_cards(){
	var set_id = getparam("id");
	var quizlet_setpage='https://api.quizlet.com/2.0/sets/' + set_id + '?client_id=2FSQyKuhuG&&callback=?';
	$.getJSON(quizlet_setpage, function(qz_data){
		var qz_title = qz_data['title'];
		var qz_termcount = qz_data['term_count'];
		var cardsarray = new Array();
		cardsarray[0] = qz_title;
		cardsarray[1] = qz_termcount;
		cardsarray[2] = set_id;
		var cards_array = new Array();
		for(i=0; i < qz_termcount; i++){
			var qz_term = qz_data.terms[i]['term'];
			var qz_definition = qz_data.terms[i]['definition'];
			var qz_comb = qz_term + "|||" + qz_definition;
			cards_array.push(qz_comb);
		}
		cardsarray[3] = JSON.stringify(cards_array);
		localStorage["coalcard" + set_id] = JSON.stringify(cardsarray);
	});
	navigator.notification.alert('Cards were saved for offline use.', cards_ol,'Saved','Okay');
	}
	
	function cards_ol(){
	$(".quizlet_cards").empty();
	var set_id = getparam("id");
	var cardsarray = JSON.parse(localStorage["coalcard" + set_id]);
	var qz_title = cardsarray[0];
	var qz_termcount = cardsarray[1];
	var set_id = cardsarray[2];
	var cards_array = JSON.parse(cardsarray[3]);
	var cards_count = cards_array.length;
	$('.row:first').html(
		"<div class='quizlet_header'><h4>" + qz_title + " (" + qz_termcount + " terms)</h4></div>" +
		"<div class='quizlet_cards'></div><div class='clearer'></div>");
	for(i=0; i < cards_count; i++){
			var qz_comb = cards_array[i].split("|||");
			var qz_term = qz_comb[0];
			var qz_definition = qz_comb[1];
			var qz_comb = qz_term + "|||" + qz_definition;
			cards_array.push(qz_comb);
			$('.quizlet_cards').append(
			"<div class='quizlet_card " + i + "'><h4>" + qz_term + 
			"</h4><h5>" + qz_definition + "<h5/></div>");
		}
	}
	
	document.addEventListener("online", function(){getcards();}, false);
	document.addEventListener("offline", function(){cards_ol();}, false);

});