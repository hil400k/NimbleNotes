angular.module('app.services', ['app.filters'])

.factory('storage', function() {
    var lstorage = {
        items: {},

        set: function(name, item) {
            localStorage.setItem(name, JSON.stringify(item));
        },

        get: function(name) {
            return JSON.parse(localStorage.getItem(name)) || null;
        },

        remove: function(name) {
            localStorage.removeItem(name);
        }
    };

    return lstorage;
});
