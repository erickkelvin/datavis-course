$(document).ready(function () {
    $('.activeable').click(function(e) {
        if (!$(this).hasClass('active')) {
            $('.activeable').removeClass('active');
            $(this).addClass('active');
        }
        else {
            $('.activeable').removeClass('active');
        }
        //e.preventDefault();
    });
});