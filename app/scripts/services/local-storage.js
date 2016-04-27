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

            store.notes.push(data);
            store._saveToLocalStorage(store.notes);
            defer.resolve(store.words);
            return defer.promise;
        },

        remove: function(data) {
            var defer = $q.defer();

            store.notes.splice(store.notes.indexOf(data), 1);
            store._saveToLocalStorage(store.notes);
            defer.resolve(store.notes);

            return deferred.promise;
        },

        getAll: function () {
            var deferred = $q.defer();

            angular.copy(store._getFromLocalStorage(), store.notes);
            deferred.resolve(store.notes);

            return deferred.promise;
        },

        update: function (note, index) {
            var deferred = $q.defer();

            store.notes[index] = note;

            store._saveToLocalStorage(store.notes);
            deferred.resolve(store.notes);

            return deferred.promise;
        }
    };

    return notesService;

});
