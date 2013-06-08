(function(){
    var iframeUrlMap = {
        'anchor':'anchor/anchor.html',
        'insertimage':'image/image.html',
        'link':'link/link.html',
        'spechars':'spechars/spechars.html',
        'searchreplace':'searchreplace/searchreplace.html',
        'map':'map/map.html',
        'gmap':'gmap/gmap.html',
        'insertvideo':'video/video.html',
        'help':'help/help.html',
        'emotion':'emotion/emotion.html',
        'wordimage':'wordimage/wordimage.html',
        'attachment':'attachment/attachment.html',
        'insertframe':'insertframe/insertframe.html',
        'edittip':'table/edittip.html',
        'edittable':'table/edittable.html',
        'edittd':'table/edittd.html',
        'snapscreen':'snapscreen/snapscreen.html',
        'scrawl':'scrawl/scrawl.html',
        'music':'music/music.html',
        'background':'background/background.html'
    };
    UE.registerUI('link insertimage edittable edittd edittip insertvideo music searchreplace map gmap',
        function (name, mode) {

            var me = this,
                currentRange,
                dialog = $.eduimodal({
                    title: (me.options.labelMap && me.options.labelMap[name]) || me.getLang("labelMap." + name),
                    url: me.options.UEDITOR_HOME_URL + '/dialogs/' + (me.options.iframeUrlMap[name] || iframeUrlMap[name]),
                    oklabel: me.getLang('ok'),
                    cancellabel: me.getLang('cancel')
                });

            dialog.attr('id', 'edui-' + name).find('.modal-body').addClass('edui-' + name + '-body');

            dialog.edui().on('hide', function () {
                var rng = me.selection.getRange();
                if (rng.equals(currentRange)) {
                    rng.select()
                }
            }).on('show',function(){
                currentRange = me.selection.getRange();
            });

            if(mode == 'menu'){
                return dialog;
            }else{
                var $btn = $.eduibutton({
                    icon: name,
                    click: function () {
                        if (!dialog.parent()[0]) {
                            me.$container.find('.edui-dialog-container').append(dialog);
                        }
                        dialog.edui().show();
                        UE.setActiveEditor(me);
                        me.$activeDialog = dialog;
                    },
                    title: this.getLang('labelMap')[name] || ''
                });

                me.addListener('selectionchange', function () {
                    var state = this.queryCommandState(name);
                    $btn.edui().disabled(state == -1).active(state == 1)
                });
                return $btn;
            }

        }
    );

})();

