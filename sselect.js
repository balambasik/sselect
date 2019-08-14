(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD (Register as an anonymous module)
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.fn.sselect = function (options, data) {

        var self = this;

        var settings = $.extend({
            data: [],
            placeholder: '',
            text_noresults: 'Not results',
            prepLi: prepLi,
            prepSelectedLi: prepSelectedLi,
            prepQuery: prepQuery,
            onInput: function () {
            },
            onSelect: function () {
            },
            onNoresults: function () {
            },
            onShow: function () {
            },
            onClose: function () {
            }
        }, options);

        if (typeof window.sselect_zindex === "undefined") {
            window.sselect_zindex = 100000;
        }


        if (options === 'setData') {
            settings.data = data;
        }


        function prepQuery(text) {
            return text;
        }


        function prepInput() {
            $(self).attr('autocomplete', 'off');

            if (settings.placeholder) {
                $(self).attr('placeholder', settings.placeholder);
            }

            var sselect_wrap = $("<div/>", {
                class: "sselect-wrap",
                css: {
                    "z-index": window.sselect_zindex--
                }
            });


            $(self).wrap(sselect_wrap);
        }

        function prepLi(item) {

            if ($.isArray(item)) {
                return '<li class="sselect-li">' + item.join(',') + '</li>';
            }

            return '<li class="sselect-li">' + item + '</li>';
        }

        function prepSelectedLi($li) {
            return $li.text();
        }

        function insertSearchBox() {

            var input_w = $(self).outerWidth();
            var input_h = $(self).outerHeight();

            var sselect_box = $("<ul/>", {
                class: "sselect-box",
                css: {
                    position: 'absolute',
                    width: input_w + 'px',
                    top: input_h + 5 + 'px',
                    left: 0,
                    display: 'none',
                    margin: 0
                }
            });

            $(self).parents('.sselect-wrap').append(sselect_box);
        }

        function search(item, query) {

            var query = query.toLowerCase();
            var ret = false;

            if (typeof item === "string") {
                item = item.toLowerCase();
                return (item.indexOf(query) !== -1);
            }

            // search from array
            $.each(item, function (i, str) {
                str = str.toLowerCase();
                if (str.indexOf(query) !== -1) {
                    ret = true;
                    return;
                }
            });

            return ret;
        }

        function insertLi(query, el) {

            var query = query || '';
            var html = '';

            $.each(settings.data, function (i, item) {

                if (!query) {
                    html += settings.prepLi(item);
                } else if (search(item, query)) {
                    html += settings.prepLi(item);
                }
            });

            if (html) {
                $(self).parent().find('.sselect-box').html(html);
            } else {
                $(self).parent().find('.sselect-box').html('<li class="sselect-li-noresults">' + settings.text_noresults + '</li>');
                settings.onNoresults(query);
            }
        }

        // Init --------------------------------------------------------

        prepInput();
        insertSearchBox();
        insertLi();

        // Events --------------------------------------------------------

        // search
        $(this).on('input focus', function () {
            var query = settings.prepQuery($(this).val().trim());

            $(this).parent().find('.sselect-box').show();
            insertLi(query, this);
            settings.onInput(query);
        });

        // show
        $(this).on('focus', function () {
            $(this).parent().find('.sselect-box').show();
            settings.onShow();
        });


        // hide
        $(document).click(function (e) {
            var block = $(".sselect-wrap");

            if (!block.is(e.target) && block.has(e.target).length === 0) {
                $(".sselect-box").hide();
                e.stopPropagation();
                settings.onClose();
            }
        });

        // click li
        $(document).on('click', '.sselect-li', function () {

            var li_text = settings.prepSelectedLi($(this));

            $(this).parents(".sselect-wrap").find("input").val(li_text);

            setTimeout(function () {
                $('.sselect-box').hide();
                $(self).blur();
            });

            settings.onSelect(li_text);
        });

        return this;
    };

}));
