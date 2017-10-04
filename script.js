$(document).ready(function () {
    $('.activeable').click(function(e) {
        $('.activeable').removeClass('active');
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
        }
        //e.preventDefault();
    });
});