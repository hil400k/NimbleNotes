angular.module('yapp.services')

.service('notesService', function(storage, $filter, $timeout, notesAPI, notificatorService) {
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
            sortCriteria: 'dateOfCreation',
            tag: '',
            priority: null
        };
    };

    ns.initNote = function() {
        ns.ncurrent = {
            text: '',
            tags: '',
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
})
