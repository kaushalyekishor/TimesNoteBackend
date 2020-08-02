const NoteService = require('../services/note.service');
//const { model } = require('../model/note.model');
//const router = require('../routes/note.route');

class NoteController {
    constructor() {

    }
    addNote(req, res) {
        var noteService = new NoteService()
        req.assert('title', 'Title cannot be blank').notEmpty();
        req.assert('content', 'Content cannot be empty').notEmpty();

        var errors = req.validationErrors();

        if (errors) {
            return res.status(400).send(errors);
        }
        else {
            noteService.addNote(req, res)
        }
    }
}

module.exports = NoteController;
/*class NoteController{
    constructor(){

    }
    async addNote(req, res){
        var noteService = new NoteService()
            try{
                req.assert('title', 'title cannot be blank').notEmpty();
                req.assert('content', 'content is not valid').isEmail();

                // Check validation errors
                var errors = req.validationErrors();

                if (errors) {
                    return res.status(400).send(errors);
                } else {
                noteService.addNote(req, res);
                }
            }catch(error){
                res.send(error)
            }
        }
    }
//module.exports = NoteService;
module.exports = NoteController;
//module.exports =  router;*/