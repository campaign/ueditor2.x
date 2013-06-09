/**
 * 全屏组件
 */

(function(){

    UE.registerUI('fullscreen', function( name ){

        var editor = this;

        title = editor.getLang("labelMap.fullscreen") || '';

        var $fullscreen = $.eduifullscreen({
            title: title,
            editor: editor
        });

        return $fullscreen;

    });

})();