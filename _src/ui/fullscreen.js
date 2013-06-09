/**
 * 全屏功能实现
 */

(function(){

    //状态缓存
    var STATUS_CACHE = {},
        //状态值列表
        STATUS_LIST = [ 'width', 'height', 'position', 'top', 'left', 'margin', 'padding' ],
        CONTENT_AREA_STATUS = {},

        //编辑器缓存
        EDITOR_CACHE = [],

        //页面状态
        DOCUMENT_STATUS = {};

    UE.ui.define ( 'fullscreen' , {

        init: function( options ){

            initOption.call( this, options );
            this.supper.init.call( this, options );

            this.data('options', options);

            this.registerEditor( options.editor );

            this.listen();

        },
        toggle: function(){

            var editor = this.data('options').editor,
                //当前编辑器的缩放状态
                _edui_fullscreen_status = this.getEditorFullState( editor );

            //更新状态
            update.call( this, editor, !_edui_fullscreen_status );


            !_edui_fullscreen_status ? this.full( editor ) : this.restore( editor );

        },
        /**
         * 注册编辑器, 以便统一处理resize
         */
        registerEditor: function( editor ){

            EDITOR_CACHE.push( editor );

        },
        /**
         * 监听resize
         */
        listen: function(){

            var editor = null,
                me = this;

            if( UE._hasFullscreenListener ) {
                return;
            }

            UE._hasFullscreenListener = true;

            $( window ).on( 'resize', function(){

                for( var i = 0, len = EDITOR_CACHE.length; i < len; i++ ) {

                    editor = EDITOR_CACHE[ i ];

                    //处于全屏状态才执行resize
                    if( me.getEditorFullState( editor ) ) {

                        me.resize( editor );

                    }

                }

                editor = null;

            } );

        },
        /**
         * 调整给定编辑器的大小
         * @param editor 给定的编辑器对象
         */
        resize: function( editor ){

            var $win = $( window ),
                width = $win.width(),
                height = $win.height();

            $( editor.container ).css( {
                width: width + 'px',
                height: height + 'px'
            } );

            $( this.getEditorHolder( editor ) ).css( {
                width: width + 'px',
                height: height - $( '.edui-toolbar', editor.container ).outerHeight() - $( '.edui-bottombar', editor.container).outerHeight() + 'px'
            } );

        },
        /**
         * 放大
         * @param 执行放大的编辑器
         */
        full: function( editor ){

            var $win = $(window);

            this.saveSataus( editor );

            this.getEditorDocument( editor ).style.overflow = 'hidden';

            var width = $win.width(),
                height = $win.height();

            $( editor.container ).css( {
                width: width + 'px',
                height: height + 'px',
                position: 'fixed',
                top: 0,
                left: 0,
                margin: 0,
                padding: 0
            } );

            $( this.getEditorHolder( editor ) ).css({
                width: width + 'px',
                height: height - $( '.edui-toolbar', editor.container ).outerHeight() - $( '.edui-bottombar', editor.container).outerHeight() + 'px'
            });

        },
        restore: function( editor ){

            var status = this.getEditorStatus( editor );

            $( editor.container ).css( status );

            this.restoreContentAreaStatus( editor );

            this.restoreDocumentStatus( editor );

        },
        /**
         * 保存状态
         */
        saveSataus: function( editor ){

            var styles = editor.container.style,
                tmp = null,
                cache = {};

            for( var i= 0, len = STATUS_LIST.length; i<len; i++ ) {

                tmp = STATUS_LIST[ i ];
                cache[ tmp ] = styles[ tmp ];

            }

            STATUS_CACHE[ editor.uid ] = cache;

            this.saveContentAreaStatus( editor );
            this.saveDocumentStatus( editor );

        },
        saveContentAreaStatus: function( editor ){

            var style = this.getEditorHolder( editor ).style;

            CONTENT_AREA_STATUS[ editor.uid ] = {
                width: style.width,
                height: style.height
            };

        },
        /**
         * 保存与指定editor相关的页面的状态
         * @param editor 指定的编辑器实例
         */
        saveDocumentStatus: function( editor ){

            var $doc = $( this.getEditorDocument( editor ) );

            DOCUMENT_STATUS[ editor.uid ] = {
                overflow: $doc.css( 'overflow' )
            };

        },
        /**
         * 恢复编辑区状态
         */
        restoreContentAreaStatus: function( editor ){

            var status = this.getContentAreaStatus( editor),
                $contentArea = $( this.getEditorHolder( editor ) );

            $contentArea.css( status );

        },
        /**
         * 恢复页面状态
         */
        restoreDocumentStatus: function( editor ) {

            var status = this.getDocumentStatus( editor),
                $doc = $( this.getEditorDocument( editor ) );

            $doc.css( 'overflow', status.overflow );

        },
        /**
         * 根据提供的编辑器获取编辑器的全屏状态
         * @param editor 指定的编辑器
         * @returns {boolean} 是否处于全屏状态
         */
        getEditorFullState: function( editor ){
            return !!editor._edui_fullscreen_status;
        },
        /**
         * 获取编辑器状态
         * @param editor 指定的编辑器对象
         */
        getEditorStatus: function( editor ){

            return STATUS_CACHE[ editor.uid ];

        },
        getContentAreaStatus: function( editor ){

            return CONTENT_AREA_STATUS[ editor.uid ];

        },
        getEditorDocument: function( editor ){

            return editor.container.ownerDocument.body;

        },
        /**
         * 获取编辑区包裹对象
         */
        getEditorHolder: function( editor ){

            return editor.iframe.parentNode;

        },
        /**
         * 获取编辑器状态
         * @param editor
         * @returns {*}
         */
        getDocumentStatus: function( editor ){

            return DOCUMENT_STATUS[ editor.uid ];

        }

    }, 'button');

    function initOption( options ) {

        options.click = this.toggle;
        options.icon = 'resize-full';

    }

    /**
     * 更新状态
     * @param editor 编辑器对象
     * @param isFull 当前状态是否是全盘状态
     */
    function update( editor, isFull ) {

        editor._edui_fullscreen_status = isFull;
        this.root().find('.edui-icon').toggleClass( 'icon-resize-full').toggleClass( 'icon-resize-small' );

    }

})();