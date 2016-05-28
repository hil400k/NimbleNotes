'use strict';

angular.module('yapp.controllers')
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

            user.email = self.loginUser.email;
            user.password = self.loginUser.password;
//            user.settings = settingsService.getDefault();

            user.$save().then(function(response) {
                self.loginUser = {
                    email: null,
                    password: null
                };
            }, function() {
                console.warn('Saving User Error');
            })
        }

        self.saveGoogleUser = function(userData) {
            var user = userService.newUserRef(userData);

            user.email = userData.google.email;
            user.googleId = userData.google.id;
            user.settings = settingsService.getDefault();

            user.$save().then(function(response) {
                console.info('User saved');
            }, function() {
                console.warn('Saving User Error');
            })
        }

        self.doLogin = function() {
            authService.$authWithPassword({
                email: self.loginUser.email,
                password: self.loginUser.password
            }).then(function(data) {
                self.userObject = authService.$getAuth();
                self.loginUser.email = null;
                self.loginUser.password = null;
                $state.go('notes');
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
                $state.go('notes');
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
                self.doLogin();
            }).catch(function() {
                console.warn('Registration Error');
            })
        }
    }

    self.init();

  });
