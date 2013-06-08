/**
 * font相关组件
 */


UE.registerUI('fontfamily', function( name ) {

        var me = this,
            $fontCombobox = $.eduicombobox({
                label: '字体',
                recordStack: [],
                mode: 'fontFamily',
                items: me.options.fontfamily
            }).eduicombobox('on', 'comboboxselect', function( evt, res ){
                    me.execCommand( name, res.value );
                }),
            $btn = $fontCombobox.eduicombobox('box');

        //querycommand
        this.addListener('selectionchange',function(){

            //设置按钮状态
            var state = this.queryCommandState( name );
            $btn.edui().disabled( state == -1 ).active( state == 1 );

            //设置当前字体
            var fontFamily = this.queryCommandValue( name );

            fontFamily = fontFamily.replace(/^\s*['|"]|['|"]\s*$/g, '');

            $fontCombobox.eduicombobox( 'selectItemByLabel', fontFamily.split(/['|"]?\s*,\s*[\1]?/) );

        });

        return $btn;

    }

);



UE.registerUI('fontsize', function( name ) {

        var me = this,
            $fontCombobox = $.eduicombobox({
                label: '字号',
                autorecord: false,
                mode: 'fontsize',
                items: me.options.fontsize
            }),
            $btn = $fontCombobox.eduicombobox('box').eduicombobox('on', 'comboboxselect', function(evt, res) {

                me.execCommand( name, res.value + 'px' );

            });

        //querycommand
        this.addListener('selectionchange',function(){

            var state = this.queryCommandState( name );
            $btn.edui().disabled( state == -1 ).active( state == 1 );

            //值反射
            var fontSize = this.queryCommandValue( name );

            $fontCombobox.eduicombobox( 'selectItemByLabel', fontSize.replace('px', '') );

        });

        return $btn;

    }

);


UE.registerUI('forecolor',
    function( name ) {

        var me = this,
            colorPickerWidget = null,
            fontIcon = null,
            $btn = null;

        //querycommand
        this.addListener('selectionchange',function(){

            //更新按钮状态
            var state = this.queryCommandState( name );
            $btn.edui().disabled( state == -1 ).active( state == 1 );

            //更新颜色
            fontIcon.css( "color", this.queryCommandValue( name ) );


        });

        $btn = $.eduisplitbutton({
            icon: 'font',
            caret: true,
            click: function() {
                me.execCommand( name, getCurrentColor() );
            }
        });

        fontIcon = $btn.find(".icon-font");

        colorPickerWidget = $.eduicolorpicker({
            lang_clearColor: me.getLang('clearColor') || '',
            lang_themeColor: me.getLang('themeColor') || '',
            lang_standardColor: me.getLang('standardColor') || ''
        }).eduitablepicker( "attachTo", $btn ).edui().on('pickcolor', function( evt, color ){
                fontIcon.css("color", color);
                me.execCommand( name, color );
            });
        colorPickerWidget.on('show',function(){
            UE.setActiveWidget(colorPickerWidget.root())
        });
        $btn.edui().mergeWith( colorPickerWidget.root() );

        return $btn;

        function getCurrentColor() {
            return domUtils.getComputedStyle( fontIcon[0], 'color' );
        }

    }

);


UE.registerUI('backcolor',
    function( name ) {

        var me = this,
            colorPickerWidget = null,
            fontIcon = null,
            $btn = null;

        //querycommand
        this.addListener('selectionchange',function(){
            var state = this.queryCommandState( name );
            $btn.edui().disabled( state == -1 ).active( state == 1 );

//            updateColor( this.queryCommandValue( name ) );

        });

        $btn = $.eduisplitbutton({
            icon: 'font',
            caret: true,
            click: function() {
                me.execCommand( name, getCurrentColor() );
            }
        });

        fontIcon = $btn.find(".icon-font");

        colorPickerWidget = $.eduicolorpicker({
            lang_clearColor: me.getLang('clearColor') || '',
            lang_themeColor: me.getLang('themeColor') || '',
            lang_standardColor: me.getLang('standardColor') || ''
        }).eduitablepicker( "attachTo", $btn ).edui().on('pickcolor', function( evt, color ){
            });

        $btn.edui().mergeWith( colorPickerWidget.root() );
        colorPickerWidget.on('show',function(){
            UE.setActiveWidget(colorPickerWidget.root())
        });
        return $btn;

        function getCurrentColor() {
            return domUtils.getComputedStyle( fontIcon[0], 'color' );
        }

    }

);