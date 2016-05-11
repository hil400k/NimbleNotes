angular.module('yapp.services')

.service('userService', function($firebaseObject) {
    var userService = {};

    userService.newUserRef = function(user) {
        var ref = new Firebase('https://lazynotes.firebaseio.com/users/' + user.uid);

        return $firebaseObject(ref);
    }

    userService.getUserData = function(user) {
        var ref = new Firebase("https://statusapp.firebaseio.com/users/" + user);

        return $firebaseObject(ref);
    }

    userService.getLoggedInUser = function() {
        var user = localStorage.getItem('firebase:session::lazynotes');
        if (user) {
            return JSON.parse(user);
        }
    }

    return userService;
});
