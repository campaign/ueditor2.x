/**
 * @file adapter.js
 * @desc adapt ui to editor
 * @import core/Editor.js, core/utils.js
 */

(function () {
    var _editorUI = {},
        _editors = {},
        _readyFn = [],
        _activeEditor = null;

    function parseData(data, editor) {
        $.each(data, function (i, v) {
            if (v.label) {
                if(!v.icon){
                    v.icon = v.exec;
                }
                if(v.dialog){
                    v.exec = function(){
                        var dialog = $.proxy(_editorUI[v.dialog],editor, v.dialog,'menu')();
                        return function(){
                            if (!dialog.parent()[0]) {
                                editor.$container.find('.edui-dialog-container').append(dialog);
                            }
                            dialog.edui().show();
                            UE.setActiveEditor(editor);
                            editor.$activeDialog = dialog;
                        }
                    }();
                    v.query = $.proxy(function(cmdName){return this.queryCommandState(cmdName)},editor, v.dialog);
                }else {
                    if (v.data) {
                        $.each(v.data,function(i,data){
                           if(!data.exec && v.exec && $.type(v.exec) == 'string'){
                                data.exec = $.proxy(function(name,val){this.execCommand(name,val)},editor, v.exec, data.value||'')
                           }
                            if(!data.query && (!v.query || !$.isFunction(v.query))){
                                data.query = $.proxy(function(name,val){return this.queryCommandState(name,val)},editor, v.exec, data.value||'')
                            }
                        });

                        v.value = $.proxy(function(editor,name){
                            var root = this.root(),value = editor.queryCommandValue(name);
                            root.find('li').each(function(index,li){
                                var $li = $(li);
                                if($li.data('value') === value.toLowerCase()){
                                    $li.find('i').addClass('icon-ok')
                                }else{
                                    $li.find('i').removeClass('icon-ok')
                                }
                            })


                        },null,editor, v.exec);
                        parseData(v.data, editor,v);
                    } else {
                        var command;
                        if(v.widget && _editorUI[v.widget]) {
                            if(!v.query){
                                v.query = v.widget;
                            }
                            v.widget = $.proxy(_editorUI[v.widget],editor, v.widget,'menu')();
                            if($.type(v.query) == 'string'){
                                command = v.query;
                                v.query = $.proxy(function(name){return this.queryCommandState(name)},editor,command);
                            }
                        }else{
                            if ($.type(v.exec) == 'string') {
                                command = v.exec;
                                v.exec = $.proxy(function(name){this.execCommand(name)},editor,command);
                                if (!v.query) {
                                    v.query = $.proxy(function(name){return this.queryCommandState(name)},editor,command);
                                }
                            } else {
                                var fn = v.exec;
                                v.exec = $.proxy(fn, null, editor, v);
                                var queryfn = v.query;
                                v.query = $.proxy(queryfn, null, editor, v);
                            }
                        }

                    }
                }


            }
            if(v.shortkey){
                v.shortkey = v.shortkey.toUpperCase()
            }

        });
        return data;
    }

    utils.extend(UE, {
        registerUI: function (name, fn) {
            utils.each(name.split(/\s+/), function (uiname) {
                _editorUI[uiname] = fn;
            })
        },
        getUI:function(editor,name){
            var arg = Array.prototype.slice.call(arguments,1);
            if(_editorUI[name]){
                return $.proxy(_editorUI[name],editor,name)()
            }
            return null;
        },
        setActiveEditor:function(editor){
            _activeEditor = editor;
        },
        getActiveEditor: function () {
            var ac;
            utils.each(UE.instants, function (editor) {
                if (editor.selection.isFocus()) {
                    ac = editor;
                    return false;
                }
            });
            return ac || _activeEditor;
        },
        getEditor: function (id, options) {
            return _editors[id] || (_editors[id] = this.createEditor(id, options));

        },
        ready: function( fn ){
            _readyFn.push( fn );
        },
        createEditor: function (id, opt) {
            var editor = new UE.Editor(opt);

            utils.loadFile(document,{
                href: editor.options.themePath + editor.options.theme + "/" + editor.options.theme + '.css',
                tag:"link",
                type:"text/css",
                rel:"stylesheet"
            },function(){
                utils.loadFile(document,{
                    href: editor.options.themePath + "font/font.css",
                    tag:"link",
                    type:"text/css",
                    rel:"stylesheet"
                },function(){
                    utils.loadFile(document,{
                        href: editor.options.themePath + "base/ueditor.css",
                        tag:"link",
                        type:"text/css",
                        rel:"stylesheet"
                    })
                })
            });

            editor.langIsReady ? $.proxy(renderUI,this) : editor.addListener("langReady", $.proxy(renderUI,this));
            function renderUI(){
                var $container = this.createUI('#' + id, editor);

                editor.ready(function(){

                    $.each( _readyFn, function( index, fn ){

                        $.proxy( fn, editor )();

                    } );

                    this.addListener('click',function(){
                        $container.find('.dropdown-menu').each(function(){
                            $(this).edui().hide()
                        })
                    })
                });

                editor.render(id);
                $container.css({
                    width: $(editor.iframe).width()
                });

                //添加tooltip;
                $.eduitooltip('attachTo');
                $container.find('a').click(function(evt){
                    evt.preventDefault()
                })
            }


        },
        createUI: function (id, editor) {
            var $editorCont = $(id),
                $container = $('<div class="edui-container"><div class="edui-editor-body"></div><div class="edui-dialog-container"></div></div>').insertBefore($editorCont);
            editor.$container = $container;
            editor.container = $container.get();
            $container.find('.edui-editor-body').append($editorCont).before(this.createToolbar(editor.options, editor));

            if(editor.options.elementpath || editor.options.wordCount){
                var $bottombar = $('<div class="edui-bottombar"></div>');
                $container.append($bottombar);
                $bottombar.insertBefore($('.edui-dialog-container',$container));

            }
            if(editor.options.elementpath){
                $bottombar.append(this.getUI(editor,'elementpath'));
            }

            return $container;
        },
        createToolbar: function (options, editor) {
            var me = this;
            var $toolbar = $.eduitoolbar(), toolbar = $toolbar.edui();
            //创建下来菜单列表

            if (options.menulist) {
                $.each(options.menulist, function (i, v) {
                    $.eduicontextmenu(parseData(v.data, editor)).edui().attachTo(toolbar.appendToTextmenu(toolbar.createTextItem(v.label)));
                })
            } else {
                $toolbar.find('.edui-text-toolbar').remove()
            }

            if (options.toolbar) {

                $.each(options.toolbar,function(i,groupstr){
                    var btngroup = [];
                    $.each(groupstr.split(/\s+/),function(index,name){
                        var ui = me.getUI(editor,name);

                        ui && btngroup.push(ui);
                    });
                    toolbar.appendToBtnmenu(btngroup);
                });
                //收起menulist
                toolbar.appendToBtnmenu($.eduibutton({
                    icon:'expand',
                    click:function(){
                        var $i = this.root().find('i');
                        if($i.hasClass('icon-expand')){
                            $i[0].className = 'icon-collapse';
                            $toolbar.find('.edui-text-toolbar').slideUp(200);
                        }else{
                            $i[0].className = 'icon-expand';
                            $toolbar.find('.edui-text-toolbar').slideDown(200)
                        }
                    },
                    title:editor.getLang('collapsebtn')
                }),{'float':'right'})

            } else {
                $toolbar.find('.edui-btn-toolbar').remove()
            }
            return $toolbar;
        }

    })


})();


