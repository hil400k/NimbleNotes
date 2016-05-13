angular.module('yapp.services')

.service('notesAPI', function(authService, storage) {
    var ref = new Firebase('https://lazynotes.firebaseio.com');
    var notesRef = ref.child('notes');
    var notesAPI = {};
    var currentUser = authService.$getAuth();


    notesAPI.create = function() {
        currentUser.uid;
    }
    // create note
    // get currentuserId
    // currentuserId + - + notes
    // set here new notes array


    return notesAPI;
});
