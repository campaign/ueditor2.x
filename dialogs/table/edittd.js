/**
 * 单元格属性
 */

var tone = $G("J_tone"),
    colorPiker = $.eduicolorpicker({
        lang_clearColor: editor.getLang('clearColor') || '',
        lang_themeColor: editor.getLang('themeColor') || '',
        lang_standardColor: editor.getLang('standardColor') || ''
    }).edui().on('pickcolor', function( evt, color ){
        tone.value = color;
    });

var $frameElement = $(window.frameElement),
    $container = $frameElement.parents('.modal'),
    $dialogBody = $frameElement.parents('.edui-modal-body'),
    $tone = $(tone),
    toneHeight = $tone.outerHeight();


colorPiker.root().appendTo( $container );

colorPiker.show = function(){

    var inputOffset = $tone.offset(),
        frameOffset = $frameElement.position(),
        bodyOffset = $dialogBody.position();

    this.root().css({
        top: inputOffset.top + bodyOffset.top + frameOffset.top + toneHeight + 'px',
        left: inputOffset.left + bodyOffset.left + frameOffset.left + 'px'
    });

    this.root().css('display', 'block');

};

$tone.on('click', function( evt ){

    colorPiker.show();

    return false;

});

$container.on('click', function(){

    colorPiker.hide();

});

$(document).on("click", function(){

    colorPiker.hide();

});

dialog.on('hide', function(){
    tone.value = '';
});

dialog.on('ok', function(){
    editor.execCommand("edittd", tone.value);
});

dialog.on('show', function(){

    var start = editor.selection.getStart(),
        cell = start && domUtils.findParentByTagName(start, ["td", "th"], true);

    if(cell){

        var color = domUtils.getComputedStyle(cell,'background-color');

        if(/^#/.test(color)){
            tone.value = color;
        }

    }

});

dialog.trigger('show');