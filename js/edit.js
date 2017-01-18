const database = require('./js/database');
const {ipcRenderer} = require('electron');

// Receive the id of the person the edit
ipcRenderer.on('id', function (event, id) {

  // Load the person from the database
  database.getPersonById(id, function(person) {
    document.getElementById('personid').value = person._id;
    document.getElementById('firstname').value = person.firstname;
    document.getElementById('lastname').value = person.lastname;
  });
});

window.onload = function() {

  // Add the add button click event
  document.getElementById('save').addEventListener('click', () => {

    // Retrieve the input fields
    var personid = document.getElementById('personid');
    var firstname = document.getElementById('firstname');
    var lastname = document.getElementById('lastname');

    // Update the person in the database
    database.updatePerson(personid.value, firstname.value, lastname.value, function() {

      // Send an event to the main process
      ipcRenderer.send('update-complete', '');
    });
  });
}
