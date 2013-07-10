// JavaScript Document

/*$(document).on("click" , ".my-box h5", function () {
 var width = $(window).width(); // New width
 if (width < 767) {
 $(this).parents(".my-box").find("ul").toggleClass("my-loyakk-links");
 $(this).find('i').toggleClass("icon-chevron-down").toggleClass("icon-chevron-up");
 }
 });

 $(document).on("click" , ".my-loyakk-head h5", function () {
 var width = $(window).width(); // New width
 if (width < 767) {
 $(this).parents(".my-loyakk-head").find("ul").toggleClass("my-loyakk-links");
 $(this).find('i').toggleClass("icon-chevron-down").toggleClass("icon-chevron-up");
 }
 });
 */
//
//$(window).resize(function () {
//    // This will execute whenever the window is resized
//
//    $(window).height(); // New height
//    var width = $(window).width(); // New width
//
//
//
//
//}).trigger("resize");

handleVenueChangeEvents();
handleImageEvents();
handleMyLoyakkEvent();
handelToggleChannelEvent();
handelFavEvent();
handelPostEvent();

handleWindowResize();
$(window).resize(handleWindowResize);


function stop(e) {
    console.log(e);
    if(e) {
        e.stopPropagation();
    }    else{
    //window.event.stopPropagation();
    window.event.stopImmediatePropagation();
    }
}

function enlargeImage(){
    $("a[rel^='prettyPhoto']").prettyPhoto({deeplinking: false,social_tools:false});
}

function handleWindowResize () {

    $(window).height(); // New height
    var width = $(window).width(); // New width
    if (width < 767) {
        $('.my-loyakk-head h5').addClass('venue-head-btn');

        /*$('.venue-box').addClass('invisible');*/
        $('.ven-head').find('.demo').slideUp('slow');


        $('.fav-head').addClass('on');

        $('.my-box ul').addClass('my-loyakk-links');

        $('.my-loyakk-head').addClass('change-border-bottom');
        $('.my-box h5').addClass('pad-adj');

        $('.my-box h5 a i').removeClass('icon-chevron-up');
        $('.my-box h5 a i').addClass('icon-chevron-down');
        $('.channel-list').addClass('bounce');
    }
    else {

        $('.my-loyakk-head h5').removeClass('venue-head-btn');
        $('.venue-box').removeClass('invisible');
        $('.ven-head').find('.demo').slideDown('slow');

        $(".my-box h5.on").unbind("click");

        $('.fav-head').removeClass('on');

        $('.channel-list').addClass('bounce');
        $(".lesser-channel").addClass('hide-class')
        $('.my-box ul').removeClass('my-loyakk-links');
    }

    if (screen.width < 500) {
        $(".demo").hide();
    }
    else {
        $(".demo").show();

    }

}

$(document).scroll(function()  {
    var windowScollTop = $(window).scrollTop();
    var winHeight = $(window).height();
    var docHeight = $(document).height();
    if ((windowScollTop >= (docHeight - winHeight)) && (winHeight > 0)) {
        $('.loadMore').trigger('click');
    }
});

//window.onscroll = function(Event) {
//    var windowScrollTop = parseInt(window.innerHeight);
//    var docHeight       = parseInt(document.body.clientHeight);
//    var winHeight       = parseInt(document.body.scrollTop);
//    if ((windowScrollTop >= (docHeight - winHeight)) && (winHeight > 0)) {
//        $('.loadMore').trigger('click');
//    }
//};

function handleVenueChangeEvents() {
    $(document).on("click", "#venue-change H3", function (t) {
        console.log($('#venue-change').length);
        var n = $(t.currentTarget);
        n.hasClass("open") ? (n.removeClass("open"), $(this).find('a').removeClass("open"), $("#venue-drop").slideUp(400) ) : (n.addClass("open"), $(this).find('a').addClass("open"), $("#venue-drop").slideDown(400))
        $('#venue-change').toggleClass('cream-box')
        $('.venue-thumb').toggleClass('change-border')
    });

    $(document).on("click", ".ven-head .venue-head-btn", function (t) {
            var n = $(t.currentTarget);
            /* $('.ven-head').find('.demo').slideToggle('fast');*/
            $('.ven-head').addClass('change-border-bottom')
            $(this).closest('.ven-head').removeClass('change-border-bottom');
            $('.ven-head h5 .venue-head-btn i').removeClass('icon-chevron-up');
            $('.ven-head h5 .venue-head-btn i').addClass('icon-chevron-down');
            $(this).closest('.ven-head').find('.demo').slideToggle('slow');
            $(this).children('i').removeClass('icon-chevron-down');
            $(this).children('i').addClass('icon-chevron-up');
        }
    );
}


