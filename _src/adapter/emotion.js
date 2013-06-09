/**
 * 表情
 */

UE.registerUI( 'emotion', function( name ){

    var editor = this,
        emotionUrl = editor.options.UEDITOR_HOME_URL + '/dialogs/emotion/emotion.html';

    emotionPopup = $.eduiemotion({
        url: emotionUrl
    });

    emotionPopup.on('beforeshow', function(){

        UE.setActiveWidget( emotionPopup );

    });

    return emotionPopup;

} );