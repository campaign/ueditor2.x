///import core
///commands 锚点
///commandsName  Anchor
///commandsTitle  锚点
///commandsDialog  dialogs\anchor
/**
 * 锚点
 * @function
 * @name baidu.editor.execCommands
 * @param {String} cmdName     cmdName="anchor"插入锚点
 */
UE.plugins['newdocument'] = function (){
    var me = this;
    me.commands['newdocument'] = {
        execCommand:function () {
            this.body.innerHTML = '<p>' + (browser.ie ? '&nbsp;' : '<br/>') + '</p>';
            this.reset();
            this.selection.getRange().setStart(this.body.firstChild,0).setCursor(false,true)
        },
        notNeedUndo:1
    };
    //快捷键
    me.addshortcutkey({
        "newdocument" : "ctrl+78" //ctrl+n
    });
};
