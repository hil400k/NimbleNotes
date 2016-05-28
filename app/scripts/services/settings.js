angular.module('yapp.services')

.service('settingsService', function($firebaseObject, $q, authService) {
    var ref = new Firebase('https://lazynotes.firebaseio.com/users'),
        settingsService = {},
        currentUser = authService.$getAuth(),
        $user = $firebaseObject(ref.child(currentUser.uid)),
        settings = null;

    settingsService.loadUser = function() {
        var defer = $q.defer();

        if (!settings) {
            $user.$loaded().then(function(user) {
                settings = {};
                angular.copy(user.settings, settings);
                defer.resolve('ok');
            });
        } else {
            defer.resolve('ok');
        }

        return defer.promise;
    }

    settingsService.set = function(newSettings) {
        angular.copy(newSettings, settings);
    }

    settingsService.get = function() {
       return settings;
    }

    settingsService.save = function() {
        angular.copy(settings, $user.settings);
        return $user.$save();
    }

    settingsService.getDefault = function() {
        return {
            daysToArchive: '',
            defaultTag: ''
        };
    }

    return settingsService;
});


// do login
// get settings
// save settings in settings service and in localstorage
//
// open page as logged in
// get settings (get from settings service (check service object or localstorage)) if empty load();
