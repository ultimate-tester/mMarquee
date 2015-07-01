(function ($) {
    $.fn.mMarquee = function (options) {
        var settings = $.extend({
            speed: 'slow'
        }, options);

        var $marquee = $(this);
        var $marqueeWrapper = $marquee.wrapInner('<div class="mMarquee-Wrapper"></div>').children().first();
        $marqueeWrapper.prop('mMarqueeCloneCreated', 'false');

        var marqueeWrapperWidth = 0;
        $marqueeWrapper.children().each(function (index, item) {
            var $item = $(item);
            marqueeWrapperWidth += $item.outerWidth(true);
        });

        $marqueeWrapper.width(marqueeWrapperWidth);
        $marqueeWrapper.outerHeight($marqueeWrapper.height());

        $marquee.css('position', 'relative');
        $marquee.height($marqueeWrapper.height());

        function cloneWrapper(wrapper) {
            var clone = wrapper.clone().appendTo($marquee);
            clone.prop('mMarqueeCloneCreated', 'false');
            clone.css('left', (clone.width() + parseInt(clone.css('left')) + 1));

            loopMarquee(clone);
            return clone;
        }

        function loopMarquee(wrapper) {
            if (typeof wrapper == 'undefined') {
                return;
            }

            var slideWidth = wrapper.children().outerWidth(true);
            wrapper.stop().animate({'left': '-=' + slideWidth}, {
                easing: 'linear',
                duration: settings.speed,
                complete: function () {
                    var left = parseInt(wrapper.css('left'));

                    if (wrapper.prop('mMarqueeCloneCreated') == 'false') {
                        if (left <= (-(wrapper.outerWidth() - $marquee.outerWidth()))) {
                            wrapper.prop('mMarqueeCloneCreated', 'true');
                            cloneWrapper(wrapper);
                        }
                    }

                    if (left <= (-wrapper.outerWidth())) {
                        wrapper.remove();
                        wrapper = undefined;
                    }

                    loopMarquee(wrapper);
                }
            });
        }

        loopMarquee($marqueeWrapper);

        return $marqueeWrapper;
    }
}(jQuery));