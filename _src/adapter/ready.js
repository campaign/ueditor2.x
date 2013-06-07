/**
 * 编辑器ready统一入口
 */

UE.ready(function(){

    var editor = this;

    editor.addListener("delcells", function () {

        var tips = UE.getUI( editor, 'edittip');

        console.log(tips.edui())

        tips.show();

    });

});