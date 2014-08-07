$(function () {

    var winheight = $(window).height();
    $('#rightcol').css({ 'min-height': (winheight - 50) + "px"})


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
            },300);
           
        }
    });


    $('.closemenu a').on('click', function (e) {

      //  $('#rightcol').css({ 'margin-left': '0' });
        closenav();
        e.preventDefault();
    });

    $('.showmenu').on('click', function (e) {
        if ($('#wrapper').hasClass('nonav')) {
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

});