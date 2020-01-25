$(function () {



    var resetwidth = function () {

        var winheight = $(window).height(), winwidth = $(window).width();
        $('#rightcol').css({ 'min-height': (winheight - 50) + "px" })
        if (winwidth <= 768) {
            $('#rightcol').css({ 'width': winwidth + "px" })
        } else {
            $('#rightcol').css({ 'width': "auto" })
        }
    }

    resetwidth();

    $(window).resize(function () {
        resetwidth();
    });

    $(".down-nav>a").click(function (e) {
        e.preventDefault();
        var n = $(this).next("ul");
        var li = $(this).closest('li');
        n.slideToggle();

        if (li.hasClass('nav-open')) {
            li.removeClass('nav-open');
        }
        else {
            // n.slideDown();
            //var newH = n.css('height', 'auto').height();         
            //n.height(0).animate({ height:newH }, 300);
            setTimeout(function () {
                li.addClass('nav-open');
            }, 300);

        }
    });


    $('.closemenu a').on('click', function (e) {

        //  $('#rightcol').css({ 'margin-left': '0' });
        closenav();
        e.preventDefault();
    });

    $('.showmenu').on('click', function (e) {

        var marginLeft = $('#rightcol').css("margin-left");
        // console.log($('#rightcol').css("margin-left"));

        if (marginLeft == '0px') {
            $('#rightcol').animate({ 'marginLeft': '170' }, 'fast');
            $('#wrapper').removeClass('nonav');

        } else {
            closenav();
        }

        e.preventDefault();
    });

    var closenav = function () {
        $('#rightcol').animate({ 'marginLeft': '0' }, 'fast');
        $('#wrapper').addClass("nonav");
    }



    $('a.expand').click(function (e) {
        $(this).closest('.box').addClass('box-fixed');
        $(this).hide();
        $(this).next('a').show()
        e.preventDefault();
    });
    $('a.compress').click(function (e) {
        $(this).closest('.box').removeClass('box-fixed');
        $(this).hide();
        $(this).prev('a').show()
        e.preventDefault();
    });
});