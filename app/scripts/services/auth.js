angular.module('app.services')

.service('authService', function($firebaseAuth) {
    var ref = new Firebase('https://lazynotes.firebaseio.com');

    return $firebaseAuth(ref);
})

.service('googleAuthService', function() {
    var ref = new Firebase('https://lazynotes.firebaseio.com');

    return ref;
})
