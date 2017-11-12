$(document).ready(function () {
    $('.activeable').click(function(e) {
        if (!$(this).hasClass('active')) {
            $('.activeable').removeClass('active');
            $(this).addClass('active');
            scrollToView($(this));
        }
        else {
            $('.activeable').removeClass('active');
            $('html,body').animate({scrollTop: 0}, 300);
        }
        //e.preventDefault();
    });
});

function scrollToView(element){
    var offset = element.offset().top - $(window).scrollTop();
    if(offset > (window.innerHeight - 200)){
        $('html,body').animate({scrollTop: offset}, 300);
    }
}