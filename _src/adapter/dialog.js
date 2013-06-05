UE.registerUI('link',
    function (name, mode) {
        var me = this,
            currentRange,
            dialog = $.eduimodal({
                title: (me.options.labelMap && me.options.labelMap[name]) || me.getLang("labelMap." + name),
                url: me.options.UEDITOR_HOME_URL + '/dialogs/' + name + '/' + name + '.html',
                oklabel: me.getLang('ok'),
                cancellabel: me.getLang('cancel')
            }).attr('id', name);

        dialog.edui().on('hide', function () {
            var rng = me.selection.getRange();
            if (rng.equals(currentRange)) {
                rng.select()
            }
        });
        var $btn = $.eduibutton({
            icon: name,
            click: function () {
                currentRange = me.selection.getRange();
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
);

