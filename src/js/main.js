var d = new Date();
const st = document.getElementById("sitetime");
if(st)
    st.innerHTML = d;
  

// var app = function() {
//     var body = void 0;
//     var menu = void 0;
//     var menuItems = void 0;

//     var init = function init() {
//         body = document.querySelector('body');
//         menu = document.querySelector('.menu-icon');
//         menuItems = document.querySelectorAll('.nav__list-item');

//         applyListeners();
//     };

//     var applyListeners = function applyListeners() {
//         menu.addEventListener('click', function() { return toggleClass(body, 'nav-active'); });
//     };

//     var toggleClass = function toggleClass(element, stringClass) {
//         if (element.classList.contains(stringClass))
//             element.classList.remove(stringClass);
//         else

//             element.classList.add(stringClass);
//     };

//     init();
// }();


$(document).ready(function() {


    $("#mainmenu .down-nav>a").click(function(e){
        e.preventDefault();
        var $that = $(this);
        $that.next('.submenu').slideToggle(function(){
            $that.closest('li.down-nav').toggleClass('open')
        });
    })

    $('#openav').click(function(e){
        e.preventDefault();
        $("#wrapper").toggleClass('closenav');
    })


    $('a.expand').click(function (e) {
        $(this).closest('.card').addClass('card-fixed');
        $(this).hide();
        $(this).next('a').show()
        e.preventDefault();
    });
    $('a.compress').click(function (e) {
        $(this).closest('.card').removeClass('card-fixed');
        $(this).hide();
        $(this).prev('a').show()
        e.preventDefault();
    });



    var url = location.pathname;
      
    switch(url){
        case "/":
        case "/index.html":     
            $(".mainmenu>li:nth-of-type(1) a").addClass("active");
        break;
        case "/table_basic.html":   
            $(".mainmenu>li:nth-of-type(2)").addClass("nav-open");
            $(".mainmenu>li:nth-of-type(2) .submenu li:nth-of-type(1) a").addClass("active");
            break;
        case "/table_adv.html":   
            $(".mainmenu>li:nth-of-type(2)").addClass("nav-open");
            $(".mainmenu>li:nth-of-type(2) .submenu li:nth-of-type(2) a").addClass("active");
            break;
        case "/customers.html":   
            $(".mainmenu>li.customers a").addClass("active");
           // $(".mainmenu>li:customers .submenu li:nth-of-type(2) a").addClass("active");
            break;
        case "/form_basic.html":   
            $(".mainmenu>li:nth-of-type(3)").addClass("nav-open");
            $(".mainmenu>li:nth-of-type(3) .submenu li:nth-of-type(1) a").addClass("active");
            break;
        case "/form_adv.html":   
            $(".mainmenu>li:nth-of-type(3)").addClass("nav-open");
            $(".mainmenu>li:nth-of-type(3) .submenu li:nth-of-type(2) a").addClass("active");
            break;
        case "/form_adv_pic.html":   
            $(".mainmenu>li:nth-of-type(3)").addClass("nav-open");
            $(".mainmenu>li:nth-of-type(3) .submenu li:nth-of-type(3) a").addClass("active");
            break;
        case "/pages.html":
            $(".mainmenu>li:nth-of-type(4) a").addClass("active");
            break;
        case "/links.html":
            $(".mainmenu>li:nth-of-type(6)").addClass("nav-open");
            $(".mainmenu>li:nth-of-type(6) .submenu li:nth-of-type(1) a").addClass("active");
            break;
    case "/culture.html":
    case "/footprints.html":
    case "/awards.html":            
        $(".mainav li:nth-of-type(4) a").addClass("active");
        break;
    case "/tech.html":            
        $(".mainav li:nth-of-type(3) a").addClass("active");
    }


  
    $(window).scroll(function() {
        if ($(this).scrollTop() > 350) {
            $('#totop').fadeIn();
        } else {
            $('#totop').fadeOut();
        };
    });
    $('#totop').click(function() {
        $('#totop').addClass("fly");
        $('#totop').find("img").attr("src", "img/fly.png");
        var myMusic = document.getElementById("myMusic");
        myMusic.play();
        $("html, body").animate({ scrollTop: 0 }, 1000, function() {
            $('#totop').removeClass("fly");
            $('#totop').find("img").attr("src", "img/totop.png");
        });

        return false;
    });

    

    
    
})