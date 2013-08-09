/**
 * buttoncombobox 实现了button和combobox的统一封装
 */

(function(){

    var widgetName = 'buttoncombobox';

    UE.ui.define( widgetName, {

        defaultOpt: {
            //按钮初始文字
            label: '',
            title: '',
            name: ''
        },
        init: function( options ){

            var me = this,
                btnWidget = $.eduibutton({
                    caret: true,
                    title: options.title,
                    name: options.name,
                    text: options.label,
                    click: function(){
                        me.show();
                    }
                });

            me.supper.init.call( me, options );

            //监听change， 改变button显示内容
            me.on('beforechange', function( e, label ){
                btnWidget.eduibutton('label', label );
            });

            me.data( 'button', btnWidget );

            me.attachTo( btnWidget )

        },
        button: function(){
            return this.data( 'button' );
        }

    }, 'combobox' );

})();
