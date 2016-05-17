angular.module('yapp.services')

.service('notesService', function(storage, $filter, notesAPI) {
    var ns = {};

    ns.nlist = [];
    ns.nlistToRemove = [];
    ns.ncurrent = {};
    ns.nlistParams = {};

    ns.getListItem = function(id) {
        return $filter('getNoteById')(ns.nlist, id);
    };

    ns.initListParams = function() {
        ns.nlistParams = {
            sortCriteria: 'creation',
            tag: '',
            priority: null
        };
    };

    ns.initNote = function() {
        ns.ncurrent = {
            id: null,
            text: '',
            tags: '',
//            name: '',
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
                id: noteItem.id,
                text: noteItem.text,
                tags: noteItem.tags,
//                name: noteItem.name,
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

        notes.$loaded().then(function(response) {
            angular.forEach(response, function(note, index) {
                note.textToDisplay = '';
            })
            ns.nlist = response;
            if (ns.getNotesAPICallback) ns.getNotesAPICallback();
        });

//        storage.getAll()
//        .then(
//            function(data) {
//                angular.forEach(data, function(note, index) {
//                    data.textToDisplay = '';
//                })
//                ns.nlist = data;
//                if (ns.getNotesAPICallback) ns.getNotesAPICallback();
//            },
//            function(error) {
//                console.info('error of getting notes');
//            }
//        )
    };

    ns.updateNoteAPI = function() {
//        notesAPI.update()
        storage.update(ns.ncurrent);
    };

    ns.createNoteAPI = function() {
        var wordsCount = 1;

        ns.ncurrent.tags = makeTagsArray(ns.ncurrent.tags);
        notesAPI.create(ns.ncurrent);
//        ns.ncurrent.id = 'id' + getRandomArbitrary(0, 100000);
//        storage.create(ns.ncurrent);
        ns.initNote();
    };

    ns.removeNotesAPI = function(params) {
        if (!params) return;

        storage.remove(params);
        ns.nlistToRemoveInit();
        if (ns.removeNotesAPICallback) ns.removeNotesAPICallback();
        ns.initNote();
        ns.getNotesAPI();
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
})
