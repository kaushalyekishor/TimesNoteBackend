"use strict"
var Note = require('../model/note.model');
var User = require('../model/user.model');
const NoteController = require('../controller/note.controller');
const userService = require('../services/user.service');

class NoteService {
    constructor() { }
    async addNote(req, res) {

        try {
            var user = await userService.getValidUserById(req.body.userId)
            console.log(user);
            if (user) {
                //console.log(user);
                var note = new Note({
                    title: req.body.title,
                    content: req.body.content,
                    userId: req.body.userId
                })
                var noteResponse = await Note.create(note)
                res.send(noteResponse)
            }
            else {
                res.status(400).send({ msg: 'note not created' })
            }
        } catch (error) {
            throw new Error(error)
        }
    }
}
module.exports = NoteService;