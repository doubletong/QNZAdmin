$(function () {

    $(".down-nav>a").click(function (e) {
        e.preventDefault();
        var n = $(this).next("ul");
        if (n.hasClass('nav-open')) {

            n.animate({ height: 0 }, 300);
            setTimeout(function () {
                n.removeClass('nav-open');
            },300);            
        }
        else {
            var newH = n.css('height', 'auto').height();
         
            n.height(0).animate({ height:newH }, 300);
            setTimeout(function () {
                n.addClass('nav-open');
            },300);
           
        }
    });
});