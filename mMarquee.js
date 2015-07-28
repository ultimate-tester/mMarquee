(function ($) {
    $.fn.mMarquee = function (options) {
        var settings = $.extend({
            pixelsPerFrame: 15,
            frameSpeed: 400,
            freezeOnBlur: false,
            freezeOnClick: false,
            freezeOnHover: true
        }, options);

        var playing = true;
        var $marquee = $(this);
        var $marqueeWrapper = $marquee.wrapInner('<div class="mMarquee-Wrapper"></div>').children().first();
        $marqueeWrapper.prop('mMarqueeCloneCreated', 'false');

        var marqueeWrapperWidth = 0;
        $marqueeWrapper.children().each(function (index, item) {
            var $item = $(item);
            marqueeWrapperWidth += $item.outerWidth(true);
        });

        $marqueeWrapper.width(marqueeWrapperWidth);
        $marquee.css('position', 'relative');
        $marquee.height($marqueeWrapper.height());

        function cloneWrapper(wrapper) {
            var clone = wrapper.clone().appendTo($marquee);
            clone.prop('mMarqueeCloneCreated', 'false');
            clone.css('left', (clone.width() + parseInt(clone.css('left'))));

            loopMarquee(clone);
            return clone;
        }

        function loopMarquee(wrapper) {
            if (typeof wrapper == 'undefined') {
                return;
            }

            var slideOffset = playing ? settings.pixelsPerFrame : 0;
            wrapper.stop().animate({'left': '-=' + slideOffset}, {
                easing: 'linear',
                duration: settings.frameDuration,
                complete: function () {
                    var left = parseInt(wrapper.css('left'));

                    createClones(wrapper);

                    if (left <= (-wrapper.outerWidth())) {
                        wrapper.remove();
                        wrapper = undefined;
                    }

                    loopMarquee(wrapper);
                }
            });
        }

        function createClones(wrapper) {
            if (wrapper.prop('mMarqueeCloneCreated') == 'false') {
                var left = parseInt(wrapper.css('left'));

                if ((left - settings.pixelsPerFrame) <= (-(wrapper.outerWidth() - $marquee.outerWidth()))) {
                    wrapper.prop('mMarqueeCloneCreated', 'true');
                    createClones(cloneWrapper(wrapper));
                }
            }
        }

        $marquee.click(function () {
            if (settings.freezeOnClick) {
                playing = !playing;
            }
        });

        $marquee.mouseover(function () {
            if (settings.freezeOnHover) {
                playing = false;
            }
        });

        $marquee.mouseout(function () {
            if (settings.freezeOnHover) {
                playing = true;
            }
        });

        $(window).blur(function () {
            if (settings.freezeOnBlur) {
                playing = false;
            }
        });

        $(window).focus(function () {
            if (settings.freezeOnBlur) {
                playing = true;
            }
        });

        createClones($marqueeWrapper);
        loopMarquee($marqueeWrapper);
        return $marqueeWrapper;
    }
}(jQuery));