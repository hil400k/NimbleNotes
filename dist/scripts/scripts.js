'use strict';

/**
 * @ngdoc overview
 * @name app
 * @description
 * # app
 *
 * Main module of the application.
 */
 angular
 .module('app', [
    'app.controllers',
    'app.components',
    'ui.router',
    'snap',
    'dibari.angular-ellipsis',
    'ngAnimate',
    'firebase'
    ])
 .config(["$stateProvider", "$urlRouterProvider", "snapRemoteProvider", function($stateProvider, $urlRouterProvider, snapRemoteProvider) {

    snapRemoteProvider.globalOptions.touchToDrag = false;
    $urlRouterProvider.when('/dashboard', '/dashboard/notes');
    $urlRouterProvider.otherwise('/login');

    $stateProvider
    .state('base', {
        abstract: true,
        templateUrl: 'views/base.html'
    })
    .state('login', {
          url: '/login',
          parent: 'base',
          templateUrl: 'views/login.html',
          controller: 'LoginCtrl',
          controllerAs: 'login'
    })
    .state('dashboard', {
          abstract: true,
          parent: 'base',
          templateUrl: 'views/dashboard.html',
          controller: 'DashboardCtrl',
          controllerAs: 'dashboard'
    })
    .state('notes', {
        url: '/notes',
        parent: 'dashboard',
        templateUrl: 'views/dashboard/notes.html',
        controller: 'NotesCtrl',
        controllerAs: 'notesCtrl'
    })
    .state('settings', {
        url: '/settings',
        parent: 'dashboard',
        templateUrl: 'views/dashboard/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'settings'
    })
    .state('about', {
        url: '/about',
        parent: 'dashboard',
        templateUrl: 'views/dashboard/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
    });

}])
 .run(["$rootScope", "$state", "userService", "settingsService", function($rootScope, $state, userService, settingsService) {
     $rootScope.$on('$stateChangeStart', function(event, toState) {
         var loggedInUser = userService.getLoggedInUser();

         if (!loggedInUser && toState.name !== 'login') {
             event.preventDefault();
             $state.go('login');
         }
     });
 }])

angular.module('app.components', [])

.directive('elastic', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, element) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                var resize = function() {
                    element[0].style.height = $scope.initialHeight;
                    element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                element.on("input change", resize);
                $timeout(resize, 0);
            }
        };
    }
])

.directive('notesGrid', ['$injector', '$rootScope', function($injector, $rootScope) {
    return {
        restrict: 'A',
        replace: false,
        link: function(scope, elem, attrs) {
            var notesService = $injector.get('notesService'),
                el = angular.element(elem[0]);

            $rootScope.$on('clear-values', function() {
                angular.forEach(el.children().children(), function(item, i) {
                    angular.element(item).removeClass('choosen-note');
                });
            });
        }
    }
}])
.directive('notificator', ['$injector', function($injector) {
    return {
        restrict: 'E',
        replace: false,
        templateUrl: 'views/dashboard/notificator.html',
        link: function(scope, elem, attrs) {
            var notificatorService = $injector.get('notificatorService'),
                messageBox = elem.children().children().eq(1).children(),
                loader = elem.children().children().eq(0),
                notification = elem.children().children().eq(1);

            notificatorService.open = function(message) {
                if (message) {
                    messageBox.text(message);
                    loader.css({display: 'none'});
                    notification.css({display: 'block'});
                } else {
                    notification.css({display: 'none'});
                    loader.css({display: 'block'});
                }
                elem.children().addClass('opened');
                notificatorService.state = true;
            }

            notificatorService.close = function() {
                elem.children().removeClass('opened');
                notificatorService.state = false;
            }
        }
    }
}])
.directive('note', ['$compile', '$timeout', '$injector', function($compile, $timeout, $injector) {
    return {
        restrict: 'E',
        replace: 'false',
        templateUrl: 'views/dashboard/note.html',
        link: function(scope, elem, attrs) {
            var notesService = $injector.get('notesService'),
                noteItem = notesService.getListItem(attrs.id),
                noteItemPriority = parseInt(noteItem.priority),
                notesGrid;

            setClassToNote();
            highlightName();
            setEvents();
            noteItem.dateToDisplay = getDateToDisplay(noteItem.dateOfEditing);

            function setEvents() {
                elem.parent().bind('mouseover mouseout', function(e) {
                    $timeout(function () {
                        $compile(elem.contents())(scope);
                    }, 100);
                });

                elem.parent().on('click', function(e) {
                    var notesToRemove = notesService.nlistToRemove;

                    if (!scope.notesCtrl.canChooseForRemoving) {
                        angular.forEach(document.querySelectorAll('.grid .note'), function(item, i) {
                            angular.element(item).removeClass('choosen-note');
                        });
                        elem.addClass('choosen-note');
                        scope.$apply(function() {
                            notesService.setNote(noteItem);
                        });
                    } else {
                        if (!elem.hasClass('choosen-note')) {
                            notesToRemove.push(noteItem.$id);
                            elem.addClass('choosen-note');
                        } else {
                            elem.removeClass('choosen-note');
                            notesToRemove.splice(notesToRemove.indexOf(noteItem.$id), 1);
                        }
                    }
                });
            }


            function highlightName() {
                var text = noteItem.text,
                    highligting = '<span class="note-name">',
                    output;
                noteItem.textToDisplay = text;
            }

            function getDateToDisplay(timestampDate) {
                var date = new Date(timestampDate),
                    hours = date.getHours(),
                    minutes = "0" + date.getMinutes(),
                    year = date.getFullYear().toString(),
                    month = '' + (date.getMonth() + 1),
                    day = '' + date.getDate(),
                    formattedDateTime = null;

                    if (month.length < 2) month = '0' + month;
                    if (day.length < 2) day = '0' + day;
                    formattedDateTime = hours + ':' + minutes.substr(-2) + ' ' + day + ':' + month + ':' + year;

                return formattedDateTime;
            }

            function setClassToNote() {
                switch(noteItemPriority) {
                    case 1:
                        elem.addClass('priority-1');
                        break;
                    case 2:
                        elem.addClass('priority-2');
                        break;
                    case 3:
                        elem.addClass('priority-3');
                        break;
                    case 4:
                        elem.addClass('priority-4');
                        break;
                    case 5:
                        elem.addClass('priority-5');
                        break;
                }
            }
        }
    }
}]);

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

