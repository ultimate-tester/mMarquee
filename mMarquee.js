(function ($) {
    $.fn.mMarquee = function (options) {
        var settings = $.extend({
            pixelsPerFrame: 15,
            frameSpeed: 400,
            freezeOnBlur: false,
            freezeOnClick: false,
            freezeOnHover: false
        }, options);

        var playing = true;
        var $marquee = $(this);
        var $marqueeWrapper = $marquee.wrapInner('<div class="mMarquee-Wrapper"></div>').children().first();
        var marqueeWrapperWidth = $marqueeWrapper.outerWidth();
        $marqueeWrapper.prop('mMarqueeCloneCreated', 'false');

        $marquee.css('position', 'relative');
        $marquee.height($marqueeWrapper.outerHeight(true));

        function cloneWrapper(wrapper) {
            var clone = wrapper.clone().appendTo($marquee);
            clone.prop('mMarqueeCloneCreated', 'false');
            clone.css('left', parseInt(wrapper.css('left')) + marqueeWrapperWidth);

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

                    if (left <= (-marqueeWrapperWidth)) {
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

                if ((left - marqueeWrapperWidth) <= (-(marqueeWrapperWidth - $marquee.outerWidth()))) {
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