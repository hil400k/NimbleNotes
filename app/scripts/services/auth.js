angular.module('yapp.services')

.service('authService', function($firebaseAuth) {
    var ref = new Firebase('https://lazynotes.firebaseio.com');

    return $firebaseAuth(ref);
});