angular.module('app.services')

.service('notesService', ["$filter", "$timeout", "storage", "notesAPI", "notificatorService", "settingsService", function($filter, $timeout, storage, notesAPI, notificatorService, settingsService) {
    var ns = {};

    ns.nlist = [];
    ns.nlistToRemove = [];
    ns.ncurrent = {};
    ns.nlistParams = {};
    ns.settings = settingsService.get();
    ns.defaultTag = ns.settings.defaultTag;

    ns.getListItem = function(id) {
        return $filter('getNoteById')(ns.nlist, id);
    };

    ns.initListParams = function() {
        ns.nlistParams = {
            sortCriteria: 'dateOfCreation',
            tag: '',
            priority: null
        };
    };

    ns.initNote = function() {
        ns.ncurrent = {
            text: '',
            tags: [settingsService.get().defaultTag],
            priority: 1,
            dateOfCreation: null,
            dateOfEditing: null,
            editingsCount: 0,
            sourceUrl: null
        };
        if (ns.initNoteCallback) ns.initNoteCallback();
    };

    ns.nlistToRemoveInit = function() {
        ns.nlistToRemove = [];
    }

    ns.setNote = function(noteItem) {
        if (noteItem) {
            ns.ncurrent = {
                $id: noteItem.$id,
                text: noteItem.text,
                tags: noteItem.tags,
                priority: noteItem.priority,
                dateOfCreation: noteItem.dateOfCreation,
                dateOfEditing: noteItem.dateOfEditing,
                editingsCount: noteItem.editingsCount,
                sourceUrl: noteItem.sourceUrl
            };
            if (ns.setNoteCallback) ns.setNoteCallback();
        }
    }

    // callbacks

    ns.getNotesAPICallback = null;
    ns.setNoteCallback = null;
    ns.removeNotesAPICallback = null;
    ns.setNoteCallback = null;
    ns.initNoteCallback = null;

    // APIs

    ns.getNotesAPI = function() {
        var notes = notesAPI.getAll(ns.nlistParams);

        return notes.$loaded();
    };

    ns.updateNoteAPI = function() {
        ns.ncurrent.tags = makeTagsArray(ns.ncurrent.tags);
        return notesAPI.update(ns.ncurrent);
    };

    ns.createNoteAPI = function() {
        var wordsCount = 1;

        ns.ncurrent.tags = makeTagsArray(ns.ncurrent.tags);
        return notesAPI.create(ns.ncurrent);
    };

    ns.removeNotesAPI = function(params) {
        var api = null;

        if (!params) return;

        if (typeof params === 'string') {
            api = notesAPI.removeItem(params);
        } else if (Array.isArray(params)) {
            api = notesAPI.removeList(params);
        }

        return api;
    };

    function makeTagsArray(tags) {
        var newTags = [];

        angular.forEach(tags, function(item, i) {
            newTags.push(item.text);
        });

        return newTags;
    }

    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }

    return ns;
}])

