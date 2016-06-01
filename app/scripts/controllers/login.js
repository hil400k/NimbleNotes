'use strict';

angular.module('app.controllers')
  .controller('LoginCtrl', function($location, $state, authService, userService, settingsService, googleAuthService) {
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
                    $state.go('notes');
                } else {
                    $user.email = userData.google.email;
                    $user.googleId = userData.google.id;
                    $user.settings = settingsService.settings = settingsService.getDefault();
                    $user.$save().then(function(response) {
                        console.info('User saved');
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

  });
