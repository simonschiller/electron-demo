// Initialize the database
var Datastore = require('nedb');
db = new Datastore({ filename: 'db/persons.db', autoload: true });

// Adds a person
exports.addPerson = function(firstname, lastname) {

  // Create the person object
  var person = {
    "firstname": firstname,
    "lastname": lastname
  };

  // Save the person to the database
  db.insert(person, function(err, newDoc) {
    // Do nothing
  });
};

exports.updatePerson = function (id, fname, lname, fnc) {

  db.update({ _id: id}, { $set: { firstname: fname, lastname: lname } }, {}, function(err, numReplaced) {

    // Execute the parameter function
    fnc();
  });
}

exports.getPersonById = function(id, fnc) {

  // Find the person from the database
  db.findOne({ _id: id }, function (err, doc) {

    // Execute the parameter function
    fnc(doc);
  });
};

// Returns all persons
exports.getPersons = function(fnc) {

  // Get all persons from the database
  db.find({}, function(err, docs) {

    // Execute the parameter function
    fnc(docs);
  });
}

// Deletes a person
exports.deletePerson = function(id) {

  db.remove({ _id: id }, {}, function(err, numRemoved) {
    // Do nothing
  });
}
