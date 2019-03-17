$(document).ready(function(){

	document.addEventListener("online", function(){drive_sync(); localStorage["istate"] = 'online';}, false);
	document.addEventListener("offline", function(){drive_off(); localStorage["istate"] = 'offline';}, false);

	$('.menu').click(function(){
		if($('.menu_bar').css('display') == 'none'){
			$('.menu_bar').slideDown('slow');
		}else{
			$('.menu_bar').slideUp('slow');
		}
	});
	
	function drive_sync(){
	$(".drive_docs").empty();
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
		drive_off();
	});
	}
	
	function drive_off(){
	$(".drive_docs").empty();
		for(i=0; i<localStorage["coalfilesllength"]; i++){
			var filesarray = JSON.parse(localStorage["coalfiles" + i]);
			var dr_id = filesarray[0];
			var filesarrayex = JSON.parse(localStorage["coalfilesex" + dr_id]);
			var dr_title = filesarrayex[0];
			var dr_download = filesarrayex[1];
			var dr_downloaded = filesarrayex[2];
			var dr_filelink = filesarrayex[3];
			var dr_mimetype = filesarrayex[4];
			if(dr_downloaded == 'yes'){
				$('.drive_docs').append(
				"<a href='" + dr_filelink + "'><div class='drive_doc' id='" + i + "'><h4>" + dr_title +
				"<h5>Tap to open saved file<h5/></div></a>");
			}else{
				$('.drive_docs').append(
				"<div class='drive_doc' id='" + i + "'><h4>" + dr_title + 
				"<h5>Tap to download<h5/></div>");
			}
		}
		$(".drive_doc").on("click", function(event){driveDocClick($(this).attr("id"));});
	}
	
	function driveDocClick(i){
		var filesarray = JSON.parse(localStorage["coalfiles" + i]);
		var dr_id = filesarray[0];
		var filesarrayex = JSON.parse(localStorage["coalfilesex" + dr_id]);
		var dr_title = filesarrayex[0];
		var dr_download = filesarrayex[1];
		var dr_downloaded = filesarrayex[2];
		var dr_filelink = filesarrayex[3];
		if(dr_downloaded == 'yes'){
			openDriveFile(dr_id);
		}else{
			if(localStorage["istate"] == 'online'){
				downloadFilego(dr_id);
			}else{
				navigator.notification.alert('Internet has to be on to save files.', drive_off, 'Offline State','Okay');
			}
		}
	}
	
	function downloadFilego(dr_id){
		navigator.notification.alert('Beginning File downloading process. Please wait.', drive_off, 'Downloading File','Okay')
		var filesarrayex = JSON.parse(localStorage["coalfilesex" + dr_id]);
		var dr_title = filesarrayex[0];
		var dr_title = dr_title.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
		var dr_download = filesarrayex[1];
		window.requestFileSystem(
			LocalFileSystem.PERSISTENT, 0, 
			function onFileSystemSuccess(fileSystem){
				fileSystem.root.getFile(
					"dummy.txt", {create: true, exclusive: false}, 
					function gotFileEntry(fileEntry) {
						var sPath = fileEntry.fullPath.replace("dummy.txt","");
						var fileTransfer = new FileTransfer();
						fileEntry.remove();

						fileTransfer.download(
							dr_download,
							sPath + dr_title,
							function(theFile) {
								console.log("download complete: " + theFile.toURL());
								downloadFileafter(theFile.toURL(), dr_id);
							},
							function(error) {
								console.log("download error source " + error.source);
								console.log("download error target " + error.target);
								console.log("upload error code: " + error.code);
							}, true
						);
					},
					function errorHandler(){
						navigator.notification.alert('File System Directory untraceable.', drive_off, 'Error Downloading','Okay');
					}
				);
			}, 
		null);
	}
	
	function downloadFileafter(file_link, dr_id){
		var filesarray = JSON.parse(localStorage["coalfilesex" + dr_id]);
		filesarray[2] = 'yes';
		filesarray[3] = file_link;
		localStorage["coalfilesex" + dr_id] = JSON.stringify(filesarray);
		navigator.notification.alert('File Succesfully downloaded. Now stored offline.', drive_off, 'File Downloaded','Okay');
		drive_off();
	}
	
	function openDriveFile(dr_id){
		var filesarray = JSON.parse(localStorage["coalfilesex" + dr_id]);
		var file_link = filesarray[3];
		var dr_mimetype = filesarray[4];
		window.plugins.webintent.startActivity({
		action: webintent.ACTION_VIEW,
		type: dr_mimetype,
		url: file_link}, 
		function(success){navigator.notification.alert('Opening with your default reader. File at ' + file_link, drive_off, 'Opening','Okay');}, 
		function(error){navigator.notification.alert('File cannot be opened. Reason: ' + error, drive_off, 'Error Opening','Okay');});
	}
			

});