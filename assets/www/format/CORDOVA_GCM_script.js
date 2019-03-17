 gApp = new Array();

gApp.deviceready = false;
gApp.gcmregid = '';
localStorage["firsttime"]='';

window.onbeforeunload  =  function(e) {

    if ( gApp.gcmregid.length > 0 )
    {
      // The same routines are called for success/fail on the unregister. You can make them unique if you like
      window.GCM.unregister( GCM_Success, GCM_Fail );      // close the GCM

    }
};


document.addEventListener('online', function() {
	if(localStorage["firsttime"] == ''){
		gApp.DeviceReady = true;
		window.GCM.register("65044067606", "GCM_Event", GCM_Success, GCM_Fail );
		localStorage["firsttime"] = '1';
	}
}, false );


function
GCM_Event(e)
{
  switch( e.event )
  {
  case 'registered':
    gApp.gcmregid = e.regid;
    if ( gApp.gcmregid.length > 0 )
    {
		$.get('http://www.myrighttoplay.com/rmecapc/get_device_id.php?auth_id=coalitionforthewin&device_id='+e.regid, function(){});

    }
    break
  case 'message':

    $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.message + '</li>');

    $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.msgcnt + '</li>');


    break;


  case 'error':

    $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');

    break;



  default:
    $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');

    break;
  }
}

function
GCM_Success(e)
{
  $("#app-status-ul").append('<li>GCM_Success -> We have successfully registered and called the GCM plugin, waiting for GCM_Event:registered -> REGID back from Google</li>');

}

function
GCM_Fail(e)
{
  $("#app-status-ul").append('<li>GCM_Fail -> GCM plugin failed to register</li>');

  $("#app-status-ul").append('<li>GCM_Fail -> ' + e.msg + '</li>');

}

