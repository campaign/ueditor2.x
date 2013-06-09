/*tab 类*/
UE.ui.define ( 'tab' , {
    init : function ( options ) {
        var me = this,
            slr = options.selector;

        if ( $.type ( slr ) ) {
            me.root ( $ ( slr , options.context ) );
            me.data ( "context" , options.context );

            $ ( slr , me.data ( "context" ) ).on ( 'click' , function ( e ) {
                e.preventDefault ()
                me.show ( e )
            } )
        }
    } ,
    show : function ( e ) {

        var me = this,
            $cur = $ ( e.target ),
            $ul = $cur.closest ( 'ul' ),
            selector,
            previous,
            $target,
            e;

        selector = $cur.attr ( 'href' );
        selector = selector && selector.replace ( /.*(?=#[^\s]*$)/ , '' );

        var $tmp = $cur.parent ( 'li' );

        if ( ! $tmp.length || $tmp.hasClass ( 'active' ) ) return;

        previous = $ul.find ( '.active:last a' )[0];

        e = $.Event ( 'beforeshow' , {
            target: $cur[0],
            relatedTarget : previous
        } );

        me.trigger ( e );

        if ( e.isDefaultPrevented () ) return;

        $target = $ ( selector , me.data ( "context" ) );

        me.activate ( $cur.parent ( 'li' ) , $ul );
        me.activate ( $target , $target.parent () , function () {
            me.trigger ( {
                type : 'aftershow' , relatedTarget : previous
            } )
        } );
    } ,
    activate : function ( element , container , callback ) {
        var $active = container.find ( '> .active' );

        $active.removeClass ( 'active' );

        element.addClass ( 'active' );

        callback && callback ();
    }
} );

