(function(factory) {
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
}(function($) {
    $.fn.sselect = function(options, data) {

        var self = this;

        var settings = $.extend({
            data: [],
            placeholder: '',
            text_noresults: 'Not results',
            prepLi: prepLi,
            prepSelectedLi: prepSelectedLi,
            onInput: function() {},
            onSelect: function() {},
            onNoresults: function() {},
            onShow: function() {},
            onClose: function() {}
        }, options);


        if (options === 'setData') {
            settings.data = data;
        }


        function prepInput() {
            $(self).attr('autocomplete', 'off');

            if (settings.placeholder) {
                $(self).attr('placeholder', settings.placeholder);
            }

            $(self).wrap("<div class='sselect-wrap'></div>");
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

            $('.sselect-wrap').append('<ul class="sselect-box"></ul>');

            $('.sselect-box').css({
                position: 'absolute',
                width: input_w + 'px',
                top: input_h + 5 + 'px',
                left: 0,
                display: 'none'
            });
        }

        function search(item, query) {

            var ret = false;

            if (typeof item === "string") {
                return (item.indexOf(query) !== -1);
            }

            // search from array
            $.each(item, function(i, str) {
                if (str.indexOf(query) !== -1) {
                    ret = true;
                    return;
                }
            });

            return ret;
        }

        function insertLi(query) {

            var query = query || '';
            var html = '';

            $.each(settings.data, function(i, item) {

                if (!query) {
                    html += settings.prepLi(item);
                } else if (search(item, query)) {
                    html += settings.prepLi(item);
                }
            });

            if (html) {
                $('.sselect-box').html(html);
            } else {
                $('.sselect-box').html('<li class="sselect-li-noresults">' + settings.text_noresults + '</li>');
                settings.onNoresults(query);
            }
        }

        // Init --------------------------------------------------------

        prepInput();
        insertSearchBox();
        insertLi();

        // Events --------------------------------------------------------

        // search
        $(this).on('input paste focus', function() {
            var query = $(this).val().trim();
            insertLi(query);
            settings.onInput(query);
        });

        // show
        $(this).on('focus', function() {
            $('.sselect-box').show();
            settings.onShow();
        });

        // hide
        $(document).click(function(event) {

            if ($(event.target).closest(".sselect-box").length || $(event.target).hasClass('input-text')) {
                return;
            }

            $(".sselect-box").hide();
            event.stopPropagation();
            settings.onClose();
        });

        // click li
        $(document).on('click', '.sselect-li', function() {

            var li_text = settings.prepSelectedLi($(this));

            $(self).val(li_text);
            $('.sselect-box').hide();
            settings.onSelect(li_text);
        });

        return this;
    };

}));