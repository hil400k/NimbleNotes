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
