/*
 * Class responsible for room management
 */

function Room (name, id, owner) {
    this.name = name;
    this.id = id;
    this.owner = owner;
    this.people = [];
    this.status = 'available';
};

Room.prototype.addPerson = function(personID) {
    if (this.status = 'available') {
        this.people.push(personID);
    }
}

exports = module.exports = Room;
