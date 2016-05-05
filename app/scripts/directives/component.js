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

.directive('note', ['$compile', '$timeout', '$rootScope', function($compile, $timeout, $rootScope) {
    return {
        restrict: 'E',
        replace: 'false',
        templateUrl: 'views/dashboard/note.html',
        link: function(scope, elem, attrs) {
            var noteItem = scope.vm.getListItem(attrs.id),
                noteItemPriority = parseInt(noteItem.priority),
                notesGrid;

            setClassToNote();
            highlightName();
            setEvents();

            // add helper/loader

            function setEvents() {
                elem.parent().bind('mouseover mouseout', function(e) {
                    $timeout(function () {
                        $compile(elem.contents())(scope);
                    }, 100);
                });

                elem.parent().bind('click', function(e) {
                    var notesToRemove = scope.notesCtrl.toRemoveList;

                    if (!scope.notesCtrl.canChooseForRemoving) {
                        angular.forEach(document.querySelectorAll('.grid .note'), function(item, i) {
                            angular.element(item).removeClass('choosen-note');
                        });
                        elem.addClass('choosen-note');
                        $rootScope.$broadcast('initNote', noteItem);
                    } else {
                        if (!elem.hasClass('choosen-note')) {
                            notesToRemove.push(noteItem.id);
                            elem.addClass('choosen-note');
                        } else {
                            elem.removeClass('choosen-note');
                            notesToRemove.splice(notesToRemove.indexOf(noteItem.id), 1);
                        }
                    }
                });
            }


            function highlightName() {
                var text = noteItem.text,
                    highligting = '<span class="note-name">',
                    output;

                output = highligting + [text.slice(0, noteItem.name.length), '</span>', text.slice(noteItem.name.length)].join('');

                noteItem.textToDisplay = output;
                // $sce || ngSatinize
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
