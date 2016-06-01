angular.module('app.services')

.service('notificatorService', function() {
    var notificator = {};

    notificator.state = false;

    notificator.open = null;
    notificator.close = null;
    notificator.showMessage = null;

    return notificator;

});
