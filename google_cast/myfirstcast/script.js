(function(){
    
    var mSession = null;
    
    $(document).ready(function() {
        
        $('#castme').click(function(){
            loadMedia();
        })
        
        if (!chrome.cast || !chrome.cast.isAvailable) {
            setTimeout(initializeCastApi, 1000);
            return;
        }
        
        function initializeCastApi() {
            
             console.log('initializeCastApi');
            
            // default set to the default media receiver app ID
            // optional: you may change it to point to your own
            var applicationID = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
            //var applicationID = '4F8B3483';

            // auto join policy can be one of the following three
            var autoJoinPolicy = chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED;

            // request session
            var sessionRequest = new chrome.cast.SessionRequest(applicationID);
            var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
                sessionListener,
                receiverListener,
                autoJoinPolicy);

            chrome.cast.initialize(apiConfig, onInitSuccess, onError);
        }
        
        function onInitSuccess(){
            console.log('onInitSuccess');
            launchApp();
        }
        
        function onError(){
            console.log('onError');
        }
        
        function sessionListener(e){
            mSession = e;
            if( mSession ) {
                
                console.log('media session created with id: ' + e.sessionId)
                
                if( mSession.media.length != 0) {
                    onMediaDiscovered('onRequestSessionSuccess', mSession.media[0]);                  
                }
                mSession.addMediaListener(onMediaDiscovered.bind(this, 'addMediaListener'));
                //mSession.addUpdateListener(sessionUpdateListener.bind(this));
            }
        }
        
        function receiverListener(e) {
            if( e === 'available' ) {
                console.log("receiver found");
            }
            else {
                console.log("receiver list empty");
            }
        }
        
        function onMediaDiscovered(how, mediaSession) {
            console.log("new media session ID:" + mediaSession.mediaSessionId + ' (' + how + ')');
        }
        
        function launchApp() {
            chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
        }
        
        function onRequestSessionSuccess(e){
            console.log('onRequestSessionSuccess ' +  e.sessionId);
            mSession = e;
        }
        
        function onLaunchError(){
            console.log('onLaunchError');            
        }
        
        function loadMedia(){
            var mediaInfo = new chrome.cast.media.MediaInfo('http://weknowyourdreams.com/images/cat/cat-02.jpg', 'image/jpg'); 
            mediaInfo.metadata = chrome.cast.media.MetadataType.PHOTO;
            mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.PHOTO;
            mediaInfo.contentType = 'image/jpg';
            
            var request = new chrome.cast.media.LoadRequest(mediaInfo);
            mSession.loadMedia(request, onMediaDiscovered.bind(this, 'loadMedia'), onMediaError.bind(this));
                       
        }
        
        function onMediaError(e){
            console.log('onMediaError:' + e);
            
        }
        
        launchApp();
        
    });
    
})();
