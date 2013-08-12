//scale 类
UE.ui.define('scale', {
    tpl: '<div class="edui-scale" unselectable="on">' +
        '<div class="edui-scale-cover"></div>' +
        '<span class="edui-scale-hand0"></span>' +
        '<span class="edui-scale-hand1"></span>' +
        '<span class="edui-scale-hand2"></span>' +
        '<span class="edui-scale-hand3"></span>' +
        '<span class="edui-scale-hand4"></span>' +
        '<span class="edui-scale-hand5"></span>' +
        '<span class="edui-scale-hand6"></span>' +
        '<span class="edui-scale-hand7"></span>' +
        '</div>',
    defaultOpt: {
        $doc: $(document),
        $wrap: $(document)
    },
    init: function (options) {
        if(options.$doc) this.defaultOpt.$doc = options.$doc;
        if(options.$wrap) this.defaultOpt.$wrap = options.$wrap;
        this.root($($.parseTmpl(this.tpl, options)));
        this.$cover = this.root().find('.edui-scale-cover');
        this.initStyle();
        this.startPos = this.prePos = {x: 0, y: 0};
        this.dragId = -1;

        this.$cover.on('mousedown', $.proxy(this.hide(), this));
        return this;
    },
    initStyle: function () {
        utils.cssRule('scale', '.edui-scale{display:none;position:absolute;border:1px solid #38B2CE;cursor:hand;}' +
            '.edui-scale span{position:absolute;left:0;top:0;width:7px;height:7px;overflow:hidden;font-size:0px;display:block;background-color:#3C9DD0;}'
            + '.edui-scale .edui-scale-hand0{cursor:nw-resize;top:0;margin-top:-4px;left:0;margin-left:-4px;}'
            + '.edui-scale .edui-scale-hand1{cursor:n-resize;top:0;margin-top:-4px;left:50%;margin-left:-4px;}'
            + '.edui-scale .edui-scale-hand2{cursor:ne-resize;top:0;margin-top:-4px;left:100%;margin-left:-3px;}'
            + '.edui-scale .edui-scale-hand3{cursor:w-resize;top:50%;margin-top:-4px;left:0;margin-left:-4px;}'
            + '.edui-scale .edui-scale-hand4{cursor:e-resize;top:50%;margin-top:-4px;left:100%;margin-left:-3px;}'
            + '.edui-scale .edui-scale-hand5{cursor:sw-resize;top:100%;margin-top:-3px;left:0;margin-left:-4px;}'
            + '.edui-scale .edui-scale-hand6{cursor:s-resize;top:100%;margin-top:-3px;left:50%;margin-left:-4px;}'
            + '.edui-scale .edui-scale-hand7{cursor:se-resize;top:100%;margin-top:-3px;left:100%;margin-left:-3px;}');
    },
    _eventHandler: function (e) {
        var me = this,
            $doc = me.defaultOpt.$doc;
        switch (e.type) {
            case 'mousedown':
                var hand = e.target || e.srcElement, hand;
                if (hand.className.indexOf('edui-scale-hand') != -1) {
                    me.dragId = hand.className.slice(-1);
                    me.startPos.x = me.prePos.x = e.clientX;
                    me.startPos.y = me.prePos.y = e.clientY;
                    $doc.bind('mousemove', $.proxy(me._eventHandler, me));
                    me.showCover();
                }
                break;
            case 'mousemove':
                if (me.dragId != -1) {
                    me.updateContainerStyle(me.dragId, {x: e.clientX - me.prePos.x, y: e.clientY - me.prePos.y});
                    me.prePos.x = e.clientX;
                    me.prePos.y = e.clientY;
                    me.updateTargetElement();
                }
                break;
            case 'mouseup':
                if (me.dragId != -1) {
                    me.dragId = -1;
                    me.updateTargetElement();
                    var target = me.data('$scaleTarget');
                    if (target.parentNode) me.attachTo(me.data('$scaleTarget'));
                }
                $doc.unbind('mousemove', $.proxy(me._eventHandler, me));
                me.hideCover();
                break;
            default:
                break;
        }
    },
    updateTargetElement: function () {
        var $root = this.root();
        this.data('$scaleTarget').css({width: $root.width(), height: $root.height()});
    },
    updateContainerStyle: function (dir, offset) {
        var me = this,
            $dom = me.root(),
            tmp,
            rect = [
                //[left, top, width, height]
                [0, 0, -1, -1],
                [0, 0, 0, -1],
                [0, 0, 1, -1],
                [0, 0, -1, 0],
                [0, 0, 1, 0],
                [0, 0, -1, 1],
                [0, 0, 0, 1],
                [0, 0, 1, 1]
            ];

        if (rect[dir][0] != 0) {
            tmp = parseInt($dom.offset().left) + offset.x;
            $dom.css('left', me._validScaledProp('left', tmp));
        }
        if (rect[dir][1] != 0) {
            tmp = parseInt($dom.offset().top) + offset.y;
            $dom.css('top', me._validScaledProp('top', tmp));
        }
        if (rect[dir][2] != 0) {
            tmp = $dom.width() + rect[dir][2] * offset.x;
            $dom.css('width', me._validScaledProp('width', tmp));
        }
        if (rect[dir][3] != 0) {
            tmp = $dom.height() + rect[dir][3] * offset.y;
            $dom.css('height', me._validScaledProp('height', tmp));
        }
    },
    _validScaledProp: function (prop, value) {
        var $ele = this.root(),
            $wrap = this.defaultOpt.$doc,
            calc = function(val, a, b){
                return (val + a) > b ? b - a : value;
            };

        value = isNaN(value) ? 0 : value;
        switch (prop) {
            case 'left':
                return value < 0 ? 0 : calc(value, $ele.width(), $wrap.width());
            case 'top':
                return value < 0 ? 0 : calc(value, $ele.height(),$wrap.height());
            case 'width':
                return value <= 0 ? 1 : calc(value, $ele.offset().left, $wrap.width());
            case 'height':
                return value <= 0 ? 1 : calc(value, $ele.offset().top, $wrap.height());
        }
    },
    hideCover: function () {
        this.$cover.hide();
    },
    showCover: function () {
        var me = this,
            $wrap = me.defaultOpt.$wrap,
            $iframe = $wrap.find('.edui-editor-body iframe'),
            wrapPos = me.root().offset(),
            iframePos = $iframe.offset();

        me.$cover.css({
            'width': $iframe.width(),
            'height': $iframe.height(),
            'top': iframePos.top - wrapPos.top + 'px',
            'left': iframePos.left - wrapPos.left + 'px',
            'position': 'absolute'
        }).show();
    },
    show: function ($obj) {
        var me = this;
        if ($obj) me.attachTo($obj);
        me.root().bind('mousedown', $.proxy(me._eventHandler, me));
        me.defaultOpt.$doc.bind('mouseup', $.proxy(me._eventHandler, me));
        me.root().show();
        me.trigger("aftershow");
    },
    hide: function () {
        var me = this;
        me.root().unbind('mousedown', $.proxy(me._eventHandler, me));
        me.defaultOpt.$doc.unbind('mouseup', $.proxy(me._eventHandler, me));
        me.hideCover();
        me.root().hide();
        me.trigger('afterhide')
    },
    attachTo: function ($obj) {
        var me = this,
            imgPos = $obj.offset(),
            $root = me.root(),
            $wrap = me.defaultOpt.$wrap,
            $iframe = $wrap.find('.edui-editor-body iframe'),
            $eduibody = $($iframe[0].contentDocument).find('body');

        me.data('$scaleTarget', $obj);
        me.root().css({
            position: 'absolute',
            width: $obj.width(),
            height: $obj.height(),
            'left': $iframe.offset().left + imgPos.left - $eduibody.scrollLeft() - parseInt($wrap.css('border-left-width')) - parseInt($root.css('border-left-width')),
            'top': $iframe.offset().top + imgPos.top - $eduibody.scrollTop() - parseInt($wrap.css('border-top-width')) - parseInt($root.css('border-top-width'))
        });
    },
    setZIndex: function (x) {
        this.$cover.css('z-index',x);
        return this.root().css('z-index',x+1);
    },
    getScaleTarget: function () {
        return this.data('$scaleTarget')[0];
    }
});