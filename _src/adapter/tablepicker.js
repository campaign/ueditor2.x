UE.registerUI('inserttable',
    /**
     * tablepicker UI注册
     * @param name 当前UI注册的名称
     * @param mode UI调用模式， 在toolbar上调用时传递的是'button'（这里如果是在toolbar上， 也可以不传mode值）, 在menu上调用传递的是'menu'， 默认是button。
     * @returns {dom} 根据不同的调用模式返回不同的对象
     *              mode值为：
     *                  button => 返回一个eduibutton对象
     *                  menu => 返回一个eduitablepicker对象
     */
    function( name, mode, item ) {

        var me = this,
            $btn = null;

        item && console.log(item.edui())

        //querycommand
        this.addListener('selectionchange',function(){
            var state = this.queryCommandState( name );
            $btn && $btn.edui().disabled( state == -1 ).active( state == 1 );
        });

        return mode === 'menu' ? $.eduitablepicker({
            mode: mode
        }).on('select', function( evt, row, col ){
                insertTable( row, col );
            }) :  ($btn = $.eduibutton({
            icon : 'inserttable',
            title: me.getLang("labelMap")[name],
            click : function() {

                var btnWidget = this;

                tablePickerWidget = btnWidget.data( 'tablepicker' );

                if( !tablePickerWidget ) {
                    tablePickerWidget = $.eduitablepicker({
                        mode: mode
                    }).eduitablepicker( "attachTo", btnWidget.root() ).on('select', function( evt, row, col ){
                        insertTable( row, col );
                    }).edui();
                    btnWidget.data( 'tablepicker', tablePickerWidget );
                }
                tablePickerWidget.on('show',function(){
                    UE.setActiveWidget(tablePickerWidget)
                });
                tablePickerWidget.show();

            }

        }));


        function insertTable( row, col ) {

            me.execCommand('inserttable', {
                numRows: row,
                numCols: col
            });

        }

    }

);