angular.module('app.services')

.service('notificatorService', function() {
    var notificator = {};

    notificator.state = false;

    notificator.open = null;
    notificator.close = null;
    notificator.showMessage = null;

    return notificator;

});

angular.module('app.services')

.service('settingsService', ["$firebaseObject", "$q", "authService", "storage", function($firebaseObject, $q, authService, storage) {
    var ref = new Firebase('https://lazynotes.firebaseio.com/users'),
        settingsService = {},
        settings = null;

    settingsService.set = function(newSettings) {
        angular.copy(newSettings, settings);
        storage.set('settings', settings);
    }

    settingsService.get = function() {
       return settings;
    }

    settingsService.save = function() {
        var currentUser = authService.$getAuth(),
            $user = $firebaseObject(ref.child(currentUser.uid)),
            defer = $q.defer();

        $user.settings = {};
        angular.copy(settings, $user.settings);

        $user.$save().then(function() {
            defer.resolve('ok');
            storage.set('settings', settings);
        });

        return defer.promise;
    }

    settingsService.getDefault = function() {
        return {
            daysToArchive: '',
            defaultTag: ''
        };
    }

    settingsService.init = function() {
        var lsettings = storage.get('settings');

        if (!settings && lsettings) settings = lsettings;
        else if (!settings) settings = {};
    }

    settingsService.init();

    return settingsService;
}]);


// do login
// get settings
// save settings in settings service and in localstorage
//
// open page as logged in
// get settings (get from settings service (check service object or localstorage)) if empty load();

angular.module('app.services')

.service('authService', ["$firebaseAuth", function($firebaseAuth) {
    var ref = new Firebase('https://lazynotes.firebaseio.com');

    return $firebaseAuth(ref);
}])

.service('googleAuthService', function() {
    var ref = new Firebase('https://lazynotes.firebaseio.com');

    return ref;
})

angular.module('app.services')

.service('userService', ["$firebaseObject", function($firebaseObject) {
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
}]);

angular.module('app.services')

.service('notesAPI', ["$firebaseArray", "authService", "storage", function($firebaseArray, authService, storage) {
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
}]);

angular.module('app.filters', [])

.filter('getNoteById', function() {
    return function(list, id) {
        var i = 0,
            len = list.length;

        for (; i < len; i++) {
          if (list[i].$id === id) {
            return list[i];
          }
        }
        return null;
    }
})
.filter('tagFilter', function() {
    return function(list, tag) {
        var result = [];

        result = list.filter(function(item) {
            if (!item.tags) return false;
            return item.tags.indexOf(tag) !== (-1);
        });

        return result;
    }
})

'use strict';

angular.module('app.controllers', ['ngTagsInput', 'app.services', 'ngSanitize', 'ngQuill'])
  .controller('DashboardCtrl', ["$state", "authService", "storage", function($state, authService, storage) {
    var self = this;

    self.init = function() {
        self.$state = $state;

        self.doLogout = function() {
            authService.$unauth();
            storage.remove('settings');
            $state.go('login');
        }
    }

    self.init();
  }]);

'use strict';

