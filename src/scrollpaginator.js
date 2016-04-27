/**
 * Created by linsf on 16/4/20.
 */
(function (root, factory) {
    //amd
    if (typeof define === 'function' && define.amd) {
        define(['$'], factory);
    } else if (typeof exports === 'object') { //umd
        module.exports = factory();
    } else {
        root.scrollPaginator = factory(window.Zepto || window.jQuery || $);
    }
})(this, function ($) {
    var ScrollPaginator = function (element, options) {
        this.init(element, options);
    };

    ScrollPaginator.prototype = {
        version: '0.1.0',
        author: "OvO",
        init: function (element, options) {
            this.$element = $(element);
            this.$scrollWin = $('<div>').appendTo(this.$element.parent());
            this.$element.appendTo(this.$scrollWin);
            var id = this.$element.attr("id");
            this.currentPage = 1;
            this.setOptions(options);
        },
        setOptions: function (options) {
            this.options = $.extend({}, (this.options || $.fn.scrollPaginator.defaults), options);
            this.height = parseInt(this.options.height, 10);  //setup the total pages property.

            if (options && typeof (options.currentPage) !== 'undefined') {
                this.setCurrentPage(options.currentPage);
            }
            this.$scrollWin.css({'height': this.height + 'px', 'overflow-y': 'auto','display': 'block','padding':'0px'});
            if (this.height > this.$element.height()) {
                this.$element.css({'min-height': (this.height + 25) + 'px', 'display': 'block','overflow': 'hidden','margin':'0px'});
            }

            this.$scrollWin.scrollTop(0);

            this.bindEvent();
        },
        setCurrentPage: function (page) {
            var cpage = parseInt(page, 10);
            if (cpage == 1) {
                this.$element.empty();
                this.$scrollWin.scrollTop(0);
                $('.loadmsg', this.$scrollWin).remove();
            }
            this.currentPage = cpage

        },
        onScrollBottomed: function (evt, page) {
            if (!this.haveMsg()) {
                if (typeof (this.options.onScrollBottomed) === "function") {
                    this.options.onScrollBottomed(++this.currentPage)
                }
            } else {
                this.showMsg();
            }
        },
        haveData: function (bool) {
            if (bool == false) {
                this.currentPage--;
                this.showMsg();
            }

            if (bool == true) {
                $('.loadmsg', this.$scrollWin).remove();
            }
        },
        haveMsg:function(){
            var loadmsg = $('.loadmsg', this.$scrollWin);
            if (loadmsg.length < 1) {
                return false;
            }
            return true;
        },
        showMsg:function(){
            var _$scrollWin=this.$scrollWin;
            var _scrolltop=_$scrollWin.scrollTop();
            var loadmsg = $('.loadmsg', this.$scrollWin);
            if (loadmsg.length < 1) {
                loadmsg = $("<div class='loadmsg'>").css({'text-align': 'center','padding': '5px;',"clear":'both'}).text('已经到底了');
                loadmsg.appendTo(this.$scrollWin);
            } else {
                loadmsg.show();
            }
            //console.debug('_scrolltop='+_scrolltop);
            setTimeout(function () {
                loadmsg.hide();
                //console.debug('$scrollWin1='+_$scrollWin.scrollTop());
                _$scrollWin.scrollTop(_$scrollWin.scrollTop()-1);
                //console.debug('$scrollWin2='+_$scrollWin.scrollTop());
            }, 3000);
        },
        bindEvent: function () {
            var _this = this;
            var _scrollelement = this.$element;
            this.$scrollWin.unbind('scroll');
            this.$scrollWin.bind('scroll', function () {
                var scrollTop = $(this).scrollTop();
                var scrollHeight = _scrollelement.height();
                var winHeight = $(this).height();
                //console.debug('w.s=' + scrollTop + ',w.h=' + winHeight + ',s+h=' + (scrollTop + winHeight) + ',s.h=' + scrollHeight + '');
                if (scrollTop + winHeight ==scrollHeight) {//滚动到底部执行事件
                    //console.debug('onScrollBottomed');
                    _this.onScrollBottomed();
                }
                if (scrollTop == 0) {//滚动到头部部执行事件
                }
            });
        }
    };

    //
    $.fn.scrollPaginator = function (option) {
        var args = arguments,
            result = null;
        $(this).each(function (index, item) {
            var $this = $(item),
                data = $this.data('scrollPaginator'),
                options = (typeof option !== 'object') ? null : option;
            if (!data) {
                data = new ScrollPaginator(this, options);
                $this = $(data.$element);
                $this.data('scrollPaginator', data);
                return;
            }
            result = data.setOptions(option);
        });

        return result;

    };

    $.fn.scrollPaginator.defaults = {
        height: 300,
        onScrollBottomed: null
    };

    $.fn.scrollPaginator.Constructor = ScrollPaginator;

    return ScrollPaginator;
});