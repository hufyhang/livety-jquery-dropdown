/*
 * jQuery dropdown: A simple dropdown plugin
 *
 * Copyright A Beautiful Site, LLC. (http://www.abeautifulsite.net/)
 *
 * Licensed under the MIT license: http://opensource.org/licenses/MIT
 *
*/
if (jQuery) (function ($) {
    var option = {
        "hover_boolen":null
    }

    $.extend($.fn, {
        dropdown: function (method, data) {

            switch (method) {
                case 'show':
                    show(null, $(this));
                    return $(this);
                case 'hide':
                    hide();
                    return $(this);
                case 'attach':
                    return $(this).attr('data-dropdown', data);
                case 'detach':
                    hide();
                    return $(this).removeAttr('data-dropdown');
                case 'disable':
                    return $(this).addClass('dropdown-disabled');
                case 'enable':
                    hide();
                    return $(this).removeClass('dropdown-disabled');
            }

        }
    });

    function show(event, object) {

        var trigger = event ? $(this) : object,
			dropdown = $(trigger.attr('data-dropdown')),
			isOpen = trigger.hasClass('dropdown-open');

        // In some cases we don't want to show it
        if (event) {
            if ($(event.target).hasClass('dropdown-ignore')) return;

            event.preventDefault();
            event.stopPropagation();
        } else {
            if (trigger !== object.target && $(object.target).hasClass('dropdown-ignore')) return;
        }
        hide();

        if (isOpen || trigger.hasClass('dropdown-disabled')) return;

        // Show it
        trigger.addClass('dropdown-open');
        dropdown
			.data('dropdown-trigger', trigger)
			.show();

        // Position it
        position();

        // Trigger the show callback
        dropdown
			.trigger('show', {
				dropdown: dropdown,
				trigger: trigger
			});

    }

    function hide(event) {

        // In some cases we don't hide them
        var targetGroup = event ? $(event.target).parents().addBack() : null;

        // Are we clicking anywhere in a dropdown?
        if (targetGroup && targetGroup.is('.dropdown')) {
            // Is it a dropdown menu?
            if (targetGroup.is('.dropdown-menu')) {
                // Did we click on an option? If so close it.
                //if (!targetGroup.is('A')) return;
            } else {
                // Nope, it's a panel. Leave it open.
                return;
            }
        }

        // Hide any dropdown that may be showing
        $(document).find('.dropdown:visible').each(function () {
            var dropdown = $(this);
            dropdown
				.hide()
				.removeData('dropdown-trigger')
				.trigger('hide', { dropdown: dropdown });
        });

        // Remove all dropdown-open classes
        $(document).find('.dropdown-open').removeClass('dropdown-open');

    }

    function position() {

        var dropdown = $('.dropdown:visible').eq(0),
			trigger = dropdown.data('dropdown-trigger'),
			hOffset = trigger ? parseInt(trigger.attr('data-horizontal-offset') || 0, 10) : null,
			vOffset = trigger ? parseInt(trigger.attr('data-vertical-offset') || 0, 10) : null;

        if (dropdown.length === 0 || !trigger) return;

        if (dropdown.hasClass('dropdown-top')) {
              dropdown.css({
                  marginTop: - dropdown.height() - $(".footer-langbar li").outerHeight(true)
              });
          }

        // Position the dropdown relative-to-parent...
        if (dropdown.hasClass('dropdown-relative')) {
            dropdown.css({
                left: dropdown.hasClass('dropdown-anchor-right') ?
					trigger.position().left - (dropdown.outerWidth(true) - trigger.outerWidth(true)) - parseInt(trigger.css('margin-right'), 10) + hOffset :
					trigger.position().left + parseInt(trigger.css('margin-left'), 10) + hOffset,
                top: trigger.position().top + trigger.outerHeight(true) - parseInt(trigger.css('margin-top'), 10) + vOffset
            });
        } else {
            // ...or relative to document
            dropdown.css({
                left: dropdown.hasClass('dropdown-anchor-right') ?
					trigger.offset().left - (dropdown.outerWidth() - trigger.outerWidth()) + hOffset : trigger.offset().left + hOffset,
                top: trigger.offset().top + trigger.outerHeight() + vOffset
            });
        }
    }

    $(document).on('click.dropdown', '[data-dropdown]', show);
    $(document).on('click.dropdown', hide);
    //by gyy
    // var isTouchDevice = (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
    var isTouch = ('ontouchstart' in window);
    if(isTouch){
        $(document).on('touchstart.dropdown', '.dropdown .needs-highlight', function () {
          $(this).addClass('dropdown-active-highlight');
        });
        $(document).on('touchend.dropdown', '.dropdown .needs-highlight', function () {
          $(this).removeClass('dropdown-active-highlight');
        });


        // $(document).on('touchstart.dropdown','.dropdown .dropdown-menu LI > A, .dropdown .dropdown-menu LABEL, .hover-dropdown .dropdown-menu LI > A,.hover-dropdown .dropdown-menu LABEL', function(){
        //
        //     $(this).css({backgroundColor:'#f56653', color: '#fff',cursor: 'pointer'});
        //     console.log("start");
        // })
        // $(document).on('touchend.dropdown','.dropdown .dropdown-menu LI > A, .dropdown .dropdown-menu LABEL, .hover-dropdown .dropdown-menu LI > A,.hover-dropdown .dropdown-menu LABEL', function(){
        //
        //     $(this).css({backgroundColor:'#fff', color: '#555'});
        //     console.log("end");
        // })

    }
    // else{
    //     $(document).on('mouseover.dropdown','.dropdown .dropdown-menu LI > A, .dropdown .dropdown-menu LABEL, .hover-dropdown .dropdown-menu LI > A,.hover-dropdown .dropdown-menu LABEL', function(){
    //         $(this).css({backgroundColor:'#f56653', color: '#fff', cursor:'pointer'});
    //         console.log("over");
    //     })
    //     $(document).on('mouseout.dropdown','.dropdown .dropdown-menu LI > A, .dropdown .dropdown-menu LABEL, .hover-dropdown .dropdown-menu LI > A,.hover-dropdown .dropdown-menu LABEL', function(){
    //         $(this).css({backgroundColor:'#fff', color: '#555'});
    //         console.log("out");
    //     })
    // }





    $(window).on('resize', position);
})(jQuery);
