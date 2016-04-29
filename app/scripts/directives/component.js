angular.module('yapp.components', [])

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

.directive('note', function() {
    return {
        restrict: 'E',
        replace: 'false',
        templateUrl: 'views/dashboard/note.html',
        link: function(scope, elem, attrs) {
            var noteItem = scope.vm.getListItem(attrs.id),
                noteItemPriority = parseInt(noteItem.priority);

            setClassToNote();

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
});
