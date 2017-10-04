$(document).ready(function () {
    $('.activeable').click(function(e) {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
        }
        else {
            $('.activeable').removeClass('active');
        }
        //e.preventDefault();
    });
});