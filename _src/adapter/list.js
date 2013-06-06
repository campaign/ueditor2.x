UE.registerUI('insertorderedlist insertunorderedlist ',
    function(name) {
        var me = this;
        var $btn = $.eduisplitbutton({
            icon : name,
            caret:true,
            click : function(){

                me.execCommand(name,$dropmenu.edui().val())
            },
            title : this.getLang('labelMap')[name] || ''
        });
        var data = [];
        $.each(me.options[name],function(key,value){
            data.push({
                value : key,
                label:value
            })
        });

        var $dropmenu = $.eduidropmenu({'data':data,click:function(evt,val){
            $dropmenu.edui().hide();
            me.execCommand(name,val);
        }});
        $dropmenu.edui().on('beforeshow',function(){
            var val = me.queryCommandValue(name);
            this.val(val)
        });

        $btn.edui().mergeWith($dropmenu);

        this.addListener('selectionchange',function(){

            var state = this.queryCommandState(name);
            if(state != -1){
                var val = this.queryCommandValue(name);
                if(val){
                    $dropmenu.edui().val(val)
                }
            }else{
                $btn.edui().disabled(true)
            }

        });
        return $btn;
    }
);

