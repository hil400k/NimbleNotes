angular.module('yapp.services')

.service('notesService', function(storage, $filter) {
    var ns = {};

    ns.nlist = [];
    ns.nlistToRemove = [];
    ns.ncurrent = {};

    ns.getListItem = function(id) {
        return $filter('getNoteById')(ns.nlist, id);
    };

    ns.initNote = function(noteItem) {
        if (noteItem)
            ns.ncurrent = {
                id: noteItem.id,
                text: noteItem.text,
                tags: noteItem.tags,
                name: noteItem.name,
                priority: noteItem.priority,
                dateOfCreation: noteItem.dateOfCreation,
                dateOfEditing: noteItem.dateOfEditing,
                editingsCount: noteItem.editingsCount,
                sourceUrl: noteItem.sourceUrl
            };
        else
            ns.ncurrent = {
                id: null,
                text: '',
                tags: '',
                name: '',
                priority: 1,
                dateOfCreation: null,
                dateOfEditing: null,
                editingsCount: 0,
                sourceUrl: null
            };
        if (ns.setNoteCallback) ns.setNoteCallback();
    };

    ns.setNote = function(noteItem) {
        ns.ncurrent = noteItem;
        if (ns.setNoteCallback) ns.setNoteCallback();
    }

    // callbacks

    ns.getNotesAPICallback = null;
    ns.setNoteCallback = null;

    // APIs

    ns.getNotesAPI = function() {
        storage.getAll()
        .then(
            function(data) {
                angular.forEach(data, function(note, index) {
                    data.textToDisplay = '';
                })
                ns.nlist = data;
                if (ns.getNotesAPICallback) ns.getNotesAPICallback();
            },
            function(error) {
                console.info('error of getting notes');
            }
        )
    };

    ns.updateNoteAPI = function() {
        storage.update(ns.ncurrent);
    };

    ns.createNoteAPI = function() {
        var wordsCount = 1;

        ns.ncurrent.name = ns.ncurrent.text.split(/\s+/).slice(0, wordsCount).join(' ');
        ns.ncurrent.id = ns.ncurrent.name;
        ns.ncurrent.dateOfCreation = ns.ncurrent.dateOfEditing = new Date().toLocaleString();
        storage.create(ns.ncurrent);
        ns.initNote();
    };

    ns.removeNotesAPI = function(params) {
        if (!params) return;

        storage.remove(params);
        ns.initNote();
        ns.getNotesAPI();

    };

    return ns;
})
