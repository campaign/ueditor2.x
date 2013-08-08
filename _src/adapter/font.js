/**
 * font相关组件
 */

UE.registerUI('fontfamily fontsize', function( name ) {

    var me = this,
        $combobox = $.eduibuttoncombobox( transOption( {
            label: me.getLang("labelMap")[ name ],
            title: me.getLang("labelMap")[ name ],
            items: me.options[ name ],
            name: name
        } )).eduicombobox('on', 'comboboxselect', function( evt, res ){
                if ( name === 'fontsize' ) {
                    res.value += "px";
                }
                me.execCommand( name, res.value );
            }),
        $btn = $combobox.eduicombobox('button');

    //querycommand
    this.addListener('selectionchange',function(){

        //设置按钮状态
        var state = this.queryCommandState( name),
            val = this.queryCommandValue( name );


        $btn.edui().disabled( state == -1 ).active( state == 1 );

        val = val.replace(/^\s*['|"]|['|"]\s*$/g, '').split(/['|"]?\s*,\s*[\1]?/);

        if ( name === 'fontsize' ) {
            val = parseInt( val, 10 );
        }

        $combobox.eduicombobox( 'selectItemByLabel', val );

    });

    return $btn;


    //参数转换
    function transOption ( options ) {

        switch ( name ) {

            case 'fontfamily':
                return fontFamilyAdaptation( options );

            case 'fontsize':
                return fontSizeAdaption( options );

        }

    }

    //字体参数调整
    function fontFamilyAdaptation( options ) {

        var fontFamily = options.items,
            temp = null,
            tempItems = [];

        options.itemStyles = [];
        options.value = [];

        options.autowidthitem = [];

        for( var i = 0, len = fontFamily.length; i < len; i++ ) {

            temp = fontFamily[ i ].val;
            tempItems.push( temp.split(/\s*,\s*/)[0] );
            options.itemStyles.push('font-family: ' + temp);
            options.value.push( temp );

        }

        options.items = tempItems;

        return options;

    }

    //字体大小
    function fontSizeAdaption( options ) {

        var fontSize = options.items,
            temp = null,
            tempItems = [];

        options.itemStyles = [];
        options.value = [];
        options.autoRecord = false;

        for( var i = 0, len = fontSize.length; i < len; i++ ) {

            temp = fontSize[ i ];
            tempItems.push( temp );
            options.itemStyles.push('font-size: ' + temp +'px');

        }

        options.value = options.items;
        options.items = tempItems;

        return options;

    }

});


UE.registerUI( 'forecolor backcolor', function( name ) {

        var me = this,
            colorPickerWidget = null,
            fontIcon = null,
            $btn = null;

        //querycommand
        this.addListener('selectionchange',function(){

            var state = this.queryCommandState( name );
            $btn.edui().disabled( state == -1 ).active( state == 1 );

        });

        $btn = $.eduisplitbutton({
            icon: 'font',
            caret: true,
            title: me.getLang("labelMap")[name],
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
                window.setTimeout( function(){
                    fontIcon.css("color", color);
                    me.execCommand( name, color );
                }, 0 );
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