/*
 * socket.io events
 */
var uuid = require('node-uuid');
var Room = require('./room');

Array.prototype.contains = function(k, callback) {
    var self = this;
    return (function check(i) {
        if (i >= self.length) {
            return callback(false);
        }
        if (self[i] === k) {
            return callback(true);
        }
        return process.nextTick(check.bind(null, i+1));
    }(0));
};

exports = module.exports = function (io) {

    var people = {},
        rooms = {},
        clients = [];

    io.sockets.on('connection', function(client) {

        client.on('join', function(name) {
            var roomID = null;
            people[client.id] = { 'name': name, 'room': roomID };

            client.emit('update', 'You have connected to the server.');

            io.sockets.emit('updatePeople', people);
            client.emit('roomList', { rooms: rooms });
            clients.push(client);
        });

        client.on('createRoom', function(name) {

            if (people[client.id].room === null) {

                var uniqueId = uuid.v4();
                var room = new Room(name, uniqueId, client.id);

                rooms[uniqueId] = room;

                io.sockets.emit('roomList', rooms);
                console.log(rooms);

                client.room = room.name;
                client.join(client.room);
                room.addPerson(client.uniqueId);

                people[client.id].room = uniqueId;
            } else {
                io.sockets.emit('update', 'You have already created a room');
            }
        });

        client.on('joinRoom', function(roomId) {
            // console.log(client.id);

            // var room = rooms[roomId];
            //
            // if (client.id === room.owner) {
            //     client.emit('update', 'You are the owner of this room and you\'ve already joined');
            // } else {
            //     room.people.contains(client.id, function(found) {
            //         if (found) {
            //             client.emit('update', 'You have already joined this room.');
            //         } else {
            //             if (people[client.id].inroom !== null) {
            //                 client.emit('update', 'You are already in a room (' +
            //                     rooms[people[client.id].inroom].name +
            //                     '), please leave it first to join another room.');
            //             } else {
            //                 room.addPerson(client.id);
            //                 people[client.id].inroom = uniqueId;
            //                 client.room = room.name;
            //                 client.join(client.room);
            //                 user = people[client.id];
            //                 socket.sockets.in(client.room).emit('update', user.name + ' has connected to ' + room.name + ' room.');
            //                 client.emit('update', 'Welcome to ' + room.name + '.');
            //                 client.emit('sendRoomID', { id: id });
            //             }
            //         }
            //     });
            // }
        });

        // client.on('send', function(msg) {
        //     if (socket.sockets.manager.roomClients[client.id]['/' + client.room] !== undefined ) {
        //             socket.sockets.in(client.room).emit('chat', people[client.id], msg);
        //     } else {
        //         client.emit('update', 'Please connect to a room.');
        //     }
        // });
        //
        // client.on('leaveRoom', function(id) {
        //     var room = rooms[id];
        //
        //     if (client.id === room.owner) {
        //         var i = 0;
        //         while (i < clients.length) {
        //             if (clients[i].id === room.people[i]) {
        //                 people[clients[i].id].inroom = null;
        //                 clients[i].leave(room.name);
        //             }
        //             ++i;
        //         }
        //         delete rooms[id];
        //         people[room.owner].owns = null;
        //
        //         io.sockets.emit('roomList', { rooms: rooms });
        //
        //         io.sockets.in(client.room).emit('update', 'The owner (' +
        //             user.name + ') is leaving the room. The room is removed');
        //
        //     } else {
        //         room.people.contains(client.id, function(found) {
        //             if (found) {
        //                 var personIndex = room.people.indexOf(client.id);
        //                 room.people.splice(personIndex, 1);
        //                 io.sockets.emit('update', people[client.id].name +
        //                     ' has left the room.');
        //
        //                 client.leave(room.name);
        //             }
        //         });
        //     }
        // });
        //
        // client.on('removeRoom', function(id) {
        //     var room = rooms[id];
        //     if (room) {
        //         if (client.id === room.owner) {
        //             var personCount = room.people.length;
        //
        //             if (personCount > 2) {
        //                 console.log('there are still people in the room warning'); // @TODO
        //             } else {
        //                 if (client.id === room.owner) {
        //                     socket.sockets.in(client.room).emit('update', 'The owner (' + people[client.id].name + ') removed the room.');
        //
        //                     var i = 0;
        //
        //                     while (i < clients.length) {
        //
        //                         if(clients[i].id === room.people[i]) {
        //                             people[clients[i].id].inroom = null;
        //                             clients[i].leave(room.name);
        //                         }
        //                         ++i;
        //                     }
        //                     delete rooms[id];
        //                     people[room.owner].owns = null;
        //                     socket.sockets.emit('roomList', {rooms: rooms});
        //
        //                 }
        //             }
        //         } else {
        //             client.emit('update', 'Only the owner can remove a room.');
        //         }
        //     }
        // });
        //
        // client.on('disconnect', function(room) {
        //     if (people[client.id]) {
        //         if (people[client.id].inroom === null) {
        //             socket.sockets.emit('update', people[client.id].name + ' has left the server.');
        //             delete people[client.id];
        //             socket.sockets.emit('updatePeople', people);
        //         } else {
        //             if (people[client.id].owns !== null) {
        //                 var room = rooms[people[client.id].owns];
        //                 if (client.id === room.owner) {
        //                     var i = 0;
        //                     while(i < clients.length) {
        //                         if (clients[i].id === room.people[i]) {
        //                             people[clients[i].id].inroom = null;
        //                             clients[i].leave(room.name);
        //                         }
        //                         ++i;
        //                     }
        //                     delete rooms[people[client.id].owns];
        //                 }
        //             }
        //             socket.sockets.emit('update', people[client.id].name + ' has left the server.');
        //             delete people[client.id];
        //             socket.sockets.emit('updatePeople', people);
        //             socket.sockets.emit('roomList', {rooms: rooms});
        //         }
        //     }
        // });
    });
}
