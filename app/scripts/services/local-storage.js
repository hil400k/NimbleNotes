angular.module('yapp.services', [])

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
            var defer = $q.defer();

            notesService.notes.splice(notesService.notes.indexOf(data), 1);
            notesService._saveToLocalStorage(notesService.notes);
            defer.resolve(notesService.notes);

            return deferred.promise;
        },

        getAll: function () {
            var deferred = $q.defer();

            angular.copy(notesService._getFromLocalStorage(), notesService.notes);
            deferred.resolve(notesService.notes);

            return deferred.promise;
        },

        update: function (note, index) {
            var deferred = $q.defer();

            notesService.notes[index] = note;

            notesService._saveToLocalStorage(notesService.notes);
            deferred.resolve(notesService.notes);

            return deferred.promise;
        }
    };

    return notesService;

});