angular.module('app.controllers')
  .controller('LoginCtrl', ["$location", "$state", "authService", "userService", "settingsService", "googleAuthService", function($location, $state, authService, userService, settingsService, googleAuthService) {
    var self = this;

    self.init = function() {
        self.loginTab = true;
        self.userObject = null;

        self.loginUser = {
            email: null,
            password: null
        }

        self.registerUser = {
            email: null,
            password: null
        };

        self.toLogin = function() {
            self.loginTab = true;
        }

        self.toRegister = function() {
            self.loginTab = false;
        }

        self.saveUser = function(userData) {
            var user = userService.newUserRef(userData);

            user.$loaded().then(function($user) {
                $user.email = self.loginUser.email;
                $user.password = self.loginUser.password;
                $user.settings = settingsService.settings = settingsService.getDefault();
                user.$save().then(function(response) {
                    self.doLogin();
                }, function() {
                    console.warn('Saving User Error');
                })
            });
        }

        self.saveGoogleUser = function(userData) {
            var user = userService.newUserRef(userData);

            user.$loaded().then(function($user) {
                if ($user.settings) {
                    settingsService.set($user.settings);
                    var event = document.createEvent('Event');
                    event.initEvent('logged-in');
                    document.dispatchEvent(event);
                    $state.go('notes');
                } else {
                    $user.email = userData.google.email;
                    $user.googleId = userData.google.id;
                    $user.settings = settingsService.settings = settingsService.getDefault();
                    $user.$save().then(function(response) {
                        console.info('User saved');
                        var event = document.createEvent('Event');
                        event.initEvent('logged-in');
                        document.dispatchEvent(event);
                        $state.go('notes');
                    }, function() {
                        console.warn('Saving User Error');
                    })
                }
            });
        }

        self.doLogin = function() {
            authService.$authWithPassword({
                email: self.loginUser.email,
                password: self.loginUser.password
            }).then(function(data) {
                var user = null;

                user = userService.newUserRef(data);
                user.$loaded().then(function($user) {
                    self.userObject = authService.$getAuth();
                    self.loginUser.email = null;
                    self.loginUser.password = null;
                    settingsService.set($user.settings);
                    var event = document.createEvent('Event');
                    event.initEvent('logged-in');
                    document.dispatchEvent(event);
                    $state.go('notes');
                });
            }).catch(function() {
                console.warn('Login Error');
            })
        }

        self.doGoogleLogin = function() {
            googleAuthService.authWithOAuthPopup("google", function(error, authData) {
              if (error) {
                console.warn("Login Failed!", error);
              } else {
                self.userObject = JSON.stringify(authService.$getAuth());
                self.saveGoogleUser(authData);
              }
            }, {
               remember: "default",
               scope: "email"
            });
        }

        self.doRegister = function() {
            authService.$createUser({
                email: self.registerUser.email,
                password: self.registerUser.password
            }).then(function(userData) {
                angular.copy(self.registerUser, self.loginUser);
                self.saveUser(userData);
            }).catch(function() {
                console.warn('Registration Error');
            })
        }
    }

    self.init();

  }]);

'use strict';


angular.module('app.controllers')
  .controller('NotesCtrl', ["$scope", "$state", "storage", "notesService", "notificatorService", function($scope, $state, storage, notesService, notificatorService) {
    var self = this;


    self.toggleChooseForRemovingAvailability = function() {
        notesService.nlistToRemoveInit();
        notesService.initNote();
        angular.forEach(document.querySelectorAll('.grid .note'), function(item, i) {
            angular.element(item).removeClass('choosen-note');
        });
        if (self.canChooseForRemoving) self.disableChooseForRemoving();
        else self.enableChooseForRemoving();
    }

    self.disableChooseForRemoving = function() {
        notificatorService.close();
        self.canChooseForRemoving = false;
    }

    self.enableChooseForRemoving = function() {
        notificatorService.open('Click "delete" button to remove choosen');
        self.canChooseForRemoving = true;
    }

    self.init = function() {
        self.canChooseForRemoving = false;
    }

    self.init();

  }]);

'use strict';

angular.module('app.controllers')
  .controller('NotesCreatorCtrl', ["$scope", "$state", "$timeout", "$rootScope", "$filter", "storage", "notesService", "notificatorService", function($scope, $state, $timeout, $rootScope, $filter, storage, notesService, notificatorService) {
    var self = this;

    self.init = function() {
        notesService.initNote();
        self.note = notesService.ncurrent;
        notesService.setNoteCallback = function() {
            self.note = notesService.ncurrent;
            $scope.notesCtrl.editingMode = true;
        }
        notesService.initNoteCallback = function() {
            self.note = notesService.ncurrent;
            $scope.notesCtrl.editingMode = false;
        }
    }

    self.clearValues = function() {
        notesService.initNote();
        $scope.notesCtrl.disableChooseForRemoving();
        $rootScope.$broadcast('clear-values');
    }

    self.send = function() {
        if (!self.note.text) {
            notificatorService.open('Note should have some text!');
            return;
        }
        if (self.note.$id) {
            notesService.updateNoteAPI().then(function() {
                notificatorService.open('Note Updated');
                $timeout(function() {notificatorService.close();}, 2000);
                notesService.getNotesAPI().then(function(response) {
                    angular.forEach(response, function(note, index) {
                        note.textToDisplay = '';
                    });
                    $scope.notesCtrl.editingMode = false;
                    notesService.nlist = $filter('orderBy')(response, notesService.nlistParams.sortCriteria, true);
                    if (notesService.getNotesAPICallback) notesService.getNotesAPICallback();
                });
            });
        } else {
            notesService.createNoteAPI().then(function() {
                notesService.initNote();
                notesService.getNotesAPI().then(function(response) {
                    angular.forEach(response, function(note, index) {
                        note.textToDisplay = '';
                    });
                    notesService.nlist = $filter('orderBy')(response, notesService.nlistParams.sortCriteria, true);
                    if (notesService.getNotesAPICallback) notesService.getNotesAPICallback();
                });
            });
        }
    }

    self.init();

  }]);

