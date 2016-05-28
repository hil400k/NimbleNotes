angular.module('yapp.services')

.service('notesAPI', function($firebaseArray, authService, storage) {
    var ref = new Firebase('https://lazynotes.firebaseio.com/notes');
    var notesAPI = {};
    var currentUser = authService.$getAuth();
    var notesId = currentUser.uid + '-notes';
    var currentUserNotes = ref.child(notesId);
    var notesUsers = $firebaseArray(ref);
    var notes = $firebaseArray(ref.child(notesId));
    var updatedNote = null;


    notesAPI.create = function(note) {
        note.dateOfCreation = note.dateOfEditing = Firebase.ServerValue.TIMESTAMP;

        return notes.$add(note);
    }

    notesAPI.removeItem = function($id) {
        var note = notes.$getRecord($id);

        return notes.$remove(note);
    }

    notesAPI.removeList = function(list) {
        var newList = [],
            isEqual = false,
            currentUserNotesList = notesUsers.$getRecord(notesId),
            notesKeys = Object.keys(currentUserNotesList),
            notesKeysLength = notesKeys.length,
            key;

        for(var i = 0; i < notesKeysLength; i++) {
            key = notesKeys[i];
            for(var j = 0; j < list.length; j++) {
                if (key === list[j]) {
                    currentUserNotesList[key] = null;
                    break;
                }
            }
        }

        return notesUsers.$save(currentUserNotesList);
    }

    notesAPI.update = function(note) {
        note.editingsCount++;
        note.dateOfEditing = Firebase.ServerValue.TIMESTAMP;
        updatedNote = notes.$getRecord(note.$id);
        angular.copy(emptyToNull(note), updatedNote);

        return notes.$save(updatedNote);
    }

    notesAPI.getAll = function(params) {
        var query = currentUserNotes.orderByChild(params.sortCriteria);
        // to make decending sorting use field with negative values
        return $firebaseArray(query);
    }

    function emptyToNull(params) {
        Object.keys(params).forEach(function(item) {
            if (params[item] === undefined) {
                params[item] = '';
            }
        });

        return params;
    }

    return notesAPI;
});
