(function() {

    var $window = $(window),
        $body = $('body'),
        $loginModal = $body.find('.js-login-modal');

    var socket = io();


    var currentUser = {};



    $window.load(function() {
        $('#login-modal').modal('show');
    });

    if ($loginModal.length) {

        $loginModal.find('.js-join').on('click', function(e) {

            var username = $loginModal.find('.js-username').val();

            currentUser.username = username;

            socket.emit('join', username);

            $loginModal.modal('hide');
        });
    }



})(jQuery);