'use strict';

angular.module('app.controllers')
  .controller('NotesListCtrl', ["$scope", "$state", "$filter", "$timeout", "notesService", "notificatorService", function($scope, $state, $filter, $timeout, notesService, notificatorService) {
    var self = this;

    self.init = function() {
        notesService.getNotesAPICallback = function() {
            self.notes = notesService.nlist;
        }
        notesService.removeNotesAPICallback = function() {
            $scope.notesCtrl.canChooseForRemoving = false;
        }
        $timeout(function() {notificatorService.open(); });
        notesService.getNotesAPI().then(afterListReceived);
    }


    self.removeNotes = function(e) {
        var DELETE_KEY_CODE_LINUX = 127,
            DELETE_KEY_CODE_WIN = 46,
            toRemove = null;

        if (e.keyCode === DELETE_KEY_CODE_LINUX || e.keyCode === DELETE_KEY_CODE_WIN) {
            if ($scope.notesCtrl.canChooseForRemoving) {
                toRemove = notesService.nlistToRemove;
            } else {
                toRemove = notesService.ncurrent.$id;
            }
            $timeout(function() { notificatorService.open();});
            notesService.removeNotesAPI(toRemove).then(function() {
                notesService.nlistToRemoveInit();
                if (notesService.removeNotesAPICallback) notesService.removeNotesAPICallback();
                notesService.initNote();
                notesService.getNotesAPI().then(afterListReceived);
            });
        }
    }

    function afterListReceived(response) {
        angular.forEach(response, function(note, index) {
            note.textToDisplay = '';
        });

        notesService.nlist = $filter('orderBy')(response, notesService.nlistParams.sortCriteria, true);
        if (notesService.getNotesAPICallback) notesService.getNotesAPICallback();
        $timeout(function() { notificatorService.close(); });
    }

    self.init();
  }]);

angular.module('app.controllers')

.controller('NotesFilters', ["$scope", "$timeout", "$filter", "notesService", function($scope, $timeout, $filter, notesService) {
    var self = this,
        timer,
        filterResult = [],
        initialized = false;

    self.init = function() {
        self.applyFilters = function() {
            notesService.getNotesAPI(self.requestedListParams).then(function(response) {
                angular.forEach(response, function(note, index) {
                    note.textToDisplay = '';
                });

                filterResult = response;

                if (notesService.nlistParams.priority) {
                    filterResult = $filter('filter')(filterResult, {priority: notesService.nlistParams.priority});
                }
                if (notesService.nlistParams.tag) {
                    filterResult = $filter('tagFilter')(filterResult, notesService.nlistParams.tag);
                }
                notesService.nlist = $filter('orderBy')(filterResult, notesService.nlistParams.sortCriteria, true);

                if (notesService.getNotesAPICallback) notesService.getNotesAPICallback();
            });
        }

        self.showDefault = function() {
            notesService.initListParams();
            self.requestedListParams = notesService.nlistParams;
            self.applyFilters();
        };

        self.setTag = function() {
            $timeout.cancel(timer);
            timer = $timeout(function() {
                self.applyFilters();
            }, 1000);
        };

        notesService.initListParams();
        self.requestedListParams = notesService.nlistParams;

        $scope.$watch(() => self.requestedListParams.sortCriteria, function(newVal) {
            if (initialized) {
                self.applyFilters();
            } else {
                $timeout(function() {
                    initialized = true;
                });
            }
        });

        $scope.$watch(() => self.requestedListParams.priority, function(newVal) {
            if (initialized) {
                self.applyFilters();
            } else {
                $timeout(function() {
                    initialized = true;
                });
            }
        });
    }

    self.init();
}]);

'use strict';

angular.module('app.controllers')
  .controller('SettingsCtrl', ["$scope", "$state", "settingsService", function($scope, $state, settingsService) {
    var self = this;

    self.init = function() {
        self.settings = settingsService.get();

        self.save = function() {
            settingsService.save().then(function(data) {

            });
        }
    }

    self.init();

  }]);

'use strict';

angular.module('app.controllers')
  .controller('AboutCtrl', ["$scope", "$state", function($scope, $state) {
  }]);
