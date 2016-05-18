angular.module('yapp.services')

.service('notesAPI', function($firebaseArray, authService, storage) {
    var ref = new Firebase('https://lazynotes.firebaseio.com/notes');
    var notesAPI = {};
    var currentUser = authService.$getAuth();
    var currentUserNotes = ref.child(currentUser.uid + '-notes');
    var notes = $firebaseArray(ref.child(currentUser.uid + '-notes'));


    notesAPI.create = function(note) {
        note.dateOfCreation = note.dateOfEditing = Firebase.ServerValue.TIMESTAMP;
        note.dateOfCreationDesc = note.dateOfEditingDesc = -Firebase.ServerValue.TIMESTAMP;
        notes.$add(note);
    }

    notesAPI.getAll = function(params) {
        var query = currentUserNotes.orderByChild(params.sortCriteria);
        // to make decending sorting use field with negative values
        return $firebaseArray(query);
    }

    return notesAPI;
});
