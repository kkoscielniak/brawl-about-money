(function() {

    var $window = $(window),
        $body = $('body'),
        $loginModal = $body.find('.js-login-modal'),
        $usersTable = $body.find('.js-users-table');

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





// angular attemtp


var brawl = angular.module('brawl', []);

brawl.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});


brawl.controller('usersController', ['$scope', 'socket', function($scope, socket) {

    $scope.users = [];

    socket.on('updatePeople', function(people) {
        $scope.users = people;
    });
}]);

// function usersController($scope, $http) {
//     $scope.formData = {};
//
//     // when landing on the page, get all todos and show them
//     // $http.get('/api/todos')
//     //     .success(function(data) {
//     //         $scope.todos = data;
//     //         console.log(data);
//     //     })
//     //     .error(function(data) {
//     //         console.log('Error: ' + data);
//     //     });
//
//     // // when submitting the add form, send the text to the node API
//     // $scope.createTodo = function() {
//     //     $http.post('/api/todos', $scope.formData)
//     //         .success(function(data) {
//     //             $scope.formData = {}; // clear the form so our user is ready to enter another
//     //             $scope.todos = data;
//     //             console.log(data);
//     //         })
//     //         .error(function(data) {
//     //             console.log('Error: ' + data);
//     //         });
//     // };
//     //
//     // // delete a todo after checking it
//     // $scope.deleteTodo = function(id) {
//     //     $http.delete('/api/todos/' + id)
//     //         .success(function(data) {
//     //             $scope.todos = data;
//     //             console.log(data);
//     //         })
//     //         .error(function(data) {
//     //             console.log('Error: ' + data);
//     //         });
//     // };
//
// }
