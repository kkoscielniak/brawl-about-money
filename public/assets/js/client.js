/*
* Angular part of the app
*/
var brawl = angular.module('brawl', []);

brawl.factory('socket', function ($rootScope) {
    var socket = io.connect();

    socket.on('update', function(data) {
        console.log(data);
    });

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

brawl.controller('loginController', ['$scope', 'socket', function($scope, socket) {

    $scope.showModal = true;
    $scope.rooms = [];

    $scope.join = function(name) {
        socket.emit('join', name);
        $scope.showModal = !$scope.showModal;
    };
}]);




brawl.controller('usersController', ['$scope', 'socket', function($scope, socket) {

    $scope.users = [];
    $scope.rooms = [];
    $scope.showModal = false;

    $scope.toggleModal = function() {
        $scope.showModal = !$scope.showModal;
    };

    $scope.createRoom = function(newRoomName) {

        socket.emit('createRoom', newRoomName);
        $scope.showModal = !$scope.showModal;
    }

    socket.on('updatePeople', function(people) {
        $scope.users = people;
    });

    socket.on('roomList', function(rooms) {
        $scope.rooms = rooms;
    });
}]);

brawl.directive('modal', function () {
    return {
        template: '<div class="modal fade">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            // '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '<h4 class="modal-title">{{ title }}</h4>' +
            '</div>' +
            '<div class="modal-body" ng-transclude></div>' +
            '</div>' +
            '</div>' +
            '</div>',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;
            scope.classes = attrs.class;

            scope.$watch(attrs.visible, function(value){
                if(value === true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function(){
                scope.$apply(function(){
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function(){
                scope.$apply(function(){
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
});
