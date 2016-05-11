'use strict';

angular.module('yapp.controllers')
  .controller('LoginCtrl', function($location, $state, authService, userService) {
    var self = this;

    self.init = function() {
        self.loginTab = true;
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

            user.username = self.loginUser.username;
            user.email = self.loginUser.email;

            user.$save().then(function(response) {
                self.loginUser = {
                    email: null,
                    password: null,
                    username: null
                };
            }, function() {
                console.warn('Saving User Error');
            })
        }

        self.doLogin = function() {
            authService.$authWithPassword({
                email: self.loginUser.email,
                password: self.loginUser.password
            }).then(function(data) {
                self.loginUser.email = null;
                self.loginUser.password = null;
                $state.go('notes')
            }).catch(function() {
                console.warn('Login Error');
            })
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
