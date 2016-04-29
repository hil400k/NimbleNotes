angular.module('yapp.filters', [])

.filter('getNoteById', function() {
    return function(list, id) {
        var i = 0,
            len = list.length;

        for (; i < len; i++) {
          if (list[i].id === id) {
            return list[i];
          }
        }
        return null;
    }
})