function handleImageEvents() {
    $(document).on("click", "#add-channel-pic", function (e) {
        $("#add-channel-pic input").click();
    });
    $(document).on("click", "#add-channel-pic input", function (e) {
        e.stopPropagation();
    });
    $(document).on("click", ".attached-camera", function (e) {
        $(this).find("input").click();
    });
    $(document).on("click", ".attached-camera input", function (e) {
        e.stopPropagation();
    });
}


function handleMyLoyakkEvent() {
    $(document).on("click", "#my-loyakk ", function (t) {
            var n = $(t.currentTarget);
            $('.toggle-nav').hasClass("open") ? ($('.toggle-nav').removeClass("open"), $("#my-drop").slideUp(400) ) : ($('.toggle-nav').addClass("open"), $("#my-drop").slideDown(400));
            $('#my-loyakk').toggleClass('white-box');
            handleWindowResize();
        }
    );
    $(document).on("click", ".my-box h5.on", (function () {

        if ($(this).closest('.my-box').find('ul').hasClass('my-loyakk-links')) {
            $('.my-box ul').addClass('my-loyakk-links')
            $(this).closest('.my-box').find('ul').removeClass('my-loyakk-links');
        } else {
            $(this).closest('.my-box').find('ul').addClass('my-loyakk-links');
        }

        if ($(this).find('i').hasClass('icon-chevron-down')) {
            $('.my-box h5.on').find('i.icon-chevron-up').addClass('icon-chevron-down');
            $('.my-box h5.on').find('i.icon-chevron-up').removeClass('icon-chevron-up');

            $(this).find('i').removeClass('icon-chevron-down');
            $(this).find('i').addClass('icon-chevron-up');
        } else {
            $(this).find('i').addClass('icon-chevron-down');
            $(this).find('i').removeClass('icon-chevron-up');
        }
    }));
}

function handelToggleChannelEvent() {
    $(document).on("click", ".more-channel", function (t) {
//            console.log($(this));
//            if ($(this).parent('#moreChannel').hasClass('moreChannelOpaque')) {
//                return false;
//            }
            var totalCount = $('ul.channel-list > li').length;
            var visibleCount = $('ul.channel-list > li:visible').length;
            // show the less button only if visible count is >= 3
            if (visibleCount >= 3) {
                $(".lesser-channel").removeClass('hide-class')
            }
            visibleCount = visibleCount + 3;
            if(visibleCount > totalCount) {
                visibleCount = totalCount;
            }
            console.log(visibleCount, totalCount);
            $(".channel-list").removeClass('bounce')

            $('ul.channel-list > li').show().slice(visibleCount, totalCount).hide();
        }
    )

    $(document).on("click", ".lesser-channel", function (t) {
            var totalCount= $('ul.channel-list > li:visible').length;

            //if (j != 6) {
                
                var lastrowcount = totalCount%3;
                if(lastrowcount == 0 && totalCount > 3) {
                    lastrowcount = 3;
                }
                $('ul.channel-list li').slice(totalCount - lastrowcount, totalCount).hide();
            //}
           //else {
              //  $('ul.channel-list li').slice(3, 6).hide()
              if(totalCount <= 6) {
                $(".lesser-channel").addClass('hide-class');
                }
           // }
        }
    );
}



function handelFavEvent(){
    $(document).on("click",".add-fav,.remove-fav", function () {

        $(this).children('i').toggleClass(' icon-heart-empty');
        $(this).toggleClass('add-fav');
        $(this).toggleClass('remove-fav');
    });
}

function handelPostEvent(){
      $(document).on("focus", ".post-input", function (t) {
                var n = $(t.currentTarget);
                $("#post-options").slideDown(400);
                $(".post-channel").slideDown(400);
            })
}

(function (e) {
    e(function () {


//Venue Listing for Small Devices


//Venue Listing for Small Devices


          

            $(".channel-row").hover(
                function () {
                    $(this).children('.remove-fav').fadeIn();
                    $(this).children('.add-fav').fadeIn();
                },
                function () {
                    $(this).children('.remove-fav').fadeOut();
                    $(this).children('.add-fav').fadeOut();
                }
            );




//            $(".unfav-button,.fav-button").click(
//                function () {
//
//                    $(this).children('i').toggleClass('icon-star-empty');
//
//
//                    $(this).toggleClass('unfav-button');
//                    $(this).toggleClass('fav-button');
//                }
//            );


            $(".comment-row .toggle-comment").click(
                function () {
                    $(this).closest('.comment-row').find('.sub-comments').slideToggle('fast');


                }
            );


        }

    )
})(jQuery);
