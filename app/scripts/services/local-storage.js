angular.module('yapp.services', ['yapp.filters'])

.factory('storage', function($q) {
    var STORAGE_ID = 'notes';

    var notesService = {
        notes: [],

        _getFromLocalStorage: function () {
            return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
        },

        _saveToLocalStorage: function (words) {
            localStorage.setItem(STORAGE_ID, JSON.stringify(words));
        },

        create: function(data) {
            var defer = $q.defer();

            notesService.notes.push(data);
            notesService._saveToLocalStorage(notesService.notes);
            defer.resolve(notesService.words);
            return defer.promise;
        },

        remove: function(data) {
            var defer = $q.defer(),
                indexToRemove,
                indexesToRemove = [];

            if (typeof data === 'string') {
                for (var i = 0; i < notesService.notes.length; i++) {
                    if (notesService.notes[i].id === data) {
                        indexToRemove = i;
                        break;
                    }
                }
                notesService.notes.splice(indexToRemove, 1);

            } else if (Array.isArray(data)) {
                for (var i = 0; i < notesService.notes.length; i++) {
                    if (notesService.notes[i].id === data) {
                        indexesToRemove.push(i);
                    }
                }
                for (var i = 0; i < indexesToRemove; i++) {
                    notesService.notes.splice(indexesToRemove[i], 1);
                }
            }


            notesService._saveToLocalStorage(notesService.notes);
            defer.resolve(notesService.notes);

            return defer.promise;
        },

        getAll: function () {
            var deferred = $q.defer();

            angular.copy(notesService._getFromLocalStorage(), notesService.notes);
            deferred.resolve(notesService.notes);

            return deferred.promise;
        },

        update: function (note) {
            var deferred = $q.defer();

            for (var i = 0; i < notesService.notes.length; i++) {
                if (notesService.notes[i].id === note.id) {
                    notesService.notes[i] = note;
                    break;
                }
            }

            notesService._saveToLocalStorage(notesService.notes);
            deferred.resolve(notesService.notes);

            return deferred.promise;
        }
    };

    return notesService;

});
